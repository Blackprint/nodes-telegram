/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/ButtonReply",
class extends Blackprint.Node {
	static input = {
		Text: String,
	};
	static output = {
		Button: Tg.Api.KeyboardButton,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create a reply button";
	}

	async update(){
		let { Input, Output } = this.ref;
		Output.Button = new Tg.Api.KeyboardButton({ text: Input.Text });
	}
});