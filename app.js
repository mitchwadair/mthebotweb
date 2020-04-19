require('dotenv').config();
const tmi = require('tmi.js');
const mysql = require('mysql');
const axios = require('axios');

// ===================== DATA =====================

let channels = {};

// ===================== HELPER FUNCTIONS =====================

Array.prototype.chunk = function(maxChunkSize) {
    let copy = [...this];
    let chunks = [];
    while (copy.length) {
        const size = copy.length > maxChunkSize ? maxChunkSize : copy.length;
        chunks.push(copy.splice(0, size));
    }
    return chunks;
}

const deleteChannel = channel => {
    delete channels[channel];
    console.log(`** removed channel ${channel} from active channels`);
}

const processChat = (channel, userstate, message) => {
    const full = message.trim();

    if (full.startsWith('!')) {
        const args = full.split(' ');
        const command = args.shift().substring(1);
    }
}

// ===================== EVENT HANDLERS =====================

const onConnected = (address, port) => {
    console.log(`** MtheBot_ connected to ${address}:${port}`);
    console.log('** joining all serviced channels...');
    db.query("SELECT name from channels", (err, results, fields) => {
        let promises = results.map(res => {
            return client.join(res.name);
        });
        Promise.all(promises).then(() => {
            console.log('** all serviced channels have been joined');
        });
    });
}

const onChat = (channel, userstate, message, self) => {
    if (self) return;

    let channelKey = channel.substring(1);
    if (channels[channelKey] !== undefined) {
        clearTimeout(channels[channelKey].timeout);
        channels[channelKey].timeout = setTimeout(() => {deleteChannel(channelKey)}, 300000);
        processChat(channel, userstate, message);
    } else {
        db.query(`SELECT commands from channels where name='${channelKey}'`, (err, results, fields) => {
            channels[channelKey] = {
                commands: results[0].commands,
                timeout: setTimeout(() => {deleteChannel(channelKey)}, 300000),
            }
            console.log(`** added channel ${channelKey} to active channels`);
            processChat(channel, userstate, message);
        });
    }
}

// ===================== BOT LIFECYCLE =====================



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