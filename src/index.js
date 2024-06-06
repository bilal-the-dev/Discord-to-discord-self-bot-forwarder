const MirrorClient = require("./classes/client");
const config = require("../config.json");

const client = new MirrorClient({ checkUpdate: false });
client.login(config["token"]);
