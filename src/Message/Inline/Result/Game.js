/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Inline/Result/Game",
class extends Blackprint.Node {
	static input = {
		Id: String,
		ShortName: String,
	};
	static output = {
		Button: Tg.Api.InputBotInlineResult,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create game result";
	}

	async update(){
		let { Input, Output } = this.ref;

		Output.Button = new Tg.Api.InputBotInlineResult({
			type: "game",
			id: Input.Id,
			shortName: Input.ShortName,
			sendMessage: new Tg.Api.InputBotInlineMessageGame(),
		});
	}
});