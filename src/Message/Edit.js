/**
 * Edit text message from a message
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Edit",
class extends Blackprint.Node {
	static input = {
		/** Trigger the send process */
		Send: Blackprint.Port.Trigger(({ iface })=> iface.node.send()),
		/** Target Message object */
		Message: Context.VirtualType(Object, "Message"),
		/** Text for being send */
		Text: String,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Edit Message";
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
			await Message._bp_client.editMessage(Message.peerId, {
				// noWebpage: true,
				message: Message.id,
				text: Input.Text,
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