Path = require 'path'
Fs = require 'fs'
Hubot = require 'hubot'
Kuromojin = require 'kuromojin'

Options = {
  adapter: 'proxy',
  enableHttpd: false,
  name: process.env.HUBOT_NAME,
  alias: process.env.HUBOT_ALIAS,
  scripts: []
}

process.env.PWD = process.cwd() if /^win/.test(process.platform)

hubotBasePath = Path.join __dirname, '..', 'node_modules', 'hubot'
adapterPath = Path.join hubotBasePath, 'src', 'adapters'
robot = Hubot.loadBot adapterPath,
                      Options.adapter,
                      Options.enableHttpd,
                      Options.name,
                      Options.alias

robot.receiveCommand = (text, room)->
  if text.startsWith robot.name
    text = (text.replace robot.name, '').trim()
  else if text.startsWith robot.alias
    text = (text.replace robot.alias, '').trim()
  user = @brain.userForName(process.env.USER_NAME)
  message = new Hubot.TextMessage user, robot.name + ' ' + text, 'MascotOps'
  if room?
    message.room = room
  @adapter.receive message

robot.receiveInput = (input) ->
  splitter = 'robotalias'
  re = new RegExp("/#{robot.alias}|#{robot.name}/", 'g')
  inputWithoutName = input.replace(re, splitter)
  Kuromojin.tokenize(inputWithoutName).then (results) =>
    userCommand = @findUserCommand results
    if userCommand?
      @receiveCommand userCommand.text, userCommand.room
    else
      @receiveCommand input

robot.extractWords = (results) ->
  words = for result in results
    if result.pos == '名詞' || result.pos == '動詞'
      if result.basic_form != '*'
        result.basic_form
      else
        result.surface_form

robot.matchCommand = (words) ->
  userCommand = @userCommands.find (userCommand, index) ->
    if words.length < userCommand.voice.length
      return false

    if userCommand.voice.every( (word, index, array) ->
      words.indexOf(word) >= 0)
        return true

    return false

robot.findUserCommand = (results) ->
  @matchCommand @extractWords(results)

robot.userCommands = []
robot.loadUserCommands = (path) ->
  if Fs.existsSync(path)
    Fs.readFile path, (err, data) =>
      if data.length > 0
        try
          @userCommands = JSON.parse data
        catch err
          console.error "Error parsing JSON data from user-commands.json: #{err}"
          process.exit(1)
  else
    console.error "Error user-commands.json is not found"

robot.loadUserCommands Path.resolve(".", "user-commands.json")

loadScripts = ->
  scriptsPath = Path.resolve ".", "scripts"
  robot.load scriptsPath

  externalScripts = Path.resolve ".", "external-scripts.json"
  if Fs.existsSync(externalScripts)
    Fs.readFile externalScripts, (err, data) ->
      if data.length > 0
        try
          scripts = JSON.parse data
        catch err
          console.error "Error parsing JSON data from external-scripts.json: #{err}"
          process.exit(1)
        robot.loadExternalScripts scripts

robot.adapter.on 'connected', loadScripts

robot.run()
module.exports = robot
