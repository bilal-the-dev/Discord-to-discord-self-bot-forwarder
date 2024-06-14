const { Schema, model } = require("mongoose");

const threadSchema = new Schema({
	threadIdsObj: { type: Object, default: {} },
});

const Thread = model("Thread", threadSchema);

module.exports = { Thread };
