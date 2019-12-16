const tmi = require('tmi.js');
const fetch = require('node-fetch');

const http = require('http');
const express = require('express');
const app = express();

//ping self to stay alive
app.get("/", (request, response) => {
  console.log("* Ping! Hello, I'm alive!");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 270000);

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('chat', onChatHandler);
client.on('connected', onConnectedHandler);
client.on("raided", onRaidHandler);
client.on("resub", onResubHandler);
client.on("subscription", onSubHandler);
client.on("subgift", onSubGiftHandler);
client.on("submysterygift", onSubMysteryGiftHandler);
client.on("slowmode", (channel, enabled, length) => {slowmode = enabled});
client.on("subscribers", (channel, enabled) => {submode = enabled});
client.on("emoteonly", (channel, enabled) => {emotemode = enabled});
client.on("followersonly", (channel, enabled) => {followmode = enabled});

// Connect to Twitch:
client.connect();

//chat state variables
//TODO: store states for each channel should we want to expand to outside my own
let submode = false;
let followmode = false;
let slowmode = false;
let emotemode = false;

//command counters
//TODO: store interval for each channel should we want to expand to outside my own
let intervalCounter = 0;

//timed messages
let interval = setInterval(intervalExec, 300000);
function intervalExec() {
  opts.channels.forEach((channel) => {
    if (intervalCounter >= 5) {
      merchChat(channel);
      primeChat(channel);
      console.log('* sent interval messages');
      intervalCounter = 0;
    }
  });
}

function primeChat(channel) {
  client.say(channel, `If you have twitch prime, don\'t forget that you get one free subscription every month!  Consider using it here to support ${(channel.substring(1))}`);
}

function merchChat(channel) {
  client.say(channel, `Want to wear some ${(channel.substring(1))}? Check out the merch store here: https://teespring.com/stores/mtb-merch-store`); //TODO: generalize link for other channels
  console.log('* Executed merch command');
}

const commands = [
  {command: 'commands', handler: commandsCommandHandler, commandLevel: 'user'},
  {command: 'modcommands', handler: modCommandsCommandHandler, commandLevel: 'mod'},
  {command: 'merch', handler: merchCommandHandler, commandLevel: 'user'},
  {command: 'mods', handler: modsCommandHandler, commandLevel: 'user'},
  {command: 'submode', handler: submodeCommandHandler, commandLevel: 'mod'},
  {command: 'followmode', handler: followmodeCommandHandler, commandLevel: 'mod'},
  {command: 'emotemode', handler: emotemodeCommandHandler, commandLevel: 'mod'},
  {command: 'slowmode', handler: slowmodeCommandHandler, commandLevel: 'mod'},
  {command: 'bot', handler: botCommandHandler, commandLevel: 'user'},
  {command: 'uptime', handler: uptimeCommandHandler, commandLevel: 'user'},
];

//=========================================================================================================================================
//                                                      COMMAND HANDLERS
//=========================================================================================================================================

function commandsCommandHandler(channel) {
  let commandList = '';
  let firstItem = true;
  commands.forEach((cmd, i) => {
    if (cmd.command != 'commands' && cmd.commandLevel == 'user') {
      if (firstItem) {
        commandList = commandList.concat(`!${cmd.command}`);
        firstItem = false;
      } else {
        commandList = commandList.concat(`, !${cmd.command}`);
      }
    }
  });
  client.say(channel, `My current commands are: ${commandList}`);
  console.log('* Executed commands command');
}

function modCommandsCommandHandler(channel, user) {
  if (isMod(channel, user)) {
    let commandList = '';
    let firstItem = true;
    commands.forEach((cmd, i) => {
      if (cmd.command != 'modcommands' && cmd.commandLevel == 'mod') {
        if (firstItem) {
          commandList = commandList.concat(`!${cmd.command}`);
          firstItem = false;
        } else {
          commandList = commandList.concat(`, !${cmd.command}`);
        }
      }
    });
    client.whisper(user.username, `The mod commands for ${channel.substring(1)}'s channel are: ${commandList}`)
      .then((data) => {
        console.log(`* whisper sent to ${data}`)
        console.log('* Executed modcommands command');
      }).catch((err) => {
        console.log(`* ERROR SENDING WHISPER TO ${user}`);
      });
  }
}

function submodeCommandHandler(channel, user) {
  if (isMod(channel, user)) {
    if (!submode) {
      client.subscribers(channel);
      submode = true;
    } else {
      client.subscribersoff(channel);
      submode = false;
    }
    console.log('* Executed submode command');
  }
}

function followmodeCommandHandler(channel, user) {
  if (isMod(channel, user)) {
    if (!followmode) {
      client.followersonly(channel);
      followmode = true;
      setTimeout(() => {followmode = false;}, 1800000);
    } else {
      client.followersonlyoff(channel);
      followmode = false;
    }
    console.log('* Executed followmode command');
  }
}

function emotemodeCommandHandler(channel, user) {
  if (isMod(channel, user)) {
    if (!emotemode) {
      client.emoteonly(channel);
      emotemode = true;
    } else {
      client.emoteonlyoff(channel);
      emotemode = false;
    }
    console.log('* Executed emotemode command');
  }
}

function slowmodeCommandHandler(channel, user) {
  if (isMod(channel, user)) {
    if (!slowmode) {
      client.slow(channel);
      slowmode = true;
      setTimeout(() => {slowmode = false;}, 300000);
    } else {
      client.slowoff(channel);
      slowmode = false;
    }
    console.log('* Executed slowmode command');
  }
}

function merchCommandHandler(channel) {
  merchChat(channel);
}

function modsCommandHandler(channel) {
  client.mods(channel)
    .then((data) => {
      client.say(channel, `The mods on this channel are: ${data.toString().replace(new RegExp(',', 'g'), ', ')}`);
    console.log('* Executed mods command');
    }).catch((err) => {
      console.log('* ERROR GETTING MODS: ' + err);
    });
}

function botCommandHandler(channel)  {
  client.say(channel, 'This bot was created by MtheB_ ( https://www.twitch.tv/mtheb_ ).  You can check out the source code here: https://github.com/mitchwadair/mthebot');
  console.log('* Executed bot command');
}

function uptimeCommandHandler(channel)  {
  fetch(`https://beta.decapi.me/twitch/uptime/${channel.substring(1)}`)
    .then(res => res.text())
    .then(data => {
      let message = data.includes('offline') ? data : `${channel.substring(1)} has been live for ${data}.`;
      client.say(channel, message);
      console.log('* Executed uptime command');
    })
    .catch(err => console.error(err));
}

//=========================================================================================================================================
//                                                      EVENT HANDLERS
//=========================================================================================================================================

// Called every time a message comes in
function onChatHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  intervalCounter++;
  
  // Remove whitespace from chat message
  const commandFull = msg.trim();

  // If the command is known, let's execute it
  if (commandFull.indexOf('!') == 0) {
    const commandName = commandFull.substring(1);
    let commandFound = false;
    commands.forEach((cmd) => {
      if (cmd.command == commandName) {
        commandFound = true;
        cmd.handler(target, context);
      }
    });
  }
}

function onSubHandler(channel, username, method, message, userstate) {
  client.say(channel, `${username} has joined the Hive with a ${method.plan} subscription, welcome!`)
  console.log('* sub');
}

function onResubHandler(channel, username, months, message, userstate, methods) {
  let cumulativeMonths = ~~userstate["msg-param-cumulative-months"];
  let suffix = ordinalSuffix(months);
  let cumSuffix = ordinalSuffix(cumulativeMonths);
  let rowMessage = months > 0 ? `Their ${months}${suffix} month in a row!` : '';
  let botMessage = cumulativeMonths > 0 ? `Welcome ${username} to their ${cumulativeMonths}${cumSuffix} month in the Hive! ${rowMessage}` : `Welcome ${username} back to the Hive!`;
  client.say(channel, botMessage);
  console.log('* resub');
}

function onSubGiftHandler(channel, username, streakMonths, recipient, methods, userstate) {
  let senderCount = ~~userstate["msg-param-sender-count"];
  let suffix = ordinalSuffix(senderCount);
  client.say(channel, `${username} has gifted their ${senderCount}${suffix} gifted subscription to ${recipient}! Thank you ${username}, and welcome to the Hive ${recipient}!`);
  console.log('* gifted sub');
}

function onSubMysteryGiftHandler(channel, username, numbOfSubs, methods, userstate) {
  let senderCount = ~~userstate["msg-param-sender-count"];
  let suffix = ordinalSuffix(senderCount);
  client.say(channel, `${username} is gifting ${numbOfSubs}, bringing their tally to ${senderCount}!  Welcome everybody to the Hive, and thank you ${username}`);
  console.log('* gifted mystery subs');
}

function onRaidHandler(channel, username, viewers) {
  client.say(channel, `${username} is raiding with ${viewers} viewers! Thank you!`)
  console.log('* raid');
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

//=========================================================================================================================================
//                                                      HELPER FUNCTIONS
//=========================================================================================================================================

function isMod(channel, user) {
  return user.mod == true || user.username == 'mtheb_';
}

function ordinalSuffix(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}
