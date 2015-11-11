var gui = require('nw.gui');
var fs = require('fs');
var iframes;
var titles = ['Messenger','Google Hangouts'];
var options = {
    icon : "src/images/chat_icon_pending.png"
} ;

try
{
    var data = JSON.parse(fs.readFileSync("config.json"));
    var pos_x = data['pos_x'];
    var pos_y = data['pos_y'];
    var width = data['width'];
    var height = data['height'];
    var fb = data['fb'];
    var hangouts = data['hangouts'];
    var irc = data['irc'];
}
catch(err)
{
    console.log("Error parsing file "+ err);
}

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
        changeconfig(pref);
        saveconfig();
        this.close(true); // true (force) is important here, else it will be an infinite loop

    }
        
    else
        this.hide();
});

function startup()
{
    iframes = document.getElementsByTagName("iframe");// get reference to the iframes
    if(fb)
    {
        iframes.item(0).src= "https://www.messenger.com/login";
        iframes.item(0).addEventListener("load",sync(0));
    }
    if(hangouts)
    {
        iframes.item(1).src= "https://accounts.google.com/ServiceLogin?service=talk&passive=1209600&continue=https://hangouts.google.com/";
        iframes.item(1).addEventListener("load",sync(1));
    }
    if(irc)
    { 
        iframes.item(2).src = "http://webchat.freenode.net?uio=MTY9dHJ1ZSYxMT05Mg07";
        // no notifications for irc for now
    }

    document.getElementById("fbcheck").checked = fb;
    document.getElementById("hangoutscheck").checked = hangouts;
    document.getElementById("irccheck").checked = irc;
}

function sync(i){
    setInterval(checkTitles,2000,iframes.item(i),titles[i],options); 
}


var xtitle;
function checkTitles(nframe,title,options)
{
    if(nframe.contentDocument.title != title && nframe.contentDocument.title != xtitle)
    {
        options.body = nframe.contentDocument.title;
        var notification = new Notification("Chatty",options); 
        notification.onshow = function(){
            window.setTimeout(function(){notification.close();},3000);
        };
        notification.onclick = function(){
            notification.close();
        }
        xtitle = nframe.contentDocument.title;
        
    }
}

function toggle(item)
{
    if(item=='fb')
    {
        if (data['fb'])
            changeconfig({'fb':false})
        else
            changeconfig({'fb':true})
    }
    if(item=='hangouts')
    {
         if (data['hangouts'])
            changeconfig({'hangouts':false})
        else
            changeconfig({'hangouts':true})
        
    }
    if(item=='irc')
    {
         if (data['irc'])
            changeconfig({'irc':false})
        else
            changeconfig({'irc':true})
    }
}


function changeconfig(newdata)
{
    for (item in newdata)
    {
        data[item] = newdata[item];
    }

}
function saveconfig()
{
     fs.writeFileSync("config.json",JSON.stringify(data),"utf8");
}