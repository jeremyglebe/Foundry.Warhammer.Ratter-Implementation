//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation";
//#endregion
//#region src/module/api/create-module-api.ts
function n() {
	return {
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		title: t
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function r() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = n();
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function i() {
	Hooks.once("init", () => {
		r();
	});
}
//#endregion
//#region src/main.ts
i();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map