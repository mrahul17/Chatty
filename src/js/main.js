var gui = require('nw.gui');

// get current window

var win = gui.Window.get();


// add icon to tray
var tray = new gui.Tray({title:'Chatty',icon:'img/icon.png'})


// add menu
var menu = new gui.Menu();

// add exit menuitem to tray
menu.append(new gui.MenuItem(
			{
				label:'Exit',
				click: function()
				{
					win.close();
				}
			}));
tray.menu = menu;


