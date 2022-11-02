/**
 * Kick member from a group
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Group/Kick",
class extends Blackprint.Node {
	static input = {
		/** Trigger the process */
		Trigger: Blackprint.Port.Trigger(({ iface })=> iface.node.trigger()),
		AuthToken: String,
		GroupId: String,
		UserId: String,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Kick Group Member";
		this._toast = new NodeToast(iface);
	}

	async trigger(){
		let { Input } = this.ref;
		let toast = this._toast;

		if(!Input.GroupId) return toast.warn("GroupId is required");

		toast.warn("Kicking");

		try {
			await fetch(`https://api.telegram.org/bot${Input.AuthToken}/kickChatMember?chat_id=${Input.GroupId}&user_id=${Input.UserId}`);
			this.routes.routeOut();
		} catch(e) {
			console.error(e);
			toast.warn();
			toast.error("Failed to kick group member");
		}

		toast.clear();
	}
});