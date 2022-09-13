/**
 * Listen to new message event
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Event/NewMessage",
class extends Blackprint.Node {
	static type = 'event';
	static input = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
	};
	static output = {
		/** New message data */
		Message: Context.VirtualType(Blackprint.Port.StructOf(Object, {
			/** Message sender's id */
			SenderId: {type: String, handle: v=> String(v.senderId)},
			/** Message chat room's id */
			ChatId: {type: String, handle: v=> String(v.chatId)},
			/** Message's id */
			Id: {type: String, handle: v=> String(v.id)},
			/** Message's text value */
			Value: {type: String, field: 'message'},
		}), "Message"),
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "On New Message";
	}

	init(){
		let { Input, IInput } = this.ref;
		IInput.Client.on('disconnect', ev => {
			if(this._callback == null) return;
			Input.Client._bpOff('UpdateNewMessage', this._callback);
		});
	}

	update(){
		let { Input, Output } = this.ref;
		if(!Input.Client) return;

		Input.Client._bpOn('UpdateNewMessage', this._callback = ev => {
			// console.log(ev);
			Output.Message = ev.message;
			this.routes.routeOut();
		});
	}

	destroy(){
		this.ref.Input.Client?._bpOff('UpdateNewMessage', this._callback);
	}
});

// UpdateEditMessage
// UpdateEditChannelMessage
// UpdateNewChannelMessage
// UpdateNewMessage
// UpdateShortSentMessage
// UpdateBotCallbackQuery
// UpdateChannelUserTyping
// UpdateUserStatus
// UpdateDeleteMessages
// UpdateReadChannelInbox
// UpdateMessagePoll
// UpdateUserName
// UpdateUserPhoto
// UpdateDeleteChannelMessages
// UpdateGroupCallParticipants
// UpdateDraftMessage
// UpdateChatParticipant
// UpdateChatParticipants
// UpdateBotInlineQuery
// UpdateInlineBotCallbackQuery
// UpdateBotInlineSend
// UpdateGroupCall