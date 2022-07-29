/**
 * Listen to new message event
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Event/UpdateNewMessage",
class extends Blackprint.Node {
	static input = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
	};
	static output = {
		/** New message data */
		Message: Blackprint.Port.StructOf(Object, {
			/** Message sender's id */
			SenderId: {type: String, handle: v=> String(v.senderId)},
			/** Message chat room's id */
			ChatId: {type: String, handle: v=> String(v.chatId)},
			/** Message's id */
			Id: {type: String, handle: v=> String(v.id)},
			/** Message's text value */
			Value: {type: String, field: 'message'},
		}),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "On New Message";
		iface.type = "event";
	}

	update(){
		let { Input, Output } = this.ref;
		if(!Input.Client) return;

		this._callback = ev => Output.Message = ev.message;
		Input.Client._bpOn('UpdateNewMessage', this._callback);
	}

	destroy(){
		this.ref.Input.Client?._bpOff('UpdateNewMessage', this._callback);
	}
});