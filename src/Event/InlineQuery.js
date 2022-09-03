/**
 * Listen to inline query event
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Event/InlineQuery",
class extends Blackprint.Node {
	static type = 'event';
	static input = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
	};
	static output = {
		/** Sender's id */
		UserId: String,
		/** Text value */
		Value: String,
		/** Query object */
		Query: Object,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "On Inline Query";
	}

	init(){
		let { Input, IInput } = this.ref;
		IInput.Client.on('disconnect', ev => {
			if(this._callback == null) return;
			Input.Client._bpOff('UpdateBotInlineQuery', this._callback);
		});
	}

	update(){
		let { Input, Output } = this.ref;
		if(!Input.Client) return;

		Input.Client._bpOn('UpdateBotInlineQuery', this._callback = ev => {
			// console.log(ev);
			Output.UserId = String(ev.userId);
			Output.Value = String(ev.query);
			Output.Query = {
				id: String(ev.queryId),
				_client: Input.Client
			};

			this.routes.routeOut();
		});
	}

	destroy(){
		this.ref.Input.Client?._bpOff('UpdateBotInlineQuery', this._callback);
	}
});