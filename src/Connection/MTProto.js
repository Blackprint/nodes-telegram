/**
 * Connect into a user/bot account on Telegram server
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Connection/MTProto",
class extends Blackprint.Node {
	static input = {
		/** Begin the connection/reconnection */
		Connect: Blackprint.Port.Trigger(({ iface })=> iface.node.connect()),
		/** Disconnect from the server */
		Disconnect: Blackprint.Port.Trigger(({ iface })=> iface.node.disconnect()),
		/** Bot/user's session token (Optional) */
		StringSession: String,
		/** Bot's auth token */
		AuthToken: String,
		/** Telegram cleint's API ID */
		API_ID: Number,
		/** Telegram cleint's API Hash */
		API_Hash: String,
		/** If connection failed, try again in specific time */
		RetryDelay: Blackprint.Port.Default(Number, 10000),
	};
	static output = {
		/** Telegram client for a user account */
		Client: Tg.TelegramClient,
		/** Return true if connected */
		IsConnected: Boolean,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Telegram MTProto";
		// iface.type = "event";

		let toast = this._toast = new NodeToast(iface);
		toast.warn("Disconnected");
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
		toast.warn("Disconnected");

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

		temp._bpOn('UpdateInlineBotCallbackQuery', ev => {
			let id = ev.data.toString('utf8');
			ButtonComponentNodeList[id]?.userClick(ev);
		});

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
				await Output.Client.connect();
			else await Output.Client.start({
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

		if(!Output.Client._bpchangedsender){
			Output.Client._bpchangedsender = true;

			let backupClient = Output.Client;
			let that = this;
			let _disconnect = Output.Client._sender.disconnect;
			Output.Client._sender.disconnect = async function() {
				toast.warn("Disconnected");
				Output.IsConnected = false;

				await _disconnect.apply(this, arguments);
				if(backupClient !== Output.Client || !that._autoReconnect) return;

				toast.warn("Reconnecting");
				let promise = backupClient.connect();
	
				let reconnectTry = 0;
				let tryInterval = setInterval(async ()=> {
					if(backupClient !== Output.Client || !that._autoReconnect || backupClient.connected){
						clearInterval(tryInterval);
						Output.IsConnected = true;
						toast.clear();
						toast.success("Connected");
					}
					else {
						toast.warn("Reconnecting " + (++reconnectTry));
						await backupClient.connect();
					}
				}, 5000);

				await promise;
				setTimeout(()=> {
					if(backupClient.connected && !backupClient._sender.userDisconnected){
						toast.clear();
						toast.success("Connected");
						clearInterval(tryInterval);
					}
				}, 100);
			}
		}

		this._autoReconnect = true;

		toast.clear();
		toast.success("Connected");
		Output.IsConnected = true;
	}
	destroy(){this.disconnect()}
	disconnect(){
		let { Output } = this.ref;
		Output.Client?.disconnect();
		this._autoReconnect = false;
		Output.IsConnected = false;
		this._toast.warn("Disconnected");
	}
});
