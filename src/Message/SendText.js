Blackprint.registerNode("Telegram/Message/SendText",
class extends Blackprint.Node {
	static input = {
		Client: Tg.TelegramClient,
		Send: Blackprint.Port.Trigger(function(){this.send()}),
		ChatId: String,
		Username: String,
		Text: String,
	};
	static output = {
		Message: Object,
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
		} catch(e) {
			console.error(e);
			Output.Message = null;
			toast.warn();
			toast.error("Failed to send message");
		}

		toast.clear();
	}
});