const Gtk = imports.gi.Gtk;

let Extension = imports.misc.extensionUtils.getCurrentExtension();
let Settings = Extension.imports.settings;

function init() {
}

function buildPrefsWidget() {
	let config = new Settings.Prefs();
	let frame = new Gtk.Box({
		orientation: Gtk.Orientation.VERTICAL,
		'margin-top': 20,
		'margin-bottom': 20,
		'margin-start': 20,
		'margin-end': 20
	});

	(function() {
		let hbox = new Gtk.Box({
			orientation: Gtk.Orientation.HORIZONTAL,
			spacing: 20
		});

		let label = new Gtk.Label({
			label: "Speed scaling\n<small>(1 = normal, 0.5 = twice as fast)</small>",
			use_markup: true,
		});
		let adjustment = new Gtk.Adjustment({
			lower: 0,
			upper: 2,
			step_increment: 0.05
		});
		let scale = new Gtk.Scale({
			orientation: Gtk.Orientation.HORIZONTAL,
			digits:2,
			adjustment: adjustment,
			hexpand: true,
			value_pos: Gtk.PositionType.RIGHT
		});

		hbox.append(label);
		hbox.append(scale);
		frame.append(hbox);

		var pref = config.SPEED;
		scale.set_value(pref.get());
		[0.25, 0.5, 1.0, 2.0].forEach(
			mark => scale.add_mark(mark, Gtk.PositionType.TOP, "<small>" + mark + "</small>")
		);
		scale.connect('value-changed', function(sw) {
			var oldval = pref.get();
			var newval = sw.get_value();
			if (newval != pref.get()) {
				pref.set(newval);
			}
		});
	})();

	frame.show();
	return frame;
}
