//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation", n = "fvtt-wfrp-ratter.ratter-11-tables", r = "mutantsHandbookPatron", i = "mutantsHandbookChaosSpawn", a = "mutantsHandbookPossessionRemoved", o = "mutantsHandbookCorruption", s = {
	dwarf: "ueEWO9920dCmA7qP",
	elf: "X4hMeYoCFx77QIvv",
	gnome: "gktszioKqcA637wH",
	halfling: "4QnKxakvIARiyqAq",
	human: "2XUdBDbSoynCvCoL",
	ogre: "5hidSDB0YHyyrTVi"
}, c = "AAOqrs1CNIgUk5OI", ee = {
	major: {
		mental: "oDBJER6WRFUUCBZX",
		physical: "T0RrHIA3JIYZqlvF"
	},
	minor: {
		mental: "wAgVEmE8c1c2mxRI",
		physical: "uNVEtSgHB0pqquzM"
	},
	trivial: {
		mental: "720DtHbXYchWhSx1",
		physical: "baHAuTz7BJJlvED1"
	}
}, te = {
	khorne: "ymLfyXm3vCnKqMqV",
	nurgle: "rG3ht32Wh5SAVuNz",
	slaanesh: "QHWmoKtujyUHxfG1",
	tzeentch: "MuS2keCF2SFOZYCg"
}, l = {
	dwarf: "dwarf",
	elf: "elf",
	gnome: "gnome",
	halfling: "halfling",
	helf: "elf",
	"high elf": "elf",
	"high-elf": "elf",
	human: "human",
	ogre: "ogre",
	welf: "elf",
	"wood elf": "elf",
	"wood-elf": "elf"
};
function ne(e) {
	return l[e.trim().toLowerCase()];
}
function u(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("physical")) return "physical";
	if (t.startsWith("mental")) return "mental";
}
function d(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("trivial")) return "trivial";
	if (t.startsWith("minor")) return "minor";
	if (t.startsWith("major")) return "major";
	if (t.includes("chosen")) return "chosen";
}
function re(e) {
	return Math.min(Math.max(0, Math.floor(e)), 4) * 10;
}
function ie(e, t) {
	return e === "physical" ? t.toughness : t.willpower;
}
function ae(e, t) {
	return Math.max(0, e - Math.max(0, t));
}
function f(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = u(r);
		e === "mental" ? t += 1 : e === "physical" && (n += 1);
	}
	return {
		mental: t,
		physical: n,
		total: e.length
	};
}
function p(e, t) {
	let n = [];
	return e.physical > t.toughness && n.push("physical"), e.mental > t.willpower && n.push("mental"), n;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/documents.ts
var m = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"unassigned"
];
function h(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function g(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function _(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function v(t) {
	return {
		data: {
			effects: [],
			flags: { [e]: {
				patron: "khorne",
				sourceDocument: "The Mutant's Handbook"
			} },
			img: t.img ?? "systems/wfrp4e/icons/blank.png",
			name: t.name,
			system: {
				description: { value: t.description },
				gmdescription: { value: "" },
				modifier: { value: "" },
				modifiesSkills: { value: !1 },
				mutationType: { value: "mental" },
				source: { value: "The Mutant's Handbook" }
			},
			type: "mutation"
		},
		name: t.name,
		nature: "mental"
	};
}
async function y(e, t) {
	if (!e.documentUuid) {
		if (t === "khorne" && e.name.trim().toLowerCase() === "prejudice") return v(e);
		throw Error(`The table result ${e.name} does not link to a mutation Item.`);
	}
	let n = await fromUuid(e.documentUuid);
	if (!g(n)) throw Error(`The table result ${e.name} does not resolve to a mutation Item.`);
	let r = u(n.system.mutationType.value);
	if (!r) throw Error(`The mutation ${n.name} has no physical or mental classification.`);
	return {
		data: _(n),
		name: n.name,
		nature: r
	};
}
function b(e) {
	let t = x(e) !== void 0;
	return f((e.itemTypes.mutation ?? []).filter((e) => e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0 && !(t && e.name.trim().toLowerCase() === "possessed")).map((e) => e.system.mutationType.value));
}
function x(t) {
	let n = t.getFlag(e, r);
	return m.find((e) => e === n);
}
function oe(e) {
	return (e.itemTypes.mutation ?? []).some((e) => e.name.trim().toLowerCase() === "possessed" && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0);
}
function se(e, t) {
	let n = t.trim().toLowerCase();
	return (e.itemTypes.mutation ?? []).some((e) => e.name.trim().toLowerCase() === n && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0);
}
function ce(t) {
	return t.getFlag(e, i) === !0;
}
async function le(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => e.name.trim().toLowerCase() === "possessed" && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0).map((t) => ({
		_id: t.id,
		[`flags.${e}.${a}`]: !0
	}));
	if (n.length > 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/messages.ts
function S(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while formatting a mutation message.");
	return game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${e}`, t);
}
async function C(e) {
	if (!game) throw Error("Foundry game global is unavailable while posting a mutation message.");
	try {
		let t = ChatMessage.applyMode({
			author: game.user.id,
			content: e
		}, "gm");
		await ChatMessage.create(t);
	} catch (e) {
		console.error("The Mutant's Handbook workflow could not create an informational message.", e);
	}
}
function w(e) {
	ui.notifications.warn(e);
}
function ue(e) {
	let t = e instanceof Error ? e.message : String(e), n = game ? game.i18n.format("FVTT_WFRP_RATTER.Mutations.Error", { message: t }) : `The Mutant's Handbook mutation workflow failed: ${t}`;
	console.error(e), ui.notifications.error(n);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/updates.ts
async function T(e, t) {
	if (!await e.update(t, { skipCorruption: !0 })) throw Error(`Foundry prevented the required update to ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/test-resolution.ts
function E(e) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	return game.i18n.localize(`FVTT_WFRP_RATTER.Mutations.${e}`);
}
function D(e, t) {
	let n = [], r = Number(e.system.status.fortune?.value ?? 0);
	return t.failed && r > 0 && !t.context.fortuneUsedReroll && n.push({
		action: "fortune-reroll",
		label: E("FortuneReroll")
	}), r > 0 && !t.context.fortuneUsedAddSL && n.push({
		action: "fortune-sl",
		label: E("FortuneSL")
	}), n.push({
		action: "dark-deal",
		label: E("DarkDeal")
	}), n.push({
		action: "accept",
		default: !0,
		label: E(t.failed ? "AcceptFailure" : "AcceptSuccess")
	}), n;
}
async function O(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: D(e, t),
		content: game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${t.failed ? "TestResourcesPrompt" : "TestResourcesSuccessPrompt"}`, { name: e.name }),
		rejectClose: !1,
		window: { title: E("TestResourcesTitle") }
	});
	return n === "dark-deal" || n === "fortune-reroll" || n === "fortune-sl" ? n : "accept";
}
async function k(e, t, n, r) {
	try {
		await n();
	} catch (n) {
		try {
			await T(e, t);
		} catch (e) {
			throw AggregateError([n, e], `${r} was spent, the reroll failed, and Foundry could not restore the resource.`, { cause: e });
		}
		throw n;
	}
}
async function A(e, t, n) {
	let r = Math.trunc(Number(e.system.status.fortune?.value ?? 0));
	if (r <= 0) return w(S("FortuneUnavailable", { name: e.name })), !1;
	let i = r - 1;
	return await T(e, { "system.status.fortune.value": i }), n ? (t.context.fortuneUsedAddSL = !0, t.context.previousResult = { ...t.result }, t.preData.SL = Math.trunc(t.result.SL) + 1, t.preData.slBonus = 0, t.preData.successBonus = 0, t.preData.roll = Math.trunc(t.result.roll), await k(e, { "system.status.fortune.value": r }, () => t.roll(), "Fortune")) : (t.context.fortuneUsedReroll = !0, t.context.fortuneUsedAddSL = !0, await k(e, { "system.status.fortune.value": r }, () => t.reroll(), "Fortune")), await C(S(n ? "FortuneSLUsed" : "FortuneRerollUsed", {
		name: e.name,
		remaining: i
	})), !0;
}
async function j(e, t) {
	let n = Math.trunc(Number(e.system.status.corruption.value)), r = n + 1;
	await T(e, { "system.status.corruption.value": r }), await k(e, { "system.status.corruption.value": n }, () => t.reroll(), "Dark Deal Corruption"), await C(S("DarkDealUsed", {
		corruption: r,
		maximum: Number(e.system.status.corruption.max),
		name: e.name
	}));
}
async function M(e, t) {
	for (;;) {
		let n = await O(e, t);
		if (n === "accept") return !t.failed;
		n === "dark-deal" ? await j(e, t) : await A(e, t, n === "fortune-sl");
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/dialogs.ts
var N = [
	"human",
	"dwarf",
	"elf",
	"halfling",
	"gnome",
	"ogre"
], P = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function F(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function I(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a species profile.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: N.map((e) => ({
			action: e,
			label: F(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesPrompt", {
			name: e,
			species: t || game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpecies")
		}),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesTitle") }
	});
	return N.find((e) => e === n);
}
async function L(e) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a Chaos patron.");
	let t = await foundry.applications.api.DialogV2.wait({
		buttons: P.map((e) => ({
			action: e,
			label: F(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.PatronPrompt", { name: e }),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.PatronTitle") }
	});
	return P.find((e) => e === t);
}
async function R(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while spending Resilience.");
	return await foundry.applications.api.DialogV2.confirm({
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.ResiliencePrompt", {
			mutation: t,
			name: e
		}),
		no: { label: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.KeepMutation") },
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ResilienceTitle") },
		yes: { label: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.SpendResilience") }
	}) === !0;
}
async function z(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while reviewing a repeated mutation.");
	return await foundry.applications.api.DialogV2.confirm({
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.RepeatPrompt", {
			mutation: t,
			name: e
		}),
		no: {
			default: !1,
			label: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ResolveManually")
		},
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.RepeatTitle") },
		yes: {
			default: !0,
			label: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.AddOccurrence")
		}
	}) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/outcomes.ts
var B = `flags.${e}.${r}`, V = `flags.${e}.${i}`;
function H(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function U(e, t) {
	return ie(t, H(e));
}
function de(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function W(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await R(e.name, t);
}
async function G(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": ae(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await T(e, i);
}
async function fe(e, t) {
	for (let n of t) {
		let t = S("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		w(t), await C(t);
	}
}
async function K(e, t) {
	if (await W(e, t.name)) {
		let n = U(e, t.nature);
		await G(e, n, !0), await C(S("Resisted", {
			loss: n,
			mutation: t.name,
			name: e.name
		}));
		return;
	}
	if (!(!se(e, t.name) || await z(e.name, t.name))) {
		let n = U(e, t.nature);
		await G(e, n, !1), await C(S("RepeatPending", {
			loss: n,
			mutation: t.name,
			name: e.name
		}));
		return;
	}
	let n = U(e, t.nature), r = await e.createEmbeddedDocuments("Item", [t.data]);
	if (r.length !== 1) throw r.length > 0 && await e.deleteEmbeddedDocuments("Item", r.map((e) => e.id)), Error(`Foundry did not create the ${t.name} mutation Item.`);
	let i;
	try {
		i = p(b(e), H(e)), await G(e, n, !1, i.length > 0 ? { [V]: !0 } : {});
	} catch (t) {
		throw await e.deleteEmbeddedDocuments("Item", r.map((e) => e.id)), t;
	}
	await C(S("Gained", {
		loss: n,
		mutation: t.name,
		name: e.name
	})), await fe(e, i);
}
async function q(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let n = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await W(e, n)) {
		let r = U(e, t);
		await G(e, r, !0), await C(S("Resisted", {
			loss: r,
			mutation: n,
			name: e.name
		}));
		return;
	}
	let r = await L(e.name), i = r ?? "unassigned", a = oe(e), o = U(e, t);
	if (await G(e, o, !1, { [B]: i }), a && await le(e), await C(S(r ? "Chosen" : "ChosenUnassigned", {
		loss: o,
		name: e.name,
		patron: r ? de(r) : "Chaos"
	})), a) {
		let t = S("PossessedRemoved", { name: e.name });
		w(t), await C(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/patron-notes.ts
var pe = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, me = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, he = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, ge = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, _e = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), ve = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function ye(e, t) {
	let n = t.trim().toLowerCase();
	if (_e.has(n)) return pe[e];
	if (ve.has(n)) return me[e];
	if (n === "addiction") return he[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return ge[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/tables.ts
function be(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function xe(e) {
	let t = game?.packs.get(n);
	if (!t) throw Error(`The required compendium ${n} is unavailable.`);
	let r = await t.getDocument(e);
	if (!be(r)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return r;
}
async function J(e, t) {
	let n = (await (await xe(e)).draw({
		displayChat: !0,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!n) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return n;
}
function Se(e) {
	return J(s[e]);
}
function Ce(e) {
	let t = re(e);
	return J(c, t > 0 ? `1d100 + ${t}` : "1d100");
}
function we(e, t) {
	return J(ee[t][e]);
}
function Te(e) {
	return J(te[e]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/workflow.ts
var Ee = `flags.${e}.${r}`;
function De(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Oe(e, t) {
	if (t !== "unassigned") return t;
	let n = await L(e.name);
	if (!n) {
		w(S("PatronRequired", { name: e.name }));
		return;
	}
	return await T(e, { [Ee]: n }), n;
}
async function ke(e, t) {
	let n = await Oe(e, t);
	if (!n) return;
	let r = await y(await Te(n), n), i = ye(n, r.name);
	await K(e, r), i && await C(S("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: De(n)
	}));
}
async function Ae(e) {
	let t = e.system.details.species.value, n = ne(t) ?? await I(e.name, t);
	if (!n) {
		w(S("SpeciesRequired", { name: e.name }));
		return;
	}
	let r = await Se(n), i = u(r.name);
	if (!i) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let a = await Ce(b(e).total), o = d(a.name);
	if (!o) throw Error(`The severity table returned an unrecognized result: ${a.name}.`);
	if (o === "chosen") {
		await q(e, i);
		return;
	}
	let s = await we(i, o);
	if (!s.documentUuid && d(s.name) === "chosen") {
		await q(e, i);
		return;
	}
	let c = await y(s);
	if (c.nature !== i) throw Error(`${c.name} does not match the rolled ${i} mutation table.`);
	await K(e, c);
}
async function je(e) {
	let t = x(e);
	t ? await ke(e, t) : await Ae(e);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/check.ts
var Y = /* @__PURE__ */ new Set();
async function X(e) {
	let t = e.system.status.corruption;
	if (!(Number(t.value) <= Number(t.max) || Y.has(e.uuid) || ce(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		Y.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[o]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await M(e, i) ? await C(game.i18n.localize("CHAT.MutateSuccess")) : await je(e);
		} finally {
			Y.delete(e.uuid);
		}
	}
}
async function Me(e) {
	let t = await fromUuid(e);
	if (!h(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await X(t);
}
//#endregion
//#region src/module/api/create-module-api.ts
function Ne() {
	return {
		checkMutantsHandbookCorruption: Me,
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		title: t
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function Pe() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = Ne();
}
//#endregion
//#region src/module/settings.ts
var Z = "useMutantsHandbookMutations";
function Fe() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(e, Z, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function Q() {
	return game?.settings.get(e, Z) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/context-options.ts
var Ie = [
	"CHATOPT.UseFortuneReroll",
	"CHATOPT.Reroll",
	"CHATOPT.UseFortuneSL",
	"CHATOPT.DarkDeal",
	"CHATOPT.StartOpposed",
	"CHATOPT.DefendOpposed",
	"CHATOPT.CompleteUnopposed",
	"CHATOPT.EditTest"
];
function Le(e) {
	let t = e.dataset.messageId;
	return (t ? game?.messages.get(t)?.system.test : void 0)?.options[o] === !0;
}
function Re(e) {
	let t = e.condition;
	e.condition = (e) => Le(e) ? !1 : t ? t(e) : !0;
}
function ze() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		if (!game) return;
		let n = new Set(Ie.map((e) => game.i18n.localize(e)));
		for (let e of t) n.has(e.name) && Re(e);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/replacement.ts
var $ = Symbol.for(`${e}.mutantsHandbookReplacement`);
function Be() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[$] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, $, { value: !0 }), e.checkCorruption = async function() {
		if (!Q()) {
			await t.call(this);
			return;
		}
		try {
			await X(this.parent);
		} catch (e) {
			ue(e);
		}
	};
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function Ve() {
	Hooks.once("init", () => {
		Fe(), Pe(), ze();
	}), Hooks.once("ready", () => {
		Be();
	});
}
//#endregion
//#region src/main.ts
Ve();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map