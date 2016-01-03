# Description:
#   cathc all commands
#
# Commands:
#
module.exports = (robot) ->
  robot.catchAll (msg) ->
    msg.send msg.message?.text
