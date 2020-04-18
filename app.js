require('dotenv').config();
const tmi = require('tmi.js');

const opts = {
    identity: {
        username: 'MtheBot_',
        password: process.env.OAUTH_TOKEN,
    },
    channels: [
        'MtheB_'
    ]
};

// ===================== EVENT HANDLERS =====================

const onConnected = (address, port) => {
    console.log(`** MtheBot_ connected to ${address}:${port}`);
}

const onMessage = (channel, userstate, message, self) => {
    if (self) return;

    console.log(channel);
    console.log(userstate);
    console.log(message);
}

// ===================== INIT CHAT BOT =====================

const client = new tmi.client(opts);

// EVENT HANDLER REGISTRATION
client.on('connected', onConnected);
client.on('message', onMessage);

client.connect();