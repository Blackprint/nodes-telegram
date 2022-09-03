/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Inline/Respond",
class extends Blackprint.Node {
	static input = {
		/** Trigger the send process */
		Send: Blackprint.Port.Trigger(({ iface })=> iface.node.send()),
		Query: Object,
		List: Blackprint.Port.ArrayOf(Tg.Api.InputBotInlineResult),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Respond to Inline Query";
		this._toast = new NodeToast(iface);
	}

	async send(){
		let { Input } = this.ref;
		let toast = this._toast;

		if(!Input.Query) return toast.warn("Query is required");

		toast.warn("Sending");
		try {
			await Input.Query._client.invoke(new Tg.Api.messages.SetInlineBotResults({
				queryId: Input.Query.id,
				results: Input.List || [],
				cacheTime: 5, // 5 sec
				gallery: false,
				private: true, // cache
				// nextOffset: "some string here",
			}));
			this.routes.routeOut();
		} catch(e) {
			console.error(e);
			toast.warn();
			toast.error("Failed to send message");
		}

		toast.clear();
	}
});