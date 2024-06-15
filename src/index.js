require("dotenv").config();
const MirrorClient = require("./classes/client");

const client = new MirrorClient({});

client.login(process.env.TOKEN);
