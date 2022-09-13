/**
 * Send text message to target user
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Send",
class extends Blackprint.Node {
	static input = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
		/** Trigger the send process */
		Send: Blackprint.Port.Trigger(({ iface })=> iface.node.send()),
		/**
		 * Target ChatID
		 * You can also use username by adding @ as the first character
		 */
		ChatId: String,
		/**
		 * Send as channel or alternate account id
		 * You can also use username by adding @ as the first character
		 */
		SendAs: String,
		/** For sending button */
		ReplyMarkup: Blackprint.Port.Union([Tg.Api.ReplyKeyboardMarkup, Tg.Api.ReplyInlineMarkup]),
		/** Text message that will be send */
		Text: String,
	};
	static output = {
		/** Message object */
		Message: Context.VirtualType(Blackprint.Port.StructOf(Object, {
			Id: {type: String, handle: v=> String(v.id)},
		}), "Message"),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Send Message";
		this._toast = new NodeToast(iface);
	}

	async send(){
		let { Input, Output } = this.ref;
		let toast = this._toast;

		if(!Input.Client) return toast.warn("Client is required");
		if(!Input.ChatId) return toast.warn("ChatId is required");
		if(!Input.Text) return toast.warn("Text is required");

		toast.warn("Sending");
		try {
			Output.Message = await Input.Client.sendMessage(Input.ChatId, {
				// noWebpage: true,
				message: Input.Text,
				replyToMsgId: Input.ReplyToMsgId,
				sendAs: Input.SendAs ? await Input.Client.getInputEntity(Input.SendAs) : undefined,
				// parseMode: 'html',
			});
			Output.Message._bp_client = Input.Client;
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