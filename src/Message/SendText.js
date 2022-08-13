/**
 * Send text message to target user
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/SendText",
class extends Blackprint.Node {
	static input = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
		/** Trigger the send process */
		Send: Blackprint.Port.Trigger(function({ iface }){iface.node.send()}),
		/** Target ChatID (Optional) */
		ChatId: String,
		/** Target Username (Optional) */
		Username: String,
		/** Text message that will be send */
		Text: String,
	};
	static output = {
		/** Message object */
		Message: Blackprint.Port.StructOf(Object, {
			Id: {type: String, handle: v=> String(v.id)},
		}),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Send Text Message";
		this._toast = new NodeToast(iface);
	}

	async send(){
		let { Input, Output } = this.ref;
		let toast = this._toast;

		if(!Input.Client)
			return toast.warn("Client is required");

		let chatId = null;
		if(!!Input.Username){
			chatId = Input.Username;
			if(chatId.slice(0, 1) !== '@')
				chatId = '@'+chatId;
		}
		else if(!!Input.ChatId)
			chatId = Input.ChatId;

		if(chatId == null)
			return toast.warn("Username or ChatId is required");

		if(!Input.Text)
			return toast.warn("Text is required");

		toast.warn("Sending");

		try {
			Output.Message = await Input.Client.sendMessage(chatId, {message: Input.Text});
			this.routes.routeOut();
		} catch(e) {
			console.error(e);
			toast.warn();
			toast.error("Failed to send message");
			Output.Message = null;
		}

		toast.clear();
	}
});