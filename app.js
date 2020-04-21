// Copyright (c) 2020 Mitchell Adair
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

require('dotenv').config();
const tmi = require('tmi.js');
const mysql = require('mysql');
const APIServer = require('./API Server/apiserver');
const axios = require('axios');

// ===================== DATA =====================

let channels = {};

// ===================== HELPER FUNCTIONS =====================

// extend Array to include a 'chunk' function
// use function rather than arrow func to access 'this'
// makes shallow copy of current array, then splits the array into chunks of the given max chunk size and returns it
Array.prototype.chunk = function(maxChunkSize) {
    let copy = [...this];
    let chunks = [];
    while (copy.length) {
        const size = copy.length > maxChunkSize ? maxChunkSize : copy.length;
        chunks.push(copy.splice(0, size));
    }
    return chunks;
}

// remove a channel from the active channels object
const deleteChannel = channel => {
    delete channels[channel];
    console.log(`** removed channel ${channel} from active channels`);
}

// process the given channel
// either restart the timeout func or add the channel to active channels
const processChannel = channelKey => {
    return new Promise((resolve, reject) => {
        if (channels[channelKey] !== undefined) {
            clearTimeout(channels[channelKey].timeout);
            channels[channelKey].timeout = setTimeout(_ => {deleteChannel(channelKey)}, 300000);
            resolve()
        } else {
            db.query(`SELECT commands,events FROM channels WHERE name='${channelKey}'`, (err, results) => {
                if (err) {
                    return reject(err);
                } else {
                    channels[channelKey] = {
                        commands: JSON.parse(results[0].commands),
                        events: JSON.parse(results[0].events),
                        timeout: setTimeout(_ => {deleteChannel(channelKey)}, 300000),
                    }
                    console.log(`** added channel ${channelKey} to active channels`);
                    resolve()
                }
            });
        }
    });
}

// ===================== EVENT HANDLERS =====================

const onConnected = (address, port) => {
    console.log(`** MtheBot_ connected to ${address}:${port}`);
    console.log('** joining all serviced channels...');
    db.query("SELECT name from channels", (err, results, fields) => {
        let promises = results.map(res => {
            return client.join(res.name);
        });
        Promise.all(promises).then(_ => {
            console.log('** all serviced channels have been joined');
        }).catch(err => {
            console.log(`** ERROR JOINING CHANNEL: ${err}`);
        });
    });
}

const onChat = (channel, userstate, message, self) => {
    if (self) return;

    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const full = message.trim();

        if (full.startsWith('!')) {
            const args = full.split(' ');
            const command = args.shift().substring(1);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onHost = (channel, username, viewers, autohost) => {
    if (!autohost) {
        const channelKey = channel.substring(1);
        processChannel(channelKey).then(_ => {
            const data = channels[channelKey].events.host;
            if (data.enabled) {
                let message = data.message
                    .replace(new RegExp('{{user}}', 'g'), username)
                    .replace(new RegExp('{{viewers}}', 'g'), viewers);
                client.say(channel, message);
            }
        }).catch(err => {
            console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
        });
    }
}

const onRaid = (channel, username, viewers) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.raid;
        if (data.enabled) {
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{viewers}}', 'g'), viewers);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onResub = (channel, username, monthStreak, message, userstate, methods) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.resub;
        if (data.enabled) {
            const months = ~~userstate["msg-param-cumulative-months"];
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{months}}', 'g'), months);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onSubGift = (channel, username, streakMonths, recipient, methods, userstate) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.subgift;
        if (data.enabled) {
            const total = ~~userstate["msg-param-sender-count"];
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{total}}', 'g'), total)
                .replace(new RegExp('{{recipient}}', 'g'), recipient);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onSubMysteryGift = (channel, username, numbOfSubs, methods, userstate) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.mysterygift;
        if (data.enabled) {
            const total = ~~userstate["msg-param-sender-count"];
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{total}}', 'g'), total)
                .replace(new RegExp('{{count}}', 'g'), numbOfSubs);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onSub = (channel, username, method, message, userstate) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.sub;
        if (data.enabled) {
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{type}}', 'g'), method.plan);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

const onCheer = (channel, userstate, message) => {
    const channelKey = channel.substring(1);
    processChannel(channelKey).then(_ => {
        const data = channels[channelKey].events.cheer;
        if (data.enabled) {
            let message = data.message
                .replace(new RegExp('{{user}}', 'g'), username)
                .replace(new RegExp('{{amount}}', 'g'), userstate.bits);
            client.say(channel, message);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channelKey}: ${err}`);
    });
}

// ===================== INIT CHAT BOT/DB CONNECTION =====================

const opts = {
    identity: {
        username: 'MtheBot_',
        password: process.env.OAUTH_TOKEN,
    },
    channels: [
        'MtheB_'
    ]
};

const client = new tmi.client(opts);

// EVENT HANDLER REGISTRATION
client.on('connected', onConnected);
client.on('chat', onChat);
client.on('hosted', onHost);
client.on('raided', onRaid);
client.on('resub', onResub);
client.on('subgift', onSubGift);
client.on('submysterygift', onSubMysteryGift);
client.on('subscription', onSub);
client.on('cheer', onCheer);

client.connect();

const db = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME
});

db.connect(err => {
    if (err) {
        console.error(`** DB Connection failed: ${err.stack}`);
        return;
    }
    console.log('** Connected to DB');
});

// ===================== INIT API SERVER =====================

APIServer(db);