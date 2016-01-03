require('dotenv').load();

const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
const globalShortcut = electron.globalShortcut;
const Menu = electron.Menu;

// Report crashes to our server.
electron.crashReporter.start({
  companyName: 'MascotOps',
  submitURL: 'https://thawing-wave-8477.herokuapp.com/'
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

global.sharedObject = {
  robot: null,
  mascot: {},
  mainWindow: null
};

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('will-quit', function() {
  // Unregister a shortcut.
  globalShortcut.unregister('ctrl+x');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 300, height: 600, frame: false, transparent: true});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('focus', function() {
    mainWindow.webContents.send('focus');
  });

  mainWindow.on('blur', function() {
    mainWindow.webContents.send('blur');
  });

  sharedObject.mainWindow = mainWindow;

  registerGlobalShortcut();
  registerMenu();
  loadHubot();
  loadMascotConfig();
});

function loadHubot() {
  require('coffee-script/register');
  var robot = require('./remote/load-hubot.coffee');
  global.sharedObject.robot = robot;
}

function loadMascotConfig() {
  var mascotConfig;
  if (process.env.MOPS_ASSETS_PACKAGE) {
    mascotConfig = require(process.env.MOPS_ASSETS_PACKAGE);
  } else {
    mascotConfig = require('mascot-ops-assets-pronama-chan');
  }
  global.sharedObject.mascotConfig = mascotConfig;
}

function registerGlobalShortcut() {
  var ret;
  if(process.env.MOPS_VOICE_SHORTCUT) {
    ret = globalShortcut.register(process.env.MOPS_VOICE_SHORTCUT, function() {
      mainWindow.webContents.send('voice-input');
    });
  }
  if (!ret) {
    console.log('MOPS_VOICE_SHORTCUT is not set or wrong Accelerator');
  }
}

function registerMenu() {
  var menu = Menu.buildFromTemplate(require('./remote/menu-template'));
  Menu.setApplicationMenu(menu);
};
