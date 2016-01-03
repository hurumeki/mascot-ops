{ CatchAllMessage } = require 'hubot'

class MyProxyConfig
  adapter: process.env.HUBOT_ADAPTER

  events: {
    senderMessage: (message = {}) ->
      rtn = ''
      rtn += "#{message.text}" if message.text?
      rtn += " from #{message.user?.name}" if message.user?.name?
      "`#{rtn.trim()}`" if rtn?

    stringsForSend: (adapter, envelope, originalStrings...) ->
      originalStrings.push @senderMessage(envelope.message)
      return originalStrings

    shouldSend: (adapter, envelope, strings...) ->
      if envelope.message instanceof CatchAllMessage
        if envelope.message.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
        return false
      else
        if envelope.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
          return true

      if envelope.room?
        adapter.robot.emit 'send_outside', envelope, strings
        return true
      else
        adapter.robot.emit 'send_inside', envelope, strings
        return false

    willSend: (adapter, envelope, strings...) ->

    didSend: (adapter, envelope, strings...) ->

    stringsForEmote: (adapter, envelope, originalStrings...) ->
      originalStrings.push @senderMessage(envelope.message)
      return originalStrings

    shouldEmote: (adapter, envelope, strings...) ->
      true

    willEmote: (adapter, envelope, strings...) ->

    didEmote: (adapter, envelope, strings...) ->

    stringsForReply: (adapter, envelope, originalStrings...) ->
      originalStrings.push @senderMessage(envelope.message)
      return originalStrings

    shouldReply: (adapter, envelope, strings...) ->
      if envelope.message instanceof CatchAllMessage
        if envelope.message.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
        return false
      else
        if envelope.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
          return true

      if envelope.room?
        adapter.robot.emit 'send_outside', envelope, strings
        return true
      else
        adapter.robot.emit 'send_inside', envelope, strings
        return false

    willReply: (adapter, envelope, strings...) ->

    didReply: (adapter, envelope, strings...) ->

    stringsForTopic: (adapter, envelope, originalStrings...) ->
      originalStrings.push @senderMessage(envelope.message)
      return originalStrings

    shouldTopic: (adapter, envelope, strings...) ->
      if envelope.message instanceof CatchAllMessage
        if envelope.message.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
        return false
      else
        if envelope.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
          return true

      if envelope.room?
        adapter.robot.emit 'send_outside', envelope, strings
        return true
      else
        adapter.robot.emit 'send_inside', envelope, strings
        return false

    willTopic: (adapter, envelope, strings...) ->

    didTopic: (adapter, envelope, strings...) ->

    stringsForPlay: (adapter, envelope, originalStrings...) ->
      originalStrings.push @senderMessage(envelope.message)
      return originalStrings

    shouldPlay: (adapter, envelope, strings...) ->
      if envelope.message instanceof CatchAllMessage
        if envelope.message.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
        return false
      else
        if envelope.message?.id != 'MascotOps'
          adapter.robot.emit 'receive_outside', envelope, strings
          return true

      if envelope.room?
        adapter.robot.emit 'send_outside', envelope, strings
        return true
      else
        adapter.robot.emit 'send_inside', envelope, strings
        return false

    willPlay: (adapter, envelope, strings...) ->

    didPlay: (adapter, envelope, strings...) ->

    willLaunch: (adapter) ->
      adapter.robot.emit 'willlaunch'

    didLaunch: (adapter) ->
      adapter.robot.emit 'didlaunch'

    willExit: (adapter) ->
      adapter.robot.emit 'willexit'

    didExit: (adapter) ->
      adapter.robot.emit 'didexit'

    shouldReceive: (adapter, message) ->
      if message.id != 'MascotOps'
        adapter.robot.emit 'receive_outside', message
        return false
      else
        adapter.robot.emit 'receive_inside', message
        return true

    willReceive: (adapter, message) ->

    didReceive: (adapter, message) ->

  }

module.exports = MyProxyConfig
