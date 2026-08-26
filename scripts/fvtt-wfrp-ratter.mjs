//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation", n = "fvtt-wfrp-ratter.ratter-11-tables", r = "mutantsHandbookPatron", i = "mutantsHandbookChaosSpawn", a = "mutantsHandbookPossessionRemoved", o = "mutantsHandbookCorruption", s = {
	dwarf: "ueEWO9920dCmA7qP",
	elf: "X4hMeYoCFx77QIvv",
	gnome: "gktszioKqcA637wH",
	halfling: "4QnKxakvIARiyqAq",
	human: "2XUdBDbSoynCvCoL",
	ogre: "5hidSDB0YHyyrTVi"
}, c = "AAOqrs1CNIgUk5OI", l = {
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
}, u = {
	khorne: "ymLfyXm3vCnKqMqV",
	nurgle: "rG3ht32Wh5SAVuNz",
	slaanesh: "QHWmoKtujyUHxfG1",
	tzeentch: "MuS2keCF2SFOZYCg"
}, d = {
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
function f(e) {
	return d[e.trim().toLowerCase()];
}
function p(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("physical")) return "physical";
	if (t.startsWith("mental")) return "mental";
}
function ee(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("trivial")) return "trivial";
	if (t.startsWith("minor")) return "minor";
	if (t.startsWith("major")) return "major";
	if (t.includes("chosen")) return "chosen";
}
function te(e) {
	return Math.min(Math.max(0, Math.floor(e)), 4) * 10;
}
function ne(e, t) {
	return e === "physical" ? t.toughness : t.willpower;
}
function re(e, t) {
	return Math.max(0, e - Math.max(0, t));
}
function ie(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = p(r);
		e === "mental" ? t += 1 : e === "physical" && (n += 1);
	}
	return {
		mental: t,
		physical: n,
		total: e.length
	};
}
function ae(e, t) {
	let n = [];
	return e.physical > t.toughness && n.push("physical"), e.mental > t.willpower && n.push("mental"), n;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/documents.ts
var oe = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"unassigned"
];
function se(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function ce(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function le(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function ue(t) {
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
async function de(t, n) {
	if (!t.documentUuid) {
		if (n === "khorne" && t.name.trim().toLowerCase() === "prejudice") return ue(t);
		throw Error(`The table result ${t.name} does not link to a mutation Item.`);
	}
	let r = await fromUuid(t.documentUuid);
	if (!ce(r)) throw Error(`The table result ${t.name} does not resolve to a mutation Item.`);
	let i = p(r.system.mutationType.value);
	if (!i) throw Error(`The mutation ${r.name} has no physical or mental classification.`);
	let a = r.getFlag(e, "mutationAutomation")?.acquisition;
	return {
		...a ? { acquisition: a } : {},
		data: le(r),
		name: r.name,
		nature: i
	};
}
function m(t, n) {
	let r = (t.itemTypes.mutation ?? []).filter((t) => t.getFlag(e, a) !== !0), i = r.filter((e) => e.name.trim().toLowerCase() === n.name.trim().toLowerCase()).length, o = n.acquisition?.max;
	if (o !== void 0 && i >= o) return `${n.name} has reached its acquisition maximum of ${o}.`;
	let s = n.acquisition?.conflicts?.find((e) => r.some((t) => t.name.trim().toLowerCase() === e.trim().toLowerCase()));
	return s ? `${n.name} conflicts with the existing ${s} mutation.` : void 0;
}
function fe(e) {
	let t = pe(e) !== void 0;
	return ie((e.itemTypes.mutation ?? []).filter((e) => e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0 && !(t && e.name.trim().toLowerCase() === "possessed")).map((e) => e.system.mutationType.value));
}
function pe(t) {
	let n = t.getFlag(e, r);
	return oe.find((e) => e === n);
}
function me(e) {
	return (e.itemTypes.mutation ?? []).some((e) => e.name.trim().toLowerCase() === "possessed" && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0);
}
function he(e, t) {
	let n = t.trim().toLowerCase();
	return (e.itemTypes.mutation ?? []).some((e) => e.name.trim().toLowerCase() === n && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0);
}
function ge(t) {
	return t.getFlag(e, i) === !0;
}
async function _e(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => e.name.trim().toLowerCase() === "possessed" && e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") !== !0).map((t) => ({
		_id: t.id,
		[`flags.${e}.${a}`]: !0
	}));
	if (n.length > 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/messages.ts
function h(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while formatting a mutation message.");
	return game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${e}`, t);
}
async function g(e) {
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
function _(e) {
	ui.notifications.warn(e);
}
function v(e) {
	let t = e instanceof Error ? e.message : String(e), n = game ? game.i18n.format("FVTT_WFRP_RATTER.Mutations.Error", { message: t }) : `The Mutant's Handbook mutation workflow failed: ${t}`;
	console.error(e), ui.notifications.error(n);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/updates.ts
async function y(e, t) {
	if (!await e.update(t, { skipCorruption: !0 })) throw Error(`Foundry prevented the required update to ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/test-resolution.ts
function b(e) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	return game.i18n.localize(`FVTT_WFRP_RATTER.Mutations.${e}`);
}
function ve(e, t) {
	let n = [], r = Number(e.system.status.fortune?.value ?? 0);
	return t.failed && r > 0 && !t.context.fortuneUsedReroll && n.push({
		action: "fortune-reroll",
		label: b("FortuneReroll")
	}), r > 0 && !t.context.fortuneUsedAddSL && n.push({
		action: "fortune-sl",
		label: b("FortuneSL")
	}), n.push({
		action: "dark-deal",
		label: b("DarkDeal")
	}), n.push({
		action: "accept",
		default: !0,
		label: b(t.failed ? "AcceptFailure" : "AcceptSuccess")
	}), n;
}
async function ye(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: ve(e, t),
		content: game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${t.failed ? "TestResourcesPrompt" : "TestResourcesSuccessPrompt"}`, { name: e.name }),
		rejectClose: !1,
		window: { title: b("TestResourcesTitle") }
	});
	return n === "dark-deal" || n === "fortune-reroll" || n === "fortune-sl" ? n : "accept";
}
async function x(e, t, n, r) {
	try {
		await n();
	} catch (n) {
		try {
			await y(e, t);
		} catch (e) {
			throw AggregateError([n, e], `${r} was spent, the reroll failed, and Foundry could not restore the resource.`, { cause: e });
		}
		throw n;
	}
}
async function be(e, t, n) {
	let r = Math.trunc(Number(e.system.status.fortune?.value ?? 0));
	if (r <= 0) return _(h("FortuneUnavailable", { name: e.name })), !1;
	let i = r - 1;
	return await y(e, { "system.status.fortune.value": i }), n ? (t.context.fortuneUsedAddSL = !0, t.context.previousResult = { ...t.result }, t.preData.SL = Math.trunc(t.result.SL) + 1, t.preData.slBonus = 0, t.preData.successBonus = 0, t.preData.roll = Math.trunc(t.result.roll), await x(e, { "system.status.fortune.value": r }, () => t.roll(), "Fortune")) : (t.context.fortuneUsedReroll = !0, t.context.fortuneUsedAddSL = !0, await x(e, { "system.status.fortune.value": r }, () => t.reroll(), "Fortune")), await g(h(n ? "FortuneSLUsed" : "FortuneRerollUsed", {
		name: e.name,
		remaining: i
	})), !0;
}
async function xe(e, t) {
	let n = Math.trunc(Number(e.system.status.corruption.value)), r = n + 1;
	await y(e, { "system.status.corruption.value": r }), await x(e, { "system.status.corruption.value": n }, () => t.reroll(), "Dark Deal Corruption"), await g(h("DarkDealUsed", {
		corruption: r,
		maximum: Number(e.system.status.corruption.max),
		name: e.name
	}));
}
async function Se(e, t) {
	for (;;) {
		let n = await ye(e, t);
		if (n === "accept") return !t.failed;
		n === "dark-deal" ? await xe(e, t) : await be(e, t, n === "fortune-sl");
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/dialogs.ts
var Ce = [
	"human",
	"dwarf",
	"elf",
	"halfling",
	"gnome",
	"ogre"
], we = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function Te(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Ee(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a species profile.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: Ce.map((e) => ({
			action: e,
			label: Te(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesPrompt", {
			name: e,
			species: t || game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpecies")
		}),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesTitle") }
	});
	return Ce.find((e) => e === n);
}
async function De(e) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a Chaos patron.");
	let t = await foundry.applications.api.DialogV2.wait({
		buttons: we.map((e) => ({
			action: e,
			label: Te(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.PatronPrompt", { name: e }),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.PatronTitle") }
	});
	return we.find((e) => e === t);
}
async function Oe(e, t) {
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
async function ke(e, t) {
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
var Ae = `flags.${e}.${r}`, je = `flags.${e}.${i}`;
function S(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function C(e, t) {
	return ne(t, S(e));
}
function Me(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function w(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await Oe(e.name, t);
}
async function T(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": re(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await y(e, i);
}
async function Ne(e, t) {
	for (let n of t) {
		let t = h("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		_(t), await g(t);
	}
}
async function E(e, t) {
	let n = m(e, t);
	if (n) throw Error(n);
	if (await w(e, t.name)) {
		let n = C(e, t.nature);
		await T(e, n, !0), await g(h("Resisted", {
			loss: n,
			mutation: t.name,
			name: e.name
		}));
		return;
	}
	if (!(!he(e, t.name) || await ke(e.name, t.name))) {
		let n = C(e, t.nature);
		await T(e, n, !1), await g(h("RepeatPending", {
			loss: n,
			mutation: t.name,
			name: e.name
		}));
		return;
	}
	let r = C(e, t.nature), i = await e.createEmbeddedDocuments("Item", [t.data]);
	if (i.length !== 1) throw i.length > 0 && await e.deleteEmbeddedDocuments("Item", i.map((e) => e.id)), Error(`Foundry did not create the ${t.name} mutation Item.`);
	let a;
	try {
		a = ae(fe(e), S(e)), await T(e, r, !1, a.length > 0 ? { [je]: !0 } : {});
	} catch (t) {
		throw await e.deleteEmbeddedDocuments("Item", i.map((e) => e.id)), t;
	}
	await g(h("Gained", {
		loss: r,
		mutation: t.name,
		name: e.name
	})), await Ne(e, a);
}
async function Pe(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let n = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await w(e, n)) {
		let r = C(e, t);
		await T(e, r, !0), await g(h("Resisted", {
			loss: r,
			mutation: n,
			name: e.name
		}));
		return;
	}
	let r = await De(e.name), i = r ?? "unassigned", a = me(e), o = C(e, t);
	if (await T(e, o, !1, { [Ae]: i }), a && await _e(e), await g(h(r ? "Chosen" : "ChosenUnassigned", {
		loss: o,
		name: e.name,
		patron: r ? Me(r) : "Chaos"
	})), a) {
		let t = h("PossessedRemoved", { name: e.name });
		_(t), await g(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/patron-notes.ts
var Fe = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, Ie = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, Le = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, Re = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, ze = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), Be = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function Ve(e, t) {
	let n = t.trim().toLowerCase();
	if (ze.has(n)) return Fe[e];
	if (Be.has(n)) return Ie[e];
	if (n === "addiction") return Le[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return Re[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/tables.ts
function He(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function Ue(e) {
	let t = game?.packs.get(n);
	if (!t) throw Error(`The required compendium ${n} is unavailable.`);
	let r = await t.getDocument(e);
	if (!He(r)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return r;
}
async function D(e, t) {
	let n = (await (await Ue(e)).draw({
		displayChat: !0,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!n) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return n;
}
function We(e) {
	return D(s[e]);
}
function Ge(e) {
	let t = te(e);
	return D(c, t > 0 ? `1d100 + ${t}` : "1d100");
}
function Ke(e, t) {
	return D(l[t][e]);
}
function qe(e) {
	return D(u[e]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/workflow.ts
var Je = `flags.${e}.${r}`, Ye = 100;
function O(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Xe(e, t) {
	if (t !== "unassigned") return t;
	let n = await De(e.name);
	if (!n) {
		_(h("PatronRequired", { name: e.name }));
		return;
	}
	return await y(e, { [Je]: n }), n;
}
async function Ze(e, t) {
	let n = await Xe(e, t);
	if (!n) return;
	let r;
	for (let t = 0; t < Ye; t += 1) {
		let t = await de(await qe(n), n), i = m(e, t);
		if (!i) {
			r = t;
			break;
		}
		_(`${i} Rerolling on the ${O(n)} mutation table.`);
	}
	if (!r) throw Error("No eligible patron mutation could be drawn after 100 attempts.");
	let i = Ve(n, r.name);
	await E(e, r), i && await g(h("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: O(n)
	}));
}
async function Qe(e) {
	let t = e.system.details.species.value, n = f(t) ?? await Ee(e.name, t);
	if (!n) {
		_(h("SpeciesRequired", { name: e.name }));
		return;
	}
	let r = await We(n), i = p(r.name);
	if (!i) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let a = await Ge(fe(e).total), o = ee(a.name);
	if (!o) throw Error(`The severity table returned an unrecognized result: ${a.name}.`);
	if (o === "chosen") {
		await Pe(e, i);
		return;
	}
	let s;
	for (let t = 0; t < Ye; t += 1) {
		let t = await Ke(i, o);
		if (!t.documentUuid && ee(t.name) === "chosen") {
			await Pe(e, i);
			return;
		}
		let n = await de(t), r = m(e, n);
		if (!r) {
			s = n;
			break;
		}
		_(`${r} Rerolling on the ${O(o)} ${i} table.`);
	}
	if (!s) throw Error("No eligible mutation could be drawn after 100 attempts.");
	if (s.nature !== i) throw Error(`${s.name} does not match the rolled ${i} mutation table.`);
	await E(e, s);
}
async function $e(e) {
	let t = pe(e);
	t ? await Ze(e, t) : await Qe(e);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/check.ts
var k = /* @__PURE__ */ new Set();
async function et(e) {
	let t = e.system.status.corruption;
	if (!(Number(t.value) <= Number(t.max) || k.has(e.uuid) || ge(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		k.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[o]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await Se(e, i) ? await g(game.i18n.localize("CHAT.MutateSuccess")) : await $e(e);
		} finally {
			k.delete(e.uuid);
		}
	}
}
async function tt(e) {
	let t = await fromUuid(e);
	if (!se(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await et(t);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-data.ts
function A(e) {
	return Array.isArray(e) ? e.map(A) : typeof e == "object" && e ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, A(t)])) : e;
}
function j(e) {
	return JSON.stringify(A({
		configure: e.configure ?? {},
		ranks: e.ranks ?? 1,
		scope: e.scope ?? "all",
		sourceUuid: e.sourceUuid,
		stack: e.stack ?? "singleton",
		type: e.type
	}));
}
function nt(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function rt(e, t, n) {
	let r = t.split(".").filter(Boolean), i = new Set([
		"__proto__",
		"constructor",
		"prototype"
	]);
	if (r.length === 0 || r.some((e) => i.has(e))) throw Error(`Unsafe mutation grant configuration path: ${t}.`);
	let a = e;
	for (let e of r.slice(0, -1)) {
		let t = a[e];
		(typeof t != "object" || !t || Array.isArray(t)) && (a[e] = {}), a = a[e];
	}
	a[r.at(-1)] = n;
}
function it(e, t) {
	t.configure?.name && (e.name = t.configure.name);
	let n = e.system, r = typeof n == "object" && n ? n : {};
	e.system = r;
	for (let [e, n] of Object.entries(t.configure?.system ?? {})) rt(r, e.replace(/^system\./, ""), n);
	return t.ranks !== void 0 && (t.type === "skill" || t.type === "talent") && rt(r, "advances.value", t.ranks), e;
}
function at(e, t, n) {
	if (e.type !== n.type) return !1;
	let r = e.toObject(), i = n.configure?.name ?? t.name;
	if (r.name !== i) return !1;
	let a = r.system;
	if (typeof a != "object" || !a) return !1;
	for (let [e, t] of Object.entries(n.configure?.system ?? {})) {
		let n = e.replace(/^system\./, "");
		if (JSON.stringify(A(nt(a, n))) !== JSON.stringify(A(t))) return !1;
	}
	return !(n.ranks !== void 0 && (n.type === "skill" || n.type === "talent") && Number(nt(a, "advances.value")) !== n.ranks);
}
function ot(e, t) {
	let n = e.toObject()._stats;
	return typeof n != "object" || !n ? !1 : n.compendiumSource === t;
}
function M(t) {
	let n = t.flags?.[e]?.mutationGrant;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (r.version !== 2 || typeof r.managed != "boolean" || typeof r.signature != "string" || typeof r.sourceUuid != "string" || !Array.isArray(r.owners)) return;
	let i = r.owners.filter((e) => typeof e == "object" && !!e && typeof e.grantKey == "string" && typeof e.ownerId == "string");
	return {
		...r,
		owners: i
	};
}
function N(t) {
	let n = t.flags?.[e]?.mutationGrantOwners;
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function P(t) {
	return t.flags?.[e]?.mutationGrantManaged === !0;
}
function st(t) {
	let n = t.flags?.[e]?.mutationSkillGrant;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (r.version !== 1 || typeof r.managed != "boolean" || !Number.isFinite(r.appliedRanks) || (r.appliedRanks ?? -1) < 0 || !Array.isArray(r.owners)) return;
	let i = r.owners.filter((e) => typeof e == "object" && !!e && typeof e.grantKey == "string" && typeof e.ownerId == "string" && Number.isFinite(e.ranks) && e.ranks > 0 && typeof e.signature == "string" && typeof e.sourceUuid == "string");
	if (i.length === r.owners.length) return {
		...r,
		owners: i
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/helpers.ts
function F(e) {
	return Array.from(e.items);
}
function ct(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && t.items !== void 0;
}
function lt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function I(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.definitionId != "string" || typeof r.version != "number" || r.grants !== void 0 && !Array.isArray(r.grants))) return n;
}
function ut(e, t, n) {
	return F(e).filter((e) => e.type === "mutation" && I(e)?.definitionId === n).sort((e, t) => e.id.localeCompare(t.id))[0]?.id === t.id;
}
async function dt(e, t, n) {
	t.update ? await t.update(n) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}]);
}
function ft(e, t, n, r) {
	let i = M(e), a = N(e).map((e) => ({
		grantKey: "legacy",
		ownerId: e
	})), o = [...i?.owners ?? a];
	return o.some((e) => e.ownerId === r.ownerId && e.grantKey === r.grantKey) || o.push(r), {
		managed: i?.managed ?? P(e),
		owners: o,
		signature: n,
		sourceUuid: t.sourceUuid,
		version: 2
	};
}
function pt(e, t, n, r, i) {
	let a = F(e).filter((e) => at(e, t, n)).sort((e, t) => e.id.localeCompare(t.id)), o = a.find((e) => {
		let t = M(e);
		return t?.signature === r && t.owners.some((e) => e.ownerId === i.ownerId && e.grantKey === i.grantKey);
	});
	return (n.stack ?? "singleton") === "rank" ? o ?? a.find((e) => N(e).includes(i.ownerId)) : a.filter((e) => {
		let t = M(e);
		return t?.signature === r || !t && N(e).length === 0 && (n.type === "skill" || ot(e, n.sourceUuid));
	}).sort((e, t) => (M(e)?.managed === !0) - +(M(t)?.managed === !0) || e.id.localeCompare(t.id))[0] || a.find((e) => N(e).includes(i.ownerId)) || a.find((e) => {
		let t = M(e);
		return t?.signature === r || !t && N(e).length === 0 && ot(e, n.sourceUuid);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/owner-cleanup.ts
async function L(t, n, r) {
	let i = [];
	for (let a of F(t)) {
		let o = M(a), s = N(a), c = (o?.owners ?? []).filter((e) => {
			if (e.ownerId !== n) return !0;
			let t = r.get(e.grantKey);
			return t !== void 0 && t.signature === o?.signature && (t.itemId === void 0 || t.itemId === a.id);
		}), l = [...r.values()], u = l.some((e) => e.itemId === a.id), d = l.some((e) => e.itemId === void 0), f = s.filter((e) => e !== n || u || d);
		if (!(c.length !== (o?.owners.length ?? 0) || f.length !== s.length)) continue;
		if ((o?.managed ?? P(a)) && c.length === 0 && f.length === 0 && !st(a)) {
			i.push(a.id);
			continue;
		}
		let p = {};
		f.length > 0 ? (p[`flags.${e}.mutationGrantOwners`] = f, P(a) && (p[`flags.${e}.mutationGrantManaged`] = !0)) : (p[`flags.${e}.-=mutationGrantManaged`] = null, p[`flags.${e}.-=mutationGrantOwners`] = null), o && c.length > 0 ? p[`flags.${e}.mutationGrant`] = {
			...o,
			owners: c
		} : o && (p[`flags.${e}.-=mutationGrant`] = null), await dt(t, a, p);
	}
	i.length > 0 && await t.deleteEmbeddedDocuments("Item", i);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/ranked-skill-items.ts
function R(e) {
	return Array.from(e.items);
}
function z(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function mt(e) {
	let t = e.toObject().system;
	if (typeof t != "object" || !t) return 0;
	let n = t.advances;
	if (typeof n != "object" || !n) return 0;
	let r = Number(n.value);
	return Number.isFinite(r) ? r : 0;
}
function B(e) {
	let t = st(e);
	if (t) return {
		...t,
		legacy: !1
	};
	let n = M(e);
	if (!n) return;
	let r;
	try {
		r = JSON.parse(n.signature);
	} catch {
		return;
	}
	if (typeof r != "object" || !r) return;
	let i = r;
	if (i.stack !== "rank" || i.type !== "skill") return;
	let a = Number(i.ranks);
	if (!Number.isFinite(a) || a <= 0) return;
	let o = n.owners.map((e) => ({
		...e,
		ranks: a,
		signature: n.signature,
		sourceUuid: n.sourceUuid
	}));
	return {
		appliedRanks: a * o.length,
		legacy: !0,
		managed: n.managed,
		owners: o
	};
}
function V(e, t) {
	let n = mt(e), r = B(e);
	if (!r) return Math.max(0, n);
	let i = r.legacy && t !== void 0 ? Math.max(r.appliedRanks, Math.min(t, n)) : r.appliedRanks;
	return Math.max(0, n - i);
}
function ht(e) {
	return B(e)?.managed === !0;
}
function gt(e) {
	let t = B(e);
	return t?.managed === !1 ? 0 : t ? 2 : 1;
}
function _t(e, t) {
	let n = typeof e.system == "object" && e.system !== null ? e.system : {};
	e.system = n;
	let r = n.advances, i = typeof r == "object" && r ? r : {};
	n.advances = i, i.value = t;
}
function vt(t, n) {
	let r = typeof t.flags == "object" && t.flags !== null ? t.flags : {};
	t.flags = r;
	let i = typeof r["fvtt-wfrp-ratter"] == "object" && r["fvtt-wfrp-ratter"] !== null ? r[e] : {};
	r[e] = i, i.mutationSkillGrant = n;
}
async function H(e, t, n) {
	let r = { skipExperienceChecks: !0 };
	t.update ? await t.update(n, r) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}], r);
}
function yt(t) {
	return {
		"system.advances.value": t,
		[`flags.${e}.-=mutationSkillGrant`]: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/skill-grant-reconciliation.ts
async function bt(e, t) {
	let n = /* @__PURE__ */ new Map();
	return await Promise.all(t.map(async ({ grant: t, mutation: r }) => {
		if (t.configure?.name || n.has(t.sourceUuid)) return;
		let i = j(t), a = R(e).find((e) => e.type === "skill" && B(e)?.owners.some((e) => e.sourceUuid === t.sourceUuid && (e.ownerId === r.id && e.grantKey === t.key || e.signature === i)));
		if (a) {
			n.set(t.sourceUuid, a.name);
			return;
		}
		let o = await fromUuid(t.sourceUuid);
		z(o) && n.set(t.sourceUuid, o.name);
	})), t.map(({ grant: e, mutation: t }) => ({
		grant: e,
		grantKey: e.key,
		mutationName: t.name,
		name: e.configure?.name ?? n.get(e.sourceUuid) ?? e.name,
		ownerId: t.id,
		ranks: e.ranks ?? 1,
		signature: j(e),
		sourceUuid: e.sourceUuid
	}));
}
function xt(e) {
	return e.map(({ grantKey: e, ownerId: t, ranks: n, signature: r, sourceUuid: i }) => ({
		grantKey: e,
		ownerId: t,
		ranks: n,
		signature: r,
		sourceUuid: i
	}));
}
async function St(e, t) {
	let n = t[0];
	if (!n) return;
	let r = await fromUuid(n.sourceUuid);
	if (!z(r)) {
		ui.notifications.warn(`${n.mutationName}: could not grant ${n.name}. Enable its source module and reconcile mutation automation.`);
		return;
	}
	let i = it(r.toObject(), n.grant);
	if (delete i._id, delete i._key, _t(i, 0), vt(i, {
		appliedRanks: 0,
		managed: !0,
		owners: [],
		version: 1
	}), !(await e.createEmbeddedDocuments("Item", [i], {
		skipExperienceChecks: !0,
		skipSpecialisationChoice: !0
	})).find(z) && !R(e).some((e) => e.type === "skill" && e.name === n.name)) throw Error(`${n.mutationName}: Foundry prevented the ${n.name} Skill grant.`);
	await wt(e, n.name, t, !1);
}
async function Ct(e, t) {
	let n = [];
	for (let r of t) {
		let t = B(r);
		if (!t) continue;
		let i = V(r);
		t.managed && i === 0 && !M(r) ? n.push(r.id) : await H(e, r, yt(i));
	}
	n.length > 0 && await e.deleteEmbeddedDocuments("Item", n);
}
async function wt(t, n, r, i = !0) {
	let a = R(t).filter((e) => e.type === "skill" && e.name === n).sort((e, t) => gt(e) - gt(t) || e.id.localeCompare(t.id));
	if (r.length === 0) {
		await Ct(t, a);
		return;
	}
	let o = a[0];
	if (!o) {
		if (!i) throw Error(`${n}: Foundry did not retain the mutation Skill grant.`);
		await St(t, r);
		return;
	}
	let s = a.slice(1).filter((e) => B(e));
	a.slice(1).filter((e) => !B(e)).length > 0 && ui.notifications.warn(`${n}: multiple user-owned Skills share this name. Mutation advances were applied only to ${o.name}; review the duplicates manually.`);
	let c = r.reduce((e, t) => e + t.ranks, 0), l = V(o, c), u = {
		appliedRanks: c,
		managed: B(o)?.managed ?? M(o)?.managed ?? !1,
		owners: xt(r),
		version: 1
	};
	await H(t, o, {
		"system.advances.value": l + c,
		[`flags.${e}.mutationSkillGrant`]: u
	});
	let d = [];
	for (let e of s) {
		let r = V(e);
		ht(e) && r === 0 && !M(e) ? d.push(e.id) : (await H(t, e, yt(r)), r > 0 && ui.notifications.warn(`${n}: retained a duplicate Skill containing non-mutation advances; review the duplicate manually.`));
	}
	d.length > 0 && await t.deleteEmbeddedDocuments("Item", d);
}
async function Tt(e, t) {
	let n = await bt(e, t), r = new Set(n.map(({ name: e }) => e));
	for (let t of R(e)) t.type === "skill" && B(t) && r.add(t.name);
	for (let t of [...r].sort()) await wt(e, t, n.filter((e) => e.name === t).sort((e, t) => e.ownerId.localeCompare(t.ownerId) || e.grantKey.localeCompare(t.grantKey)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation.ts
var U = /* @__PURE__ */ new Map();
async function Et(t, n, r, i, a) {
	let o = it(n.toObject(), r);
	delete o._id, delete o._key;
	let s = typeof o.flags == "object" && o.flags !== null ? o.flags : {};
	o.flags = s;
	let c = typeof s["fvtt-wfrp-ratter"] == "object" && s["fvtt-wfrp-ratter"] !== null ? s[e] : {};
	return s[e] = c, c.mutationGrant = {
		managed: !0,
		owners: [a],
		signature: i,
		sourceUuid: r.sourceUuid,
		version: 2
	}, (await t.createEmbeddedDocuments("Item", [o], { skipSpecialisationChoice: !0 }))[0]?.id;
}
async function Dt(t, n, r) {
	let i = j(r), a = await fromUuid(r.sourceUuid);
	if (!lt(a)) return ui.notifications.warn(`${n.name}: could not grant ${r.configure?.name ?? r.key}. Enable its source module and reconcile mutation automation.`), { signature: i };
	let o = {
		grantKey: r.key,
		ownerId: n.id
	}, s = pt(t, a, r, i, o);
	if (!s) {
		let e = await Et(t, a, r, i, o);
		return e ? {
			itemId: e,
			signature: i
		} : { signature: i };
	}
	let c = ft(s, r, i, o), l = s.flags?.["fvtt-wfrp-ratter"] ?? {};
	return JSON.stringify(M(s)) === JSON.stringify(c) && !("mutationGrantManaged" in l) && !("mutationGrantOwners" in l) || await dt(t, s, {
		[`flags.${e}.mutationGrant`]: c,
		[`flags.${e}.-=mutationGrantManaged`]: null,
		[`flags.${e}.-=mutationGrantOwners`]: null
	}), {
		itemId: s.id,
		signature: i
	};
}
async function Ot(e, t) {
	let n = I(t);
	if (!n) return;
	let r = (n.grants ?? []).filter((r) => (r.scope !== "first" || ut(e, t, n.definitionId)) && !(r.type === "skill" && r.stack === "rank")), i = /* @__PURE__ */ new Map();
	for (let n of r) i.set(n.key, await Dt(e, t, n));
	await L(e, t.id, i);
}
async function kt(e) {
	let t = F(e).filter((e) => e.type === "mutation"), n = [];
	for (let r of t) {
		let t = I(r);
		if (t) for (let i of t.grants ?? []) i.type === "skill" && i.stack === "rank" && (i.scope !== "first" || ut(e, r, t.definitionId)) && n.push({
			grant: i,
			mutation: r
		});
	}
	await Tt(e, n);
	for (let n of t) await Ot(e, n);
	let r = new Set(F(e).filter((e) => e.type === "mutation" && I(e) !== void 0).map((e) => e.id)), i = /* @__PURE__ */ new Set();
	for (let t of F(e)) {
		for (let e of M(t)?.owners ?? []) r.has(e.ownerId) || i.add(e.ownerId);
		for (let e of N(t)) r.has(e) || i.add(e);
	}
	for (let t of i) await L(e, t, /* @__PURE__ */ new Map());
}
async function At(e, t) {
	let n = (U.get(e) ?? Promise.resolve()).catch(() => void 0).then(t);
	U.set(e, n);
	try {
		await n;
	} finally {
		U.get(e) === n && U.delete(e);
	}
}
async function W(e) {
	let t = await fromUuid(e);
	if (!ct(t)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await At(e, () => kt(t));
}
async function jt(e, t) {
	let n = await fromUuid(e);
	if (!ct(n)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await At(e, async () => {
		await L(n, t, /* @__PURE__ */ new Map()), await kt(n);
	});
}
//#endregion
//#region src/module/api/create-module-api.ts
function Mt() {
	return {
		checkMutantsHandbookCorruption: tt,
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		reconcileMutationAutomation: W,
		removeMutationGrantOwner: jt,
		title: t
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function Nt() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = Mt();
}
//#endregion
//#region src/module/settings.ts
var Pt = "useMutantsHandbookMutations";
function Ft() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(e, Pt, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function It() {
	return game?.settings.get(e, Pt) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/context-options.ts
var Lt = [
	"CHATOPT.UseFortuneReroll",
	"CHATOPT.Reroll",
	"CHATOPT.UseFortuneSL",
	"CHATOPT.DarkDeal",
	"CHATOPT.StartOpposed",
	"CHATOPT.DefendOpposed",
	"CHATOPT.CompleteUnopposed",
	"CHATOPT.EditTest"
];
function Rt(e) {
	let t = e.dataset.messageId;
	return (t ? game?.messages.get(t)?.system.test : void 0)?.options[o] === !0;
}
function zt(e) {
	let t = e.condition;
	e.condition = (e) => Rt(e) ? !1 : t ? t(e) : !0;
}
function Bt() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		if (!game) return;
		let n = new Set(Lt.map((e) => game.i18n.localize(e)));
		for (let e of t) n.has(e.name) && zt(e);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/hooks.ts
function Vt(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (n.type !== "mutation" || typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e]?.mutationAutomation;
	return typeof r == "object" && r ? n : void 0;
}
function Ht(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e];
	return typeof r?.mutationGrant == "object" || typeof r?.mutationSkillGrant == "object" ? n : void 0;
}
function G(e) {
	e.catch(v);
}
function Ut(e) {
	return typeof e == "string" && game?.user.id === e;
}
function Wt() {
	Hooks.on("createItem", (e, t, n) => {
		if (!Ut(n)) return;
		let r = Vt(e);
		r?.actor && G(W(r.actor.uuid));
	}), Hooks.on("deleteItem", (e, t, n) => {
		if (!Ut(n)) return;
		let r = Vt(e);
		if (r?.actor) {
			G(jt(r.actor.uuid, r.id));
			return;
		}
		let i = Ht(e);
		i?.actor && G(W(i.actor.uuid));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/migration.ts
var Gt = `${e}.ratter-11-items`, Kt = "The Mutant's Handbook", qt = new Set([
	"acquisition",
	"automated",
	"definitionId",
	"grants",
	"manual",
	"selfControl",
	"status",
	"version"
]);
function K(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function q(e) {
	return e.toObject();
}
function J(t) {
	let n = t.flags;
	if (!K(n)) return {};
	let r = n[e];
	return K(r) ? r : {};
}
function Y(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.filter(K) : [];
}
function X(e) {
	return Array.isArray(e) ? e.map(X) : K(e) ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, X(t)])) : e;
}
function Jt(e, t) {
	return JSON.stringify(X(e)) === JSON.stringify(X(t));
}
function Z(e) {
	let t = { ...e };
	return delete t._key, delete t._stats, t;
}
function Q(t) {
	let n = t.flags;
	if (!K(n)) return !1;
	let r = n[e];
	return K(r) && typeof r.automationPhase == "string";
}
function Yt(e, t) {
	if (!K(e)) return t;
	let n = Object.fromEntries(Object.entries(e).filter(([e]) => !qt.has(e)));
	return {
		...t,
		...n
	};
}
function Xt(t, n) {
	let r = J(n).mutationAutomation;
	if (!K(r)) return;
	let i = J(t).mutationAutomation, a = Yt(i, r), o = Y(t).filter(Q), s = Y(n).filter(Q), c = [...s, ...Y(t).filter((e) => !Q(e))], l = {};
	return Jt(i, a) || (l[`flags.${e}.mutationAutomation`] = a), Jt(o.map(Z), s.map(Z)) || (l.effects = c), Object.keys(l).length > 0 ? l : void 0;
}
function Zt(e) {
	return K(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.toObject == "function" : !1;
}
function $(e) {
	let t = J(q(e)).mutationAutomation;
	return K(t) && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
function Qt(e) {
	return J(q(e)).sourceDocument === Kt;
}
function $t(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.uuid, t);
	for (let e of t) for (let t of e.tokens ?? []) t.actor && n.set(t.actor.uuid, t.actor);
	return [...n.values()];
}
async function en(e, t) {
	if (!e.deleteEmbeddedDocuments || !e.createEmbeddedDocuments) throw Error(`${e.name} does not support embedded Active Effect migration.`);
	let n = Y(q(e)).filter(Q), r = n.map((e) => e._id).filter((e) => typeof e == "string");
	if (r.length !== n.length) throw Error(`${e.name} has a managed Active Effect without an ID.`);
	r.length > 0 && await e.deleteEmbeddedDocuments("ActiveEffect", r);
	let i = Y(q(t)).filter(Q).map((e) => {
		let t = { ...e };
		return delete t._key, t;
	});
	i.length > 0 && await e.createEmbeddedDocuments("ActiveEffect", i, { keepId: !0 });
}
async function tn() {
	if (!game || game.user.isUniqueGM !== !0) return;
	let e = game.packs.get(Gt);
	if (!e) throw Error(`The required compendium ${Gt} is unavailable.`);
	let t = (await e.getDocuments()).filter(Zt), n = new Map(t.map((e) => [$(e) ?? e.id, e])), r = new Map(t.map((e) => [e.name, e])), i = $t(game.actors ?? [], game.scenes ?? []);
	for (let e of i) {
		let t = [], i = [];
		for (let a of Array.from(e.items).filter(Zt)) {
			let e = ($(a) ? n.get($(a)) : void 0) ?? (Qt(a) ? r.get(a.name) : void 0);
			if (!e) continue;
			let o = Xt(q(a), q(e));
			o && ("effects" in o && (i.push({
				owned: a,
				source: e
			}), delete o.effects), Object.keys(o).length > 0 && t.push({
				_id: a.id,
				...o
			}));
		}
		t.length > 0 && await e.updateEmbeddedDocuments("Item", t);
		for (let e of i) await en(e.owned, e.source);
		await W(e.uuid);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/replacement.ts
var nn = Symbol.for(`${e}.mutantsHandbookReplacement`);
function rn() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[nn] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, nn, { value: !0 }), e.checkCorruption = async function() {
		if (!It()) {
			await t.call(this);
			return;
		}
		try {
			await et(this.parent);
		} catch (e) {
			v(e);
		}
	};
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function an() {
	Hooks.once("init", () => {
		Ft(), Nt(), Bt(), Wt();
	}), Hooks.once("ready", async () => {
		rn();
		try {
			await tn();
		} catch (e) {
			v(e);
		}
	});
}
//#endregion
//#region src/main.ts
an();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map