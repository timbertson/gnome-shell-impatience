const Gtk = imports.gi.Gtk;

let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;

function init() {
}

function buildPrefsWidget() {
	let config = new Settings.Prefs();
	let frame = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		border_width: 10
	});

	(function() {
		let label = new Gtk.Label({
			label: "Speed scaling (1 = normal, 0.5 = twice as fast, 0.1 = ten times faster)\nWarning: This also affects contdown for Logout and Shutdown dialogs.",
			use_markup: false,
			xalign: 0
		});
		let adjustment = new Gtk.Adjustment({
			lower: 0.001,
			upper: 1,
			step_increment: 0.001
		});
		let scale = new Gtk.HScale({
			digits:3,
			adjustment: adjustment,
			value_pos: Gtk.PositionType.RIGHT
		});

		frame.add(label);
		frame.pack_end(scale, true, true, 0);

		var pref = config.SPEED;
		scale.set_value(pref.get());
		scale.connect('value-changed', function(sw) {
			var oldval = pref.get();
			var newval = sw.get_value();
			if (newval != pref.get()) {
				pref.set(newval);
			}
		});
	})();

	frame.show_all();
	return frame;
}