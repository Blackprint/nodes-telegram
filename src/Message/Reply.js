/**
 * Reply a text message
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Reply",
class extends Blackprint.Node {
	static input = {
		/** Trigger the send process */
		Send: Blackprint.Port.Trigger(({ iface })=> iface.node.send()),
		/** Target Message object */
		Message: Context.VirtualType(Object, "Message"),
		/** Text for being send */
		Text: String,
		/** For adding button to the message or user keyboard */
		ReplyMarkup: Blackprint.Port.Union([Tg.Api.ReplyKeyboardMarkup, Tg.Api.ReplyInlineMarkup]),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Reply Message";
		this._toast = new NodeToast(iface);
	}

	async send(){
		let { Input } = this.ref;
		let toast = this._toast;

		if(!Input.Message) return toast.warn("Message is required");
		if(!Input.Text) return toast.warn("Text is required");

		toast.warn("Sending");
		let { Message } = Input;

		try {
			await Message._bp_client.sendMessage(Message.peerId, {
				// noWebpage: true,
				replyTo: Message.id,
				message: Input.Text,
				// parseMode: 'html',
			});
			this.routes.routeOut();
		} catch(e) {
			console.error(e);
			toast.warn();
			toast.error("Failed to send message");
		}

		toast.clear();
	}
});