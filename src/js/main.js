var gui = require('nw.gui');

// get current window

var win = gui.Window.get();


// add icon to tray
var tray = new gui.Tray(
			{
			title:'Chatty',
			icon:'img/icon.png',
			click: function()
			{
				win.show();
			}
			})


// add menu
var menu = new gui.Menu();

// add exit menuitem to tray
// exit flag will determine if window needs to be hidden or reduced to tray, like skype
var exit = false;
menu.append(new gui.MenuItem(
			{
				label:'Exit',
				click: function()
				{
					exit = true;
					win.close();
					
				},
				
			}));
tray.menu = menu;

// close window if exit pressed , else hide
win.on('close',function()
{
	if(exit)
		this.close(true);// true (force) is important here, else it will be an infinite loop
	else
		this.hide();
});

