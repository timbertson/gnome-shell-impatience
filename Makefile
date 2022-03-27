all: schemas zip

0: phony
	mkzero-gfxmonk -p impatience -p xdg gnome-shell-impatience.xml

schemas: phony
	cd impatience/schemas && glib-compile-schemas .

zip: phony
	rm -f impatience@gfxmonk.net.zip
	cd impatience && zip -r ../impatience@gfxmonk.net.zip *

.PHONY: phony
