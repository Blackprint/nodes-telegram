Blackprint.registerNode("Telegram/Connection/MTProto",
class extends Blackprint.Node {
	static input = {
		Connect: Blackprint.Port.Trigger(function(){this.connect()}),
		Disconnect: Blackprint.Port.Trigger(function(){this.disconnect()}),
		StringSession: String,
		AuthToken: String,
		API_ID: Number,
		API_Hash: String,
		RetryDelay: Blackprint.Port.Default(Number, 10000),
	};
	static output = {
		Client: Tg.TelegramClient,
		IsConnected: Boolean,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Telegram MTProto";
		// iface.type = "event";

		this._toast = new NodeToast(iface);
	}

	update(){
		let { Input, Output } = this.ref;
		let toast = this._toast;

		if(Output.Client != null){
			Output.Client.disconnect();
			Output.Client = null;
		}

		if(!Input.StringSession && !Input.AuthToken)
			return toast.warn("StringSession or AuthToken is required");

		// Can be obtained from https://my.telegram.org/apps
		if(!Input.API_ID)
			return toast.warn("API_ID is required");

		if(!Input.API_Hash)
			return toast.warn("API_Hash is required");

		toast.clear();
		let temp = new Tg.TelegramClient(
			new Tg.sessions.StringSession(Input.StringSession ?? ''),
			Input.API_ID,
			Input.API_Hash, {
				retryDelay: Input.RetryDelay,
		});

		temp._bpEvList = {};
		temp.addEventHandler(event => this._onEvent(event));

		temp._bpOn = function(name, callback){
			let list = this._bpEvList[name] ??= [];
			if(list.includes(callback)) return;
			list.push(callback);
		}
		temp._bpOff = function(name, callback){
			let list = this._bpEvList[name];
			if(list == null || list.length === 0) return;

			if(callback == null)
				return list.length = 0;

			let i = list.includes(callback);
			if(i === -1) return;

			list.splice(i, 1);
		}

		temp.setLogLevel("error"); // only errors

		// Send to output
		Output.Client = temp;
	}
	_onEvent(event){
		if(event.className === void 0){
			// let eventName = event.constructor.name;
			return;
		}

		let { _bpEvList } = this.ref.Output.Client;
		let handler = _bpEvList[event.className];

		if(handler === void 0){
			// console.log('Unhandled Event:', event);
			return;
		}

		for (let i=0; i < handler.length; i++) {
			handler[i](event);
		}
	}
	async connect(){
		let { Input, Output } = this.ref;
		let toast = this._toast;

		if(Output.Client == null){
			this.update();
			if(Output.Client == null) return;
		}

		toast.warn("Connecting");

		try{
			if(!Input.AuthToken)
				await this.ref.Output.Client.connect();
			else await this.ref.Output.Client.start({
				botAuthToken: Input.AuthToken,
				onError(msg){
					toast.error("Failed to connect");
					console.error(arguments);
				}
			});
		} catch(e) {
			toast.error("Failed to connect");
			console.error(e);
			Output.IsConnected = false;
			return;
		} finally {
			toast.warn();
		}

		toast.clear();
		toast.success("Connected");
		Output.IsConnected = true;
	}
	destroy(){this.disconnect()}
	disconnect(){
		this.ref.Output.Client?.disconnect();
		this.ref.Output.IsConnected = false;
		this._toast.warn("Disconnected");
	}
});
