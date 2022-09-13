/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/InlineKeyboard",
class extends Blackprint.Node {
	static input = {
		Rows: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButtonRow),
	};
	static output = {
		ReplyMarkup: Tg.Api.ReplyKeyboardMarkup,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create inline keyboard markup";
	}

	async update(){
		let { Input, Output } = this.ref;
		Output.ReplyMarkup = new Tg.Api.ReplyKeyboardMarkup({rows: Input.Rows});
	}
});