//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation", n = "fvtt-wfrp-ratter.ratter-11-tables", r = "mutantsHandbookPatron", i = "mutantsHandbookChaosSpawn", a = "mutantsHandbookRetired", o = "mutantsHandbookPossessionRemoved", s = "mutantsHandbookCorruption", c = {
	dwarf: "ueEWO9920dCmA7qP",
	elf: "X4hMeYoCFx77QIvv",
	gnome: "gktszioKqcA637wH",
	halfling: "4QnKxakvIARiyqAq",
	human: "2XUdBDbSoynCvCoL",
	ogre: "5hidSDB0YHyyrTVi"
}, l = "AAOqrs1CNIgUk5OI", u = {
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
}, d = {
	khorne: "ymLfyXm3vCnKqMqV",
	nurgle: "rG3ht32Wh5SAVuNz",
	slaanesh: "QHWmoKtujyUHxfG1",
	tzeentch: "MuS2keCF2SFOZYCg"
}, f = {
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
function p(e) {
	return f[e.trim().toLowerCase()];
}
function ee(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("physical")) return "physical";
	if (t.startsWith("mental")) return "mental";
}
function te(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("trivial")) return "trivial";
	if (t.startsWith("minor")) return "minor";
	if (t.startsWith("major")) return "major";
	if (t.includes("chosen")) return "chosen";
}
function ne(e) {
	return Math.min(Math.max(0, Math.floor(e)), 4) * 10;
}
function re(e, t) {
	return e === "physical" ? t.toughness : t.willpower;
}
function ie(e, t) {
	return Math.max(0, e - Math.max(0, t));
}
function ae(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = ee(r);
		e === "mental" ? t += 1 : e === "physical" && (n += 1);
	}
	return {
		mental: t,
		physical: n,
		total: e.length
	};
}
function oe(e, t) {
	let n = [];
	return e.physical > t.toughness && n.push("physical"), e.mental > t.willpower && n.push("mental"), n;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/document-helpers.ts
function m(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function h(e) {
	return e.trim().toLowerCase();
}
function se(t, n) {
	return typeof t.getFlag == "function" ? t.getFlag(e, n) : void 0;
}
function ce(e) {
	let t = e.itemTypes, n = Object.values(t ?? {}).flatMap((e) => e ?? []), r = [];
	try {
		r = Array.from(e.items);
	} catch {}
	return [...r, ...n].filter((e, t, n) => n.findIndex((t) => t === e || typeof e.id == "string" && e.id.length > 0 && t.id === e.id) === t);
}
function le(e) {
	return e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0;
}
function g(e, t) {
	return (e.itemTypes.mutation ?? []).filter((e) => (t === void 0 || e.id !== t) && !le(e));
}
function _(e) {
	return typeof e == "string" ? [h(e)] : Array.isArray(e) ? e.filter((e) => typeof e == "string").map(h) : [];
}
function ue(e) {
	let t = se(e, "mutationAutomation");
	if (!m(t)) return;
	let n = t.state;
	if (!m(n)) return;
	let r = n.acquisition;
	if (!(!m(r) || r.status !== "resolved")) return m(r.selections) ? r.selections : void 0;
}
function v(e, t, n) {
	let r = ue(e);
	if (!r) return !1;
	let i = new Set(n.map(h));
	return _(r[t]).some((e) => i.has(e));
}
function y(e, t, n) {
	let r = h(t);
	return g(e, n).find((e) => h(e.name) === r);
}
function de(e, t) {
	let n = h(t);
	return ce(e).some((e) => {
		if (e.type !== "talent" || typeof e.name != "string") return !1;
		let t = h(e.name);
		return t === n || t.startsWith(`${n} (`);
	});
}
function fe(e, t) {
	let n = e;
	for (let e of t) {
		if (!m(n)) return;
		n = n[e];
	}
	return n;
}
function pe(e) {
	let t = e.currentCareer, n = [...m(t) ? [t] : [], ...ce(e).filter((e) => e.type === "career" && fe(e.system, ["current", "value"]) === !0)];
	for (let e of n) {
		let t = fe(e, [
			"system",
			"careergroup",
			"value"
		]);
		if (typeof t == "string" && t.trim().length > 0) return h(t);
	}
}
function me(e, t) {
	return g(e, t).some((e) => ["additional extremities", "additional limbs"].includes(h(e.name)) && v(e, "limb", ["legs"]));
}
function he(e, t) {
	return g(e, t).some((e) => ["additional extremities", "additional limbs"].includes(h(e.name)) && v(e, "limb", ["arms"]));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actor-state.ts
var ge = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"unassigned"
];
function b(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function _e(e) {
	let t = ve(e) !== void 0;
	return ae((e.itemTypes.mutation ?? []).filter((e) => !le(e) && !(t && h(e.name) === "possessed")).map((e) => e.system.mutationType.value));
}
function ve(t) {
	let n = t.getFlag(e, r);
	return ge.find((e) => e === n);
}
function ye(e) {
	return (e.itemTypes.mutation ?? []).some((e) => h(e.name) === "possessed" && !le(e));
}
function be(t) {
	return t.getFlag(e, i) === !0;
}
async function xe(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => h(e.name) === "possessed" && !le(e)).map((t) => ({
		_id: t.id,
		[`flags.${e}.${o}`]: !0
	}));
	if (n.length !== 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
async function Se(t) {
	let n = g(t).filter((e) => h(e.name) === "skinwalker");
	if (n.length === 0) return [];
	let r = await t.updateEmbeddedDocuments("Item", n.map((t) => ({
		_id: t.id,
		[`flags.${e}.${a}`]: !0
	})));
	if (r.length !== n.length) {
		let e = new Set(r.map((e) => e.id)), i = n.filter((t) => e.has(t.id)).map((e) => e.id);
		try {
			await Ce(t, i);
		} catch (e) {
			throw AggregateError([e], `Foundry only partially retired Skinwalker for ${t.name}, and rollback failed.`, { cause: e });
		}
		throw Error(`Foundry prevented Skinwalker from being retired for ${t.name}.`);
	}
	return n.map((e) => e.id);
}
async function Ce(e, t) {
	if (t.length !== 0 && (await e.updateEmbeddedDocuments("Item", t.map((e) => ({
		_id: e,
		"flags.fvtt-wfrp-ratter.-=mutantsHandbookRetired": null
	})))).length !== t.length) throw Error(`Foundry prevented retired mutations from being restored for ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition-eligibility.ts
var we = new Set([
	"bachtrachian suckers",
	"bestial legs",
	"centauroid",
	"clubfoot",
	"hopper",
	"prehensile feet",
	"unnatural legs"
]);
function Te(e, t) {
	let n = new Set(["left", "right"]), r = !1;
	for (let i of g(e, t)) {
		let e = h(i.name), t = ue(i);
		if (e === "razor-sharp claws" && n.clear(), e === "pincer claw") {
			let e = _(t?.["pincer-hand"]);
			e.length === 0 && (r = !0);
			for (let t of e) (t === "left" || t === "right") && n.delete(t);
		}
		if (e === "beweaponed extremities") {
			let e = _(t?.arms);
			if (e.includes("both")) n.clear();
			else if (e.includes("one")) {
				let e = _(t?.["weapon-side"]);
				e.length === 0 && (r = !0);
				for (let t of e) (t === "left" || t === "right") && n.delete(t);
			} else r = !0;
		}
		if (e === "atrophy" && v(i, "atrophied-part", ["arm", "hand"])) {
			let e = _(t?.["atrophy-side"]);
			e.length === 0 && (r = !0);
			for (let t of e) (t === "left" || t === "right") && n.delete(t);
		}
	}
	return {
		ambiguous: r,
		extraArms: he(e, t),
		primaryHands: n
	};
}
function Ee(e, t, n, r, i) {
	return g(e, i).some((e) => h(e.name) === h(t) && v(e, n, r));
}
function x(e) {
	return {
		kind: "eligibility",
		message: e
	};
}
function De(e, t, n) {
	let r = h(t.name), i = [];
	if (r === "chosen one" && de(e, "Arcane Magic") && i.push(x(`${t.name} cannot be acquired with Arcane Magic.`)), r === "false wizard") {
		ve(e) === "khorne" && i.push(x(`${t.name} cannot be acquired by a Chosen of Khorne.`));
		let n = ["Bless", "Invoke"].filter((t) => de(e, t));
		n.length > 0 && i.push(x(`${t.name} cannot be acquired with ${n.join(" or ")}.`));
	}
	if (r === "malign sorcerer" && ve(e) === "khorne" && i.push(x(`${t.name} cannot be acquired with Khorne as patron.`)), r === "prince of nothing") {
		let n = pe(e);
		n === "noble" ? i.push(x(`${t.name} cannot be acquired by an actual Noble.`)) : n === void 0 && i.push(x(`Confirm that ${e.name} is not an actual Noble before acquiring ${t.name}.`));
	}
	if (r === "headless") {
		let r = y(e, "Elongated Limbs", n);
		r && v(r, "limb", ["neck"]) && i.push(x(`${t.name} cannot be acquired with Elongated Limbs (Neck).`));
	}
	if (r === "wings" && Ee(e, "Wings", "wing-size", ["huge"], n) && i.push(x(`${t.name} cannot be acquired again after reaching Huge wings.`)), r === "beweaponed extremities" && Ee(e, "Beweaponed Extremities", "arms", ["both"], n) && i.push(x(`${t.name} cannot be acquired again because a prior acquisition transformed both arms.`)), r === "pincer claw" || r === "razor-sharp claws") {
		let r = Te(e, n);
		r.primaryHands.size === 0 && !r.extraArms && !r.ambiguous ? i.push(x(`${t.name} requires at least one ordinary clawless hand.`)) : (r.primaryHands.size === 0 || r.extraArms || r.ambiguous) && i.push(x(`Confirm that ${e.name} has an ordinary clawless hand that can receive ${t.name}; non-left/right or legacy hand anatomy cannot be inferred safely.`));
	}
	return r === "overgrown arm" && he(e, n) && i.push(x(`Confirm which arm receives ${t.name}; resolved extra arms are not limited to the tracked left/right choices.`)), we.has(r) && y(e, "Blob", n) && !me(e, n) && i.push(x(`${t.name} alters legs, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), i;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition-blocks.ts
var Oe = {
	"additional appendages": ["location", ["foot"]],
	atrophy: ["atrophied-part", [
		"foot",
		"leg",
		"toes"
	]],
	"elongated limbs": ["limb", ["legs"]],
	"extra joints": ["jointed-limbs", ["legs"]]
}, ke = {
	"bestial arms": [
		"bear",
		"canine",
		"caprine",
		"feline",
		"mustelid",
		"primate",
		"rodent"
	],
	"bestial body": [
		"bear",
		"canine",
		"caprine",
		"feline",
		"primate"
	],
	"bestial feature": [
		"bear",
		"canine",
		"caprine",
		"feline",
		"mustelid",
		"primate",
		"rodent"
	],
	"bestial head": [
		"bear",
		"canine",
		"caprine",
		"feline",
		"primate"
	],
	"bestial legs": [
		"bear",
		"canine",
		"caprine",
		"feline",
		"mustelid",
		"primate",
		"rodent"
	]
};
function Ae(e) {
	return e.filter((t, n) => e.findIndex((e) => e.kind === t.kind && e.message === t.message) === n);
}
function je(e, t, n) {
	let r = g(e, n), i = r.filter((e) => h(e.name) === h(t.name)).length, a = t.acquisition?.max, o = [];
	a !== void 0 && i >= a && o.push({
		kind: "maximum",
		message: `${t.name} has reached its acquisition maximum of ${a}.`
	}), o.push(...De(e, t, n));
	for (let e of t.acquisition?.conflicts ?? []) r.some((t) => h(t.name) === h(e)) && o.push({
		kind: "conflict",
		message: `${t.name} conflicts with the existing ${e} mutation.`
	});
	return Ae(o);
}
function Me(e, t, n, r) {
	if (n.status !== "resolved") return [];
	let i = h(t), a = [];
	i === "elongated limbs" && _(n.selections.limb).includes("neck") && y(e, "Headless", r) && a.push(x(`${t} (Neck) cannot be acquired with Headless.`));
	let o = Oe[i];
	if (o && _(n.selections[o[0]]).some((e) => o[1].includes(e)) && y(e, "Blob", r) && !me(e, r) && a.push(x(`${t} selected a leg-altering result, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), i === "questing eye") {
		let e = n.selections["questing-eye"], r = typeof e == "string" && e.trim().length > 0 ? `“${e.trim()}” is` : "the chosen eye is";
		a.push(x(`Confirm that ${r} an existing eye available to receive ${t}; exact eye anatomy is not reliably detectable.`));
	}
	if (y(e, "Hairless", r)) {
		let e = ke[i];
		(i === "protective skin" && _(n.selections.skin).includes("fur") || e !== void 0 && _(n.selections["bestial-source"]).some((t) => e.includes(t))) && a.push(x(`${t} selected a hair or fur result, but Hairless prevents that manifestation; confirm whether to keep or reroll it.`));
	}
	return Ae(a);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/mutation-results.ts
function Ne(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function Pe(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function Fe(t) {
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
async function Ie(t, n) {
	if (!t.documentUuid) {
		if (n === "khorne" && t.name.trim().toLowerCase() === "prejudice") return Fe(t);
		throw Error(`The table result ${t.name} does not link to a mutation Item.`);
	}
	let r = await fromUuid(t.documentUuid);
	if (!Ne(r)) throw Error(`The table result ${t.name} does not resolve to a mutation Item.`);
	let i = ee(r.system.mutationType.value);
	if (!i) throw Error(`The mutation ${r.name} has no physical or mental classification.`);
	let a = r.getFlag(e, "mutationAutomation")?.acquisition;
	return {
		...a ? { acquisition: a } : {},
		data: Pe(r),
		name: r.name,
		nature: i
	};
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
function Le(e) {
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
function Re(e, t) {
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
async function ze(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: Re(e, t),
		content: game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${t.failed ? "TestResourcesPrompt" : "TestResourcesSuccessPrompt"}`, { name: e.name }),
		rejectClose: !1,
		window: { title: E("TestResourcesTitle") }
	});
	return n === "dark-deal" || n === "fortune-reroll" || n === "fortune-sl" ? n : "accept";
}
async function Be(e, t, n, r) {
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
async function Ve(e, t, n) {
	let r = Math.trunc(Number(e.system.status.fortune?.value ?? 0));
	if (r <= 0) return w(S("FortuneUnavailable", { name: e.name })), !1;
	let i = r - 1;
	return await T(e, { "system.status.fortune.value": i }), n ? (t.context.fortuneUsedAddSL = !0, t.context.previousResult = { ...t.result }, t.preData.SL = Math.trunc(t.result.SL) + 1, t.preData.slBonus = 0, t.preData.successBonus = 0, t.preData.roll = Math.trunc(t.result.roll), await Be(e, { "system.status.fortune.value": r }, () => t.roll(), "Fortune")) : (t.context.fortuneUsedReroll = !0, t.context.fortuneUsedAddSL = !0, await Be(e, { "system.status.fortune.value": r }, () => t.reroll(), "Fortune")), await C(S(n ? "FortuneSLUsed" : "FortuneRerollUsed", {
		name: e.name,
		remaining: i
	})), !0;
}
async function He(e, t) {
	let n = Math.trunc(Number(e.system.status.corruption.value)), r = n + 1;
	await T(e, { "system.status.corruption.value": r }), await Be(e, { "system.status.corruption.value": n }, () => t.reroll(), "Dark Deal Corruption"), await C(S("DarkDealUsed", {
		corruption: r,
		maximum: Number(e.system.status.corruption.max),
		name: e.name
	}));
}
async function Ue(e, t) {
	for (;;) {
		let n = await ze(e, t);
		if (n === "accept") return !t.failed;
		n === "dark-deal" ? await He(e, t) : await Ve(e, t, n === "fortune-sl");
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/dialogs.ts
var We = [
	"human",
	"dwarf",
	"elf",
	"halfling",
	"gnome",
	"ogre"
], Ge = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function Ke(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function qe(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function Je(e, t, n) {
	let r = [
		...n ? [{
			action: "reroll",
			callback: () => "reroll",
			default: !0,
			label: "Reroll"
		}] : [],
		{
			action: "accept",
			callback: () => "accept",
			default: !n,
			label: "Accept Anyway"
		},
		{
			action: "cancel",
			callback: () => "cancel",
			label: "Cancel"
		}
	], i = await foundry.applications.api.DialogV2.wait({
		buttons: r,
		content: `<div class="fvtt-wfrp-ratter-root"><div role="alert" class="tw:dui-alert tw:dui-alert-warning"><span>${qe(t.message)}</span></div><p>${n ? "Reroll this table result, accept it despite the warning, or cancel the mutation procedure." : "Accept this mutation despite the warning, or cancel adding it."}</p></div>`,
		rejectClose: !1,
		window: { title: `Review ${e}` }
	});
	return i === "accept" || i === "reroll" ? i : "cancel";
}
async function Ye(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a species profile.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: We.map((e) => ({
			action: e,
			label: Ke(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesPrompt", {
			name: e,
			species: t || game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpecies")
		}),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesTitle") }
	});
	return We.find((e) => e === n);
}
async function Xe(e) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a Chaos patron.");
	let t = await foundry.applications.api.DialogV2.wait({
		buttons: Ge.map((e) => ({
			action: e,
			label: Ke(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.PatronPrompt", { name: e }),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.PatronTitle") }
	});
	return Ge.find((e) => e === t);
}
async function Ze(e, t) {
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
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-data.ts
function D(e) {
	return Array.isArray(e) ? e.map(D) : typeof e == "object" && e ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e < t ? -1 : +(e > t)).map(([e, t]) => [e, D(t)])) : e;
}
function O(e) {
	return JSON.stringify(D({
		configure: e.configure ?? {},
		ranks: e.ranks ?? 1,
		scope: e.scope ?? "all",
		sourceUuid: e.sourceUuid,
		stack: e.stack ?? "singleton",
		type: e.type
	}));
}
function Qe(e) {
	let t = { ...e };
	return delete t.scope, O({
		...t,
		ranks: 1
	});
}
function $e(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	if (typeof t != "object" || !t || Array.isArray(t)) return;
	let n = t;
	if (!(n.stack !== "rank" || n.type !== "skill" && n.type !== "talent")) return n.ranks = 1, n.scope = "all", JSON.stringify(D(n));
}
function et(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function tt(e, t, n) {
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
function nt(e, t) {
	t.configure?.name && (e.name = t.configure.name);
	let n = e.system, r = typeof n == "object" && n ? n : {};
	e.system = r;
	for (let [e, n] of Object.entries(t.configure?.system ?? {})) tt(r, e.replace(/^system\./, ""), D(n));
	return t.ranks !== void 0 && (t.type === "skill" || t.type === "talent") && tt(r, "advances.value", t.ranks), e;
}
function rt(e, t, n) {
	if (e.type !== n.type) return !1;
	let r = e.toObject(), i = n.configure?.name ?? t.name;
	if (r.name !== i) return !1;
	let a = r.system;
	if (typeof a != "object" || !a) return !1;
	for (let [e, t] of Object.entries(n.configure?.system ?? {})) {
		let n = e.replace(/^system\./, "");
		if (JSON.stringify(D(et(a, n))) !== JSON.stringify(D(t))) return !1;
	}
	return !(n.ranks !== void 0 && (n.type === "skill" || n.type === "talent") && Number(et(a, "advances.value")) !== n.ranks);
}
function it(e, t) {
	let n = e.toObject()._stats;
	return typeof n != "object" || !n ? !1 : n.compendiumSource === t;
}
function k(t) {
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
function A(t) {
	let n = t.flags?.[e]?.mutationGrantOwners;
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function at(t) {
	return t.flags?.[e]?.mutationGrantManaged === !0;
}
function ot(t) {
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
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/acquisition-grants.ts
var st = new Set([
	"armour",
	"psychology",
	"skill",
	"talent",
	"trait",
	"weapon"
]), ct = new Set([
	"configuration",
	"rank",
	"singleton"
]), lt = 256, ut = new Set([
	"__proto__",
	"constructor",
	"prototype"
]), dt = /^Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Item\.[A-Za-z0-9_-]+$/, ft = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, j = Symbol("invalid-acquisition-value");
function M(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function N(e, t, n = 0) {
	if (e === null || typeof e == "string" || typeof e == "boolean") return e;
	if (typeof e == "number") return Number.isFinite(e) ? e : j;
	if (n >= 20 || typeof e != "object" || !e || t.has(e)) return j;
	if (t.add(e), Array.isArray(e)) {
		let r = [];
		for (let i of e) {
			let e = N(i, t, n + 1);
			if (e === j) return j;
			r.push(e);
		}
		return t.delete(e), r;
	}
	if (!M(e)) return j;
	let r = {};
	for (let [i, a] of Object.entries(e)) {
		if (ut.has(i)) return j;
		let e = N(a, t, n + 1);
		if (e === j) return j;
		r[i] = e;
	}
	return t.delete(e), r;
}
function pt(e) {
	let t = e.replace(/^system\./, ""), n = t.split(".");
	return t.length > 0 && n.every((e) => e && !ut.has(e)) ? t : void 0;
}
function mt(e) {
	if (e === void 0 || !M(e) || Object.keys(e).some((e) => e !== "name" && e !== "system")) return;
	let t = {};
	if (e.name !== void 0) {
		if (typeof e.name != "string" || e.name.trim().length === 0) return;
		t.name = e.name;
	}
	if (e.system !== void 0) {
		if (!M(e.system)) return;
		let n = {}, r = [];
		for (let [t, i] of Object.entries(e.system)) {
			let e = pt(t), a = N(i, /* @__PURE__ */ new Set());
			if (!e || a === j || r.some((t) => e.startsWith(`${t}.`) || t.startsWith(`${e}.`))) return;
			r.push(e), n[t] = a;
		}
		t.system = n;
	}
	return t;
}
function ht(e) {
	if (!M(e)) return;
	let t = new Set([
		"aggregate",
		"aggregateKey",
		"configure",
		"key",
		"name",
		"ranks",
		"scope",
		"sourceUuid",
		"stack",
		"type"
	]);
	if (Object.keys(e).some((e) => !t.has(e))) return;
	let { key: n, name: r, sourceUuid: i, type: a } = e;
	if (typeof n != "string" || !ft.test(n) || typeof r != "string" || r.trim().length === 0 || typeof i != "string" || !dt.test(i) || typeof a != "string" || !st.has(a)) return;
	let o = e.stack ?? "singleton";
	if (typeof o != "string" || !ct.has(o) || o === "rank" && a !== "skill" && a !== "talent" || e.scope !== void 0 && e.scope !== "first" || e.aggregate !== void 0 && e.aggregate !== "latest" || e.aggregate === "latest" && o !== "configuration") return;
	let s = e.aggregateKey;
	if (s !== void 0 && (typeof s != "string" || s.trim().length === 0 || s.length > lt) || e.ranks !== void 0 && (!Number.isSafeInteger(e.ranks) || Number(e.ranks) < 1) || e.ranks !== void 0 && a !== "skill" && a !== "talent") return;
	let c = mt(e.configure);
	if (!(e.configure !== void 0 && c === void 0)) return {
		...e.aggregate === "latest" ? { aggregate: "latest" } : {},
		...typeof s == "string" ? { aggregateKey: s } : {},
		...c ? { configure: c } : {},
		key: n,
		name: r,
		...e.ranks === void 0 ? {} : { ranks: Number(e.ranks) },
		...e.scope === "first" ? { scope: "first" } : {},
		sourceUuid: i,
		stack: o,
		type: a
	};
}
function gt(e) {
	return !M(e) || e.status !== "resolved" || e.version !== void 0 && e.version !== 1 || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !M(e.rolls) || !M(e.selections) || N(e.rolls, /* @__PURE__ */ new Set()) === j || N(e.selections, /* @__PURE__ */ new Set()) === j || !Array.isArray(e.grants) ? !1 : e.acceptedBlocks === void 0 ? !0 : Array.isArray(e.acceptedBlocks) && e.acceptedBlocks.every((e) => M(e) && Object.keys(e).every((e) => e === "kind" || e === "message") && typeof e.kind == "string" && typeof e.message == "string");
}
function _t(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!M(n)) return [];
	let r = n.state;
	if (!M(r) || !gt(r.acquisition)) return [];
	let i = r.acquisition.grants.map(ht).filter((e) => e !== void 0), a = /* @__PURE__ */ new Map();
	for (let e of i) a.set(e.key, (a.get(e.key) ?? 0) + 1);
	return i.filter((e) => a.get(e.key) === 1);
}
function vt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!M(n)) return;
	let r = n.state;
	if (!M(r)) return;
	let i = r.acquisition;
	if (!M(i) || i.version !== void 0 && i.version !== 1) return;
	let a = i.occurrence;
	return Number.isSafeInteger(a) && Number(a) > 0 ? Number(a) : void 0;
}
function yt(e, t = []) {
	let n = t.map(ht).filter((e) => e !== void 0), r = new Map(n.map((e) => [e.key, e]));
	for (let t of _t(e)) {
		let e = r.get(t.key), n = e?.stack === "configuration" && t.stack === "configuration";
		r.set(t.key, {
			...t,
			...n && e.aggregate === "latest" && t.aggregate === void 0 ? { aggregate: "latest" } : {},
			...n && e.aggregateKey && t.aggregateKey === void 0 ? { aggregateKey: e.aggregateKey } : {}
		});
	}
	return [...r.values()];
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/helpers.ts
function P(e) {
	return Array.from(e.items);
}
function bt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && t.items !== void 0;
}
function xt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function St(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.definitionId != "string" || typeof r.version != "number" || r.grants !== void 0 && !Array.isArray(r.grants))) return n;
}
function Ct(t) {
	return t.getFlag(e, o) === !0;
}
function wt(e) {
	return Ct(e) || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0;
}
function Tt(e, t, n) {
	return P(e).filter((e) => e.type === "mutation" && !wt(e) && St(e)?.definitionId === n).sort((e, t) => e.id.localeCompare(t.id))[0]?.id === t.id;
}
async function Et(e, t, n) {
	t.update ? await t.update(n) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}]);
}
function Dt(e, t, n, r) {
	let i = k(e), a = A(e).map((e) => ({
		grantKey: "legacy",
		ownerId: e
	})), o = [...i?.owners ?? a];
	return o.some((e) => e.ownerId === r.ownerId && e.grantKey === r.grantKey) || o.push(r), {
		managed: i?.managed ?? at(e),
		owners: o,
		signature: n,
		sourceUuid: t.sourceUuid,
		version: 2
	};
}
function Ot(e, t, n, r, i) {
	let a = P(e).filter((e) => rt(e, t, n)).sort((e, t) => e.id.localeCompare(t.id)), o = a.find((e) => {
		let t = k(e);
		return t?.signature === r && t.owners.some((e) => e.ownerId === i.ownerId && e.grantKey === i.grantKey);
	});
	return (n.stack ?? "singleton") === "rank" ? o ?? a.find((e) => A(e).includes(i.ownerId)) : a.filter((e) => {
		let t = k(e);
		return t?.signature === r || !t && A(e).length === 0 && (n.type === "skill" || it(e, n.sourceUuid));
	}).sort((e, t) => (k(e)?.managed === !0) - +(k(t)?.managed === !0) || e.id.localeCompare(t.id))[0] || a.find((e) => A(e).includes(i.ownerId)) || a.find((e) => {
		let t = k(e);
		return t?.signature === r || !t && A(e).length === 0 && it(e, n.sourceUuid);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/owner-cleanup.ts
async function kt(t, n, r) {
	let i = [];
	for (let a of P(t)) {
		let o = k(a), s = A(a), c = (o?.owners ?? []).filter((e) => {
			if (e.ownerId !== n) return !0;
			let t = r.get(e.grantKey);
			return t !== void 0 && t.signature === o?.signature && (t.itemId === void 0 || t.itemId === a.id);
		}), l = [...r.values()], u = l.some((e) => e.itemId === a.id), d = l.some((e) => e.itemId === void 0), f = s.filter((e) => e !== n || u || d);
		if (!(c.length !== (o?.owners.length ?? 0) || f.length !== s.length)) continue;
		if ((o?.managed ?? at(a)) && c.length === 0 && f.length === 0 && !ot(a)) {
			i.push(a.id);
			continue;
		}
		let p = {};
		f.length > 0 ? (p[`flags.${e}.mutationGrantOwners`] = f, at(a) && (p[`flags.${e}.mutationGrantManaged`] = !0)) : (p[`flags.${e}.-=mutationGrantManaged`] = null, p[`flags.${e}.-=mutationGrantOwners`] = null), o && c.length > 0 ? p[`flags.${e}.mutationGrant`] = {
			...o,
			owners: c
		} : o && (p[`flags.${e}.-=mutationGrant`] = null), await Et(t, a, p);
	}
	i.length > 0 && await t.deleteEmbeddedDocuments("Item", i);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/ranked-skill-items.ts
function At(e) {
	return Array.from(e.items);
}
function jt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function Mt(e) {
	let t = e.toObject().system;
	if (typeof t != "object" || !t) return 0;
	let n = t.advances;
	if (typeof n != "object" || !n) return 0;
	let r = Number(n.value);
	return Number.isFinite(r) ? r : 0;
}
function Nt(e) {
	let t = ot(e);
	if (t) return {
		...t,
		legacy: !1
	};
	let n = k(e);
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
function Pt(e, t) {
	let n = Mt(e), r = Nt(e);
	if (!r) return Math.max(0, n);
	let i = r.legacy && t !== void 0 ? Math.max(r.appliedRanks, Math.min(t, n)) : r.appliedRanks;
	return Math.max(0, n - i);
}
function Ft(e) {
	return Nt(e)?.managed === !0;
}
function It(e, t) {
	let n = typeof e.system == "object" && e.system !== null ? e.system : {};
	e.system = n;
	let r = n.advances, i = typeof r == "object" && r ? r : {};
	n.advances = i, i.value = t;
}
function Lt(t, n) {
	let r = typeof t.flags == "object" && t.flags !== null ? t.flags : {};
	t.flags = r;
	let i = typeof r["fvtt-wfrp-ratter"] == "object" && r["fvtt-wfrp-ratter"] !== null ? r[e] : {};
	r[e] = i, i.mutationSkillGrant = n;
}
async function Rt(e, t, n) {
	let r = { skipExperienceChecks: !0 };
	t.update ? await t.update(n, r) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}], r);
}
function zt(t) {
	return {
		"system.advances.value": t,
		[`flags.${e}.-=mutationSkillGrant`]: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/ranked-grant-data.ts
function Bt(e) {
	if (e.type !== "talent") return;
	let t = k(e);
	if (!t || !$e(t.signature)) return;
	let n = 0;
	try {
		n = Number(JSON.parse(t.signature).ranks);
	} catch {
		return;
	}
	if (!(!Number.isFinite(n) || n <= 0)) return {
		appliedRanks: n * t.owners.length,
		legacy: !0,
		managed: t.managed,
		owners: t.owners.map((e) => ({
			...e,
			ranks: n,
			signature: t.signature,
			sourceUuid: t.sourceUuid
		}))
	};
}
function F(e) {
	return Nt(e) ?? Bt(e);
}
function Vt(e, t) {
	let n = Bt(e);
	if (!n) return Pt(e, t);
	let r = e.toObject().system, i = Number(r?.advances?.value ?? 0), a = t === void 0 ? n.appliedRanks : Math.max(n.appliedRanks, Math.min(t, i));
	return Math.max(0, i - a);
}
function Ht(e) {
	let t = F(e);
	return t?.managed === !1 ? 0 : t ? 2 : 1;
}
function Ut(e, t) {
	return F(e)?.owners.some((e) => $e(e.signature) === t) ?? !1;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/skill-grant-reconciliation.ts
function I(e, t) {
	return e < t ? -1 : +(e > t);
}
function Wt(e, t) {
	let n = { ...t.grant };
	return delete n.ranks, rt(e, { name: t.name }, n);
}
async function Gt(e, t) {
	let n = /* @__PURE__ */ new Map();
	return await Promise.all(t.map(async ({ grant: t, mutation: r }) => {
		if (t.type !== "skill" && t.type !== "talent") return;
		let i = Qe(t);
		if (t.configure?.name || n.has(i)) return;
		let a = O(t), o = At(e).find((e) => e.type === t.type && F(e)?.owners.some((e) => e.sourceUuid === t.sourceUuid && (e.ownerId === r.id && e.grantKey === t.key || e.signature === a)));
		if (o) {
			n.set(i, o.name);
			return;
		}
		let s = await fromUuid(t.sourceUuid);
		jt(s) && s.type === t.type && n.set(i, s.name);
	})), t.flatMap(({ grant: e, mutation: t }) => {
		if (e.type !== "skill" && e.type !== "talent") return [];
		let r = Qe(e);
		return [{
			grant: e,
			grantKey: e.key,
			identity: r,
			mutationName: t.name,
			name: e.configure?.name ?? n.get(r) ?? e.name,
			ownerId: t.id,
			ranks: e.ranks ?? 1,
			signature: O(e),
			sourceUuid: e.sourceUuid
		}];
	});
}
function Kt(e) {
	return e.map(({ grantKey: e, ownerId: t, ranks: n, signature: r, sourceUuid: i }) => ({
		grantKey: e,
		ownerId: t,
		ranks: n,
		signature: r,
		sourceUuid: i
	}));
}
async function qt(e, t) {
	let n = t[0];
	if (!n) return;
	let r = await fromUuid(n.sourceUuid);
	if (!jt(r) || r.type !== n.grant.type) {
		ui.notifications.warn(`${n.mutationName}: could not grant ${n.name}. Enable its source module and reconcile mutation automation.`);
		return;
	}
	let i = nt(r.toObject(), n.grant);
	if (delete i._id, delete i._key, It(i, 0), Lt(i, {
		appliedRanks: 0,
		managed: !0,
		owners: [],
		version: 1
	}), !(await e.createEmbeddedDocuments("Item", [i], {
		skipExperienceChecks: !0,
		skipSpecialisationChoice: !0
	})).find(jt) && !At(e).some((e) => Wt(e, n))) throw Error(`${n.mutationName}: Foundry prevented the ${n.name} grant.`);
	await Yt(e, n.identity, t, !1);
}
async function Jt(e, t) {
	let n = [];
	for (let r of t) {
		let t = F(r);
		if (!t) continue;
		let i = Vt(r);
		t.managed && i === 0 && !k(r) ? n.push(r.id) : await Rt(e, r, zt(i));
	}
	n.length > 0 && await e.deleteEmbeddedDocuments("Item", n);
}
async function Yt(t, n, r, i = !0) {
	let a = r[0], o = At(t).filter((e) => a ? Wt(e, a) : Ut(e, n)).sort((e, t) => Ht(e) - Ht(t) || I(e.id, t.id));
	if (r.length === 0) {
		await Jt(t, o);
		return;
	}
	let s = o[0];
	if (!s) {
		if (!i) throw Error(`${a?.name ?? "Ranked Item"}: Foundry did not retain the mutation grant.`);
		await qt(t, r);
		return;
	}
	let c = o.slice(1).filter((e) => F(e));
	o.slice(1).filter((e) => !F(e)).length > 0 && ui.notifications.warn(`${a?.name}: multiple user-owned Items share this configuration. Mutation advances were applied only to ${s.name}; review the duplicates manually.`);
	let l = r.reduce((e, t) => e + t.ranks, 0), u = Vt(s, l), d = {
		appliedRanks: l,
		managed: F(s)?.managed ?? k(s)?.managed ?? !1,
		owners: Kt(r),
		version: 1
	};
	await Rt(t, s, {
		"system.advances.value": u + l,
		[`flags.${e}.mutationSkillGrant`]: d
	});
	let f = [];
	for (let e of c) {
		let n = Vt(e);
		(Ft(e) || F(e)?.managed) && n === 0 && !k(e) ? f.push(e.id) : (await Rt(t, e, zt(n)), n > 0 && ui.notifications.warn(`${a?.name}: retained a duplicate Item containing non-mutation advances; review the duplicate manually.`));
	}
	f.length > 0 && await t.deleteEmbeddedDocuments("Item", f);
}
async function Xt(e, t) {
	let n = await Gt(e, t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.identity) ?? [];
		t.push(e), r.set(e.identity, t);
	}
	let i = /* @__PURE__ */ new Set();
	for (let t of At(e)) for (let e of F(t)?.owners ?? []) {
		let t = $e(e.signature);
		t && i.add(t);
	}
	for (let t of [...i].filter((e) => !r.has(e)).sort(I)) await Yt(e, t, []);
	for (let t of [...r.keys()].sort(I)) await Yt(e, t, (r.get(t) ?? []).sort((e, t) => I(e.ownerId, t.ownerId) || I(e.grantKey, t.grantKey)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation.ts
var L = /* @__PURE__ */ new Map();
async function Zt(t, n, r, i, a) {
	let o = nt(n.toObject(), r);
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
async function Qt(t, n, r) {
	let i = O(r), a = await fromUuid(r.sourceUuid);
	if (!xt(a) || a.type !== r.type) return ui.notifications.warn(`${n.name}: could not grant ${r.configure?.name ?? r.key}. Enable its source module and reconcile mutation automation.`), { signature: i };
	let o = {
		grantKey: r.key,
		ownerId: n.id
	}, s = Ot(t, a, r, i, o);
	if (!s) {
		let e = await Zt(t, a, r, i, o);
		return e ? {
			itemId: e,
			signature: i
		} : { signature: i };
	}
	let c = Dt(s, r, i, o), l = s.flags?.["fvtt-wfrp-ratter"] ?? {};
	return JSON.stringify(k(s)) === JSON.stringify(c) && !("mutationGrantManaged" in l) && !("mutationGrantOwners" in l) || await Et(t, s, {
		[`flags.${e}.mutationGrant`]: c,
		[`flags.${e}.-=mutationGrantManaged`]: null,
		[`flags.${e}.-=mutationGrantOwners`]: null
	}), {
		itemId: s.id,
		signature: i
	};
}
async function $t(e) {
	let t = P(e).filter((e) => e.type === "mutation" && !wt(e)), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let [o, s] of t.entries()) {
		let t = St(s);
		if (!t) continue;
		let c = (a.get(t.definitionId) ?? 0) + 1;
		a.set(t.definitionId, c), r.set(s.id, /* @__PURE__ */ new Map());
		for (let a of yt(s, t.grants)) if (!(a.scope === "first" && !Tt(e, s, t.definitionId))) if ((a.type === "skill" || a.type === "talent") && a.stack === "rank") n.push({
			grant: a,
			mutation: s
		});
		else if (a.aggregate === "latest" && a.stack === "configuration") {
			let e = `${t.definitionId}\0${a.aggregateKey ?? a.key}`, n = i.get(e) ?? [];
			n.push({
				grant: a,
				mutation: s,
				occurrence: vt(s) ?? c,
				order: o
			}), i.set(e, n);
		} else r.get(s.id)?.set(a.key, await Qt(e, s, a));
	}
	await Xt(e, n);
	for (let t of i.values()) {
		t.sort((e, t) => e.occurrence - t.occurrence || e.order - t.order);
		let n = t.at(-1)?.grant;
		if (n) for (let i of t) r.get(i.mutation.id)?.set(n.key, await Qt(e, i.mutation, n));
	}
	for (let n of t) {
		let t = r.get(n.id);
		t && await kt(e, n.id, t);
	}
	let o = new Set(P(e).filter((e) => e.type === "mutation" && !wt(e) && St(e) !== void 0).map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let t of P(e)) {
		for (let e of k(t)?.owners ?? []) o.has(e.ownerId) || s.add(e.ownerId);
		for (let e of A(t)) o.has(e) || s.add(e);
	}
	for (let t of s) await kt(e, t, /* @__PURE__ */ new Map());
}
async function en(e, t) {
	let n = (L.get(e) ?? Promise.resolve()).catch(() => void 0).then(t);
	L.set(e, n);
	try {
		await n;
	} finally {
		L.get(e) === n && L.delete(e);
	}
}
async function R(e) {
	let t = await fromUuid(e);
	if (!bt(t)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await en(e, () => $t(t));
}
async function tn(e, t) {
	let n = await fromUuid(e);
	if (!bt(n)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await en(e, async () => {
		await kt(n, t, /* @__PURE__ */ new Map()), await $t(n);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/outcomes.ts
var nn = `flags.${e}.${r}`, rn = `flags.${e}.${i}`;
function an(e, t) {
	return e?.some((e) => e.kind === t.kind && e.message === t.message) === !0;
}
async function on(e, t, n, r) {
	let i = [r];
	try {
		await Ce(e, n);
	} catch (e) {
		i.push(e);
	}
	try {
		await e.deleteEmbeddedDocuments("Item", [...t]);
	} catch (e) {
		i.push(e);
	}
	throw i.length > 1 ? AggregateError(i, `Failed to roll back mutation acquisition for ${e.name}.`) : r;
}
function sn(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function z(e, t) {
	return re(t, sn(e));
}
function cn(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function ln(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await Ze(e.name, t);
}
async function B(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": ie(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await T(e, i);
}
async function un(e, t) {
	for (let n of t) {
		let t = S("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		w(t), await C(t);
	}
}
async function dn(e, t, n = {}) {
	let r = je(e, t).find((e) => !an(n.acceptedBlocks, e));
	if (r) throw Error(r.message);
	if (await ln(e, t.name)) {
		let n = z(e, t.nature);
		return await B(e, n, !0), await C(S("Resisted", {
			loss: n,
			mutation: t.name,
			name: e.name
		})), "applied";
	}
	let i = z(e, t.nature), a = {
		mutationAcquisitionAcceptedBlocks: n.acceptedBlocks ?? [],
		mutationAcquisitionCanReroll: n.canReroll === !0,
		mutationAcquisitionHandlesChimeranRetirement: !0
	}, o = await e.createEmbeddedDocuments("Item", [t.data], a);
	if (o.length === 0 && a.mutationAcquisitionCancelled === !0) return a.mutationAcquisitionRerollRequested === !0 ? "reroll" : (w(`${t.name} acquisition was cancelled. Corruption was not changed.`), "cancelled");
	if (o.length !== 1) throw o.length > 0 && await e.deleteEmbeddedDocuments("Item", o.map((e) => e.id)), Error(`Foundry did not create the ${t.name} mutation Item.`);
	let s, c = [];
	try {
		t.name.trim().toLowerCase() === "chimeran curse" && (c = await Se(e)), s = oe(_e(e), sn(e)), await B(e, i, !1, s.length > 0 ? { [rn]: !0 } : {});
	} catch (t) {
		return on(e, o.map((e) => e.id), c, t);
	}
	if (c.length > 0) try {
		await R(e.uuid);
	} catch (e) {
		Le(e);
	}
	return await C(S("Gained", {
		loss: i,
		mutation: t.name,
		name: e.name
	})), await un(e, s), "applied";
}
async function fn(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let n = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await ln(e, n)) {
		let r = z(e, t);
		await B(e, r, !0), await C(S("Resisted", {
			loss: r,
			mutation: n,
			name: e.name
		}));
		return;
	}
	let r = await Xe(e.name), i = r ?? "unassigned", a = ye(e), o = z(e, t);
	if (await B(e, o, !1, { [nn]: i }), a && (await xe(e), await R(e.uuid)), await C(S(r ? "Chosen" : "ChosenUnassigned", {
		loss: o,
		name: e.name,
		patron: r ? cn(r) : "Chaos"
	})), a) {
		let t = S("PossessedRemoved", { name: e.name });
		w(t), await C(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/patron-notes.ts
var pn = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, mn = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, hn = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, gn = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, _n = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), vn = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function yn(e, t) {
	let n = t.trim().toLowerCase();
	if (_n.has(n)) return pn[e];
	if (vn.has(n)) return mn[e];
	if (n === "addiction") return hn[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return gn[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/tables.ts
function bn(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function xn(e) {
	let t = game?.packs.get(n);
	if (!t) throw Error(`The required compendium ${n} is unavailable.`);
	let r = await t.getDocument(e);
	if (!bn(r)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return r;
}
async function Sn(e, t) {
	let n = (await (await xn(e)).draw({
		displayChat: !0,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!n) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return n;
}
function Cn(e) {
	return Sn(c[e]);
}
function wn(e) {
	let t = ne(e);
	return Sn(l, t > 0 ? `1d100 + ${t}` : "1d100");
}
function Tn(e, t) {
	return Sn(u[t][e]);
}
function En(e) {
	return Sn(d[e]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/workflow.ts
var Dn = `flags.${e}.${r}`, On = 100;
function kn(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function An(e, t) {
	let n = [];
	for (let r of je(e, t)) {
		let e = await Je(t.name, r, !0);
		if (e !== "accept") return {
			action: e,
			block: r
		};
		n.push(r);
	}
	return {
		action: "accept",
		acceptedBlocks: n
	};
}
async function jn(e, t) {
	if (t !== "unassigned") return t;
	let n = await Xe(e.name);
	if (!n) {
		w(S("PatronRequired", { name: e.name }));
		return;
	}
	return await T(e, { [Dn]: n }), n;
}
async function Mn(e, t) {
	let n = await jn(e, t);
	if (!n) return;
	let r;
	for (let t = 0; t < On; t += 1) {
		let t = await Ie(await En(n), n), i = await An(e, t);
		if (i.action === "cancel") return;
		if (i.action === "reroll") {
			w(`${i.block.message} Rerolling on the ${kn(n)} mutation table.`);
			continue;
		}
		let a = await dn(e, t, {
			acceptedBlocks: i.acceptedBlocks,
			canReroll: !0
		});
		if (a !== "reroll") {
			if (a === "cancelled") return;
			r = t;
			break;
		}
	}
	if (!r) throw Error("No eligible patron mutation could be drawn after 100 attempts.");
	let i = yn(n, r.name);
	i && await C(S("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: kn(n)
	}));
}
async function Nn(e) {
	let t = e.system.details.species.value, n = p(t) ?? await Ye(e.name, t);
	if (!n) {
		w(S("SpeciesRequired", { name: e.name }));
		return;
	}
	let r = await Cn(n), i = ee(r.name);
	if (!i) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let a = await wn(_e(e).total), o = te(a.name);
	if (!o) throw Error(`The severity table returned an unrecognized result: ${a.name}.`);
	if (o === "chosen") {
		await fn(e, i);
		return;
	}
	let s;
	for (let t = 0; t < On; t += 1) {
		let t = await Tn(i, o);
		if (!t.documentUuid && te(t.name) === "chosen") {
			await fn(e, i);
			return;
		}
		let n = await Ie(t), r = await An(e, n);
		if (r.action === "cancel") return;
		if (r.action === "reroll") {
			w(`${r.block.message} Rerolling on the ${kn(o)} ${i} table.`);
			continue;
		}
		if (n.nature !== i) throw Error(`${n.name} does not match the rolled ${i} mutation table.`);
		let a = await dn(e, n, {
			acceptedBlocks: r.acceptedBlocks,
			canReroll: !0
		});
		if (a !== "reroll") {
			if (a === "cancelled") return;
			s = n;
			break;
		}
	}
	if (!s) throw Error("No eligible mutation could be drawn after 100 attempts.");
}
async function Pn(e) {
	let t = ve(e);
	t ? await Mn(e, t) : await Nn(e);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/check.ts
var Fn = /* @__PURE__ */ new Set();
async function In(e) {
	let t = e.system.status.corruption;
	if (!(Number(t.value) <= Number(t.max) || Fn.has(e.uuid) || be(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		Fn.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[s]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await Ue(e, i) ? await C(game.i18n.localize("CHAT.MutateSuccess")) : await Pn(e);
		} finally {
			Fn.delete(e.uuid);
		}
	}
}
async function Ln(e) {
	let t = await fromUuid(e);
	if (!b(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await In(t);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/values.ts
function V(e, t, n) {
	let r = e[t];
	return Array.isArray(r) ? r[n] : n === 0 ? r : void 0;
}
function Rn(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = t.selections[e];
		for (let e of Array.isArray(n) ? n : n === void 0 ? [] : [n]) r.add(e);
	}
	return t.filter((e) => !r.has(e.id));
}
function zn(e, t, n, r) {
	let i = e[t], a = Array.isArray(i) ? [...i] : i === void 0 ? [] : [i];
	a[n] = r, e[t] = a.length === 1 ? a[0] : a;
}
function Bn(e, t) {
	let n = e;
	for (let e of t) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function Vn(e, t, n) {
	return Bn({
		...n,
		acquisition: {
			occurrence: t.occurrence,
			rolls: t.rolls,
			selections: t.selections
		},
		occurrence: t.occurrence,
		rolls: t.rolls,
		selections: t.selections
	}, e.key.split(".")) ?? t.selections[e.key] ?? t.rolls[e.key];
}
function Hn(e, t) {
	return Array.isArray(e) || Array.isArray(t) ? JSON.stringify(e) === JSON.stringify(t) : e === t;
}
function Un(e, t, n) {
	return (e ?? []).every((e) => {
		let r = Vn(e, t, n), i = e.value;
		switch (e.operator) {
			case "equals": return Hn(r, i);
			case "notEquals": return !Hn(r, i);
			case "exists": return r != null;
			case "notExists": return r == null;
			case "includes": return (Array.isArray(r) || typeof r == "string") && r.includes(i);
			case "notIncludes": return !((Array.isArray(r) || typeof r == "string") && r.includes(i));
			case "lt": return typeof r == "number" && typeof i == "number" && r < i;
			case "lte": return typeof r == "number" && typeof i == "number" && r <= i;
			case "gt": return typeof r == "number" && typeof i == "number" && r > i;
			case "gte": return typeof r == "number" && typeof i == "number" && r >= i;
			case "sumEquals": {
				let e = (Array.isArray(r) ? r : r === void 0 ? [] : [r]).map(Number);
				return typeof i == "number" && e.length > 0 && e.every(Number.isFinite) && e.reduce((e, t) => e + t, 0) === i;
			}
		}
	});
}
function Wn(e) {
	let { ranks: t, ...n } = e;
	return n;
}
function Gn(e, t) {
	let n = e.findIndex((e) => e.key === t.key && e.aggregateKey === t.aggregateKey);
	if (n < 0) {
		e.push({ ...t });
		return;
	}
	let r = e[n];
	if (t.aggregate === "latest") {
		e[n] = { ...t };
		return;
	}
	if (JSON.stringify(Wn(r)) !== JSON.stringify(Wn(t))) throw Error(`Acquisition grants reuse the incompatible key ${t.key}.`);
	t.stack === "rank" && (e[n] = {
		...r,
		ranks: (r.ranks ?? 1) + (t.ranks ?? 1)
	});
}
function Kn(e, t) {
	let n = e.findIndex((e) => e.key === t.key);
	if (n < 0) {
		e.push({ ...t });
		return;
	}
	if (JSON.stringify(e[n]) !== JSON.stringify(t)) throw Error(`Acquisition modifiers reuse the incompatible key ${t.key}.`);
}
function qn(e, t) {
	return {
		acceptedBlocks: [...e?.acceptedBlocks ?? []],
		grants: [],
		modifiers: [],
		occurrence: t,
		rolls: Object.fromEntries(Object.entries(e?.rolls ?? {}).map(([e, t]) => [e, Array.isArray(t) ? [...t] : t])),
		selections: Object.fromEntries(Object.entries(e?.selections ?? {}).map(([e, t]) => [e, Array.isArray(t) ? [...t] : t])),
		status: "pending",
		version: 1
	};
}
function Jn(e) {
	let t = new Set(e.modifiers.map((e) => e.key));
	return Object.fromEntries(Object.entries(e.rolls).filter(([e, n]) => t.has(e) && typeof n == "number" && Number.isFinite(n)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/materialize.ts
function Yn(e, t, n) {
	let { roll: r, ...i } = e;
	return {
		...i,
		key: t,
		...n === void 0 ? {} : { value: n }
	};
}
function Xn(e, t, n) {
	let r = (r) => r.replaceAll(/{{([^{}]+)}}/g, (r, i) => {
		let a = V(t.selections, i.trim(), n);
		if (a === void 0) throw Error(`Acquisition grant ${e.key} has an unresolved {{${i}}} placeholder.`);
		return a;
	}), i = e.configure?.nameTemplate, a = e.aggregateKeyTemplate;
	if (!i && !a) return e;
	let { aggregateKeyTemplate: o, ...s } = e, { nameTemplate: c, ...l } = e.configure ?? {};
	return {
		...s,
		...a ? { aggregateKey: r(a) } : {},
		...e.configure ? { configure: {
			...l,
			...i ? { name: r(i) } : {}
		} } : {}
	};
}
async function Zn(e, t, n, r) {
	for (let t of r.grants ?? []) Gn(e.state.grants, Xn(t, e.state, n));
	for (let i of r.modifiers ?? []) {
		let r = `${t.key}:${e.state.occurrence}:${n + 1}:${i.key}`, a = "roll" in i ? i.roll : void 0, o = e.state.rolls[r];
		if (Array.isArray(o) && (o = o[0]), a && (typeof o != "number" || !Number.isFinite(o))) {
			let n = await e.services.roll(a, `${e.mutationName}: ${t.prompt}`);
			o = n.total, e.state.rolls[r] = o, n.announce && e.announcements.push(n.announce);
		}
		if (a && (typeof o != "number" || !Number.isFinite(o))) throw Error(`The acquisition modifier ${i.key} did not resolve a roll.`);
		let s = Yn(i, r, a ? o : void 0);
		Kn(e.state.modifiers, s), a && typeof o == "number" && (e.topLevelRolls[r] = o);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/signals.ts
var Qn = Symbol("acquisition-cancelled"), $n = {
	depth: 8,
	resolutions: 32,
	tableRolls: 20
}, er = class {
	block;
	constructor(e) {
		this.block = e;
	}
};
function tr(e, t, n, r) {
	return {
		kind: n,
		message: `${e}: ${t} ${r}.`
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/state.ts
function H(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var nr = new Set([
	"ag",
	"bs",
	"dex",
	"fel",
	"i",
	"int",
	"s",
	"t",
	"wp",
	"ws"
]), rr = new Set([
	"ceil",
	"floor",
	"round"
]);
function U(e, t) {
	let n = new Set(t);
	return Object.keys(e).every((e) => n.has(e));
}
function ir(e) {
	return typeof e == "string" && e.trim().length > 0 && e.length <= 256;
}
function W(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function ar(e) {
	return typeof e == "string" && nr.has(e);
}
function or(e) {
	return e === void 0 || e === "first";
}
function sr(e) {
	let t = e.roll;
	return (typeof t == "string" && t.trim().length > 0) !== W(e.value);
}
function cr(e) {
	return e === void 0 || Array.isArray(e) && e.every((e) => typeof e == "string" && e.trim().length > 0);
}
function lr(e) {
	return e === void 0 || Array.isArray(e) && e.every(ar);
}
function ur(e) {
	if (!H(e) || !ir(e.key) || typeof e.kind != "string") return;
	let t = e.key;
	switch (e.kind) {
		case "characteristic": return !U(e, [
			"characteristic",
			"key",
			"kind",
			"roll",
			"scope",
			"value"
		]) || !ar(e.characteristic) || !or(e.scope) || !sr(e) ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristic",
			...typeof e.roll == "string" ? { roll: e.roll } : {},
			...e.scope === "first" ? { scope: "first" } : {},
			...W(e.value) ? { value: e.value } : {}
		};
		case "characteristicCap": return !U(e, [
			"characteristic",
			"key",
			"kind",
			"maximum"
		]) || !ar(e.characteristic) || !W(e.maximum) || e.maximum < 0 ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristicCap",
			maximum: e.maximum
		};
		case "move":
		case "status": return !U(e, [
			"key",
			"kind",
			"scope",
			"value"
		]) || !or(e.scope) || !W(e.value) ? void 0 : {
			key: t,
			kind: e.kind,
			...e.scope === "first" ? { scope: "first" } : {},
			value: e.value
		};
		case "moveMultiplier": return !U(e, [
			"key",
			"kind",
			"round",
			"value"
		]) || typeof e.round != "string" || !rr.has(e.round) || !W(e.value) ? void 0 : {
			key: t,
			kind: "moveMultiplier",
			round: e.round,
			value: e.value
		};
		case "sizeStep": return !U(e, [
			"direction",
			"key",
			"kind"
		]) || e.direction !== -1 && e.direction !== 1 ? void 0 : {
			direction: e.direction,
			key: t,
			kind: "sizeStep"
		};
		case "test": {
			let n = e.skills, r = e.characteristics;
			return !U(e, [
				"characteristics",
				"key",
				"kind",
				"roll",
				"skills",
				"value"
			]) || !cr(n) || !lr(r) || !(n?.length || r?.length) || !sr(e) ? void 0 : {
				...r ? { characteristics: [...r] } : {},
				key: t,
				kind: "test",
				...typeof e.roll == "string" ? { roll: e.roll } : {},
				...n ? { skills: [...n] } : {},
				...W(e.value) ? { value: e.value } : {}
			};
		}
		case "wounds": return !U(e, [
			"key",
			"kind",
			"value"
		]) || !W(e.value) ? void 0 : {
			key: t,
			kind: "wounds",
			value: e.value
		};
		default: return;
	}
}
function dr(e) {
	return !H(e) || typeof e.message != "string" ? !1 : [
		"conflict",
		"eligibility",
		"exhausted",
		"maximum"
	].includes(String(e.kind));
}
function G(...e) {
	let t = e.flatMap((e) => e ?? []).filter(dr);
	return t.filter((e, n) => t.findIndex((t) => t.kind === e.kind && t.message === e.message) === n);
}
function fr(e, t) {
	if (!H(e)) return !1;
	let n = (e) => typeof e === t && (t !== "number" || Number.isFinite(e));
	return Object.values(e).every((e) => n(e) || Array.isArray(e) && e.every(n));
}
function pr(e) {
	if (!H(e) || e.version !== 1 || e.status !== "pending" && e.status !== "resolved" || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !fr(e.rolls, "number") || !fr(e.selections, "string") || !Array.isArray(e.grants)) return;
	let t = Array.isArray(e.modifiers) ? e.modifiers.map(ur).filter((e) => e !== void 0) : [];
	return {
		acceptedBlocks: G(Array.isArray(e.acceptedBlocks) ? e.acceptedBlocks : void 0),
		grants: e.grants,
		modifiers: t,
		occurrence: Number(e.occurrence),
		rolls: e.rolls,
		selections: e.selections,
		status: e.status,
		version: 1
	};
}
function mr(t) {
	let n = t.getFlag(e, "mutationAutomation");
	return H(n) && H(n.acquisition) ? n : void 0;
}
function hr(e, t) {
	return e.some((e) => e.kind === t.kind && e.message === t.message);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/progression.ts
function K(e, t, n, r, i, a) {
	if (!r) throw Error(`Acquisition step ${n.key} has no fallback option.`);
	let o = tr(e.mutationName, n.prompt, i, a);
	if (hr(t.acceptedBlocks ?? [], o)) return r;
	throw new er(o);
}
function gr(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = V(a?.occurrence === e.occurrence - 1 ? a.selections : {}, n.key, r), s = i.findIndex((e) => e.id === o);
	return s < 0 ? K(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : s >= i.length - 1 ? K(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1];
}
function _r(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = V(a?.selections ?? {}, n.key, r) ?? n.initial, s = i.findIndex((e) => e.id === o);
	return s < 0 ? K(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : Un(n.advanceWhen, t, e.facts ?? {}) ? s >= i.length - 1 ? K(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1] : i[s];
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/repeat.ts
function vr(e, t, n) {
	if (!(t <= 1)) {
		if (e.repeat === "copy-first" && !n.some((e) => e.occurrence === 1)) return "cannot copy because the first occurrence has no resolved result";
		if (e.repeat === "unique") {
			let e = new Set(n.map((e) => e.occurrence));
			for (let n = 1; n < t; n += 1) if (!e.has(n)) return `cannot guarantee a unique result because occurrence ${n} is unresolved`;
		}
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/text.ts
async function yr(e) {
	let { executionIndex: t, mutationName: n, previousStates: r, services: i, state: a, step: o } = e;
	if (V(a.selections, o.key, t) !== void 0) return;
	let s;
	a.occurrence > 1 && o.repeat === "copy-first" && (s = V(r.find((e) => e.occurrence === 1)?.selections ?? {}, o.key, t));
	let c = new Set(r.flatMap((e) => {
		let t = e.selections[o.key];
		return Array.isArray(t) ? t : t === void 0 ? [] : [t];
	})), l;
	for (let e = 0; s === void 0 && e < 10; e += 1) {
		let e = await i.input({
			prompt: o.prompt,
			title: n
		});
		if (e === void 0) throw Qn;
		l = e, (o.repeat !== "unique" || !c.has(e)) && (s = e);
	}
	if (s === void 0) {
		let e = tr(n, o.prompt, "exhausted", "has no unique value remaining");
		if (!hr(a.acceptedBlocks ?? [], e)) throw new er(e);
		s = l;
	}
	if (s === void 0) throw Error(`Acquisition step ${o.key} has no text fallback.`);
	zn(a.selections, o.key, t, s);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/engine.ts
var br = class {
	request;
	services;
	announcements = [];
	executionCounts = /* @__PURE__ */ new Map();
	facts;
	previous;
	state;
	stepsByKey;
	topLevelRolls = {};
	resolutions = 0;
	get mutationName() {
		return this.request.mutationName;
	}
	constructor(e, t) {
		this.request = e, this.services = t, this.previous = e.previousStates ?? [], this.facts = e.facts ?? {}, this.state = qn(e.initialState, e.occurrence), this.state.acceptedBlocks = G(this.state.acceptedBlocks, e.acceptedBlocks), this.stepsByKey = new Map((e.steps ?? []).map((e) => [e.key, e]));
	}
	async run() {
		try {
			await this.resolveRetainedRolls();
			let e = new Set((this.request.steps ?? []).flatMap((e) => (e.options ?? []).flatMap((e) => e.next ? [e.next] : [])));
			for (let t of this.request.steps ?? []) e.has(t.key) || await this.visit(t, 0);
			return this.state.status = "resolved", {
				announcements: this.announcements,
				retainedRolls: this.topLevelRolls,
				state: this.state,
				status: "resolved"
			};
		} catch (e) {
			if (e === Qn) return { status: "cancelled" };
			if (e instanceof er) return {
				announcements: this.announcements,
				block: e.block,
				state: this.state,
				status: "blocked"
			};
			throw e;
		}
	}
	async resolveRetainedRolls() {
		for (let e of this.request.retainedRolls ?? []) {
			let t = this.state.rolls[e.key];
			if (Array.isArray(t) && (t = t[0]), typeof t != "number" || !Number.isFinite(t)) {
				let n = await this.roll(e.formula, `${this.request.mutationName}: retained roll`);
				t = n.total, this.state.rolls[e.key] = t, n.announce && this.announcements.push(n.announce);
			}
			this.topLevelRolls[e.key] = t;
		}
	}
	async visit(e, t) {
		if (t > $n.depth) throw Error("Mutation acquisition nesting exceeds its safe limit.");
		if (!Un(e.when, this.state, this.facts)) return;
		let n = vr(e, this.request.occurrence, this.previous);
		if (n) {
			let t = tr(this.request.mutationName, e.prompt, "eligibility", n);
			if (!hr(this.state.acceptedBlocks ?? [], t)) throw new er(t);
		}
		let r = Math.max(1, Math.trunc(e.count ?? 1));
		for (let n = 0; n < r; n += 1) await this.resolveStep(e, t);
	}
	async resolveStep(e, t) {
		if (this.resolutions += 1, this.resolutions > $n.resolutions) throw Error("Mutation acquisition contains too many nested resolutions.");
		let n = this.executionCounts.get(e.key) ?? 0;
		if (this.executionCounts.set(e.key, n + 1), e.kind === "text") {
			await yr({
				executionIndex: n,
				mutationName: this.request.mutationName,
				previousStates: this.previous,
				services: this.services,
				state: this.state,
				step: e
			});
			return;
		}
		let r = (e.options ?? []).filter((e) => Un(e.when, this.state, this.facts));
		if (r.length === 0) throw Error(`Acquisition step ${e.key} has no options.`);
		let i = V(this.state.selections, e.key, n), a = i ? r.find((e) => e.id === i) : await this.resolveOption(e, n, r);
		if (!a) throw Error(`Acquisition step ${e.key} retained an unknown option.`);
		if (zn(this.state.selections, e.key, n, a.id), a.next) {
			let n = this.stepsByKey.get(a.next);
			if (!n) throw Error(`Acquisition step ${e.key} references missing ${a.next}.`);
			await this.visit(n, t + 1);
		}
		await Zn(this, e, n, a);
	}
	async resolveOption(e, t, n) {
		let r = this.request.occurrence > 1;
		if (!r && e.initial) {
			let t = n.find((t) => t.id === e.initial);
			if (!t) throw Error(`Acquisition step ${e.key} has no initial option.`);
			return t;
		}
		if (r && e.repeat === "copy-first") {
			let r = V(this.previous.find((e) => e.occurrence === 1)?.selections ?? {}, e.key, t), i = n.find((e) => e.id === r);
			if (i) return i;
		}
		if (r && e.repeat === "advance") return gr(this.request, this.state, e, t, n);
		if (r && e.repeat === "conditional-advance") return _r(this.request, this.state, e, t, n);
		let i = r && e.repeat === "unique" ? Rn(e.key, n, [...this.previous, this.state]) : n;
		if (i.length === 0) {
			let r = V(this.previous.at(-1)?.selections ?? {}, e.key, t);
			return K(this.request, this.state, e, n.find((e) => e.id === r) ?? n.at(-1), "exhausted", "has no further result remaining");
		}
		return e.kind === "choice" && (e.options?.length ?? 0) > 1 && i.length === 1 ? i[0] : e.kind === "table" ? this.resolveTable(e, t, i) : this.choose(e, i);
	}
	async resolveTable(e, t, n) {
		if ((await this.choose(e, [{
			id: "roll",
			label: "Roll"
		}, {
			id: "choose",
			label: "Choose"
		}])).id === "choose") return this.choose(e, n);
		for (let r = 0; r < $n.tableRolls; r += 1) {
			let r = await this.roll(e.formula ?? "1d100", `${this.request.mutationName}: ${e.prompt}`), i = n.filter((e) => r.total >= (e.min ?? -Infinity) && r.total <= (e.max ?? Infinity));
			if (i.length === 0) continue;
			let a = i.length === 1 ? i[0] : await this.choose(e, i);
			return zn(this.state.rolls, e.key, t, r.total), r.announce && this.announcements.push(r.announce), a;
		}
		return K(this.request, this.state, e, n.at(-1), "exhausted", "has no further result remaining");
	}
	async choose(e, t) {
		let n = await this.services.choose({
			options: t,
			prompt: e.prompt,
			title: this.request.mutationName
		});
		if (n === void 0) throw Qn;
		let r = t.find((e) => e.id === n);
		if (!r) throw Error(`Acquisition dialog returned unknown option ${n}.`);
		return r;
	}
	async roll(e, t) {
		let n = await this.services.roll(e, t);
		if (!Number.isFinite(n.total)) throw Error(`Acquisition roll ${e} was not finite.`);
		return n;
	}
};
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/resolve.ts
async function xr(e, t) {
	let n = e.initialState, r = (e.retainedRolls ?? []).every((e) => Number.isFinite(n?.rolls[e.key]));
	if (n?.status !== "resolved" || !r) return new br(e, t).run();
	let i = qn(n, e.occurrence);
	return i.grants = [...n.grants], i.modifiers = [...n.modifiers], i.acceptedBlocks = G(n.acceptedBlocks, e.acceptedBlocks), i.status = "resolved", {
		announcements: [],
		retainedRolls: {
			...Jn(i),
			...Object.fromEntries((e.retainedRolls ?? []).map((e) => [e.key, i.rolls[e.key]]))
		},
		state: i,
		status: "resolved"
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/dialog.ts
function q(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function Sr(e) {
	let t = e.options.filter((e) => e.description), n = [...t.length ? [
		"<ul class=\"tw:flex tw:flex-col tw:gap-2\">",
		...t.map((e) => `<li><strong>${q(e.label)}</strong><div class="tw:text-sm tw:opacity-70">${q(e.description ?? "")}</div></li>`),
		"</ul>"
	] : []];
	if (e.options.length > 4) {
		let t = [
			"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-2\">",
			"<fieldset class=\"tw:dui-fieldset\">",
			`<legend class="tw:dui-fieldset-legend">${q(e.prompt)}</legend>`,
			"<select class=\"tw:dui-select tw:w-full\" name=\"mutation-acquisition-choice\">",
			...e.options.map((e) => `<option value="${q(e.id)}">${q(e.label)}</option>`),
			"</select>",
			"</fieldset>",
			...n,
			"</div>"
		].join(""), r = await foundry.applications.api.DialogV2.wait({
			buttons: [{
				action: "save",
				callback: (e, t) => {
					let n = t.form?.elements.namedItem("mutation-acquisition-choice");
					return n instanceof HTMLSelectElement ? n.value : void 0;
				},
				default: !0,
				label: "Select"
			}, {
				action: "cancel",
				callback: () => void 0,
				label: "Cancel"
			}],
			content: t,
			rejectClose: !1,
			window: { title: e.title }
		});
		return typeof r == "string" && e.options.some((e) => e.id === r) ? r : void 0;
	}
	let r = [
		"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-2\">",
		`<p>${q(e.prompt)}</p>`,
		...n,
		"</div>"
	].join(""), i = await foundry.applications.api.DialogV2.wait({
		buttons: e.options.map((e, t) => ({
			action: e.id,
			callback: () => e.id,
			default: t === 0,
			label: e.label
		})),
		content: r,
		rejectClose: !1,
		window: { title: e.title }
	});
	return typeof i == "string" && e.options.some((e) => e.id === i) ? i : void 0;
}
async function Cr(e, t) {
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: [{
			action: "save",
			callback: (e, t) => {
				let n = t.form?.elements.namedItem("mutation-acquisition-value");
				return n instanceof HTMLInputElement ? n.value.trim() : void 0;
			},
			default: !0,
			label: "Save"
		}, {
			action: "cancel",
			callback: () => void 0,
			label: "Cancel"
		}],
		content: `<fieldset class="fvtt-wfrp-ratter-root tw:dui-fieldset"><legend class="tw:dui-fieldset-legend">${q(e)}</legend><input class="tw:dui-input tw:w-full" name="mutation-acquisition-value" type="text" autocomplete="off" required></fieldset>`,
		rejectClose: !1,
		window: { title: t }
	});
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
async function wr(e, t) {
	let n = new Roll(e);
	await n.evaluate({ allowInteractive: !1 });
	let r = n.total;
	if (typeof r != "number" || !Number.isFinite(r)) throw Error(`Acquisition roll ${e} did not produce a finite total.`);
	return {
		announce: async () => {
			await n.toMessage({ flavor: t });
		},
		total: r
	};
}
var Tr = {
	choose: Sr,
	input: ({ prompt: e, title: t }) => Cr(e, t),
	roll: wr
};
function Er(e) {
	return Object.entries(e).map(([e, t]) => `<div><dt class="tw:font-semibold">${q(e)}</dt><dd>${q(Array.isArray(t) ? t.join(", ") : String(t))}</dd></div>`);
}
async function Dr(e, t) {
	let n = (t.acceptedBlocks ?? []).map((e) => `<li><span>${q(e.message)}</span></li>`), r = [
		"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-3\">",
		"<p>This mutation already has a resolved acquisition. Keep it, or explicitly reconfigure its stored results.</p>",
		"<dl class=\"tw:grid tw:grid-cols-2 tw:gap-2\">",
		...Er(t.selections),
		...Er(t.rolls),
		"</dl>",
		...n.length ? [
			"<div role=\"alert\" class=\"tw:dui-alert tw:dui-alert-warning\"><ul>",
			...n,
			"</ul></div>"
		] : [],
		"</div>"
	].join("");
	return await foundry.applications.api.DialogV2.wait({
		buttons: [{
			action: "keep",
			callback: () => "keep",
			default: !0,
			label: "Keep"
		}, {
			action: "reconfigure",
			callback: () => "reconfigure",
			label: "Reconfigure"
		}],
		content: r,
		rejectClose: !1,
		window: { title: `Review ${e}` }
	}) === "reconfigure" ? "reconfigure" : "keep";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/history.ts
function Or(e, t, n) {
	let r = [...e.items].filter((e) => e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 ? !1 : mr(e)?.definitionId === n), i = r.findIndex((e) => e.id === t.id), a = r.flatMap((e, t) => {
		let n = pr(mr(e)?.state?.acquisition);
		return n?.status === "resolved" ? [{
			index: t,
			state: n
		}] : [];
	}), o = i >= 0 ? a.find(({ index: e }) => e === i)?.state : void 0, s = a.reduce((e, { state: t }) => Math.max(e, t.occurrence), 0), c = o?.occurrence ?? (i >= 0 ? i + 1 : Math.max(r.length, s) + 1), l = a.filter(({ index: e, state: t }) => o ? t.occurrence < c : i < 0 || e < i).sort((e, t) => e.state.occurrence - t.state.occurrence || e.index - t.index).map(({ state: e }) => e);
	return {
		isLatest: i < 0 || i === r.length - 1,
		occurrence: c,
		previousStates: l
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/persistence.ts
function kr(e) {
	return H(e) ? Object.fromEntries(Object.entries(e).filter((e) => Number.isFinite(e[1]))) : {};
}
function Ar(e) {
	return new Set(e?.modifiers.map((e) => e.key) ?? []);
}
function jr(e) {
	return pr(e.state?.acquisition);
}
function Mr(e, t, n) {
	let r = kr(e.state?.rolls), i = Object.fromEntries((e.retainedRolls ?? []).filter((e) => typeof r[e.key] == "number").map((e) => [e.key, r[e.key]]));
	if (!(Object.keys(i).length === 0 && n.length === 0)) return {
		acceptedBlocks: [...n],
		grants: [],
		modifiers: [],
		occurrence: t,
		rolls: i,
		selections: {},
		status: "pending",
		version: 1
	};
}
function Nr(e, t) {
	return {
		acceptedBlocks: [...t],
		grants: [],
		modifiers: [],
		occurrence: e,
		rolls: {},
		selections: {},
		status: "pending",
		version: 1
	};
}
async function Pr(t, n, r, i, a, o, s) {
	let c = H(n.state) ? { ...n.state } : {}, l = kr(c.rolls);
	if (a) {
		let e = Ar(o);
		for (let t of n.retainedRolls ?? []) e.add(t.key);
		for (let t of e) delete l[t];
	}
	let u = {
		...c,
		acquisition: r.state,
		rolls: {
			...l,
			...r.retainedRolls
		}
	}, d = { [`flags.${e}.mutationAutomation.state`]: u };
	if (!i) {
		if (!t.updateSource) throw Error(`Foundry cannot stage acquisition state for ${t.name}.`);
		t.updateSource(d);
		return;
	}
	if (!t.update) throw Error(`Foundry cannot update acquisition state for ${t.name}.`);
	await t.update(d, s);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/runtime.ts
var Fr = 8;
function Ir(e) {
	return H(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.getFlag == "function" && typeof e.toObject == "function" : !1;
}
function Lr(e, t) {
	return t.items.has?.(e.id) === !0 ? !0 : t.items.get?.(e.id) !== void 0 || [...t.items].some((t) => t === e);
}
function Rr(e) {
	let t = e.mutationAcquisitionAcceptedBlocks;
	return G(Array.isArray(t) ? t : void 0);
}
function zr(e, t) {
	e.mutationAcquisitionAcceptedBlocks = [...t];
}
function J(e, t = !1) {
	return e.abortItemCreation = !0, e.mutationAcquisitionCancelled = !0, t && (e.mutationAcquisitionRerollRequested = !0), !1;
}
async function Br(e, t, n, r, i) {
	for (let a of t) {
		if (hr(n, a)) continue;
		let t = await Je(e, a, i);
		if (t === "reroll") return J(r, !0);
		if (t !== "accept") return J(r);
		n.splice(0, n.length, ...G(n, [a])), zr(r, n);
	}
	return !0;
}
async function Vr(e, t, n, r, i, a) {
	let o = ee(t.system.mutationType.value);
	if (!o) throw Error(`${t.name} has no physical or mental mutation classification.`);
	let s = je(e, {
		acquisition: n.acquisition,
		data: t.toObject(),
		name: t.name,
		nature: o
	}, r ? t.id : void 0);
	return Br(t.name, s, i, a, a.mutationAcquisitionCanReroll === !0);
}
async function Hr(e, t, n) {
	if (n.skipMutationAcquisition === !0 || !Ir(e)) return !0;
	let r = b(t) ? t : b(e.actor) ? e.actor : void 0;
	if (!r) return !0;
	let i = mr(e);
	if (!i) return !0;
	let a = Lr(e, r), o = jr(i), s = n.mutationAcquisitionReconfigure === !0, c = Or(r, e, i.definitionId);
	if (s && a && !c.isLatest) return ui.notifications.warn(`${e.name}: only the latest active occurrence can be reconfigured because later results depend on its retained history.`), !1;
	let l = c.occurrence, u = G(o?.acceptedBlocks, Rr(n));
	if (zr(n, u), !await Vr(r, e, i, a, u, n)) return !1;
	let d = s ? Nr(l, u) : o;
	d ??= Mr(i, l, u);
	let f = [];
	for (let t = 0; t < Fr; t += 1) {
		let t = await xr({
			acceptedBlocks: u,
			facts: {
				actor: {
					name: r.name,
					system: r.system,
					type: r.type
				},
				mutation: {
					name: e.name,
					nature: e.system.mutationType.value
				}
			},
			...d ? { initialState: d } : {},
			mutationName: e.name,
			occurrence: l,
			previousStates: c.previousStates,
			retainedRolls: i.retainedRolls ?? [],
			steps: i.acquisition.steps ?? []
		}, Tr);
		if (t.status === "cancelled") return J(n);
		if (f.push(...t.announcements), t.status === "blocked") {
			let r = await Je(e.name, t.block, n.mutationAcquisitionCanReroll === !0);
			if (r === "reroll") return J(n, !0);
			if (r !== "accept") return J(n);
			u.splice(0, u.length, ...G(u, [t.block])), zr(n, u), d = {
				...t.state,
				acceptedBlocks: [...u]
			};
			continue;
		}
		let p = Me(r, e.name, t.state, a ? e.id : void 0);
		if (!await Br(e.name, p, u, n, n.mutationAcquisitionCanReroll === !0)) return !1;
		await Pr(e, i, {
			...t,
			state: {
				...t.state,
				acceptedBlocks: [...u]
			}
		}, a, s, o, n);
		for (let e of f) await e();
		return !0;
	}
	throw Error(`Acquisition review for ${e.name} exceeded its safe limit.`);
}
async function Ur(e) {
	let t = await fromUuid(e);
	if (!Ir(t) || !b(t.actor)) throw Error(`The UUID ${e} does not resolve to an owned mutation Item.`);
	let n = mr(t);
	if (!n) throw Error(`${t.name} has no Mutant's Handbook automation data.`);
	let r = jr(n);
	if (r?.status === "resolved" && await Dr(t.name, r) === "keep") return !0;
	let i = { ...r?.status === "resolved" ? { mutationAcquisitionReconfigure: !0 } : {} }, a = await Hr(t, t.actor, i);
	return a && await R(t.actor.uuid), a;
}
//#endregion
//#region src/module/api/create-module-api.ts
function Wr() {
	return {
		checkMutantsHandbookCorruption: Ln,
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		prepareMutationAcquisition: Hr,
		reconcileMutationAutomation: R,
		removeMutationGrantOwner: tn,
		resolveOwnedMutationAcquisition: Ur,
		title: t
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function Gr() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = Wr();
}
//#endregion
//#region src/module/settings.ts
var Kr = "useMutantsHandbookMutations";
function qr() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(e, Kr, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function Jr() {
	return game?.settings.get(e, Kr) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/context-options.ts
var Yr = [
	"CHATOPT.UseFortuneReroll",
	"CHATOPT.Reroll",
	"CHATOPT.UseFortuneSL",
	"CHATOPT.DarkDeal",
	"CHATOPT.StartOpposed",
	"CHATOPT.DefendOpposed",
	"CHATOPT.CompleteUnopposed",
	"CHATOPT.EditTest"
];
function Xr(e) {
	let t = e.dataset.messageId;
	return (t ? game?.messages.get(t)?.system.test : void 0)?.options[s] === !0;
}
function Zr(e) {
	let t = e.condition;
	e.condition = (e) => Xr(e) ? !1 : t ? t(e) : !0;
}
function Qr() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		if (!game) return;
		let n = new Set(Yr.map((e) => game.i18n.localize(e)));
		for (let e of t) n.has(e.name) && Zr(e);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/hooks.ts
function $r(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (n.type !== "mutation" || typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e]?.mutationAutomation;
	return typeof r == "object" && r ? n : void 0;
}
function ei(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e];
	return typeof r?.mutationGrant == "object" || typeof r?.mutationSkillGrant == "object" ? n : void 0;
}
function ti(e) {
	e.catch(Le);
}
function ni(e) {
	return typeof e == "string" && game?.user.id === e;
}
async function ri(e, t = {}) {
	e.actor && (e.name.trim().toLowerCase() === "chimeran curse" && t.mutationAcquisitionHandlesChimeranRetirement !== !0 && await Se(e.actor), await R(e.actor.uuid));
}
function ii() {
	Hooks.on("createItem", (e, t, n) => {
		if (!ni(n)) return;
		let r = $r(e);
		r?.actor && ti(ri(r, typeof t == "object" && t ? t : {}));
	}), Hooks.on("deleteItem", (e, t, n) => {
		if (!ni(n)) return;
		let r = $r(e);
		if (r?.actor) {
			ti(tn(r.actor.uuid, r.id));
			return;
		}
		let i = ei(e);
		i?.actor && ti(R(i.actor.uuid));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/migration.ts
var ai = `${e}.ratter-11-items`, oi = "The Mutant's Handbook", si = new Set([
	"acquisition",
	"automated",
	"definitionId",
	"grants",
	"manual",
	"retainedRolls",
	"selfControl",
	"status",
	"version"
]);
function Y(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function X(e) {
	return e.toObject();
}
function ci(t) {
	let n = t.flags;
	if (!Y(n)) return {};
	let r = n[e];
	return Y(r) ? r : {};
}
function Z(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.filter(Y) : [];
}
function Q(e) {
	return Array.isArray(e) ? e.map(Q) : Y(e) ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, Q(t)])) : e;
}
function li(e, t) {
	return JSON.stringify(Q(e)) === JSON.stringify(Q(t));
}
function di(e) {
	let t = { ...e };
	return delete t._key, delete t._stats, t;
}
function $(t) {
	let n = t.flags;
	if (!Y(n)) return !1;
	let r = n[e];
	return Y(r) && typeof r.automationPhase == "string";
}
function fi(e, t) {
	if (!Y(e)) return t;
	let n = Object.fromEntries(Object.entries(e).filter(([e]) => !si.has(e)));
	return {
		...t,
		...n
	};
}
function pi(t, n) {
	let r = ci(n).mutationAutomation;
	if (!Y(r)) return;
	let i = ci(t).mutationAutomation, a = fi(i, r), o = Z(t).filter($), s = Z(n).filter($), c = [...s, ...Z(t).filter((e) => !$(e))], l = {};
	return li(i, a) || (l[`flags.${e}.mutationAutomation`] = a), li(o.map(di), s.map(di)) || (l.effects = c), Object.keys(l).length > 0 ? l : void 0;
}
function mi(e) {
	return Y(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.toObject == "function" : !1;
}
function hi(e) {
	let t = ci(X(e)).mutationAutomation;
	return Y(t) && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
function gi(e) {
	return ci(X(e)).sourceDocument === oi;
}
function _i(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.uuid, t);
	for (let e of t) for (let t of e.tokens ?? []) t.actor && n.set(t.actor.uuid, t.actor);
	return [...n.values()];
}
async function vi(e, t) {
	if (!e.deleteEmbeddedDocuments || !e.createEmbeddedDocuments) throw Error(`${e.name} does not support embedded Active Effect migration.`);
	let n = Z(X(e)).filter($), r = n.map((e) => e._id).filter((e) => typeof e == "string");
	if (r.length !== n.length) throw Error(`${e.name} has a managed Active Effect without an ID.`);
	r.length > 0 && await e.deleteEmbeddedDocuments("ActiveEffect", r);
	let i = Z(X(t)).filter($).map((e) => {
		let t = { ...e };
		return delete t._key, t;
	});
	i.length > 0 && await e.createEmbeddedDocuments("ActiveEffect", i, {
		keepId: !0,
		skipMutationAcquisition: !0
	});
}
async function yi() {
	if (!game || game.user.isUniqueGM !== !0) return;
	let e = game.packs.get(ai);
	if (!e) throw Error(`The required compendium ${ai} is unavailable.`);
	let t = (await e.getDocuments()).filter(mi), n = new Map(t.map((e) => [hi(e) ?? e.id, e])), r = new Map(t.map((e) => [e.name, e])), i = _i(game.actors ?? [], game.scenes ?? []);
	for (let e of i) {
		let t = [], i = [];
		for (let a of Array.from(e.items).filter(mi)) {
			let e = (hi(a) ? n.get(hi(a)) : void 0) ?? (gi(a) ? r.get(a.name) : void 0);
			if (!e) continue;
			let o = pi(X(a), X(e));
			o && ("effects" in o && (i.push({
				owned: a,
				source: e
			}), delete o.effects), Object.keys(o).length > 0 && t.push({
				_id: a.id,
				...o
			}));
		}
		t.length > 0 && await e.updateEmbeddedDocuments("Item", t);
		for (let e of i) await vi(e.owned, e.source);
		await R(e.uuid);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/replacement.ts
var bi = Symbol.for(`${e}.mutantsHandbookReplacement`);
function xi() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[bi] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, bi, { value: !0 }), e.checkCorruption = async function() {
		if (!Jr()) {
			await t.call(this);
			return;
		}
		try {
			await In(this.parent);
		} catch (e) {
			Le(e);
		}
	};
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function Si() {
	Hooks.once("init", () => {
		qr(), Gr(), Qr(), ii();
	}), Hooks.once("ready", async () => {
		xi();
		try {
			await yi();
		} catch (e) {
			Le(e);
		}
	});
}
//#endregion
//#region src/main.ts
Si();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map