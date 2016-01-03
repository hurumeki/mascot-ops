electron = require 'electron'
globalShortcut = electron.globalShortcut

module.exports = () ->
  if process.env.MOPS_VOICE_SHORTCUT
    ret = globalShortcut.register process.env.MOPS_VOICE_SHORTCUT, () ->
      mainWindow.webContents.send 'voice-input'

  console.log 'MOPS_VOICE_SHORTCUT is not set or wrong Accelerator' unless ret?
