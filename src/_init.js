//> Optional, just for Blackprint Editor
// Let the Blackprint Editor know the source URL where
// the registerNode and registerInterface belongs to
let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	// hasInterface: true,

	// This will autoload (*.docs.json) for Browser
	hasDocs: true,
});

let Tg, fetch = globalThis.fetch ?? require('node-fetch');

if(Blackprint.Environment.loadFromURL){
	await imports([
		// "http://localhost:6789/dist/telegram.js", // npm run build-gramjs
		"https://cdn.jsdelivr.net/npm/@blackprint/nodes-telegram@0.0.2-dep/dist/browser/telegram.js",
	]);

	// Sometime the browser is cached the old module and telegram couldn't be initialized
	// Let's try again for browser
	if(window.telegram == null && window.sf?.loader != null)
		await sf.loader.js(["https://cdn.jsdelivr.net/npm/@blackprint/nodes-telegram@0.0.2-dep/dist/browser/telegram.js"]);

	if(window.telegram == null) throw new Error("Telegram library didn't initialized");
	Tg = window.telegram;
}
else Tg = await import('telegram');

// Global shared context
let Context = Blackprint.createContext('Telegram');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};

// The error must be thrown
Tg.Logger.prototype.error = function(e){throw e};
let VirtualClass = Tg.Api.Chat.prototype.constructor;
let Buffer = globalThis.Buffer ?? Tg.tl.serializeBytes('').constructor;

let ButtonComponentNodeList = {};

// Fix minified class name
Blackprint.utils.renameTypeName({
	InputBotInlineResult: Tg.Api.InputBotInlineResult,
	KeyboardButtonRow: Tg.Api.KeyboardButtonRow,
	ReplyKeyboardMarkup: Tg.Api.ReplyKeyboardMarkup,
	ReplyInlineMarkup: Tg.Api.ReplyInlineMarkup,
	KeyboardButtonCallback: Tg.Api.KeyboardButtonCallback,
	KeyboardButton: Tg.Api.KeyboardButton,
});