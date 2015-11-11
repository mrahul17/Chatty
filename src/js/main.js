var gui = require('nw.gui');
var fs = require('fs');

try
{
    var data = JSON.parse(fs.readFileSync("config.json"));
    console.log(data);
    var pos_x = data['pos_x'];
    var pos_y = data['pos_y'];
    var width = data['width'];
    var height = data['height'];
    
}
catch(err)
{
    console.log("Error parsing file "+ err);
}
// get current window

var win = gui.Window.get();
// realign with user preferences
if(pos_x && pos_y && height && width)
{
        win.moveTo(pos_x,pos_y);
        win.resizeTo(width,height);

}
win.show();

// add icon to tray
var tray = new gui.Tray({
    title: 'Chatty',
    icon: 'src/images/chat_icon.png',
    click: function() {
        win.show();
    }
})


// add menu
var menu = new gui.Menu();

// add exit menuitem to tray
// exit flag will determine if window needs to be hidden or reduced to tray, like skype
var exit = false;
menu.append(new gui.MenuItem({
    label: 'Exit',
    click: function() {
        exit = true;
        win.close();

    },

}));
tray.menu = menu;

// close window if exit pressed , else hide
win.on('close', function() {
    if (exit)
    {
        // save preferences to config file
        var pref = {
            "pos_x":win.x,
            "pos_y":win.y,
            "width":win.width,
            "height":win.height,
        };
        fs.writeFileSync("config.json",JSON.stringify(pref),"utf8");
        this.close(true); // true (force) is important here, else it will be an infinite loop

    }
        
    else
        this.hide();
});

// get reference to the iframes and get the title as a proxy for notifications
function sync()
{
    var iframes = document.getElementsByTagName("iframe");// get reference to the iframes
    var titles = ['Messenger','Google Hangouts']; // the default titles        
    var options = {
        icon : "src/images/chat_icon_pending.png"
    } ;
    for(var i = 0; i < iframes.length; i++)
    {
            setInterval(checkTitles,2000,iframes[i],titles[i],options);   
       
    }

}
var xtitle;
function checkTitles(iframe,title,options)
{
    if(iframe.contentDocument.title != title && iframe.contentDocument.title != xtitle)
    {
        options.body = iframe.contentDocument.title;
        var notification = new Notification("Chatty",options); 
        notification.onshow = function(){
            window.setTimeout(function(){notification.close();},3000);
        };
        notification.onclick = function(){
            notification.close();
        }
        xtitle = iframe.contentDocument.title;
        
    }
}
