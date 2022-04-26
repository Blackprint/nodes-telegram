//> Optional, just for Blackprint Editor
// Let the Blackprint Editor know the source URL where
// the registerNode and registerInterface belongs to
let Blackprint = window.Blackprint.loadScope({
	// You can find the URL on Blackprint menu -> Modules
	// This will also be exported to JSON if this module's nodes is being used
	url: import.meta.url,

	// This will autoload (*.sf.mjs) and (*.sf.css) file for Browser
	hasInterface: true,
});

await imports([
	"http://localhost:6789/dist/telegram.js", // npm run build-gramjs
	// "https://cdn.jsdelivr.net/npm/sfmediastream@latest",
]);

var Telegram = window.telegram;

// Global shared context
let Context = Blackprint.createContext('Your/Module/Name');

// This is needed to avoid duplicated event listener when using hot reload
// Event listener that registered with same slot will be replaced
Context.EventSlot = {slot: 'my-private-event-slot'};