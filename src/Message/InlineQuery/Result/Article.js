/**
 * ToDo
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Message/InlineQuery/Result/Article",
class extends Blackprint.Node {
	static input = {
		Title: String,
		Description: String,
		RespondText: String,
		RespondButtonRows: Blackprint.Port.ArrayOf(Tg.Api.KeyboardButtonRow),
	};
	static output = {
		Button: Tg.Api.InputBotInlineResult,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Create article result";
		this._id = 'ɃƤ_'+String(Date.now()).slice(3) + (Math.random()*1e3 | 0);
		this._toast = new NodeToast(iface);
	}

	update(){
		let { Input, Output } = this.ref;

		if(!Input.RespondText) return this._toast.warn("RespondText is required");

		Output.Button = new Tg.Api.InputBotInlineResult({
			type: "article",
			id: this._id,
			title: Input.Title,
			description: Input.Description,
			sendMessage: new Tg.Api.InputBotInlineMessageText({
				message: Input.RespondText,
				replyMarkup: Input.RespondButtonRows.length === 0 ? undefined : new Tg.Api.ReplyInlineMarkup({
					rows: Input.RespondButtonRows
				}),
			}),
		});
	}
});

let _dummyArticleButton = new Tg.Api.ReplyInlineMarkup({rows: [
	new Tg.Api.KeyboardButtonRow({buttons: [
		new Tg.Api.KeyboardButtonCallback({text: '...', data: Buffer.from('1')})
	]})
]});