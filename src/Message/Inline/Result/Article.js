/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/Inline/Result/Article",
class extends Blackprint.Node {
	static input = {
		Title: String,
		Description: String,
		RespondText: String,
	};
	static output = {
		Button: Tg.Api.InputBotInlineResult,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create article result";
		this._id = String(Date.now()).slice(3) + (Math.random()*1e3 | 0);
	}

	async update(){
		let { Input, Output } = this.ref;

		Output.Button = new Tg.Api.InputBotInlineResult({
			type: "article",
			id: this._id,
			title: Input.Title,
			description: Input.Description,
			sendMessage: new Tg.Api.InputBotInlineMessageText({
				message: Input.RespondText,
				// replyMarkup: raw.replyMarkup,
			}),
		});
	}
});