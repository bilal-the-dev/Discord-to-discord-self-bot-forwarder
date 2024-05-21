const MirrorClient = require('./client');
const config = require('../config.json'); 

const client = new MirrorClient({ checkUpdate: false });
client.login(config['token']);