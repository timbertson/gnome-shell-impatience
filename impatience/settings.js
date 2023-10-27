export function Prefs(extension) {
	var settings = this.settings = extension.getSettings();
	this.SPEED = {
		key: 'speed-factor',
		get: function() { return settings.get_double(this.key); },
		set: function(v) { settings.set_double(this.key, v); },
		changed: function(cb) { return settings.connect('changed::' + this.key, cb); },
		disconnect: function() { return settings.disconnect.apply(settings, arguments); },
	};
};
