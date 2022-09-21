/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/ButtonRow",
class extends Blackprint.Node {
	static input = {
		ButtonCallback: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButtonCallback),
		ButtonReply: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButton),
	};
	static output = {
		Row: Tg.Api.KeyboardButtonRow,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create row of button";
	}

	async update(){
		let { Input, Output } = this.ref;
		Output.Row = new Tg.Api.KeyboardButtonRow({
			buttons: [...Input.ButtonCallback, ...Input.ButtonReply]
		});
	}
});