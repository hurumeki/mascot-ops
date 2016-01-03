import ipcRenderer from 'ipc';
import Remote from 'remote';
import React from 'react';
import ReactDOM from 'react-dom';
import Recognition from './es6/recognition.js';
import MMD from './es6/mmd.js';
import { Input, Messages, Mascot } from './jsx/index.jsx';

import css from './scss/main.scss';

const Menu = Remote.Menu;
const MenuItem = Remote.MenuItem;

var recognitionStarted = false,
  recognitionStopTimer = null;

var sharedObject = Remote.getGlobal('sharedObject');
var robot = sharedObject.robot;
var mascotConfig = sharedObject.mascotConfig;
var mainWindow = sharedObject.mainWindow;

var input = ReactDOM.render(
  <Input
    placeholder=''
    sendMessage={ (text) => {
    addMessages(text, 'user');
    robot.receiveInput(text);
  } } />,
  document.getElementById('input')
);

var messages = ReactDOM.render(
  <Messages messages={ [] } />,
  document.getElementById('messages')
);

var mascot;
console.log(mascot);
if (mascotConfig.image) {
  mascot = ReactDOM.render(
    <Mascot
      src={ mascotConfig.image }
      style={ { width: '100%' } } />,
    document.getElementById('mascot')
  );
} else if (mascotConfig.model) {
  MMD( mascotConfig, document.getElementById('mascot') );
}

function addMessages(body, type, id = null) {
  id = id || new Date().valueOf();
  var message = {
    id: id,
    type: type,
    body: body
  };

  messages.setState({
    messages: messages.state.messages.concat([message])
  });

  document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;

  if (type !== 'user' && !mainWindow.isFocused()) {
    var title = '';
    if (type == 'chara') {
      title = robot.alias;
    }
    notify(body, title, mascotConfig.icon);
  }
}

function notify(body, title = 'MascotOps', icon = null) {
  if (!body) {
    return false;
  }

  var param = {
    title: title,
    body: body
  };

  if (icon) {
    param.icon = icon;
  }
  var notification = new Notification(param.title, param);

  notification.onclick = function () {
    mainWindow.focus();
  };
}

robot.on('send_inside', (envelope, strings) => {
  addMessages(strings[0], 'chara');
});

robot.on('send_outside', (envelope, strings) => {
  addMessages(strings, 'chara');
});

robot.on('receive_inside', (message) => {
});

robot.on('receive_outside', (message, strings) => {
  if (strings) {
    addMessages(strings, 'other');
  } else {
    addMessages(message.text, 'other');
  }
});

Recognition.addEventListener('result', function(event){
  if (event.results[event.resultIndex].isFinal) {
    var text = event.results[event.resultIndex][0].transcript;
    addMessages(text, 'user');
    robot.receiveInput(text);
  }
});

Recognition.addEventListener('error', function (err) {
  if (err.error != 'no-speech') {
    console.error(err);
  }
});

ipcRenderer.on('voice-input', function() {
  if (recognitionStarted) {
    clearTimeout(recognitionStopTimer);
    Recognition.stop();
    recognitionStarted = false;
    input.setState({ placeholder: '' });
  } else {
    Recognition.start();
    recognitionStarted = true;
    input.setState({ placeholder: 'Speak Now' });
    recognitionStopTimer = setTimeout(function () {
      Recognition.stop();
      recognitionStarted = false;
      input.setState({ placeholder: '' });
    }, 10000);
  }
});

ipcRenderer.on('focus', function() {
  document.body.classList.remove('blur');
  document.querySelector('.input__text').focus();
});

ipcRenderer.on('blur', function() {
  document.body.classList.add('blur');
});

var menu = new Menu();
var submenu = new Menu();
for (let command of robot.userCommands) {
  submenu.append(new MenuItem({ label: command.text, click() {
    robot.receiveInput(command.text);
  } }));
}
menu.append(new MenuItem({ label: 'Commands', type: 'submenu', submenu: submenu }));
menu.append(new MenuItem({ type: 'separator' }));
menu.append(new MenuItem({ label: 'Minimize',  role: 'minimize'}));
menu.append(new MenuItem({ label: 'Close',  role: 'close'}));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(Remote.getCurrentWindow());
}, false);
