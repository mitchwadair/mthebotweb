require('dotenv').config();
const tmi = require('tmi.js');
const mysql = require('mysql');
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
const processChannel = channel => {
    return new Promise((resolve, reject) => {
        let channelKey = channel.substring(1);
        if (channels[channelKey] !== undefined) {
            clearTimeout(channels[channelKey].timeout);
            channels[channelKey].timeout = setTimeout(_ => {deleteChannel(channelKey)}, 300000);
            resolve()
        } else {
            db.query(`SELECT commands from channels where name='${channelKey}'`, (err, results, fields) => {
                if (err) {
                    return reject(err);
                } else {
                    channels[channelKey] = {
                        commands: results[0].commands,
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

    processChannel(channel).then(_ => {
        const full = message.trim();

        if (full.startsWith('!')) {
            const args = full.split(' ');
            const command = args.shift().substring(1);
        }
    }).catch(err => {
        console.log(`** ERROR PROCESSING CHANNEL ${channel}: ${err}`);
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