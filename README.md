# Mascot Ops
デスクトップマスコットとChatOpsをしよう！

Electronを使った、デスクトップマスコットアプリです。  
PNG画像の表示またはMMDを動かせます。  
中身はHUBOTで出来ているので、  
HUBOTにスクリプトを追加するように機能が追加できます。  
_※追加しないと機能はありません_

![スクリーンショット](https://github.com/hurumeki/mascot-ops/screenshot.png "スクリーンショット")

## Features
* マスコットの表示
* [HUBOT](https://hubot.github.com/)の実行
  * テキスト入力
  * 音声入力 (CommandOrCtrl+Shift+Mで開始)

## Requirements
* git
* nodejs
* npm
* slack (Account and Integration)

## Install
```sh
> git clone https://github.com/hurumeki/mascot-ops
> npm install
# edit .env file
# HUBOT_ADAPTER=slack
# HUBOT_SLACK_TOKEN=< your slack hubot integeration 'API Token' (required) >
# HUBOT_NAME=< your slack hubot integeration 'Customize Name' (required) >
# HUBOT_ALIAS=< mascot name (optional) >
# USER_NAME=< your slack account name >
> npm start
```

## Tutorial
ポモドーロテクニックを行うhubotスクリプトを入れる手順を説明します。  

1. npm からスクリプトをインストールします。
  ```
  > npm install hubot-pomodoro
  ```

1. external-scripts.jsonに追加したスクリプトを追加します。  
  ```external-scripts.json
  [
    "hubot-help",
    "hubot-pomodoro"
  ]
  ```


1. user-commands.jsonに実行コマンドを追加します。
  ```user-commands.json
  [
    {"text":"help", "voice":["ヘルプ"]},
    {"text":"start pomodoro", "voice":["ポモドーロ", "開始"]},
    {"text":"stop pomodoro", "voice":["ポモドーロ", "終了"]}
  ]
  ```
  * text: 実行するhubot-scriptコマンド（hubot-nameは不要）
  * voice: テキスト入力または音声入力するの言葉（配列。入力内容に全ての言葉が含まれている場合にtextで指定されているコマンドが実行されます）
  * room: [任意]Slackのルーム名（入力されている場合、Slackルームにコマンド実行結果を送信します）

1. MascotOpsを起動します

1. Command+Shift+M または Ctrl+Shift+M を押して音声入力を開始します

1. 「ポモドーロ開始」と音声入力します。(テキスト入力でも可)

1. 「Pomodoro started!」と表示され、タイマーが開始します

1. アプリが非アクティブな場合は、Notificationでメッセージが表示されます

1. 「ポモドーロ終了」でタイマー終了します
