const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

var get_local_gsettings = function() {
	LOG("initting schemas");
	const GioSSS = Gio.SettingsSchemaSource;
	const SCHEMA_PATH = 'org.gnome.shell.extensions.net.gfxmonk.impatience';

	var schemaSource;
	try {
		const Extension = imports.misc.extensionUtils.getCurrentExtension();
		let schemaDir = Extension.dir.get_child('schemas');
		schemaSource = GioSSS.new_from_directory(
			schemaDir.get_path(),
			GioSSS.get_default(),
			false);
		let schemaObj = schemaSource.lookup(SCHEMA_PATH, true);
		if (!schemaObj) {
			throw new Error(
				'Schema ' + schema +
				' could not be found for extension ' +
				Extension.metadata.uuid
			);
		}
		return new Gio.Settings({ settings_schema: schemaObj });
	} catch(e) {
		LOG("Couldn't get local schema: " + e);
		// works on 3.2, with $XDG_DATA_DIRS set appropriately
		return new Gio.Settings({schema: SCHEMA_PATH});
	}

};

function LOG(m){
	global.log("[impatience] " + m);
	log("[impatience] " + m);
};
function Ext() {
	this._init.apply(this, arguments);
};
var noop = function() {};

Ext.prototype = {};
Ext.prototype._init = function() {
	this.enabled = false;
	this.original_speed = St.get_slow_down_factor();
	this.modified_speed = 0.75;
	this.unbind = noop;
};

Ext.prototype.enable = function() {
	if(this.enabled) {
		LOG("double-enabled! Ignoring...");
		return;
	}
	this.enabled = true;
	var settings = null;
	try {
		settings = get_local_gsettings();
	} catch (e) {
		LOG("failed to make settings configurable: " + e + "\nThis may mean your gnome-shell version is too old.");
		this.set_speed();
	}
	if(settings) {
		var binding = settings.connect("changed::speed-factor", Lang.bind(this, function() {
			this.set_speed(settings.get_double('speed-factor'));
		}));
		this.unbind = function() {
			settings.disconnect(binding);
			this.unbind = noop;
		};
		this.set_speed(settings.get_double('speed-factor'));
	}
};

Ext.prototype.disable = function() {
	if(!this.enabled) {
		LOG("double-disabled! Ignoring...");
		return;
	}
	this.enabled = false;
	this.unbind();
	St.set_slow_down_factor(this.original_speed);
};

Ext.prototype.set_speed = function(new_speed) {
	if(!this.enabled) {
		LOG("NOT setting new speed (since the extension is disabled. how did this even happen?)");
		return;
	}
	if(new_speed !== undefined) {
		this.modified_speed = new_speed;
	}
	LOG("setting new speed: " + this.modified_speed);
	St.set_slow_down_factor(this.modified_speed);
};

function init() {
	return new Ext();
};

function main() {
	init().enable();
};
