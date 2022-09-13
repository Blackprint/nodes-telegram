/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Component/InlineMessage",
class extends Blackprint.Node {
	static input = {
		Rows: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButtonRow),
	};
	static output = {
		ReplyMarkup: Tg.Api.ReplyInlineMarkup,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create inline message markup";
	}

	async update(){
		let { Input, Output } = this.ref;
		Output.ReplyMarkup = new Tg.Api.ReplyInlineMarkup({rows: Input.Rows});
	}
});