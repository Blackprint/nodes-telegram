Blackprint.registerNode("Telegram/Event/UpdateNewMessage",
class extends Blackprint.Node {
	static input = {
		Client: Tg.TelegramClient,
	};
	static output = {
		Data: Object,
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

		this._callback = ev => Output.Data = ev;
		Input.Client._bpOn('UpdateNewMessage', this._callback);
	}

	destroy(){
		this.ref.Input.Client?._bpOff('UpdateNewMessage', this._callback);
	}
});