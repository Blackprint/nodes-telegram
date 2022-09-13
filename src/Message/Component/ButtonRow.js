/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/ButtonRow",
class extends Blackprint.Node {
	static input = {
		Button: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButtonCallback),
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
		Output.Row = new Tg.Api.KeyboardButtonRow({buttons: Input.Button});
	}
});