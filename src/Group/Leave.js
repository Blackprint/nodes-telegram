/**
 * Leave from a group
 * @blackprint node
 */
Blackprint.registerNode("Telegram/Group/Leave",
class extends Blackprint.Node {
	static input = {
		/** Trigger the process */
		Trigger: Blackprint.Port.Trigger(({ iface })=> iface.node.trigger()),
		AuthToken: String,
		GroupId: String,
	};

	constructor(instance){
		super(instance);

		let iface = this.setInterface();
		iface.title = "Leave Group";
		this._toast = new NodeToast(iface);
	}

	async trigger(){
		let { Input } = this.ref;
		let toast = this._toast;

		if(!Input.GroupId) return toast.warn("GroupId is required");

		toast.warn("Leaving");

		try {
			await fetch(`https://api.telegram.org/bot${Input.AuthToken}/leaveChat?chat_id=${Input.GroupId}`);
			this.routes.routeOut();
		} catch(e) {
			console.error(e);
			toast.warn();
			toast.error("Failed to leave group");
		}

		toast.clear();
	}
});