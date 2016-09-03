'use strict';

angular.module('WallpaperCurator.desktop')

.factory('Desktop', function() {
	
	var win, tray, isMinimized, menu, restoreMenuItem, closeMenuItem;

	function toggleWindow () {
		if (isMinimized) 
			restore();
	  else 
	  	hide();
	}

	function restore() {
	  win.show();
	  win.restore();
	  restoreMenuItem.label = 'Minimize';
	  isMinimized = false;
	}

	function hide() {
		win.hide();
	  restoreMenuItem.label = 'Restore';
	  isMinimized = true;
	}

	function close() {
		win.close(true);
	}

	isMinimized = false;

	win = nw.Window.get();
	win.on('minimize', hide);

	restoreMenuItem = new nw.MenuItem({ label: 'Restore', click: toggleWindow });
	closeMenuItem = new nw.MenuItem({ label: 'Close', click: close});

	menu = new nw.Menu();
	menu.append(restoreMenuItem);
	menu.append(new nw.MenuItem({ type: 'separator' }));
	menu.append(closeMenuItem);

	tray = new nw.Tray({ title: 'Wallpapers', icon: 'icon.png' });
	tray.on('click', toggleWindow);
	tray.menu = menu;

	return {
		win: {
			restore: restore,
			hide: hide,
			close: close
		},
		tray: {

		}
	};

});