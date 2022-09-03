/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Inline/Result/Photo",
class extends Blackprint.Node {
	static input = {
		URL: String,
	};
	static output = {
		Button: Object,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create photo result";
		this._id = String(Date.now()).slice(3) + (Math.random()*1e3 | 0);
	}

	async update(){
		let { Input, Output } = this.ref;

		let url = Input.URL;
		if(!url) return;

		Output.Button = new Api.InputBotInlineResult({
			type: "photo",
			id: this._id,
			title: 'Untitled',
			url,
			thumb: new Api.InputWebDocument({url, size: 197053, mimeType: 'image/jpeg', attributes:[
				new Api.DocumentAttributeImageSize({w:1024, h:1024})
			]}),
			content: new Api.InputWebDocument({url, size: 197053, mimeType: 'image/jpeg', attributes:[
				new Api.DocumentAttributeImageSize({w:1024, h:1024})
			]}),
			sendMessage: new Api.InputBotInlineMessageMediaAuto({
				message: ''
			}),
		});
	}
});