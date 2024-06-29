class MessageMap {
	constructor() {
		this.messageMap = new Map();
	}

	findMessage(id) {
		return this.messageMap.get(id);
	}

	addMessage(sourceMsgId, message) {
		const { channel_id, id } = message;

		this.messageMap.set(sourceMsgId, [channel_id, id]);
	}
}

module.exports = new MessageMap();
