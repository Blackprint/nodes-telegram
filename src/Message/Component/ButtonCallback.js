/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/ButtonCallback",
class extends Blackprint.Node {
	static input = {
		Text: String,
		/** Data to be passed to the event listener after user clicked the button */
		Data: String,
	};
	static output = {
		Button: Tg.Api.KeyboardButtonCallback,
		/** Can be called use clicked the button and the Data input is not defined */
		Callback: Function,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create a callback button";
		this._id = 'ɃƤ_'+String(Date.now()).slice(3) + (Math.random()*1e3 | 0);

		ButtonComponentNodeList[this._id] = this;
	}

	userClick(ev){
		// .data, .queryId, .userId
		this.ref.Output.Callback();
	}

	async update(){
		let { Input, Output } = this.ref;

		let data = Input.Data || this._id;
		Output.Button = new Tg.Api.KeyboardButtonCallback({
			text: Input.Text,
			data: Buffer.from(data),
		});
	}

	destroy(){
		delete ButtonComponentNodeList[this._id];
	}
});