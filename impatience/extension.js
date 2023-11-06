import St from 'gi://St';
const DEFAULT_SPEED = 0.75;
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Settings from './settings.js';

function LOG(m){
	console.log("[impatience] " + m);
};

var noop = function() {};

export default class Impatience extends Extension {
	constructor(metadata) {
		super(metadata);
		this.enabled = false;
		this.original_speed = St.Settings.get().slow_down_factor;
		this.modified_speed = DEFAULT_SPEED;
		this.unbind = noop;
	};

	enable() {
		this.enabled = true;
		var pref = (new Settings.Prefs(this)).SPEED;
		LOG("enabled");
		var binding = pref.changed(() => {
			this.set_speed(pref.get());
		});
		this.unbind = () => {
			pref.disconnect(binding);
			this.unbind = noop;
		};
		this.set_speed(pref.get());
	};

	disable() {
		this.enabled = false;
		this.unbind();
		St.Settings.get().slow_down_factor = this.original_speed;
	};

	set_speed(new_speed) {
		if(!this.enabled) {
			LOG("NOT setting new speed, since the extension is disabled.");
			return;
		}
		if(new_speed !== undefined) {
			this.modified_speed = new_speed;
		}
		LOG("setting new speed: " + this.modified_speed);
		St.Settings.get().slow_down_factor = this.modified_speed;
	};
}
