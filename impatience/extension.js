const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const DEFAULT_SPEED = 0.75;

var get_local_gsettings = function() {
	LOG("initting schemas");
	const SCHEMA_PATH = 'org.gnome.shell.extensions.net.gfxmonk.impatience';

	if(Gio.Settings.list_schemas().indexOf(SCHEMA_PATH) != -1) {
		LOG("Using sytem-installed schema.");
		return new Gio.Settings({schema: SCHEMA_PATH});
	}

	LOG("Attempting load of extension-local schema.");
	const GioSSS = Gio.SettingsSchemaSource;
	const Extension = imports.misc.extensionUtils.getCurrentExtension();
	let schemaDir = Extension.dir.get_child('schemas');
	let schemaSource = GioSSS.new_from_directory(
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
	this.modified_speed = DEFAULT_SPEED;
	this.unbind = noop;
};

Ext.prototype.enable = function() {
	this.enabled = true;
	var settings = null;
	try {
		settings = get_local_gsettings();
	} catch (e) {
		LOG("failed to make settings configurable: " + e + "\nThis may mean your gnome-shell version is too old.");
		this.set_speed();
	}
	LOG("enabled");
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
	this.enabled = false;
	this.unbind();
	St.set_slow_down_factor(this.original_speed);
};

Ext.prototype.set_speed = function(new_speed) {
	if(!this.enabled) {
		LOG("NOT setting new speed, since the extension is disabled.");
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

