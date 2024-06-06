class MessageMap {
	constructor() {
		this.messageMap = new Map();
	}

	findMessage(id) {
		return this.messageMap.get(id);
	}

	addMessage(message, desMsgId) {
		const { channel_id, id } = message;

		this.messageMap.set(desMsgId, [channel_id, id]);
	}
}

module.exports = new MessageMap();
