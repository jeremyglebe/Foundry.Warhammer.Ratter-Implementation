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
function de(e, t, n) {
	let r = ue(e);
	if (!r) return !1;
	let i = new Set(n.map(h));
	return _(r[t]).some((e) => i.has(e));
}
function fe(e, t, n) {
	let r = h(t);
	return g(e, n).find((e) => h(e.name) === r);
}
function pe(e, t) {
	let n = h(t);
	return ce(e).some((e) => {
		if (e.type !== "talent" || typeof e.name != "string") return !1;
		let t = h(e.name);
		return t === n || t.startsWith(`${n} (`);
	});
}
function me(e, t) {
	let n = e;
	for (let e of t) {
		if (!m(n)) return;
		n = n[e];
	}
	return n;
}
function he(e) {
	let t = e.currentCareer, n = [...m(t) ? [t] : [], ...ce(e).filter((e) => e.type === "career" && me(e.system, ["current", "value"]) === !0)];
	for (let e of n) {
		let t = me(e, [
			"system",
			"careergroup",
			"value"
		]);
		if (typeof t == "string" && t.trim().length > 0) return h(t);
	}
}
function ge(e, t) {
	return g(e, t).some((e) => ["additional extremities", "additional limbs"].includes(h(e.name)) && de(e, "limb", ["legs"]));
}
function _e(e, t) {
	return g(e, t).some((e) => ["additional extremities", "additional limbs"].includes(h(e.name)) && de(e, "limb", ["arms"]));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actor-state.ts
var ve = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"unassigned"
];
function ye(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function be(e) {
	let t = xe(e) !== void 0;
	return ae((e.itemTypes.mutation ?? []).filter((e) => !le(e) && !(t && h(e.name) === "possessed")).map((e) => e.system.mutationType.value));
}
function xe(t) {
	let n = t.getFlag(e, r);
	return ve.find((e) => e === n);
}
function Se(e) {
	return (e.itemTypes.mutation ?? []).some((e) => h(e.name) === "possessed" && !le(e));
}
function Ce(t) {
	return t.getFlag(e, i) === !0;
}
async function we(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => h(e.name) === "possessed" && !le(e)).map((t) => ({
		_id: t.id,
		[`flags.${e}.${o}`]: !0
	}));
	if (n.length !== 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
async function Te(t) {
	let n = g(t).filter((e) => h(e.name) === "skinwalker");
	if (n.length === 0) return [];
	let r = await t.updateEmbeddedDocuments("Item", n.map((t) => ({
		_id: t.id,
		[`flags.${e}.${a}`]: !0
	})));
	if (r.length !== n.length) {
		let e = new Set(r.map((e) => e.id)), i = n.filter((t) => e.has(t.id)).map((e) => e.id);
		try {
			await Ee(t, i);
		} catch (e) {
			throw AggregateError([e], `Foundry only partially retired Skinwalker for ${t.name}, and rollback failed.`, { cause: e });
		}
		throw Error(`Foundry prevented Skinwalker from being retired for ${t.name}.`);
	}
	return n.map((e) => e.id);
}
async function Ee(e, t) {
	if (t.length !== 0 && (await e.updateEmbeddedDocuments("Item", t.map((e) => ({
		_id: e,
		"flags.fvtt-wfrp-ratter.-=mutantsHandbookRetired": null
	})))).length !== t.length) throw Error(`Foundry prevented retired mutations from being restored for ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition-eligibility.ts
var De = new Set([
	"bachtrachian suckers",
	"bestial legs",
	"centauroid",
	"clubfoot",
	"hopper",
	"prehensile feet",
	"unnatural legs"
]);
function Oe(e, t) {
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
		if (e === "atrophy" && de(i, "atrophied-part", ["arm", "hand"])) {
			let e = _(t?.["atrophy-side"]);
			e.length === 0 && (r = !0);
			for (let t of e) (t === "left" || t === "right") && n.delete(t);
		}
	}
	return {
		ambiguous: r,
		extraArms: _e(e, t),
		primaryHands: n
	};
}
function ke(e, t, n, r, i) {
	return g(e, i).some((e) => h(e.name) === h(t) && de(e, n, r));
}
function v(e) {
	return {
		kind: "eligibility",
		message: e
	};
}
function Ae(e, t, n) {
	let r = h(t.name), i = [];
	if (r === "chosen one" && pe(e, "Arcane Magic") && i.push(v(`${t.name} cannot be acquired with Arcane Magic.`)), r === "false wizard") {
		xe(e) === "khorne" && i.push(v(`${t.name} cannot be acquired by a Chosen of Khorne.`));
		let n = ["Bless", "Invoke"].filter((t) => pe(e, t));
		n.length > 0 && i.push(v(`${t.name} cannot be acquired with ${n.join(" or ")}.`));
	}
	if (r === "malign sorcerer" && xe(e) === "khorne" && i.push(v(`${t.name} cannot be acquired with Khorne as patron.`)), r === "prince of nothing") {
		let n = he(e);
		n === "noble" ? i.push(v(`${t.name} cannot be acquired by an actual Noble.`)) : n === void 0 && i.push(v(`Confirm that ${e.name} is not an actual Noble before acquiring ${t.name}.`));
	}
	if (r === "headless") {
		let r = fe(e, "Elongated Limbs", n);
		r && de(r, "limb", ["neck"]) && i.push(v(`${t.name} cannot be acquired with Elongated Limbs (Neck).`));
	}
	if (r === "wings" && ke(e, "Wings", "wing-size", ["huge"], n) && i.push(v(`${t.name} cannot be acquired again after reaching Huge wings.`)), r === "beweaponed extremities" && ke(e, "Beweaponed Extremities", "arms", ["both"], n) && i.push(v(`${t.name} cannot be acquired again because a prior acquisition transformed both arms.`)), r === "pincer claw" || r === "razor-sharp claws") {
		let r = Oe(e, n);
		r.primaryHands.size === 0 && !r.extraArms && !r.ambiguous ? i.push(v(`${t.name} requires at least one ordinary clawless hand.`)) : (r.primaryHands.size === 0 || r.extraArms || r.ambiguous) && i.push(v(`Confirm that ${e.name} has an ordinary clawless hand that can receive ${t.name}; non-left/right or legacy hand anatomy cannot be inferred safely.`));
	}
	return r === "overgrown arm" && _e(e, n) && i.push(v(`Confirm which arm receives ${t.name}; resolved extra arms are not limited to the tracked left/right choices.`)), De.has(r) && fe(e, "Blob", n) && !ge(e, n) && i.push(v(`${t.name} alters legs, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), i;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition-blocks.ts
var je = {
	"additional appendages": ["location", ["foot"]],
	atrophy: ["atrophied-part", [
		"foot",
		"leg",
		"toes"
	]],
	"elongated limbs": ["limb", ["legs"]],
	"extra joints": ["jointed-limbs", ["legs"]]
}, Me = {
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
function Ne(e) {
	return e.filter((t, n) => e.findIndex((e) => e.kind === t.kind && e.message === t.message) === n);
}
function Pe(e, t, n) {
	let r = g(e, n), i = r.filter((e) => h(e.name) === h(t.name)).length, a = t.acquisition?.max, o = [];
	a !== void 0 && i >= a && o.push({
		kind: "maximum",
		message: `${t.name} has reached its acquisition maximum of ${a}.`
	}), o.push(...Ae(e, t, n));
	for (let e of t.acquisition?.conflicts ?? []) r.some((t) => h(t.name) === h(e)) && o.push({
		kind: "conflict",
		message: `${t.name} conflicts with the existing ${e} mutation.`
	});
	return Ne(o);
}
function Fe(e, t, n, r) {
	if (n.status !== "resolved") return [];
	let i = h(t), a = [];
	i === "elongated limbs" && _(n.selections.limb).includes("neck") && fe(e, "Headless", r) && a.push(v(`${t} (Neck) cannot be acquired with Headless.`));
	let o = je[i];
	if (o && _(n.selections[o[0]]).some((e) => o[1].includes(e)) && fe(e, "Blob", r) && !ge(e, r) && a.push(v(`${t} selected a leg-altering result, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), i === "questing eye") {
		let e = n.selections["questing-eye"], r = typeof e == "string" && e.trim().length > 0 ? `“${e.trim()}” is` : "the chosen eye is";
		a.push(v(`Confirm that ${r} an existing eye available to receive ${t}; exact eye anatomy is not reliably detectable.`));
	}
	if (fe(e, "Hairless", r)) {
		let e = Me[i];
		(i === "protective skin" && _(n.selections.skin).includes("fur") || e !== void 0 && _(n.selections["bestial-source"]).some((t) => e.includes(t))) && a.push(v(`${t} selected a hair or fur result, but Hairless prevents that manifestation; confirm whether to keep or reroll it.`));
	}
	return Ne(a);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/mutation-results.ts
function Ie(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function Le(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function Re(t) {
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
async function ze(t, n) {
	if (!t.documentUuid) {
		if (n === "khorne" && t.name.trim().toLowerCase() === "prejudice") return Re(t);
		throw Error(`The table result ${t.name} does not link to a mutation Item.`);
	}
	let r = await fromUuid(t.documentUuid);
	if (!Ie(r)) throw Error(`The table result ${t.name} does not resolve to a mutation Item.`);
	let i = ee(r.system.mutationType.value);
	if (!i) throw Error(`The mutation ${r.name} has no physical or mental classification.`);
	let a = r.getFlag(e, "mutationAutomation")?.acquisition;
	return {
		...a ? { acquisition: a } : {},
		data: Le(r),
		name: r.name,
		nature: i
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/messages.ts
function y(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while formatting a mutation message.");
	return game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${e}`, t);
}
async function b(e) {
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
function x(e) {
	ui.notifications.warn(e);
}
function Be(e) {
	let t = e instanceof Error ? e.message : String(e), n = game ? game.i18n.format("FVTT_WFRP_RATTER.Mutations.Error", { message: t }) : `The Mutant's Handbook mutation workflow failed: ${t}`;
	console.error(e), ui.notifications.error(n);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/updates.ts
async function S(e, t) {
	if (!await e.update(t, { skipCorruption: !0 })) throw Error(`Foundry prevented the required update to ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/test-resolution.ts
function C(e) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	return game.i18n.localize(`FVTT_WFRP_RATTER.Mutations.${e}`);
}
function Ve(e, t) {
	let n = [], r = Number(e.system.status.fortune?.value ?? 0);
	return t.failed && r > 0 && !t.context.fortuneUsedReroll && n.push({
		action: "fortune-reroll",
		label: C("FortuneReroll")
	}), r > 0 && !t.context.fortuneUsedAddSL && n.push({
		action: "fortune-sl",
		label: C("FortuneSL")
	}), n.push({
		action: "dark-deal",
		label: C("DarkDeal")
	}), n.push({
		action: "accept",
		default: !0,
		label: C(t.failed ? "AcceptFailure" : "AcceptSuccess")
	}), n;
}
async function He(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while resolving a corruption test.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: Ve(e, t),
		content: game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${t.failed ? "TestResourcesPrompt" : "TestResourcesSuccessPrompt"}`, { name: e.name }),
		rejectClose: !1,
		window: { title: C("TestResourcesTitle") }
	});
	return n === "dark-deal" || n === "fortune-reroll" || n === "fortune-sl" ? n : "accept";
}
async function Ue(e, t, n, r) {
	try {
		await n();
	} catch (n) {
		try {
			await S(e, t);
		} catch (e) {
			throw AggregateError([n, e], `${r} was spent, the reroll failed, and Foundry could not restore the resource.`, { cause: e });
		}
		throw n;
	}
}
async function We(e, t, n) {
	let r = Math.trunc(Number(e.system.status.fortune?.value ?? 0));
	if (r <= 0) return x(y("FortuneUnavailable", { name: e.name })), !1;
	let i = r - 1;
	return await S(e, { "system.status.fortune.value": i }), n ? (t.context.fortuneUsedAddSL = !0, t.context.previousResult = { ...t.result }, t.preData.SL = Math.trunc(t.result.SL) + 1, t.preData.slBonus = 0, t.preData.successBonus = 0, t.preData.roll = Math.trunc(t.result.roll), await Ue(e, { "system.status.fortune.value": r }, () => t.roll(), "Fortune")) : (t.context.fortuneUsedReroll = !0, t.context.fortuneUsedAddSL = !0, await Ue(e, { "system.status.fortune.value": r }, () => t.reroll(), "Fortune")), await b(y(n ? "FortuneSLUsed" : "FortuneRerollUsed", {
		name: e.name,
		remaining: i
	})), !0;
}
async function Ge(e, t) {
	let n = Math.trunc(Number(e.system.status.corruption.value)), r = n + 1;
	await S(e, { "system.status.corruption.value": r }), await Ue(e, { "system.status.corruption.value": n }, () => t.reroll(), "Dark Deal Corruption"), await b(y("DarkDealUsed", {
		corruption: r,
		maximum: Number(e.system.status.corruption.max),
		name: e.name
	}));
}
async function Ke(e, t) {
	for (;;) {
		let n = await He(e, t);
		if (n === "accept") return !t.failed;
		n === "dark-deal" ? await Ge(e, t) : await We(e, t, n === "fortune-sl");
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/dialogs.ts
var qe = [
	"human",
	"dwarf",
	"elf",
	"halfling",
	"gnome",
	"ogre"
], Je = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function Ye(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Xe(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function Ze(e, t, n) {
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
		content: `<div class="fvtt-wfrp-ratter-root"><div role="alert" class="tw:dui-alert tw:dui-alert-warning"><span>${Xe(t.message)}</span></div><p>${n ? "Reroll this table result, accept it despite the warning, or cancel the mutation procedure." : "Accept this mutation despite the warning, or cancel adding it."}</p></div>`,
		rejectClose: !1,
		window: { title: `Review ${e}` }
	});
	return i === "accept" || i === "reroll" ? i : "cancel";
}
async function Qe(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a species profile.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: qe.map((e) => ({
			action: e,
			label: Ye(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesPrompt", {
			name: e,
			species: t || game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpecies")
		}),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesTitle") }
	});
	return qe.find((e) => e === n);
}
async function $e(e) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a Chaos patron.");
	let t = await foundry.applications.api.DialogV2.wait({
		buttons: Je.map((e) => ({
			action: e,
			label: Ye(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.PatronPrompt", { name: e }),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.PatronTitle") }
	});
	return Je.find((e) => e === t);
}
async function et(e, t) {
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
function w(e) {
	return Array.isArray(e) ? e.map(w) : typeof e == "object" && e ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e < t ? -1 : +(e > t)).map(([e, t]) => [e, w(t)])) : e;
}
function tt(e) {
	return JSON.stringify(w({
		configure: e.configure ?? {},
		ranks: e.ranks ?? 1,
		scope: e.scope ?? "all",
		sourceUuid: e.sourceUuid,
		stack: e.stack ?? "singleton",
		type: e.type
	}));
}
function nt(e) {
	let t = { ...e };
	return delete t.scope, tt({
		...t,
		ranks: 1
	});
}
function rt(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	if (typeof t != "object" || !t || Array.isArray(t)) return;
	let n = t;
	if (!(n.stack !== "rank" || n.type !== "skill" && n.type !== "talent")) return n.ranks = 1, n.scope = "all", JSON.stringify(w(n));
}
function it(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function at(e, t, n) {
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
function ot(e, t) {
	t.configure?.name && (e.name = t.configure.name);
	let n = e.system, r = typeof n == "object" && n ? n : {};
	e.system = r;
	for (let [e, n] of Object.entries(t.configure?.system ?? {})) at(r, e.replace(/^system\./, ""), w(n));
	return t.ranks !== void 0 && (t.type === "skill" || t.type === "talent") && at(r, "advances.value", t.ranks), e;
}
function st(e, t, n) {
	if (e.type !== n.type) return !1;
	let r = e.toObject(), i = n.configure?.name ?? t.name;
	if (r.name !== i) return !1;
	let a = r.system;
	if (typeof a != "object" || !a) return !1;
	for (let [e, t] of Object.entries(n.configure?.system ?? {})) {
		let n = e.replace(/^system\./, "");
		if (JSON.stringify(w(it(a, n))) !== JSON.stringify(w(t))) return !1;
	}
	return !(n.ranks !== void 0 && (n.type === "skill" || n.type === "talent") && Number(it(a, "advances.value")) !== n.ranks);
}
function ct(e, t) {
	let n = e.toObject()._stats;
	return typeof n != "object" || !n ? !1 : n.compendiumSource === t;
}
function T(t) {
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
function E(t) {
	let n = t.flags?.[e]?.mutationGrantOwners;
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function lt(t) {
	return t.flags?.[e]?.mutationGrantManaged === !0;
}
function ut(t) {
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
//#region src/functions/mutants-handbook/actions/constants.ts
var dt = [
	"w8zPEHooiAzTdLYu",
	"A7OLAWKXWUfh0UGU",
	"O6QDcWXjqBD1C8R6",
	"1YH1DgABwSXNaMI7",
	"rMh2lJZMML0W61MH",
	"oyDtC4mkFBxcCYju",
	"XheCM6GZG8FhAoGp",
	"0KO8587hDiF4PSCq",
	"tZZlX68I8HTDr3Db",
	"5KF01h4PSOrrABbf",
	"xpllKoAOD5X9C8Pi",
	"ihjcMhBrb24nwkhm",
	"sdXBHwy9bpRcLriW",
	"UOkDReH2uUWWAgrf",
	"NDDLEunW5biRvTfy",
	"q3sK3RsdsJxrifZP",
	"mNNavbJayRcsyeXJ"
], ft = ["b5xKInMaTt8ljJVQ"];
[...dt, ...ft];
//#endregion
//#region src/functions/mutants-handbook/actions/support-item-ids.ts
var D = {
	"acidic-saliva-spit": "FebzFfLAxgNhm7wr",
	"additional-head-control": "JewvTFlDyMLJBb2l",
	"beast-alpha-command": "1MfdvldnRNRjRQLf",
	"bloodsucker-feed": "76HnLBLuPBKS2EoZ",
	"bodysnatcher-drone-deploy": "UUvwkshI1hvD6qI6",
	"bloomblight-touch-heal": "2EZ7EBagV6uv1BzH",
	"burning-body-aura": "hluAuXdF352vkxBr",
	"chameleon-skin-camouflage": "MX6xt2WTzQHNJGCc",
	"contagious-madness-aura": "Ya0PZjQf230jkZ4f",
	"dimensional-instability-teleport": "MoKSSwRQMfv7EDTr",
	"ecstatic-milk-produce-dose": "40o7GdhDDB2FsP3I",
	"entrancement-beguile": "Vbsxzv776wXEnkvd",
	"ethereal-become-insubstantial": "5nSig5q0dPjZbOiy",
	"evil-eye-gaze": "kJSprf6VC0f7Wvei",
	"frostbite-touch": "BzRsJd1lFnACCLvE",
	"fleshcrafter-bonecraft": "35MrhPCM6yH0ceIj",
	"fleshcrafter-cosmetic": "NGvZAq54UMaTkB1C",
	"fleshcrafter-reshape": "cpoT2lHmQ3EHoqUh",
	"fleshcrafter-stop-bleeding": "pEJ8uaJssHy86Qol",
	"gnawer-gnaw": "GBTyHGDL44bKay3Q",
	"green-sovereign-command-plants": "Do7S8MvFzdg7SXnb",
	"green-sovereign-branch-strike": "p7fFRvr9MB2ILZnV",
	"green-sovereign-root-grapple": "UGCgLAnwlQX9muh7",
	"green-sovereign-strike-or-grapple": "2Chrquot50KfU3CN",
	"gut-worm-attack": "YpfKStGc61L8YHE2",
	"horrid-scream-unleash": "AVzEGfrXzDigJMlG",
	"hungering-maw-free-bite": "kmDWEJdBmG28nNgs",
	"hungering-maw-grapple": "OQ9m964Hb2utHF6d",
	"infernal-furnace-breath": "83rVtBBBLWeJvJNl",
	"infernal-furnace-critical-burst": "2ZHu2EdcoZUZAsAy",
	"infernal-furnace-death-explosion": "Yk3454zXQ7eAa9BS",
	"invisibility-vanish": "tNdEPnV5ZWTKAmUc",
	"levitation-rise": "eHZzMCNjhVk0c9Kx",
	"life-leech-touch": "QLbD612y8GsxzAlx",
	"life-leech-combat-touch": "SRJqfQmSB6XtrJ9Q",
	"mirror-image-disguise": "4gBZGA6253HIOVhs",
	"oracle-augury": "x4D4RF5FYU4cakr0",
	"oracle-foresight": "iT9boxhs6HcuCkeL",
	"phantasmal-mind-animate": "by1jszZB8rqOXxBu",
	"phantasmal-mind-illusion": "ELnT60LdqXvoPwyh",
	"piercing-tongue-attack": "26xuNz3nFbtESVJk",
	"pyrokinesis-blast": "4IABIUu3vFX912f0",
	"pyrokinesis-ignite": "LFtTluanEnKTgnrU",
	"razor-sharp-claws-attack": "pqkiTNQePUJVMwNH",
	"scrying-touch-psychometry": "ufxPg25r4pxHAJoc",
	"shapeshifter-assume-form": "dtpkQMEEb7ptR5O0",
	"shapeshifter-revert-form": "9OmpGEgdwvqakVkC",
	"skinwalker-assume-form": "tfZuhiTraftqUnEF",
	"skinwalker-revert-form": "RWJnvcJCcHC9yVAA",
	"spectral-companion-manifest": "ZyEHAcyOJZK9NNbf",
	"spelleater-gland-spend-sl": "bwc2MG1frBYRGzae",
	"swarmform-reform": "gLK2MGXqfHAeD6Jm",
	"swarmform-transform": "4zzOVfS16UTHD1fd",
	"symbiotic-twin-manifest": "ZyYYGoZePtEpR56N",
	"tail-mace-free-attack": "wiyTBt7rJhv3SSgJ",
	"tail-prehensile-free-attack": "ygmUvxH502mHLAgd",
	"tail-scorpion-free-attack": "yS52LEFz9wsKvCeU",
	"tantalising-aura": "Mi2Nxe9YZwyIeQqc",
	"telekinesis-hurl-weapon": "irW6FspLKIVVunSj",
	"telekinesis-hurl-projectile": "bjjhwfE1bs3F6jNl",
	"telekinesis-move-object": "O4HLCBWIBwAGz1qT",
	"telepathy-project-thoughts": "UlUAKp147NaJFmwR",
	"telepathy-read-thoughts": "eo0COW83jsIN7lxD",
	"temporal-instability-surge": "rWKJa2FcsqQ4ygI4",
	"thorns-launch": "PeoiDXzx5HEAL4Tq",
	"thorns-unarmed": "eFGzLQJMLrQCqw6e",
	"thunderhead-lightning-bolt": "KIaxtPoGuEqxDOoi",
	"thunderhead-combat-touch": "XR4N1wln3vnJQjCU",
	"thunderhead-shock": "ptfZukLxHg6K5c1C",
	"wind-caller-breeze": "EjCDzlyidhCuuaKg",
	"wind-caller-gust": "OdGQUMwOrpNwrfNn",
	"vestigial-twin-manifest": "6QEdptsyoC5WAZcW",
	"warp-spasm-end": "rbdiWJcE1Zs8Wv6W",
	"warp-spasm-transform": "pGEJ3HWTAozRcuZr",
	"werebeast-revert": "hDsSaNDAoQdi4pYy",
	"werebeast-transform": "j4XrtvCyx7fKQYfu"
}, pt = [
	{
		actionType: "attack",
		conditions: ["Spitting, drooling acid onto objects, and consuming unusual materials share this TB-per-day allowance.", "Glass and gold are not damaged by the acid."],
		duration: "Immediate",
		id: "acidic-saliva-spit",
		implementation: "support",
		itemId: D["acidic-saliva-spit"],
		mutationId: "NvnDw82FSvjCpsxz",
		mutationName: "Acidic Saliva",
		name: "Spit Acid",
		outcome: "On a successful Ballistic Skill Test, the spit deals 5 + SL Damage.",
		range: "SB + TB yards",
		rules: "Use the normal ranged-combat rules. The acid can also melt most unattended materials.",
		target: "creature-or-object",
		test: {
			SL: !0,
			attackType: "ranged",
			characteristic: "bs",
			damage: !0,
			difficulty: "challenging",
			specification: "+5"
		},
		usage: {
			max: "tb",
			period: "day"
		}
	},
	{
		actionType: "control",
		conditions: ["The target must be an animal or a bestial creature with Intelligence 15 or lower and must hear the mutant.", "Domestic or Broken animals receive +20; monsters receive -20."],
		duration: "GM-determined",
		id: "beast-alpha-command",
		implementation: "support",
		itemId: D["beast-alpha-command"],
		mutationId: "IAojmuCNEt6z9EwB",
		mutationName: "Beast Alpha",
		name: "Command Beast",
		outcome: "A won Opposed Willpower Test makes the beast follow a simple conveyed intent.",
		range: "Hearing range",
		rules: "Commands convey intent, such as attack, flee, or calm down, rather than complex instructions.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "healing",
		conditions: ["Resolve the Fangs or Piercing Tongue attack before applying this rider."],
		duration: "Immediate",
		id: "bloodsucker-feed",
		implementation: "support",
		itemId: D["bloodsucker-feed"],
		mutationId: "tBOg8CYxOPXLBUMF",
		mutationName: "Bloodsucker",
		name: "Feed on Blood",
		outcome: "Heal as many Wounds as the bitten opponent loses.",
		range: "Touch",
		rules: "One Wound worth of blood can replace a meal. This action is a rider on the linked bite or tongue attack.",
		target: "single"
	},
	{
		actionType: "healing",
		conditions: ["The target must then pass a Challenging (+0) Endurance Test or gain a randomly rolled symptom for 1d10 days."],
		duration: "Immediate healing; symptom lasts 1d10 days",
		id: "bloomblight-touch-heal",
		implementation: "support",
		itemId: D["bloomblight-touch-heal"],
		mutationId: "Rpt4fqmrRuoN0Wz0",
		mutationName: "Bloomblight Touch",
		name: "Bloomblight Healing Touch",
		outcome: "On success, heal the living target for Fellowship + SL Wounds.",
		range: "Touch",
		rules: "A failed target Endurance Test causes Buboes, Fever, Flux, Nausea, or Pox as rolled on the mutation table.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "corrosive-vomit-attack",
		implementation: "native",
		mutationId: "vesyHqLaA7yKb4Ca",
		mutationName: "Corrosive Vomit",
		name: "Vomit",
		outcome: "Resolve the owned Vomit (TB +4) Creature Trait attack.",
		range: "As the owned Vomit Creature Trait",
		rules: "Each additional mutation level increases the configured attack Damage by 1.",
		target: "area"
	},
	{
		actionType: "movement",
		conditions: [
			"The destination must be in line of sight.",
			"Each additional use before an eight-hour rest worsens Difficulty by one step.",
			"The mutant may carry one physically touching passenger per SL; each passenger worsens Difficulty by one step."
		],
		duration: "Immediate",
		id: "dimensional-instability-teleport",
		implementation: "support",
		itemId: D["dimensional-instability-teleport"],
		miscast: "minor",
		mutationId: "w8zPEHooiAzTdLYu",
		mutationName: "Dimensional Instability",
		name: "Teleport",
		outcome: "On success, teleport as the mutant's Movement.",
		range: "WP yards",
		rules: "Difficulty progression resets after eight hours of rest.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "resource",
		conditions: ["The mutant is immune to their own milk.", "A consumer must pass the source's Easy (+20) Endurance Test or gain Addiction (Enthralling Milk)."],
		duration: "4 hours per dose; only duration stacks",
		id: "ecstatic-milk-produce-dose",
		implementation: "support",
		itemId: D["ecstatic-milk-produce-dose"],
		mutationId: "u5uyIhwDYnXOFOTY",
		mutationName: "Ecstatic Milk",
		name: "Produce Ecstatic Milk",
		outcome: "Produce a dose that grants Acute Sense (All), +1 Movement, +10 Agility, and +10 Initiative, followed by 1 Fatigued per dose.",
		range: "Self",
		rules: "The consumer craves vivid sensory stimulus while affected; apply the addiction Test and delayed Fatigued manually.",
		target: "none",
		usage: {
			max: "tb",
			period: "day"
		}
	},
	{
		actionType: "attack",
		duration: "Until the Entangled effect is removed",
		id: "ensnaring-tongue-attack",
		implementation: "native",
		mutationId: "KCWuur9cvnmekn72",
		mutationName: "Ensnaring Tongue",
		name: "Tongue Attack",
		outcome: "Resolve the owned Tongue Attack Creature Trait and Entangle the target on a successful hit.",
		range: "TB x 2 yards",
		rules: "The tongue can sustain TB Wounds before severing and regrows one inch per week; those consequences remain manual.",
		target: "single"
	},
	{
		actionType: "control",
		conditions: [
			"The target must be living.",
			"At most WPB people may be entranced at once.",
			"A Critical Success makes the target conspicuously eager or lovesick."
		],
		duration: "WPB + SL hours",
		id: "entrancement-beguile",
		implementation: "support",
		itemId: D["entrancement-beguile"],
		mutationId: "3K649FcYKM9vmAPo",
		mutationName: "Entrancement",
		name: "Entrancement",
		outcome: "Winning an Opposed Willpower Test makes the target eager to please and grants +20 to the mutant's social interactions with them.",
		range: "Source does not specify a range",
		rules: "The target retains self-preservation and does not follow commands mindlessly.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "control",
		conditions: ["The mutant must be able to look at the target."],
		duration: "Conditions persist normally",
		id: "evil-eye-gaze",
		implementation: "support",
		itemId: D["evil-eye-gaze"],
		mutationId: "bgKHmWGNH4jxzOhC",
		mutationName: "Evil Eye",
		name: "Inflict Crippling Pain",
		outcome: "Win an Opposed Willpower Test to give the target 1 Fatigued; they then test Hard (-20) Endurance or become Prone. On failure, the mutant gains 1 Stunned.",
		range: "Sight",
		rules: "Resolve the target's Endurance Test and all resulting Conditions from the original Test card.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "fangs-bite",
		implementation: "native",
		mutationId: "21yzNwQwaqNEJ86D",
		mutationName: "Fangs",
		name: "Bite",
		outcome: "Resolve the owned Bite (SB +3) Creature Trait attack.",
		range: "Melee",
		rules: "The configured Bite gains +1 Damage for each additional mutation level and may carry the retained Venom result.",
		target: "single"
	},
	{
		actionType: "skill",
		conditions: ["Fleshcraft cannot be used in combat and usually takes several minutes or hours."],
		duration: "Permanent until altered again",
		id: "fleshcrafter-cosmetic",
		implementation: "support",
		itemId: D["fleshcrafter-cosmetic"],
		mutationId: "bnvOpEm16kCdb9oh",
		mutationName: "Fleshcrafter",
		name: "Cosmetic Fleshcraft",
		outcome: "Make cosmetic changes to flesh and appearance.",
		range: "Touch",
		rules: "The GM sets accumulated successes for disguises, Fellowship changes, or Attractive; Critical failures create a negative result.",
		target: "single",
		test: {
			difficulty: "challenging",
			skill: "trade-fleshcraft"
		}
	},
	{
		actionType: "skill",
		conditions: ["Fleshcraft cannot be used in combat and usually takes several minutes or hours."],
		duration: "Permanent until altered again",
		id: "fleshcrafter-reshape",
		implementation: "support",
		itemId: D["fleshcrafter-reshape"],
		mutationId: "bnvOpEm16kCdb9oh",
		mutationName: "Fleshcrafter",
		name: "Drastic Fleshcraft",
		outcome: "Trade 1 point between physical Characteristics per SL, subject to GM approval.",
		range: "Touch",
		rules: "The GM may instead permit Charm, Intimidation, or Fear changes; Critical failures create a negative result.",
		target: "single",
		test: {
			difficulty: "difficult",
			skill: "trade-fleshcraft"
		}
	},
	{
		actionType: "skill",
		conditions: ["Fleshcraft cannot be used in combat and usually takes several minutes or hours."],
		duration: "Permanent until altered again",
		id: "fleshcrafter-bonecraft",
		implementation: "support",
		itemId: D["fleshcrafter-bonecraft"],
		mutationId: "bnvOpEm16kCdb9oh",
		mutationName: "Fleshcrafter",
		name: "Bonecraft",
		outcome: "Alter stature within species Size limits, create bone protrusions, or craft a bone object.",
		range: "Touch",
		rules: "The GM adjudicates the exact alteration; Critical failures create a negative result.",
		target: "creature-or-object",
		test: {
			difficulty: "hard",
			skill: "trade-fleshcraft"
		}
	},
	{
		actionType: "healing",
		conditions: ["Fleshcraft cannot be used in combat and usually takes several minutes or hours."],
		duration: "Immediate",
		id: "fleshcrafter-stop-bleeding",
		implementation: "support",
		itemId: D["fleshcrafter-stop-bleeding"],
		mutationId: "bnvOpEm16kCdb9oh",
		mutationName: "Fleshcrafter",
		name: "Fleshcraft Bleeding",
		outcome: "Remove 1 Bleeding Condition per SL.",
		range: "Touch",
		rules: "Critical failures create a negative result chosen by the GM.",
		target: "single",
		test: {
			difficulty: "challenging",
			skill: "trade-fleshcraft"
		}
	},
	{
		actionType: "control",
		conditions: ["The touched target makes the Challenging (+0) Endurance Test; the mutant does not roll."],
		duration: "Stunned persists normally",
		id: "frostbite-touch",
		implementation: "support",
		itemId: D["frostbite-touch"],
		mutationId: "nToBQW3xOzVt9WhX",
		mutationName: "Frostbite",
		name: "Freezing Touch",
		outcome: "The target gains Stunned unless they pass a Challenging (+0) Endurance Test.",
		range: "Touch",
		rules: "A given target can be stunned by this mutation only once per scene.",
		target: "single",
		usage: {
			max: 1,
			perTarget: !0,
			period: "scene"
		}
	}
], mt = [
	{
		actionType: "utility",
		conditions: ["The skin normally adapts to the surroundings automatically.", "Passing for an unmutated person instead requires the source's Average (+20) Cool Test to resist adapting for the scene."],
		duration: "One scene or until the surroundings materially change",
		id: "chameleon-skin-camouflage",
		implementation: "support",
		itemId: D["chameleon-skin-camouflage"],
		mutationId: "mEaGI63MtfCQ9KS7",
		mutationName: "Chameleon Skin",
		name: "Use Chameleon Camouflage",
		outcome: "Gain +20 Stealth while the skin matches the surroundings.",
		range: "Self",
		rules: "The conditional Stealth modifier and scene state remain player/GM guidance; this action records the deliberate use of camouflage.",
		target: "self"
	},
	{
		actionType: "utility",
		conditions: ["The mutant must have stored SL in the Spelleater Gland.", "Reactive capture of spell SL and its one-round expiry are Phase 4 mechanics and remain manual."],
		duration: "Applied to one spell as it is cast",
		id: "spelleater-gland-spend-sl",
		implementation: "support",
		itemId: D["spelleater-gland-spend-sl"],
		mutationId: "OTBdbPb9D9yfSFrm",
		mutationName: "Spelleater Gland",
		name: "Spend Stored Spell Energy",
		outcome: "Reduce the cast spell's CN by 1 for each stored SL spent.",
		range: "Self",
		rules: "Choose how many stored SL to consume before resolving the spell; do not spend more SL than the gland currently stores.",
		target: "self"
	},
	{
		actionType: "utility",
		conditions: ["Only Magical attacks can harm the mutant while Ethereal.", "Becoming solid with a limb inside an object destroys it; becoming solid with the body or head trapped is fatal."],
		duration: "WPB + SL rounds",
		id: "ethereal-become-insubstantial",
		implementation: "support",
		itemId: D["ethereal-become-insubstantial"],
		miscast: "minor",
		mutationId: "A7OLAWKXWUfh0UGU",
		mutationName: "Ethereal",
		name: "Become Ethereal",
		outcome: "On success, gain the Ethereal Creature Trait and become insubstantial for the duration.",
		range: "Self",
		rules: "Applying the temporary Trait, round countdown, and trapped-body consequences remain guidance until Phase 5 form support.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "utility",
		conditions: ["The invisibility ends when the mutant draws attention by attacking or making a large noise.", "A viewer with Second Sight may make a Challenging (+0) Perception Test to notice the mutant nearby."],
		duration: "WP + SL rounds; double duration for each additional mutation level",
		id: "invisibility-vanish",
		implementation: "support",
		itemId: D["invisibility-vanish"],
		miscast: "minor",
		mutationId: "1YH1DgABwSXNaMI7",
		mutationName: "Invisibility",
		name: "Become Invisible",
		outcome: "On success, remain concealed from everyone without Second Sight.",
		range: "Self",
		rules: "Applying concealment, ending it early, and counting rounds remain guidance until Phase 5 form support.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "utility",
		duration: "One scene",
		id: "oracle-foresight",
		implementation: "support",
		itemId: D["oracle-foresight"],
		miscast: "minor",
		mutationId: "0KO8587hDiF4PSCq",
		mutationName: "Oracle",
		name: "Moment-to-Moment Foresight",
		outcome: "On success, gain +10 Initiative and +1 Fortune per mutation level for the scene.",
		range: "Self",
		rules: "Applying and clearing the scene-long bonuses remains guidance until timed effects are implemented.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "utility",
		duration: "GM-determined",
		id: "wind-caller-breeze",
		implementation: "support",
		itemId: D["wind-caller-breeze"],
		miscast: "minor",
		mutationId: "UOkDReH2uUWWAgrf",
		mutationName: "Wind Caller",
		name: "Call a Breeze",
		outcome: "On success, make the wind blow slightly more or less within range.",
		range: "WP yards",
		rules: "This covers small wind effects; use the separate gust action for forceful feats.",
		target: "area",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "attack",
		conditions: ["Use this wrapper only when spending Advantage to make the Maw attack as a Free Action."],
		duration: "Immediate",
		id: "hungering-maw-free-bite",
		implementation: "support",
		itemId: D["hungering-maw-free-bite"],
		mutationId: "kMq1tiXJG6Pyp0nc",
		mutationName: "Hungering Maw",
		name: "Maw Free Bite",
		outcome: "Resolve a Bite attack dealing SB + 5 + SL Damage.",
		range: "Melee",
		rules: "Spend 1 Advantage before making the Melee (Brawling) attack; use the owned Bite normally for a primary Action.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "s",
			damage: !0,
			difficulty: "challenging",
			skill: "melee-brawling",
			specification: "+5"
		},
		usage: { advantageCost: 1 }
	},
	{
		actionType: "attack",
		conditions: ["The retained Tail result must be Saurian Tail."],
		duration: "Immediate",
		id: "tail-saurian-attack",
		implementation: "native",
		mutationId: "bSVbWpX8AcBSIyTU",
		mutationName: "Tail",
		name: "Saurian Tail Attack",
		outcome: "Resolve the owned Tail Attack (SB +2) Creature Trait.",
		range: "Melee",
		rules: "The source does not grant the Saurian Tail a separate Advantage-funded Free Action.",
		target: "single"
	},
	{
		actionType: "control",
		conditions: ["Use WPB instead of SB for forceful feats.", "Stunning an opponent requires an Opposed Test."],
		duration: "Immediate or the chosen Extended Test",
		id: "wind-caller-gust",
		implementation: "support",
		itemId: D["wind-caller-gust"],
		miscast: "minor",
		mutationId: "UOkDReH2uUWWAgrf",
		mutationName: "Wind Caller",
		name: "Call a Gust",
		outcome: "Create a gust to fill a sail, clear small debris, topple an object, or attempt to Stun an opponent.",
		range: "Source does not specify a range",
		rules: "The power may be performed as an Extended Test; resolve object resistance or the target's opposed Test manually.",
		target: "creature-or-object",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	}
], ht = [
	{
		actionType: "attack",
		conditions: ["First succeed at the separate Green Sovereign power Test.", "Branches count as Improvised Weapons."],
		duration: "Immediate",
		id: "green-sovereign-branch-strike",
		implementation: "support",
		itemId: D["green-sovereign-branch-strike"],
		mutationId: "O6QDcWXjqBD1C8R6",
		mutationName: "Green Sovereign",
		name: "Branch Strike",
		outcome: "Strike using WPB instead of SB, with normal Improvised Weapon rules.",
		qualities: ["undamaging"],
		range: "WP yards",
		rules: "This is the required Weapon Skill Test after the power Test succeeds.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "wp",
			characteristic: "ws",
			damage: !0,
			difficulty: "challenging",
			specification: "+1"
		}
	},
	{
		actionType: "control",
		conditions: ["First succeed at the separate Green Sovereign power Test."],
		duration: "Normal grapple duration",
		id: "green-sovereign-root-grapple",
		implementation: "support",
		itemId: D["green-sovereign-root-grapple"],
		mutationId: "O6QDcWXjqBD1C8R6",
		mutationName: "Green Sovereign",
		name: "Root and Vine Grapple",
		outcome: "Resolve the grapple using WPB instead of SB for feats of force.",
		range: "WP yards",
		rules: "This is the required Weapon Skill Test after the power Test succeeds.",
		target: "single",
		test: {
			characteristic: "ws",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		conditions: ["First succeed at the separate Telekinesis power Test.", "Choose a throwing weapon or comparable projectile such as a knife or rock."],
		duration: "Immediate",
		id: "telekinesis-hurl-projectile",
		implementation: "support",
		itemId: D["telekinesis-hurl-projectile"],
		mutationId: "xpllKoAOD5X9C8Pi",
		mutationName: "Telekinesis",
		name: "Hurl Telekinetic Projectile",
		outcome: "Resolve the projectile's Damage and Qualities using WPB instead of SB.",
		range: "The selected throwing weapon's range",
		rules: "This is the required Ballistic Skill Test after the power Test succeeds.",
		target: "single",
		test: {
			characteristic: "bs",
			difficulty: "challenging"
		}
	},
	{
		actionType: "control",
		conditions: ["Use this combat touch Test before Leech Life; do not roll normal damage."],
		duration: "Immediate",
		id: "life-leech-combat-touch",
		implementation: "support",
		itemId: D["life-leech-combat-touch"],
		mutationId: "oyDtC4mkFBxcCYju",
		mutationName: "Life Leech",
		name: "Combat Touch",
		outcome: "Win the Opposed Test to touch the target, then use the Leech Life action.",
		range: "Touch",
		rules: "Outside combat, the source does not require this preliminary Test.",
		target: "single",
		test: {
			difficulty: "challenging",
			skill: "melee-brawling"
		}
	},
	{
		actionType: "control",
		conditions: ["Use this combat touch Test before Electric Touch."],
		duration: "Immediate",
		id: "thunderhead-combat-touch",
		implementation: "support",
		itemId: D["thunderhead-combat-touch"],
		mutationId: "sdXBHwy9bpRcLriW",
		mutationName: "Thunderhead",
		name: "Combat Touch",
		outcome: "Win the Melee (Brawling) Test to touch the target, then use Electric Touch.",
		range: "Touch",
		rules: "Outside combat, the source does not require this preliminary Test.",
		target: "single",
		test: {
			difficulty: "challenging",
			skill: "melee-brawling"
		}
	}
], gt = [
	{
		actionType: "control",
		duration: "Immediate",
		id: "gnawer-bite",
		implementation: "native",
		mutationId: "NSczK3KBMIJztNFL",
		mutationName: "Gnawer",
		name: "Bite",
		outcome: "Resolve the owned Bite (SB +1) Creature Trait attack.",
		range: "Melee",
		rules: "Ordinary bites use the native Creature Trait; the special gnawing action is catalogued separately.",
		target: "single"
	},
	{
		actionType: "utility",
		conditions: ["The target must be organic material such as wood or leather, and the mutant must be able to gnaw rather than merely bite it."],
		duration: "Measured per turn of sustained gnawing",
		id: "gnawer-gnaw",
		implementation: "support",
		itemId: D["gnawer-gnaw"],
		mutationId: "NSczK3KBMIJztNFL",
		mutationName: "Gnawer",
		name: "Gnaw Organic Material",
		outcome: "Deal twice the normal damage per turn to the organic material.",
		range: "Touch",
		rules: "This is sustained structural damage, not the ordinary Bite attack.",
		target: "object"
	},
	{
		actionType: "utility",
		conditions: ["Only vegetation and plants can be commanded."],
		duration: "GM-determined",
		id: "green-sovereign-command-plants",
		implementation: "support",
		itemId: D["green-sovereign-command-plants"],
		miscast: "minor",
		mutationId: "O6QDcWXjqBD1C8R6",
		mutationName: "Green Sovereign",
		name: "Command Plants",
		outcome: "On success, make plants perform a small non-combat feat such as shedding leaves, ripening fruit, or rattling branches.",
		range: "WP yards",
		rules: "The power controls existing vegetation; the GM adjudicates comparable small effects.",
		target: "area",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "attack",
		conditions: ["The source requires both the Challenging (+0) Willpower Test and a Weapon Skill Test.", "Choose either an Improvised Weapon branch strike or a grapple using roots and vines."],
		duration: "Immediate strike or normal grapple duration",
		id: "green-sovereign-strike-or-grapple",
		implementation: "support",
		itemId: D["green-sovereign-strike-or-grapple"],
		miscast: "minor",
		mutationId: "O6QDcWXjqBD1C8R6",
		mutationName: "Green Sovereign",
		name: "Plant Strike or Grapple",
		outcome: "On success, proceed to the provided branch-strike or root-grapple Test.",
		range: "WP yards",
		rules: "This is the power Test; roll the separate Weapon Skill action after it succeeds.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		conditions: ["The target must be engaged with the mutant in melee.", "A shield can block this attack as though it were a projectile."],
		duration: "Immediate",
		id: "gut-worm-attack",
		implementation: "support",
		itemId: D["gut-worm-attack"],
		mutationId: "sfoURj3eoxtUYRFf",
		mutationName: "Gut Worm",
		name: "Gut Worm Free Attack",
		outcome: "On success, the worm deals SB + 1 + SL Damage.",
		range: "Engaged target",
		rules: "Spend 1 Advantage before rolling the Ballistic Skill attack as a Free Action.",
		target: "single",
		test: {
			SL: !0,
			attackType: "ranged",
			bonusCharacteristic: "s",
			characteristic: "bs",
			damage: !0,
			difficulty: "challenging",
			specification: "+1"
		},
		usage: { advantageCost: 1 }
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "horns-attack",
		implementation: "native",
		mutationId: "0KJD1mq4myyF3ghQ",
		mutationName: "Horns",
		name: "Horns",
		outcome: "Resolve the owned Horns (SB +3) Creature Trait attack.",
		range: "Melee",
		rules: "Each additional mutation level increases the configured attack Damage by 1.",
		target: "single"
	},
	{
		actionType: "control",
		conditions: ["Each affected creature gains 1 Deafened and must pass Challenging (+0) Cool or gain Fear 1.", "A creature with Skittish gains 3 Broken instead."],
		duration: "Conditions persist normally",
		id: "horrid-scream-unleash",
		implementation: "support",
		itemId: D["horrid-scream-unleash"],
		mutationId: "zwl6VTWh854Bvheu",
		mutationName: "Horrid Scream",
		name: "Unleash Horrid Scream",
		outcome: "Affect every eligible creature in range with Deafened and the mutation's fear response.",
		range: "WP yards",
		rules: "This costs an Action. Each affected creature resolves its own Cool Test.",
		target: "area"
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "hungering-maw-bite",
		implementation: "native",
		mutationId: "kMq1tiXJG6Pyp0nc",
		mutationName: "Hungering Maw",
		name: "Maw Bite",
		outcome: "Resolve the owned Bite (SB +5) Creature Trait attack.",
		range: "Melee",
		rules: "The Bite can be used as the primary attack normally; the mutation also permits a 1-Advantage Free Action.",
		target: "single"
	},
	{
		actionType: "control",
		conditions: ["Choose this instead of inflicting Bite damage."],
		duration: "Normal grapple duration",
		id: "hungering-maw-grapple",
		implementation: "support",
		itemId: D["hungering-maw-grapple"],
		mutationId: "kMq1tiXJG6Pyp0nc",
		mutationName: "Hungering Maw",
		name: "Maw Free Grapple",
		outcome: "Make an Opposed Melee (Brawling) Test to grapple the target with the maw.",
		range: "Melee",
		rules: "Spend 1 Advantage to use the maw as a Free Action; use the ordinary primary action when no Advantage is spent.",
		target: "single",
		test: {
			difficulty: "challenging",
			skill: "melee-brawling"
		},
		usage: { advantageCost: 1 }
	},
	{
		actionType: "attack",
		conditions: ["The Fire and Cold Immunity grants are separate from this action."],
		duration: "Immediate",
		id: "infernal-furnace-breath",
		implementation: "support",
		itemId: D["infernal-furnace-breath"],
		mutationId: "IUBfAizppAlcAgWL",
		mutationName: "Infernal Furnace",
		name: "Infernal Breath",
		outcome: "Resolve a Breath (TB x2, Fire) Creature Trait attack.",
		range: "As Breath (TB x2, Fire)",
		rules: "Illumination, body-Critical Ablaze bursts, and the death explosion are reactive Phase 4 rules and are not part of this action.",
		target: "area",
		test: {
			SL: !0,
			attackType: "ranged",
			bonusCharacteristic: "t",
			bonusMultiplier: 2,
			characteristic: "t",
			damage: !0,
			difficulty: "challenging",
			specification: "x2, Fire"
		}
	},
	{
		actionType: "movement",
		duration: "WPB + SL rounds; double duration for each additional mutation level",
		id: "levitation-rise",
		implementation: "support",
		itemId: D["levitation-rise"],
		miscast: "minor",
		mutationId: "rMh2lJZMML0W61MH",
		mutationName: "Levitation",
		name: "Levitate",
		outcome: "On success, gain Flight with a rating equal to 30 times the mutation level.",
		range: "Self",
		rules: "The temporary Flight effect and its round countdown remain guidance until timed effects are implemented.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		conditions: ["In combat, first win an Opposed Melee (Brawling) Test to touch the target; do not roll normal Brawling damage.", "The target may be a living creature or organic material such as plant matter, leather, or cloth."],
		duration: "Immediate",
		id: "life-leech-touch",
		implementation: "support",
		itemId: D["life-leech-touch"],
		miscast: "minor",
		mutationId: "oyDtC4mkFBxcCYju",
		mutationName: "Life Leech",
		name: "Leech Life",
		outcome: "Deal SL Damage ignoring Armour to creatures, or reduce an object's AP by SL, then heal the same amount.",
		range: "Touch",
		rules: "Toughness still protects creatures. Add 1 Damage per additional mutation level; each Damage may instead count as one good meal.",
		target: "creature-or-object",
		test: {
			SL: !0,
			attackType: "melee",
			characteristic: "wp",
			damage: !0,
			difficulty: "challenging",
			specification: "+0"
		}
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "long-spines-attack",
		implementation: "native",
		mutationId: "xplswIRGiyIn5L6X",
		mutationName: "Long Spines",
		name: "Ram with Spines",
		outcome: "Resolve the owned Horns (SB +1), named for the spines, as a melee attack.",
		range: "Melee",
		rules: "Retained upgrades may add Venom, retractability, or +1 Damage.",
		target: "single"
	},
	{
		actionType: "utility",
		conditions: ["The mutant must be familiar with the imitated person.", "The imitated person must be no more than one Size step smaller or larger."],
		duration: "WP + (SL x 10) minutes; double duration for each additional mutation level",
		id: "mirror-image-disguise",
		implementation: "support",
		itemId: D["mirror-image-disguise"],
		miscast: "minor",
		mutationId: "XheCM6GZG8FhAoGp",
		mutationName: "Mirror Image",
		name: "Assume a Mirror Image",
		outcome: "On success, assume the target person's face, stature, clothing, and voice.",
		range: "Self",
		rules: "Those without Second Sight are fooled automatically; Second Sight permits Perception, but dispelling is required to see through it.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "skill",
		duration: "As the Augury Skill",
		id: "oracle-augury",
		implementation: "support",
		itemId: D["oracle-augury"],
		miscast: "minor",
		mutationId: "0KO8587hDiF4PSCq",
		mutationName: "Oracle",
		name: "Augury",
		outcome: "Resolve the owned Augury Skill using its Winds of Magic rules.",
		range: "As the Augury Skill",
		rules: "The mutation grants 10 Augury Advances per level and permits one use per day.",
		target: "none",
		test: {
			difficulty: "challenging",
			skill: "augury"
		},
		usage: {
			max: 1,
			period: "day"
		}
	}
], _t = [
	{
		actionType: "control",
		duration: "As the owned Creature Trait",
		id: "petrifying-gaze",
		implementation: "native",
		mutationId: "91fvvDsNtm8bfqOM",
		mutationName: "Petrifying Gaze",
		name: "Petrifying Gaze",
		outcome: "Resolve the owned Petrifying Gaze Creature Trait.",
		range: "As the owned Petrifying Gaze Creature Trait",
		rules: "The Core Creature Trait supplies its Test and degree-based effects.",
		target: "single"
	},
	{
		actionType: "utility",
		conditions: ["The illusion is static unless animated with the separate action.", "A viewer with Second Sight may make a Difficult (-10) Perception Test, but must dispel the illusion to see through it."],
		duration: "WP + (SL x 10) minutes",
		id: "phantasmal-mind-illusion",
		implementation: "support",
		itemId: D["phantasmal-mind-illusion"],
		miscast: "minor",
		mutationId: "tZZlX68I8HTDr3Db",
		mutationName: "Phantasmal Mind",
		name: "Create Phantasmal Image",
		outcome: "On success, create a static illusionary image chosen by the mutant.",
		range: "Source does not specify the area's range",
		rules: "Viewers without Second Sight are fooled automatically; people outside the chosen area do not see it.",
		target: "area",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "utility",
		conditions: ["A Phantasmal Mind illusion must already be active."],
		duration: "One round",
		id: "phantasmal-mind-animate",
		implementation: "support",
		itemId: D["phantasmal-mind-animate"],
		mutationId: "tZZlX68I8HTDr3Db",
		mutationName: "Phantasmal Mind",
		name: "Animate Phantasmal Image",
		outcome: "On success, animate the otherwise static illusion during the round.",
		range: "The active illusion's area",
		rules: "This action does not extend the illusion's original duration.",
		target: "area",
		test: {
			characteristic: "wp",
			difficulty: "hard"
		}
	},
	{
		actionType: "attack",
		conditions: ["Apply the retained Venom (Average) result when present.", "With Bloodsucker, lodging, ongoing Wounds, severing, and regrowth remain manual reactive or timed rules."],
		duration: "Immediate",
		id: "piercing-tongue-attack",
		implementation: "support",
		itemId: D["piercing-tongue-attack"],
		mutationId: "uAYtIoGnhuRpIjs9",
		mutationName: "Piercing Tongue",
		name: "Piercing Tongue",
		outcome: "On a successful Ballistic Skill Test, deal SB + SL Damage with the Precise Quality.",
		qualities: ["precise"],
		range: "4 yards",
		rules: "The tongue itself can sustain 2 Wounds and regrows two inches per week if severed.",
		target: "single",
		test: {
			SL: !0,
			attackType: "ranged",
			bonusCharacteristic: "s",
			characteristic: "bs",
			damage: !0,
			difficulty: "challenging",
			specification: "+0"
		}
	},
	{
		actionType: "attack",
		duration: "Immediate",
		id: "pincer-claw-attack",
		implementation: "native",
		mutationId: "Sak78tbYEARrf7RD",
		mutationName: "Pincer Claw",
		name: "Pincer Claw",
		outcome: "Resolve the owned Weapon (SB +4) Creature Trait attack.",
		range: "Melee",
		rules: "The separately owned Constrictor Trait governs constriction; the claw cannot wield items or use Dexterity Skills.",
		target: "single"
	},
	{
		actionType: "utility",
		conditions: ["Setting a creature Ablaze requires flammable clothing or fur."],
		duration: "Immediate ignition; Ablaze persists normally",
		id: "pyrokinesis-ignite",
		implementation: "support",
		itemId: D["pyrokinesis-ignite"],
		miscast: "minor",
		mutationId: "5KF01h4PSOrrABbf",
		mutationName: "Pyrokinesis",
		name: "Ignite",
		outcome: "On success, light a torch or campfire, or set an eligible target Ablaze.",
		range: "WP yards",
		rules: "The action increases heat until something suitable catches fire; the GM confirms whether a target is flammable.",
		target: "creature-or-object",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "attack",
		conditions: ["Each creature in the area makes an Average (+20) Endurance Test or gains 1 Ablaze.", "Toughness and Armour protect against the blast's Damage normally."],
		duration: "Immediate; Ablaze persists normally",
		id: "pyrokinesis-blast",
		implementation: "support",
		itemId: D["pyrokinesis-blast"],
		miscast: "minor",
		mutationId: "5KF01h4PSOrrABbf",
		mutationName: "Pyrokinesis",
		name: "Fire Blast",
		outcome: "On success, deal WPB + SL Damage throughout the area.",
		range: "WPB-yard area",
		rules: "Resolve Damage and each target's Endurance Test from the original action card.",
		target: "area",
		test: {
			SL: !0,
			attackType: "ranged",
			bonusCharacteristic: "wp",
			characteristic: "wp",
			damage: !0,
			difficulty: "challenging",
			specification: "+0"
		}
	},
	{
		actionType: "attack",
		conditions: ["The mutation requires at least one clawless hand when acquired."],
		duration: "Immediate",
		id: "razor-sharp-claws-attack",
		implementation: "support",
		itemId: D["razor-sharp-claws-attack"],
		mutationId: "5KLgj76uWOvi1Hx0",
		mutationName: "Razor-sharp Claws",
		name: "Razor-sharp Claws",
		outcome: "Resolve an unarmed attack with the Damaging Quality.",
		qualities: ["damaging"],
		range: "Melee",
		rules: "Retained acquisition determines whether the claws are retractable; that property does not change the attack.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "s",
			characteristic: "ws",
			damage: !0,
			difficulty: "challenging",
			specification: "+0"
		}
	},
	{
		actionType: "skill",
		conditions: ["The mutant must touch the person or object being read."],
		duration: "As the Psychometry Skill",
		id: "scrying-touch-psychometry",
		implementation: "support",
		itemId: D["scrying-touch-psychometry"],
		mutationId: "EcZopIPOTXZofeHh",
		mutationName: "Scrying Touch",
		name: "Psychometry",
		outcome: "Resolve the owned Psychometry Skill using its Winds of Magic rules.",
		range: "Touch",
		rules: "The mutation grants 10 Psychometry Advances per level. The glove/Fatigued rule is conditional Phase 4 guidance.",
		target: "creature-or-object",
		test: {
			difficulty: "challenging",
			skill: "psychometry"
		}
	},
	{
		actionType: "attack",
		duration: "As the owned Web Creature Trait",
		id: "spiderkin-web",
		implementation: "native",
		mutationId: "rmqh8BM8Bsa2pK8S",
		mutationName: "Spiderkin",
		name: "Web",
		outcome: "Resolve the owned Web (T) Creature Trait attack.",
		range: "SB x 3 yards",
		rules: "The Core Web Creature Trait supplies its Test and entangling effects.",
		target: "single"
	}
], vt = [
	{
		actionType: "control",
		conditions: ["Target every creature currently engaged with the mutant."],
		duration: "Resolve at the end of each Round",
		id: "burning-body-aura",
		implementation: "support",
		itemId: D["burning-body-aura"],
		mutationId: "jTQNDgvjHRM2s357",
		mutationName: "Burning Body",
		name: "Resolve Burning Aura",
		outcome: "Each target tests Challenging Endurance or gains 1 Ablaze.",
		range: "Engaged creatures",
		rules: "Select the engaged creatures, then apply the outcome from this card.",
		target: "multiple"
	},
	{
		actionType: "control",
		conditions: ["Target sentient creatures in range that are not already affected this Round."],
		duration: "One Round",
		id: "contagious-madness-aura",
		implementation: "support",
		itemId: D["contagious-madness-aura"],
		mutationId: "1TCTKzF5nkk90k4A",
		mutationName: "Contagious Madness",
		name: "Resolve Contagious Madness Aura",
		outcome: "Each target tests Average Cool; failures roll on the Contagious Madness Table.",
		range: "Willpower yards",
		rules: "Select all newly exposed sentient creatures, then apply the outcome from this card.",
		target: "multiple"
	},
	{
		actionType: "control",
		conditions: ["Use after the mutant suffers a Critical Wound to the body."],
		duration: "Immediate",
		id: "infernal-furnace-critical-burst",
		implementation: "support",
		itemId: D["infernal-furnace-critical-burst"],
		mutationId: "IUBfAizppAlcAgWL",
		mutationName: "Infernal Furnace",
		name: "Resolve Body-Critical Flame Burst",
		outcome: "Creatures within 2 yards test Average Endurance or gain 1 Ablaze.",
		range: "2 yards",
		rules: "Select every creature in range, then apply the outcome from this card.",
		target: "multiple"
	},
	{
		actionType: "attack",
		conditions: ["Use when the mutant dies."],
		duration: "Immediate",
		id: "infernal-furnace-death-explosion",
		implementation: "support",
		itemId: D["infernal-furnace-death-explosion"],
		mutationId: "IUBfAizppAlcAgWL",
		mutationName: "Infernal Furnace",
		name: "Resolve Death Explosion",
		outcome: "Each target suffers TB x3 Damage and gains 1 Ablaze.",
		range: "TB x3 yards",
		rules: "Select every creature in range. Apply Damage normally; the outcome applies Ablaze.",
		target: "multiple"
	},
	{
		actionType: "control",
		conditions: ["Target every living creature within range."],
		duration: "Resolve each Round",
		id: "tantalising-aura",
		implementation: "support",
		itemId: D["tantalising-aura"],
		mutationId: "UocYY55QaW15zWYk",
		mutationName: "Tantalising Aura",
		name: "Resolve Tantalising Aura",
		outcome: "Each target tests Average Willpower or gains Surprised and must approach the mutant.",
		range: "WPB yards",
		rules: "Select all living creatures in range, then apply the outcome from this card.",
		target: "multiple"
	}
], O = (e) => ({
	...e,
	implementation: "support",
	itemId: D[e.id]
}), yt = [
	O({
		actionType: "control",
		duration: "Immediate",
		id: "additional-head-control",
		mutationId: "gnBENJ8AzIgoa39t",
		mutationName: "Additional Head",
		name: "Resist the Additional Head",
		outcome: "Retain control when the secondary head can directly pursue its own Ambition.",
		range: "Self",
		rules: "Test when the secondary head has a direct opportunity to pursue its own Ambition.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	}),
	O({
		actionType: "companion",
		duration: "Persistent; regrows one month after destruction",
		id: "bodysnatcher-drone-deploy",
		mutationId: "LgBwqZBzYaVggfVI",
		mutationName: "Bodysnatcher Drone",
		name: "Create Bodysnatcher Drone",
		outcome: "Create or recover a linked Tiny drone Actor with its printed profile.",
		range: "Willpower yards while active",
		rules: "Applying the outcome creates one managed drone Actor and links it to this mutant.",
		target: "self"
	}),
	O({
		actionType: "form",
		conditions: ["The assumed humanoid species must have been observed for at least one hour."],
		duration: "TB + SL hours",
		id: "shapeshifter-assume-form",
		miscast: "minor",
		mutationId: "NDDLEunW5biRvTfy",
		mutationName: "Shapeshifter",
		name: "Assume Observed Form",
		outcome: "Create a timed Shapeshifter form marker.",
		range: "Self",
		rules: "Record the copied appearance in the effect after applying the outcome.",
		target: "self",
		test: {
			characteristic: "t",
			difficulty: "challenging"
		}
	}),
	O({
		actionType: "form",
		duration: "Immediate",
		id: "shapeshifter-revert-form",
		mutationId: "NDDLEunW5biRvTfy",
		mutationName: "Shapeshifter",
		name: "Revert Shapeshifter Form",
		outcome: "Remove the managed Shapeshifter form.",
		range: "Self",
		rules: "Apply this outcome to return to the mutant's natural form.",
		target: "self"
	}),
	O({
		actionType: "form",
		conditions: ["Target the consumed humanoid or ordinary beast whose form is being stored."],
		duration: "Until voluntarily reverted or a new source is consumed",
		id: "skinwalker-assume-form",
		mutationId: "JtmI1wOwKqWT4zVG",
		mutationName: "Skinwalker",
		name: "Assume Consumed Form",
		outcome: "Copy the selected source Actor's physical Characteristics and movement into a managed form.",
		range: "Self",
		rules: "The four-hour consumption and source eligibility remain GM-verified prerequisites.",
		target: "single"
	}),
	O({
		actionType: "form",
		duration: "Immediate",
		id: "skinwalker-revert-form",
		mutationId: "JtmI1wOwKqWT4zVG",
		mutationName: "Skinwalker",
		name: "Revert Skinwalker Form",
		outcome: "Remove the managed Skinwalker form and copied Characteristics.",
		range: "Self",
		rules: "Apply this outcome to return to the mutant's natural form.",
		target: "self"
	}),
	O({
		actionType: "companion",
		duration: "Persistent",
		id: "spectral-companion-manifest",
		mutationId: "wpD9QuU8AuxSExbe",
		mutationName: "Spectral Companion",
		name: "Create Spectral Companion",
		outcome: "Create or recover a linked companion Actor using the retained type, name, and ambitions.",
		range: "Willpower yards",
		rules: "The GM supplies or imports the chosen spirit's full creature profile if needed.",
		target: "self"
	}),
	O({
		actionType: "form",
		duration: "Until reformed",
		id: "swarmform-transform",
		miscast: "minor",
		mutationId: "q3sK3RsdsJxrifZP",
		mutationName: "Swarmform",
		name: "Become the Swarm",
		outcome: "Apply the Swarm form, retained Size, and source-specific movement.",
		range: "Self",
		rules: "The form retains current Wounds and completes after one Round.",
		target: "self",
		test: {
			characteristic: "t",
			difficulty: "challenging"
		}
	}),
	O({
		actionType: "form",
		duration: "Immediate",
		id: "swarmform-reform",
		mutationId: "q3sK3RsdsJxrifZP",
		mutationName: "Swarmform",
		name: "Reform from the Swarm",
		outcome: "Remove the managed Swarm form and its movement override.",
		range: "Self",
		rules: "The GM resolves separated or destroyed portions before reformation.",
		target: "self"
	}),
	O({
		actionType: "companion",
		duration: "Permanent",
		id: "symbiotic-twin-manifest",
		mutationId: "Og9cw0jROsunkR2j",
		mutationName: "Symbiotic Twins",
		name: "Create Symbiotic Twin",
		outcome: "Clone the host into a linked twin Actor at the moment of acquisition.",
		range: "Any distance for telepathy",
		rules: "Use once after acquisition; the two Actors progress independently afterward.",
		target: "self"
	}),
	O({
		actionType: "companion",
		duration: "Permanent while attached",
		id: "vestigial-twin-manifest",
		mutationId: "33Y5xaZHFZxqaT9Q",
		mutationName: "Vestigial Twin",
		name: "Create Vestigial Twin",
		outcome: "Create or recover a linked immobile twin Actor with the printed characteristic penalties.",
		range: "Attached",
		rules: "The managed Actor records the retained personality, motivation, and ambitions.",
		target: "self"
	}),
	O({
		actionType: "form",
		duration: "One battle",
		id: "warp-spasm-transform",
		mutationId: "jPlCrsK3hTgkHsTR",
		mutationName: "Warp Spasm",
		name: "Enter Warp Spasm",
		outcome: "Apply Fear 1 and temporary Frenzy, Berserk Charge, Contortionist, and Painless support Items.",
		range: "Self",
		rules: "The form ends automatically with combat or by using End Warp Spasm.",
		target: "self"
	}),
	O({
		actionType: "form",
		duration: "Immediate",
		id: "warp-spasm-end",
		mutationId: "jPlCrsK3hTgkHsTR",
		mutationName: "Warp Spasm",
		name: "End Warp Spasm",
		outcome: "Remove Warp Spasm support and gain 1 Fatigued.",
		range: "Self",
		rules: "Apply ignored Critical Wound penalties before ending the form.",
		target: "self"
	}),
	O({
		actionType: "form",
		conditions: ["Apply the Morrslieb modifier printed in the mutation before rolling."],
		duration: "Until reverted",
		id: "werebeast-transform",
		miscast: "minor",
		mutationId: "mNNavbJayRcsyeXJ",
		mutationName: "Werebeast",
		name: "Assume Werebeast Form",
		outcome: "Activate the retained Bestial Body grants as a managed werebeast form.",
		range: "Self",
		rules: "Transformation takes one Round; retained acquisition choices define the form.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	}),
	O({
		actionType: "form",
		conditions: ["Apply the inverse Morrslieb modifier printed in the mutation before rolling."],
		duration: "Immediate",
		id: "werebeast-revert",
		miscast: "minor",
		mutationId: "mNNavbJayRcsyeXJ",
		mutationName: "Werebeast",
		name: "Revert Werebeast Form",
		outcome: "Remove the managed Werebeast form and its temporary grants.",
		range: "Self",
		rules: "Reversion takes one Round.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	})
], bt = [
	{
		actionType: "control",
		conditions: ["The retained Tail result must be Mace Tail."],
		duration: "Immediate",
		id: "tail-mace-free-attack",
		implementation: "support",
		itemId: D["tail-mace-free-attack"],
		mutationId: "bSVbWpX8AcBSIyTU",
		mutationName: "Tail",
		name: "Mace Tail Free Attack",
		outcome: "Resolve the owned Weapon (SB +3) Creature Trait attack with Pummel.",
		qualities: ["pummel"],
		range: "Melee",
		rules: "Spend 1 Advantage to attack as a Free Action; the tail may instead attack normally as the primary action.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "s",
			characteristic: "ws",
			damage: !0,
			difficulty: "challenging",
			specification: "+3"
		},
		usage: { advantageCost: 1 }
	},
	{
		actionType: "attack",
		conditions: ["The retained Tail result must be Prehensile Tail.", "The tail must be holding a weapon within its SB Encumbrance allowance."],
		duration: "Immediate",
		id: "tail-prehensile-free-attack",
		implementation: "support",
		itemId: D["tail-prehensile-free-attack"],
		mutationId: "bSVbWpX8AcBSIyTU",
		mutationName: "Tail",
		name: "Prehensile Tail Free Attack",
		outcome: "Resolve an attack with the weapon held by the tail.",
		range: "The held weapon's range",
		rules: "Spend 1 Advantage to attack as a Free Action; the held weapon may instead attack normally as the primary action.",
		target: "single",
		usage: { advantageCost: 1 }
	},
	{
		actionType: "attack",
		conditions: ["The retained Tail result must be Scorpion Stinger."],
		duration: "Immediate",
		id: "tail-scorpion-free-attack",
		implementation: "support",
		itemId: D["tail-scorpion-free-attack"],
		mutationId: "bSVbWpX8AcBSIyTU",
		mutationName: "Tail",
		name: "Scorpion Stinger Free Attack",
		outcome: "Resolve the owned Weapon (SB +3) Creature Trait with Impale and Venom (Average).",
		qualities: ["impale"],
		range: "Melee",
		rules: "Spend 1 Advantage to attack as a Free Action; the stinger may instead attack normally as the primary action.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "s",
			characteristic: "ws",
			damage: !0,
			difficulty: "challenging",
			specification: "+3"
		},
		usage: { advantageCost: 1 }
	},
	{
		actionType: "control",
		conditions: ["Use WP instead of Strength to determine carrying capacity and to resolve contested lifting."],
		duration: "WP rounds",
		id: "telekinesis-move-object",
		implementation: "support",
		itemId: D["telekinesis-move-object"],
		miscast: "minor",
		mutationId: "xpllKoAOD5X9C8Pi",
		mutationName: "Telekinesis",
		name: "Move Object with Telekinesis",
		outcome: "On success, move matter at WPB yards per round.",
		range: "Source does not specify an initial range",
		rules: "The duration and any contested lifting remain player/GM guidance until timed and opposed effects are implemented.",
		target: "object",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "attack",
		conditions: ["The source requires both the Challenging (+0) Willpower Test and a Ballistic Skill Test.", "The projectile must be a throwing weapon or comparable object such as a knife or rock."],
		duration: "Immediate",
		id: "telekinesis-hurl-weapon",
		implementation: "support",
		itemId: D["telekinesis-hurl-weapon"],
		miscast: "minor",
		mutationId: "xpllKoAOD5X9C8Pi",
		mutationName: "Telekinesis",
		name: "Hurl Weapon with Telekinesis",
		outcome: "On success, proceed to the provided Ballistic Skill projectile Test.",
		range: "The thrown weapon's range",
		rules: "This is the power Test; roll the separate projectile action after it succeeds.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "control",
		conditions: ["The target must be sentient, within range, and either visible or known to be in the area.", "The target may reply without a Test during the same round."],
		duration: "The same round",
		id: "telepathy-project-thoughts",
		implementation: "support",
		itemId: D["telepathy-project-thoughts"],
		miscast: "minor",
		mutationId: "ihjcMhBrb24nwkhm",
		mutationName: "Telepathy",
		name: "Project Thoughts",
		outcome: "On success, project thoughts into the target's mind as an Action.",
		range: "WP yards",
		rules: "Charm, Intimidation, and other social Skills work as they do in ordinary communication.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "average"
		}
	},
	{
		actionType: "control",
		conditions: [
			"The target must be sentient, within range, and either visible or known to be in the area.",
			"Reading memories applies -30; the subconscious cannot be raided.",
			"A failed Opposed Test prevents targeting that creature again until after eight hours of rest."
		],
		duration: "Immediate",
		id: "telepathy-read-thoughts",
		implementation: "support",
		itemId: D["telepathy-read-thoughts"],
		miscast: "minor",
		mutationId: "ihjcMhBrb24nwkhm",
		mutationName: "Telepathy",
		name: "Read Thoughts",
		outcome: "Win an Opposed Willpower Test to read surface thoughts or memories; fewer than 2 SL alerts the target.",
		range: "WP yards",
		rules: "Track the failed-target eight-hour lockout manually; successful uses do not create a cooldown.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "utility",
		conditions: ["After resolving the Test, roll 1d10; on a 10 the mutant ages one full year."],
		duration: "The current turn",
		id: "temporal-instability-surge",
		implementation: "support",
		itemId: D["temporal-instability-surge"],
		miscast: "major",
		mutationId: "b5xKInMaTt8ljJVQ",
		mutationName: "Temporal Instability",
		name: "Plunge Forward in Time",
		outcome: "On success, gain one additional Movement and Action during the turn.",
		range: "Self",
		rules: "The extra turn resources and possible aging remain guidance so rerolls cannot leave stale state.",
		target: "self",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		conditions: ["Apply the retained Venom (Average) result when present."],
		duration: "Immediate",
		id: "thorns-launch",
		implementation: "support",
		itemId: D["thorns-launch"],
		mutationId: "3I87KH11NFbNEfIW",
		mutationName: "Thorns",
		name: "Launch Thorn",
		outcome: "On a successful Ballistic Skill Test, deal 1 + SL Damage.",
		range: "10 + SB yards",
		rules: "This ranged attack costs an Action.",
		target: "single",
		test: {
			SL: !0,
			attackType: "ranged",
			characteristic: "bs",
			damage: !0,
			difficulty: "challenging",
			specification: "+1"
		}
	},
	{
		actionType: "attack",
		conditions: ["The +1 Damage also applies when the mutant makes a Grappling attack."],
		duration: "Immediate",
		id: "thorns-unarmed",
		implementation: "support",
		itemId: D["thorns-unarmed"],
		mutationId: "3I87KH11NFbNEfIW",
		mutationName: "Thorns",
		name: "Thorn-covered Unarmed Attack",
		outcome: "Resolve an Unarmed or Grappling attack with +1 Damage.",
		range: "Melee",
		rules: "Use Melee (Brawling); the ranged thorn-launching action is catalogued separately.",
		target: "single",
		test: {
			SL: !0,
			attackType: "melee",
			bonusCharacteristic: "s",
			damage: !0,
			difficulty: "challenging",
			skill: "melee-brawling",
			specification: "+1"
		}
	},
	{
		actionType: "control",
		conditions: ["In combat, first win a Melee (Brawling) Test to touch the target."],
		duration: "Stunned persists normally",
		id: "thunderhead-shock",
		implementation: "support",
		itemId: D["thunderhead-shock"],
		miscast: "minor",
		mutationId: "sdXBHwy9bpRcLriW",
		mutationName: "Thunderhead",
		name: "Electric Touch",
		outcome: "Win an Opposed Willpower versus Toughness Test to Stun the touched target.",
		range: "Touch",
		rules: "Resolve the additional combat touch Test before the opposed power Test when required.",
		target: "single",
		test: {
			characteristic: "wp",
			difficulty: "challenging"
		}
	},
	{
		actionType: "attack",
		conditions: ["Metal armour does not protect against this Damage."],
		duration: "Immediate; Blinded persists normally",
		id: "thunderhead-lightning-bolt",
		implementation: "support",
		itemId: D["thunderhead-lightning-bolt"],
		miscast: "minor",
		mutationId: "sdXBHwy9bpRcLriW",
		mutationName: "Thunderhead",
		name: "Lightning Bolt",
		outcome: "On success, deal WPB + SL Damage and inflict 1 Blinded.",
		range: "WPB yards",
		rules: "The action card reports Damage and Blinded guidance without applying irreversible outcome state.",
		target: "single",
		test: {
			SL: !0,
			attackType: "ranged",
			bonusCharacteristic: "wp",
			characteristic: "wp",
			damage: !0,
			difficulty: "challenging",
			specification: "+0"
		}
	}
], xt = Object.freeze([
	...pt,
	...gt,
	..._t,
	...bt,
	...ht,
	...mt,
	...vt,
	...yt
]), St = new Map(xt.map((e) => [e.id, e])), Ct = /* @__PURE__ */ new Map();
for (let e of xt) {
	let t = Ct.get(e.mutationId) ?? [];
	t.push(e), Ct.set(e.mutationId, t);
}
new Map([...Ct].map(([e, t]) => [e, Object.freeze(t)]));
function wt(e) {
	return St.get(e);
}
//#endregion
//#region src/functions/mutants-handbook/actions/outcomes.ts
var Tt = {
	"bodysnatcher-drone-deploy": [{
		companion: "bodysnatcher-drone",
		kind: "companion",
		subject: "self",
		when: "always"
	}],
	"bloomblight-touch-heal": [{
		amount: "fellowship-plus-sl",
		kind: "heal",
		subject: "targets",
		when: "success"
	}, {
		characteristic: "t",
		difficulty: "challenging",
		failureConditions: [],
		failureRoll: {
			formula: "1d5",
			label: "Bloomblight symptom: 1 Buboes, 2 Fever, 3 Flux, 4 Nausea, 5 Pox; lasts 1d10 days"
		},
		kind: "follow-up-test",
		subject: "targets",
		when: "success"
	}],
	"chameleon-skin-camouflage": [{
		effect: "camouflage",
		kind: "effect",
		subject: "self",
		when: "always"
	}],
	"burning-body-aura": [{
		characteristic: "t",
		difficulty: "challenging",
		failureConditions: [{ condition: "ablaze" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "always"
	}],
	"contagious-madness-aura": [{
		difficulty: "average",
		failureConditions: [],
		failureRoll: {
			formula: "1d100",
			label: "Contagious Madness Table result (this Round)"
		},
		kind: "follow-up-test",
		skill: "Cool",
		subject: "targets",
		when: "always"
	}],
	"entrancement-beguile": [{
		effect: "entrancement",
		kind: "effect",
		subject: "targets",
		when: "success"
	}],
	"ethereal-become-insubstantial": [{
		form: "ethereal",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "success"
	}],
	"evil-eye-gaze": [
		{
			condition: "stunned",
			kind: "condition",
			subject: "self",
			when: "failure"
		},
		{
			condition: "fatigued",
			kind: "condition",
			subject: "targets",
			when: "success"
		},
		{
			characteristic: "t",
			difficulty: "hard",
			failureConditions: [{ condition: "prone" }],
			kind: "follow-up-test",
			subject: "targets",
			when: "success"
		}
	],
	"fleshcrafter-stop-bleeding": [{
		amount: "sl",
		condition: "bleeding",
		kind: "remove-condition",
		subject: "targets",
		when: "success"
	}],
	"frostbite-touch": [{
		characteristic: "t",
		difficulty: "challenging",
		failureConditions: [{ condition: "stunned" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "always"
	}],
	"horrid-scream-unleash": [{
		condition: "deafened",
		kind: "condition",
		subject: "targets",
		when: "always"
	}, {
		characteristic: "wp",
		difficulty: "challenging",
		failureConditions: [{ condition: "broken" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "always"
	}],
	"invisibility-vanish": [{
		effect: "invisible",
		kind: "effect",
		subject: "self",
		when: "success"
	}],
	"infernal-furnace-critical-burst": [{
		characteristic: "t",
		difficulty: "average",
		failureConditions: [{ condition: "ablaze" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "always"
	}],
	"infernal-furnace-death-explosion": [{
		condition: "ablaze",
		kind: "condition",
		subject: "targets",
		when: "always"
	}],
	"levitation-rise": [{
		effect: "levitation",
		kind: "effect",
		subject: "self",
		when: "success"
	}],
	"life-leech-touch": [{
		amount: "sl",
		kind: "heal",
		subject: "self",
		when: "success"
	}],
	"mirror-image-disguise": [{
		form: "mirror-image",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "success"
	}],
	"oracle-foresight": [{
		effect: "foresight",
		kind: "effect",
		subject: "self",
		when: "success"
	}],
	"pyrokinesis-blast": [{
		characteristic: "t",
		difficulty: "average",
		failureConditions: [{ condition: "ablaze" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "success"
	}],
	"pyrokinesis-ignite": [{
		condition: "ablaze",
		kind: "condition",
		subject: "targets",
		when: "success"
	}],
	"shapeshifter-assume-form": [{
		form: "shapeshifter",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "success"
	}],
	"shapeshifter-revert-form": [{
		form: "shapeshifter",
		kind: "form",
		mode: "revert",
		subject: "self",
		when: "always"
	}],
	"skinwalker-assume-form": [{
		form: "skinwalker",
		kind: "form",
		mode: "activate",
		source: "targets",
		subject: "self",
		when: "always"
	}],
	"skinwalker-revert-form": [{
		form: "skinwalker",
		kind: "form",
		mode: "revert",
		subject: "self",
		when: "always"
	}],
	"spectral-companion-manifest": [{
		companion: "spectral-companion",
		kind: "companion",
		subject: "self",
		when: "always"
	}],
	"swarmform-reform": [{
		form: "swarmform",
		kind: "form",
		mode: "revert",
		subject: "self",
		when: "always"
	}],
	"swarmform-transform": [{
		form: "swarmform",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "success"
	}],
	"symbiotic-twin-manifest": [{
		companion: "symbiotic-twin",
		kind: "companion",
		subject: "self",
		when: "always"
	}],
	"telekinesis-move-object": [{
		effect: "telekinesis",
		kind: "effect",
		subject: "self",
		when: "success"
	}],
	"tantalising-aura": [{
		characteristic: "wp",
		difficulty: "average",
		failureConditions: [{ condition: "surprised" }],
		kind: "follow-up-test",
		subject: "targets",
		when: "always"
	}],
	"temporal-instability-surge": [{
		effect: "temporal-surge",
		kind: "effect",
		subject: "self",
		when: "success"
	}, {
		formula: "1d10",
		kind: "roll",
		label: "Temporal Instability ageing (10 = one year)",
		when: "always"
	}],
	"thunderhead-lightning-bolt": [{
		condition: "blinded",
		kind: "condition",
		subject: "targets",
		when: "success"
	}],
	"thunderhead-shock": [{
		condition: "stunned",
		kind: "condition",
		subject: "targets",
		when: "success"
	}],
	"vestigial-twin-manifest": [{
		companion: "vestigial-twin",
		kind: "companion",
		subject: "self",
		when: "always"
	}],
	"warp-spasm-end": [{
		form: "warp-spasm",
		kind: "form",
		mode: "revert",
		subject: "self",
		when: "always"
	}],
	"warp-spasm-transform": [{
		form: "warp-spasm",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "always"
	}],
	"werebeast-revert": [{
		form: "werebeast",
		kind: "form",
		mode: "revert",
		subject: "self",
		when: "success"
	}],
	"werebeast-transform": [{
		form: "werebeast",
		kind: "form",
		mode: "activate",
		subject: "self",
		when: "success"
	}]
};
function Et(e) {
	return Tt[e] ?? [];
}
Object.freeze(Object.keys(Tt));
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/acquisition-grants.ts
var Dt = new Set([
	"armour",
	"psychology",
	"skill",
	"talent",
	"trait",
	"weapon"
]), Ot = new Set([
	"configuration",
	"rank",
	"singleton"
]), kt = 256, At = new Set([
	"__proto__",
	"constructor",
	"prototype"
]), jt = /^Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Item\.[A-Za-z0-9_-]+$/, Mt = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, k = Symbol("invalid-acquisition-value"), Nt = "bSVbWpX8AcBSIyTU", Pt = {
	mace: ["tail-mace-free-attack", "Mace Tail: Free Attack"],
	prehensile: ["tail-prehensile-free-attack", "Prehensile Tail: Free Attack"],
	scorpion: ["tail-scorpion-free-attack", "Scorpion Stinger: Free Attack"]
};
function A(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function j(e, t, n = 0) {
	if (e === null || typeof e == "string" || typeof e == "boolean") return e;
	if (typeof e == "number") return Number.isFinite(e) ? e : k;
	if (n >= 20 || typeof e != "object" || !e || t.has(e)) return k;
	if (t.add(e), Array.isArray(e)) {
		let r = [];
		for (let i of e) {
			let e = j(i, t, n + 1);
			if (e === k) return k;
			r.push(e);
		}
		return t.delete(e), r;
	}
	if (!A(e)) return k;
	let r = {};
	for (let [i, a] of Object.entries(e)) {
		if (At.has(i)) return k;
		let e = j(a, t, n + 1);
		if (e === k) return k;
		r[i] = e;
	}
	return t.delete(e), r;
}
function Ft(e) {
	let t = e.replace(/^system\./, ""), n = t.split(".");
	return t.length > 0 && n.every((e) => e && !At.has(e)) ? t : void 0;
}
function It(e) {
	if (e === void 0 || !A(e) || Object.keys(e).some((e) => e !== "name" && e !== "system")) return;
	let t = {};
	if (e.name !== void 0) {
		if (typeof e.name != "string" || e.name.trim().length === 0) return;
		t.name = e.name;
	}
	if (e.system !== void 0) {
		if (!A(e.system)) return;
		let n = {}, r = [];
		for (let [t, i] of Object.entries(e.system)) {
			let e = Ft(t), a = j(i, /* @__PURE__ */ new Set());
			if (!e || a === k || r.some((t) => e.startsWith(`${t}.`) || t.startsWith(`${e}.`))) return;
			r.push(e), n[t] = a;
		}
		t.system = n;
	}
	return t;
}
function Lt(e) {
	if (!A(e)) return;
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
	if (typeof n != "string" || !Mt.test(n) || typeof r != "string" || r.trim().length === 0 || typeof i != "string" || !jt.test(i) || typeof a != "string" || !Dt.has(a)) return;
	let o = e.stack ?? "singleton";
	if (typeof o != "string" || !Ot.has(o) || o === "rank" && a !== "skill" && a !== "talent" || e.scope !== void 0 && e.scope !== "first" || e.aggregate !== void 0 && e.aggregate !== "latest" || e.aggregate === "latest" && o !== "configuration") return;
	let s = e.aggregateKey;
	if (s !== void 0 && (typeof s != "string" || s.trim().length === 0 || s.length > kt) || e.ranks !== void 0 && (!Number.isSafeInteger(e.ranks) || Number(e.ranks) < 1) || e.ranks !== void 0 && a !== "skill" && a !== "talent") return;
	let c = It(e.configure);
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
function Rt(e) {
	return !A(e) || e.status !== "resolved" || e.version !== void 0 && e.version !== 1 || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !A(e.rolls) || !A(e.selections) || j(e.rolls, /* @__PURE__ */ new Set()) === k || j(e.selections, /* @__PURE__ */ new Set()) === k || !Array.isArray(e.grants) ? !1 : e.acceptedBlocks === void 0 ? !0 : Array.isArray(e.acceptedBlocks) && e.acceptedBlocks.every((e) => A(e) && Object.keys(e).every((e) => e === "kind" || e === "message") && typeof e.kind == "string" && typeof e.message == "string");
}
function zt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n) || n.definitionId === "mNNavbJayRcsyeXJ") return [];
	let r = n.state;
	if (!A(r) || !Rt(r.acquisition)) return [];
	let i = r.acquisition.grants.map(Lt).filter((e) => e !== void 0), a = /* @__PURE__ */ new Map();
	for (let e of i) a.set(e.key, (a.get(e.key) ?? 0) + 1);
	return i.filter((e) => a.get(e.key) === 1);
}
function Bt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n)) return;
	let r = n.state;
	if (!A(r)) return;
	let i = r.acquisition;
	if (!A(i) || i.version !== void 0 && i.version !== 1) return;
	let a = i.occurrence;
	return Number.isSafeInteger(a) && Number(a) > 0 ? Number(a) : void 0;
}
function Vt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n) || n.definitionId !== Nt) return;
	let r = n.state;
	if (!A(r)) return;
	let i = r.acquisition;
	if (!A(i) || i.status !== "resolved") return;
	let a = i.selections;
	if (!A(a) || typeof a.tail != "string") return;
	let o = Pt[a.tail];
	if (!o) return;
	let [s, c] = o;
	return {
		key: `mutation-action:${s}`,
		name: c,
		sourceUuid: `Compendium.${e}.ratter-11-items.Item.${D[s]}`,
		stack: "singleton",
		type: "trait"
	};
}
function Ht(e, t = []) {
	let n = t.map(Lt).filter((e) => e !== void 0), r = new Map(n.map((e) => [e.key, e])), i = Vt(e);
	i && r.set(i.key, i);
	for (let t of zt(e)) {
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
function M(e) {
	return Array.from(e.items);
}
function Ut(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && t.items !== void 0;
}
function Wt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function Gt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.definitionId != "string" || typeof r.version != "number" || r.grants !== void 0 && !Array.isArray(r.grants))) return n;
}
function Kt(t) {
	return t.getFlag(e, o) === !0;
}
function qt(e) {
	return Kt(e) || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0;
}
function Jt(e, t, n) {
	return M(e).filter((e) => e.type === "mutation" && !qt(e) && Gt(e)?.definitionId === n).sort((e, t) => e.id.localeCompare(t.id))[0]?.id === t.id;
}
async function Yt(e, t, n) {
	t.update ? await t.update(n) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}]);
}
function Xt(e, t, n, r) {
	let i = T(e), a = E(e).map((e) => ({
		grantKey: "legacy",
		ownerId: e
	})), o = [...i?.owners ?? a];
	return o.some((e) => e.ownerId === r.ownerId && e.grantKey === r.grantKey) || o.push(r), {
		managed: i?.managed ?? lt(e),
		owners: o,
		signature: n,
		sourceUuid: t.sourceUuid,
		version: 2
	};
}
function Zt(e, t, n, r, i) {
	let a = M(e).filter((e) => st(e, t, n)).sort((e, t) => e.id.localeCompare(t.id)), o = a.find((e) => {
		let t = T(e);
		return t?.signature === r && t.owners.some((e) => e.ownerId === i.ownerId && e.grantKey === i.grantKey);
	});
	return (n.stack ?? "singleton") === "rank" ? o ?? a.find((e) => E(e).includes(i.ownerId)) : a.filter((e) => {
		let t = T(e);
		return t?.signature === r || !t && E(e).length === 0 && (n.type === "skill" || ct(e, n.sourceUuid));
	}).sort((e, t) => (T(e)?.managed === !0) - +(T(t)?.managed === !0) || e.id.localeCompare(t.id))[0] || a.find((e) => E(e).includes(i.ownerId)) || a.find((e) => {
		let t = T(e);
		return t?.signature === r || !t && E(e).length === 0 && ct(e, n.sourceUuid);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/owner-cleanup.ts
async function Qt(t, n, r) {
	let i = [];
	for (let a of M(t)) {
		let o = T(a), s = E(a), c = (o?.owners ?? []).filter((e) => {
			if (e.ownerId !== n) return !0;
			let t = r.get(e.grantKey);
			return t !== void 0 && t.signature === o?.signature && (t.itemId === void 0 || t.itemId === a.id);
		}), l = [...r.values()], u = l.some((e) => e.itemId === a.id), d = l.some((e) => e.itemId === void 0), f = s.filter((e) => e !== n || u || d);
		if (!(c.length !== (o?.owners.length ?? 0) || f.length !== s.length)) continue;
		if ((o?.managed ?? lt(a)) && c.length === 0 && f.length === 0 && !ut(a)) {
			i.push(a.id);
			continue;
		}
		let p = {};
		f.length > 0 ? (p[`flags.${e}.mutationGrantOwners`] = f, lt(a) && (p[`flags.${e}.mutationGrantManaged`] = !0)) : (p[`flags.${e}.-=mutationGrantManaged`] = null, p[`flags.${e}.-=mutationGrantOwners`] = null), o && c.length > 0 ? p[`flags.${e}.mutationGrant`] = {
			...o,
			owners: c
		} : o && (p[`flags.${e}.-=mutationGrant`] = null), await Yt(t, a, p);
	}
	i.length > 0 && await t.deleteEmbeddedDocuments("Item", i);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/ranked-skill-items.ts
function $t(e) {
	return Array.from(e.items);
}
function en(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function tn(e) {
	let t = e.toObject().system;
	if (typeof t != "object" || !t) return 0;
	let n = t.advances;
	if (typeof n != "object" || !n) return 0;
	let r = Number(n.value);
	return Number.isFinite(r) ? r : 0;
}
function nn(e) {
	let t = ut(e);
	if (t) return {
		...t,
		legacy: !1
	};
	let n = T(e);
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
function rn(e, t) {
	let n = tn(e), r = nn(e);
	if (!r) return Math.max(0, n);
	let i = r.legacy && t !== void 0 ? Math.max(r.appliedRanks, Math.min(t, n)) : r.appliedRanks;
	return Math.max(0, n - i);
}
function an(e) {
	return nn(e)?.managed === !0;
}
function on(e, t) {
	let n = typeof e.system == "object" && e.system !== null ? e.system : {};
	e.system = n;
	let r = n.advances, i = typeof r == "object" && r ? r : {};
	n.advances = i, i.value = t;
}
function sn(t, n) {
	let r = typeof t.flags == "object" && t.flags !== null ? t.flags : {};
	t.flags = r;
	let i = typeof r["fvtt-wfrp-ratter"] == "object" && r["fvtt-wfrp-ratter"] !== null ? r[e] : {};
	r[e] = i, i.mutationSkillGrant = n;
}
async function cn(e, t, n) {
	let r = { skipExperienceChecks: !0 };
	t.update ? await t.update(n, r) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}], r);
}
function ln(t) {
	return {
		"system.advances.value": t,
		[`flags.${e}.-=mutationSkillGrant`]: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/ranked-grant-data.ts
function un(e) {
	if (e.type !== "talent") return;
	let t = T(e);
	if (!t || !rt(t.signature)) return;
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
function N(e) {
	return nn(e) ?? un(e);
}
function dn(e, t) {
	let n = un(e);
	if (!n) return rn(e, t);
	let r = e.toObject().system, i = Number(r?.advances?.value ?? 0), a = t === void 0 ? n.appliedRanks : Math.max(n.appliedRanks, Math.min(t, i));
	return Math.max(0, i - a);
}
function fn(e) {
	let t = N(e);
	return t?.managed === !1 ? 0 : t ? 2 : 1;
}
function pn(e, t) {
	return N(e)?.owners.some((e) => rt(e.signature) === t) ?? !1;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/skill-grant-reconciliation.ts
function P(e, t) {
	return e < t ? -1 : +(e > t);
}
function mn(e, t) {
	let n = { ...t.grant };
	return delete n.ranks, st(e, { name: t.name }, n);
}
async function hn(e, t) {
	let n = /* @__PURE__ */ new Map();
	return await Promise.all(t.map(async ({ grant: t, mutation: r }) => {
		if (t.type !== "skill" && t.type !== "talent") return;
		let i = nt(t);
		if (t.configure?.name || n.has(i)) return;
		let a = tt(t), o = $t(e).find((e) => e.type === t.type && N(e)?.owners.some((e) => e.sourceUuid === t.sourceUuid && (e.ownerId === r.id && e.grantKey === t.key || e.signature === a)));
		if (o) {
			n.set(i, o.name);
			return;
		}
		let s = await fromUuid(t.sourceUuid);
		en(s) && s.type === t.type && n.set(i, s.name);
	})), t.flatMap(({ grant: e, mutation: t }) => {
		if (e.type !== "skill" && e.type !== "talent") return [];
		let r = nt(e);
		return [{
			grant: e,
			grantKey: e.key,
			identity: r,
			mutationName: t.name,
			name: e.configure?.name ?? n.get(r) ?? e.name,
			ownerId: t.id,
			ranks: e.ranks ?? 1,
			signature: tt(e),
			sourceUuid: e.sourceUuid
		}];
	});
}
function gn(e) {
	return e.map(({ grantKey: e, ownerId: t, ranks: n, signature: r, sourceUuid: i }) => ({
		grantKey: e,
		ownerId: t,
		ranks: n,
		signature: r,
		sourceUuid: i
	}));
}
async function _n(e, t) {
	let n = t[0];
	if (!n) return;
	let r = await fromUuid(n.sourceUuid);
	if (!en(r) || r.type !== n.grant.type) {
		ui.notifications.warn(`${n.mutationName}: could not grant ${n.name}. Enable its source module and reconcile mutation automation.`);
		return;
	}
	let i = ot(r.toObject(), n.grant);
	if (delete i._id, delete i._key, on(i, 0), sn(i, {
		appliedRanks: 0,
		managed: !0,
		owners: [],
		version: 1
	}), !(await e.createEmbeddedDocuments("Item", [i], {
		skipExperienceChecks: !0,
		skipSpecialisationChoice: !0
	})).find(en) && !$t(e).some((e) => mn(e, n))) throw Error(`${n.mutationName}: Foundry prevented the ${n.name} grant.`);
	await yn(e, n.identity, t, !1);
}
async function vn(e, t) {
	let n = [];
	for (let r of t) {
		let t = N(r);
		if (!t) continue;
		let i = dn(r);
		t.managed && i === 0 && !T(r) ? n.push(r.id) : await cn(e, r, ln(i));
	}
	n.length > 0 && await e.deleteEmbeddedDocuments("Item", n);
}
async function yn(t, n, r, i = !0) {
	let a = r[0], o = $t(t).filter((e) => a ? mn(e, a) : pn(e, n)).sort((e, t) => fn(e) - fn(t) || P(e.id, t.id));
	if (r.length === 0) {
		await vn(t, o);
		return;
	}
	let s = o[0];
	if (!s) {
		if (!i) throw Error(`${a?.name ?? "Ranked Item"}: Foundry did not retain the mutation grant.`);
		await _n(t, r);
		return;
	}
	let c = o.slice(1).filter((e) => N(e));
	o.slice(1).filter((e) => !N(e)).length > 0 && ui.notifications.warn(`${a?.name}: multiple user-owned Items share this configuration. Mutation advances were applied only to ${s.name}; review the duplicates manually.`);
	let l = r.reduce((e, t) => e + t.ranks, 0), u = dn(s, l), d = {
		appliedRanks: l,
		managed: N(s)?.managed ?? T(s)?.managed ?? !1,
		owners: gn(r),
		version: 1
	};
	await cn(t, s, {
		"system.advances.value": u + l,
		[`flags.${e}.mutationSkillGrant`]: d
	});
	let f = [];
	for (let e of c) {
		let n = dn(e);
		(an(e) || N(e)?.managed) && n === 0 && !T(e) ? f.push(e.id) : (await cn(t, e, ln(n)), n > 0 && ui.notifications.warn(`${a?.name}: retained a duplicate Item containing non-mutation advances; review the duplicate manually.`));
	}
	f.length > 0 && await t.deleteEmbeddedDocuments("Item", f);
}
async function bn(e, t) {
	let n = await hn(e, t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.identity) ?? [];
		t.push(e), r.set(e.identity, t);
	}
	let i = /* @__PURE__ */ new Set();
	for (let t of $t(e)) for (let e of N(t)?.owners ?? []) {
		let t = rt(e.signature);
		t && i.add(t);
	}
	for (let t of [...i].filter((e) => !r.has(e)).sort(P)) await yn(e, t, []);
	for (let t of [...r.keys()].sort(P)) await yn(e, t, (r.get(t) ?? []).sort((e, t) => P(e.ownerId, t.ownerId) || P(e.grantKey, t.grantKey)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation.ts
var xn = /* @__PURE__ */ new Map();
async function Sn(t, n, r, i, a) {
	let o = ot(n.toObject(), r);
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
async function Cn(t, n, r) {
	let i = tt(r), a = await fromUuid(r.sourceUuid);
	if (!Wt(a) || a.type !== r.type) return ui.notifications.warn(`${n.name}: could not grant ${r.configure?.name ?? r.key}. Enable its source module and reconcile mutation automation.`), { signature: i };
	let o = {
		grantKey: r.key,
		ownerId: n.id
	}, s = Zt(t, a, r, i, o);
	if (!s) {
		let e = await Sn(t, a, r, i, o);
		return e ? {
			itemId: e,
			signature: i
		} : { signature: i };
	}
	let c = Xt(s, r, i, o), l = s.flags?.["fvtt-wfrp-ratter"] ?? {};
	return JSON.stringify(T(s)) === JSON.stringify(c) && !("mutationGrantManaged" in l) && !("mutationGrantOwners" in l) || await Yt(t, s, {
		[`flags.${e}.mutationGrant`]: c,
		[`flags.${e}.-=mutationGrantManaged`]: null,
		[`flags.${e}.-=mutationGrantOwners`]: null
	}), {
		itemId: s.id,
		signature: i
	};
}
async function wn(e) {
	let t = M(e).filter((e) => e.type === "mutation" && !qt(e)), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let [o, s] of t.entries()) {
		let t = Gt(s);
		if (!t) continue;
		let c = (a.get(t.definitionId) ?? 0) + 1;
		a.set(t.definitionId, c), r.set(s.id, /* @__PURE__ */ new Map());
		for (let a of Ht(s, t.grants)) if (!(a.scope === "first" && !Jt(e, s, t.definitionId))) if ((a.type === "skill" || a.type === "talent") && a.stack === "rank") n.push({
			grant: a,
			mutation: s
		});
		else if (a.aggregate === "latest" && a.stack === "configuration") {
			let e = `${t.definitionId}\0${a.aggregateKey ?? a.key}`, n = i.get(e) ?? [];
			n.push({
				grant: a,
				mutation: s,
				occurrence: Bt(s) ?? c,
				order: o
			}), i.set(e, n);
		} else r.get(s.id)?.set(a.key, await Cn(e, s, a));
	}
	await bn(e, n);
	for (let t of i.values()) {
		t.sort((e, t) => e.occurrence - t.occurrence || e.order - t.order);
		let n = t.at(-1)?.grant;
		if (n) for (let i of t) r.get(i.mutation.id)?.set(n.key, await Cn(e, i.mutation, n));
	}
	for (let n of t) {
		let t = r.get(n.id);
		t && await Qt(e, n.id, t);
	}
	let o = new Set(M(e).filter((e) => e.type === "mutation" && !qt(e) && Gt(e) !== void 0).map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let t of M(e)) {
		for (let e of T(t)?.owners ?? []) o.has(e.ownerId) || s.add(e.ownerId);
		for (let e of E(t)) o.has(e) || s.add(e);
	}
	for (let t of s) await Qt(e, t, /* @__PURE__ */ new Map());
}
async function Tn(e, t) {
	let n = (xn.get(e) ?? Promise.resolve()).catch(() => void 0).then(t);
	xn.set(e, n);
	try {
		await n;
	} finally {
		xn.get(e) === n && xn.delete(e);
	}
}
async function F(e) {
	let t = await fromUuid(e);
	if (!Ut(t)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await Tn(e, () => wn(t));
}
async function En(e, t) {
	let n = await fromUuid(e);
	if (!Ut(n)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await Tn(e, async () => {
		await Qt(n, t, /* @__PURE__ */ new Map()), await wn(n);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/outcomes.ts
var Dn = `flags.${e}.${r}`, On = `flags.${e}.${i}`;
function kn(e, t) {
	return e?.some((e) => e.kind === t.kind && e.message === t.message) === !0;
}
async function An(e, t, n, r) {
	let i = [r];
	try {
		await Ee(e, n);
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
function jn(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function Mn(e, t) {
	return re(t, jn(e));
}
function Nn(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Pn(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await et(e.name, t);
}
async function Fn(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": ie(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await S(e, i);
}
async function In(e, t) {
	for (let n of t) {
		let t = y("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		x(t), await b(t);
	}
}
async function Ln(e, t, n = {}) {
	let r = Pe(e, t).find((e) => !kn(n.acceptedBlocks, e));
	if (r) throw Error(r.message);
	if (await Pn(e, t.name)) {
		let n = Mn(e, t.nature);
		return await Fn(e, n, !0), await b(y("Resisted", {
			loss: n,
			mutation: t.name,
			name: e.name
		})), "applied";
	}
	let i = Mn(e, t.nature), a = {
		mutationAcquisitionAcceptedBlocks: n.acceptedBlocks ?? [],
		mutationAcquisitionCanReroll: n.canReroll === !0,
		mutationAcquisitionHandlesChimeranRetirement: !0
	}, o = await e.createEmbeddedDocuments("Item", [t.data], a);
	if (o.length === 0 && a.mutationAcquisitionCancelled === !0) return a.mutationAcquisitionRerollRequested === !0 ? "reroll" : (x(`${t.name} acquisition was cancelled. Corruption was not changed.`), "cancelled");
	if (o.length !== 1) throw o.length > 0 && await e.deleteEmbeddedDocuments("Item", o.map((e) => e.id)), Error(`Foundry did not create the ${t.name} mutation Item.`);
	let s, c = [];
	try {
		t.name.trim().toLowerCase() === "chimeran curse" && (c = await Te(e)), s = oe(be(e), jn(e)), await Fn(e, i, !1, s.length > 0 ? { [On]: !0 } : {});
	} catch (t) {
		return An(e, o.map((e) => e.id), c, t);
	}
	if (c.length > 0) try {
		await F(e.uuid);
	} catch (e) {
		Be(e);
	}
	return await b(y("Gained", {
		loss: i,
		mutation: t.name,
		name: e.name
	})), await In(e, s), "applied";
}
async function Rn(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let n = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await Pn(e, n)) {
		let r = Mn(e, t);
		await Fn(e, r, !0), await b(y("Resisted", {
			loss: r,
			mutation: n,
			name: e.name
		}));
		return;
	}
	let r = await $e(e.name), i = r ?? "unassigned", a = Se(e), o = Mn(e, t);
	if (await Fn(e, o, !1, { [Dn]: i }), a && (await we(e), await F(e.uuid)), await b(y(r ? "Chosen" : "ChosenUnassigned", {
		loss: o,
		name: e.name,
		patron: r ? Nn(r) : "Chaos"
	})), a) {
		let t = y("PossessedRemoved", { name: e.name });
		x(t), await b(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/patron-notes.ts
var zn = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, Bn = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, Vn = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, Hn = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, Un = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), Wn = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function Gn(e, t) {
	let n = t.trim().toLowerCase();
	if (Un.has(n)) return zn[e];
	if (Wn.has(n)) return Bn[e];
	if (n === "addiction") return Vn[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return Hn[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/tables.ts
function Kn(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function qn(e) {
	let t = game?.packs.get(n);
	if (!t) throw Error(`The required compendium ${n} is unavailable.`);
	let r = await t.getDocument(e);
	if (!Kn(r)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return r;
}
async function Jn(e, t) {
	let n = (await (await qn(e)).draw({
		displayChat: !0,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!n) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return n;
}
function Yn(e) {
	return Jn(c[e]);
}
function Xn(e) {
	let t = ne(e);
	return Jn(l, t > 0 ? `1d100 + ${t}` : "1d100");
}
function Zn(e, t) {
	return Jn(u[t][e]);
}
function Qn(e) {
	return Jn(d[e]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/workflow.ts
var $n = `flags.${e}.${r}`, er = 100;
function tr(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function nr(e, t) {
	let n = [];
	for (let r of Pe(e, t)) {
		let e = await Ze(t.name, r, !0);
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
async function rr(e, t) {
	if (t !== "unassigned") return t;
	let n = await $e(e.name);
	if (!n) {
		x(y("PatronRequired", { name: e.name }));
		return;
	}
	return await S(e, { [$n]: n }), n;
}
async function ir(e, t) {
	let n = await rr(e, t);
	if (!n) return;
	let r;
	for (let t = 0; t < er; t += 1) {
		let t = await ze(await Qn(n), n), i = await nr(e, t);
		if (i.action === "cancel") return;
		if (i.action === "reroll") {
			x(`${i.block.message} Rerolling on the ${tr(n)} mutation table.`);
			continue;
		}
		if (i.action !== "accept") continue;
		let a = await Ln(e, t, {
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
	let i = Gn(n, r.name);
	i && await b(y("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: tr(n)
	}));
}
async function ar(e) {
	let t = e.system.details.species.value, n = p(t) ?? await Qe(e.name, t);
	if (!n) {
		x(y("SpeciesRequired", { name: e.name }));
		return;
	}
	let r = await Yn(n), i = ee(r.name);
	if (!i) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let a = await Xn(be(e).total), o = te(a.name);
	if (!o) throw Error(`The severity table returned an unrecognized result: ${a.name}.`);
	if (o === "chosen") {
		await Rn(e, i);
		return;
	}
	let s;
	for (let t = 0; t < er; t += 1) {
		let t = await Zn(i, o);
		if (!t.documentUuid && te(t.name) === "chosen") {
			await Rn(e, i);
			return;
		}
		let n = await ze(t), r = await nr(e, n);
		if (r.action === "cancel") return;
		if (r.action === "reroll") {
			x(`${r.block.message} Rerolling on the ${tr(o)} ${i} table.`);
			continue;
		}
		if (r.action !== "accept") continue;
		if (n.nature !== i) throw Error(`${n.name} does not match the rolled ${i} mutation table.`);
		let a = await Ln(e, n, {
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
async function or(e) {
	let t = xe(e);
	t ? await ir(e, t) : await ar(e);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/check.ts
var sr = /* @__PURE__ */ new Set();
async function cr(e) {
	let t = e.system.status.corruption;
	if (!(Number(t.value) <= Number(t.max) || sr.has(e.uuid) || Ce(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		sr.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[s]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await Ke(e, i) ? await b(game.i18n.localize("CHAT.MutateSuccess")) : await or(e);
		} finally {
			sr.delete(e.uuid);
		}
	}
}
async function lr(e) {
	let t = await fromUuid(e);
	if (!ye(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await cr(t);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/values.ts
function I(e, t, n) {
	let r = e[t];
	return Array.isArray(r) ? r[n] : n === 0 ? r : void 0;
}
function ur(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = t.selections[e];
		for (let e of Array.isArray(n) ? n : n === void 0 ? [] : [n]) r.add(e);
	}
	return t.filter((e) => !r.has(e.id));
}
function dr(e, t, n, r) {
	let i = e[t], a = Array.isArray(i) ? [...i] : i === void 0 ? [] : [i];
	a[n] = r, e[t] = a.length === 1 ? a[0] : a;
}
function fr(e, t) {
	let n = e;
	for (let e of t) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function pr(e, t, n) {
	return fr({
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
function mr(e, t) {
	return Array.isArray(e) || Array.isArray(t) ? JSON.stringify(e) === JSON.stringify(t) : e === t;
}
function hr(e, t, n) {
	return (e ?? []).every((e) => {
		let r = pr(e, t, n), i = e.value;
		switch (e.operator) {
			case "equals": return mr(r, i);
			case "notEquals": return !mr(r, i);
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
function gr(e) {
	let { ranks: t, ...n } = e;
	return n;
}
function _r(e, t) {
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
	if (JSON.stringify(gr(r)) !== JSON.stringify(gr(t))) throw Error(`Acquisition grants reuse the incompatible key ${t.key}.`);
	t.stack === "rank" && (e[n] = {
		...r,
		ranks: (r.ranks ?? 1) + (t.ranks ?? 1)
	});
}
function vr(e, t) {
	let n = e.findIndex((e) => e.key === t.key);
	if (n < 0) {
		e.push({ ...t });
		return;
	}
	if (JSON.stringify(e[n]) !== JSON.stringify(t)) throw Error(`Acquisition modifiers reuse the incompatible key ${t.key}.`);
}
function yr(e, t) {
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
function br(e) {
	let t = new Set(e.modifiers.map((e) => e.key));
	return Object.fromEntries(Object.entries(e.rolls).filter(([e, n]) => t.has(e) && typeof n == "number" && Number.isFinite(n)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/materialize.ts
function xr(e, t, n) {
	let { roll: r, ...i } = e;
	return {
		...i,
		key: t,
		...n === void 0 ? {} : { value: n }
	};
}
function Sr(e, t, n) {
	let r = (r) => r.replaceAll(/{{([^{}]+)}}/g, (r, i) => {
		let a = I(t.selections, i.trim(), n);
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
async function Cr(e, t, n, r) {
	for (let t of r.grants ?? []) _r(e.state.grants, Sr(t, e.state, n));
	for (let i of r.modifiers ?? []) {
		let r = `${t.key}:${e.state.occurrence}:${n + 1}:${i.key}`, a = "roll" in i ? i.roll : void 0, o = e.state.rolls[r];
		if (Array.isArray(o) && (o = o[0]), a && (typeof o != "number" || !Number.isFinite(o))) {
			let n = await e.services.roll(a, `${e.mutationName}: ${t.prompt}`);
			o = n.total, e.state.rolls[r] = o, n.announce && e.announcements.push(n.announce);
		}
		if (a && (typeof o != "number" || !Number.isFinite(o))) throw Error(`The acquisition modifier ${i.key} did not resolve a roll.`);
		let s = xr(i, r, a ? o : void 0);
		vr(e.state.modifiers, s), a && typeof o == "number" && (e.topLevelRolls[r] = o);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/signals.ts
var wr = Symbol("acquisition-cancelled"), Tr = {
	depth: 8,
	resolutions: 32,
	tableRolls: 20
}, Er = class {
	block;
	constructor(e) {
		this.block = e;
	}
};
function Dr(e, t, n, r) {
	return {
		kind: n,
		message: `${e}: ${t} ${r}.`
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/state.ts
function L(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var Or = new Set([
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
]), kr = new Set([
	"ceil",
	"floor",
	"round"
]);
function R(e, t) {
	let n = new Set(t);
	return Object.keys(e).every((e) => n.has(e));
}
function Ar(e) {
	return typeof e == "string" && e.trim().length > 0 && e.length <= 256;
}
function z(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function jr(e) {
	return typeof e == "string" && Or.has(e);
}
function Mr(e) {
	return e === void 0 || e === "first";
}
function Nr(e) {
	let t = e.roll;
	return (typeof t == "string" && t.trim().length > 0) !== z(e.value);
}
function Pr(e) {
	return e === void 0 || Array.isArray(e) && e.every((e) => typeof e == "string" && e.trim().length > 0);
}
function Fr(e) {
	return e === void 0 || Array.isArray(e) && e.every(jr);
}
function Ir(e) {
	if (!L(e) || !Ar(e.key) || typeof e.kind != "string") return;
	let t = e.key;
	switch (e.kind) {
		case "characteristic": return !R(e, [
			"characteristic",
			"key",
			"kind",
			"roll",
			"scope",
			"value"
		]) || !jr(e.characteristic) || !Mr(e.scope) || !Nr(e) ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristic",
			...typeof e.roll == "string" ? { roll: e.roll } : {},
			...e.scope === "first" ? { scope: "first" } : {},
			...z(e.value) ? { value: e.value } : {}
		};
		case "characteristicCap": return !R(e, [
			"characteristic",
			"key",
			"kind",
			"maximum"
		]) || !jr(e.characteristic) || !z(e.maximum) || e.maximum < 0 ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristicCap",
			maximum: e.maximum
		};
		case "move":
		case "status": return !R(e, [
			"key",
			"kind",
			"scope",
			"value"
		]) || !Mr(e.scope) || !z(e.value) ? void 0 : {
			key: t,
			kind: e.kind,
			...e.scope === "first" ? { scope: "first" } : {},
			value: e.value
		};
		case "moveMultiplier": return !R(e, [
			"key",
			"kind",
			"round",
			"value"
		]) || typeof e.round != "string" || !kr.has(e.round) || !z(e.value) ? void 0 : {
			key: t,
			kind: "moveMultiplier",
			round: e.round,
			value: e.value
		};
		case "sizeStep": return !R(e, [
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
			return !R(e, [
				"characteristics",
				"key",
				"kind",
				"roll",
				"skills",
				"value"
			]) || !Pr(n) || !Fr(r) || !(n?.length || r?.length) || !Nr(e) ? void 0 : {
				...r ? { characteristics: [...r] } : {},
				key: t,
				kind: "test",
				...typeof e.roll == "string" ? { roll: e.roll } : {},
				...n ? { skills: [...n] } : {},
				...z(e.value) ? { value: e.value } : {}
			};
		}
		case "wounds": return !R(e, [
			"key",
			"kind",
			"value"
		]) || !z(e.value) ? void 0 : {
			key: t,
			kind: "wounds",
			value: e.value
		};
		default: return;
	}
}
function Lr(e) {
	return !L(e) || typeof e.message != "string" ? !1 : [
		"conflict",
		"eligibility",
		"exhausted",
		"maximum"
	].includes(String(e.kind));
}
function B(...e) {
	let t = e.flatMap((e) => e ?? []).filter(Lr);
	return t.filter((e, n) => t.findIndex((t) => t.kind === e.kind && t.message === e.message) === n);
}
function Rr(e, t) {
	if (!L(e)) return !1;
	let n = (e) => typeof e === t && (t !== "number" || Number.isFinite(e));
	return Object.values(e).every((e) => n(e) || Array.isArray(e) && e.every(n));
}
function zr(e) {
	if (!L(e) || e.version !== 1 || e.status !== "pending" && e.status !== "resolved" || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !Rr(e.rolls, "number") || !Rr(e.selections, "string") || !Array.isArray(e.grants)) return;
	let t = Array.isArray(e.modifiers) ? e.modifiers.map(Ir).filter((e) => e !== void 0) : [];
	return {
		acceptedBlocks: B(Array.isArray(e.acceptedBlocks) ? e.acceptedBlocks : void 0),
		grants: e.grants,
		modifiers: t,
		occurrence: Number(e.occurrence),
		rolls: e.rolls,
		selections: e.selections,
		status: e.status,
		version: 1
	};
}
function Br(t) {
	let n = t.getFlag(e, "mutationAutomation");
	return L(n) && L(n.acquisition) ? n : void 0;
}
function Vr(e, t) {
	return e.some((e) => e.kind === t.kind && e.message === t.message);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/progression.ts
function V(e, t, n, r, i, a) {
	if (!r) throw Error(`Acquisition step ${n.key} has no fallback option.`);
	let o = Dr(e.mutationName, n.prompt, i, a);
	if (Vr(t.acceptedBlocks ?? [], o)) return r;
	throw new Er(o);
}
function Hr(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = I(a?.occurrence === e.occurrence - 1 ? a.selections : {}, n.key, r), s = i.findIndex((e) => e.id === o);
	return s < 0 ? V(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : s >= i.length - 1 ? V(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1];
}
function Ur(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = I(a?.selections ?? {}, n.key, r) ?? n.initial, s = i.findIndex((e) => e.id === o);
	return s < 0 ? V(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : hr(n.advanceWhen, t, e.facts ?? {}) ? s >= i.length - 1 ? V(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1] : i[s];
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/repeat.ts
function Wr(e, t, n) {
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
async function Gr(e) {
	let { executionIndex: t, mutationName: n, previousStates: r, services: i, state: a, step: o } = e;
	if (I(a.selections, o.key, t) !== void 0) return;
	let s;
	a.occurrence > 1 && o.repeat === "copy-first" && (s = I(r.find((e) => e.occurrence === 1)?.selections ?? {}, o.key, t));
	let c = new Set(r.flatMap((e) => {
		let t = e.selections[o.key];
		return Array.isArray(t) ? t : t === void 0 ? [] : [t];
	})), l;
	for (let e = 0; s === void 0 && e < 10; e += 1) {
		let e = await i.input({
			prompt: o.prompt,
			title: n
		});
		if (e === void 0) throw wr;
		l = e, (o.repeat !== "unique" || !c.has(e)) && (s = e);
	}
	if (s === void 0) {
		let e = Dr(n, o.prompt, "exhausted", "has no unique value remaining");
		if (!Vr(a.acceptedBlocks ?? [], e)) throw new Er(e);
		s = l;
	}
	if (s === void 0) throw Error(`Acquisition step ${o.key} has no text fallback.`);
	dr(a.selections, o.key, t, s);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/engine.ts
var Kr = class {
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
		this.request = e, this.services = t, this.previous = e.previousStates ?? [], this.facts = e.facts ?? {}, this.state = yr(e.initialState, e.occurrence), this.state.acceptedBlocks = B(this.state.acceptedBlocks, e.acceptedBlocks), this.stepsByKey = new Map((e.steps ?? []).map((e) => [e.key, e]));
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
			if (e === wr) return { status: "cancelled" };
			if (e instanceof Er) return {
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
		if (t > Tr.depth) throw Error("Mutation acquisition nesting exceeds its safe limit.");
		if (!hr(e.when, this.state, this.facts)) return;
		let n = Wr(e, this.request.occurrence, this.previous);
		if (n) {
			let t = Dr(this.request.mutationName, e.prompt, "eligibility", n);
			if (!Vr(this.state.acceptedBlocks ?? [], t)) throw new Er(t);
		}
		let r = Math.max(1, Math.trunc(e.count ?? 1));
		for (let n = 0; n < r; n += 1) await this.resolveStep(e, t);
	}
	async resolveStep(e, t) {
		if (this.resolutions += 1, this.resolutions > Tr.resolutions) throw Error("Mutation acquisition contains too many nested resolutions.");
		let n = this.executionCounts.get(e.key) ?? 0;
		if (this.executionCounts.set(e.key, n + 1), e.kind === "text") {
			await Gr({
				executionIndex: n,
				mutationName: this.request.mutationName,
				previousStates: this.previous,
				services: this.services,
				state: this.state,
				step: e
			});
			return;
		}
		let r = (e.options ?? []).filter((e) => hr(e.when, this.state, this.facts));
		if (r.length === 0) throw Error(`Acquisition step ${e.key} has no options.`);
		let i = I(this.state.selections, e.key, n), a = i ? r.find((e) => e.id === i) : await this.resolveOption(e, n, r);
		if (!a) throw Error(`Acquisition step ${e.key} retained an unknown option.`);
		if (dr(this.state.selections, e.key, n, a.id), a.next) {
			let n = this.stepsByKey.get(a.next);
			if (!n) throw Error(`Acquisition step ${e.key} references missing ${a.next}.`);
			await this.visit(n, t + 1);
		}
		await Cr(this, e, n, a);
	}
	async resolveOption(e, t, n) {
		let r = this.request.occurrence > 1;
		if (!r && e.initial) {
			let t = n.find((t) => t.id === e.initial);
			if (!t) throw Error(`Acquisition step ${e.key} has no initial option.`);
			return t;
		}
		if (r && e.repeat === "copy-first") {
			let r = I(this.previous.find((e) => e.occurrence === 1)?.selections ?? {}, e.key, t), i = n.find((e) => e.id === r);
			if (i) return i;
		}
		if (r && e.repeat === "advance") return Hr(this.request, this.state, e, t, n);
		if (r && e.repeat === "conditional-advance") return Ur(this.request, this.state, e, t, n);
		let i = r && e.repeat === "unique" ? ur(e.key, n, [...this.previous, this.state]) : n;
		if (i.length === 0) {
			let r = I(this.previous.at(-1)?.selections ?? {}, e.key, t);
			return V(this.request, this.state, e, n.find((e) => e.id === r) ?? n.at(-1), "exhausted", "has no further result remaining");
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
		for (let r = 0; r < Tr.tableRolls; r += 1) {
			let r = await this.roll(e.formula ?? "1d100", `${this.request.mutationName}: ${e.prompt}`), i = n.filter((e) => r.total >= (e.min ?? -Infinity) && r.total <= (e.max ?? Infinity));
			if (i.length === 0) continue;
			let a = i.length === 1 ? i[0] : await this.choose(e, i);
			return dr(this.state.rolls, e.key, t, r.total), r.announce && this.announcements.push(r.announce), a;
		}
		return V(this.request, this.state, e, n.at(-1), "exhausted", "has no further result remaining");
	}
	async choose(e, t) {
		let n = await this.services.choose({
			options: t,
			prompt: e.prompt,
			title: this.request.mutationName
		});
		if (n === void 0) throw wr;
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
async function qr(e, t) {
	let n = e.initialState, r = (e.retainedRolls ?? []).every((e) => Number.isFinite(n?.rolls[e.key]));
	if (n?.status !== "resolved" || !r) return new Kr(e, t).run();
	let i = yr(n, e.occurrence);
	return i.grants = [...n.grants], i.modifiers = [...n.modifiers], i.acceptedBlocks = B(n.acceptedBlocks, e.acceptedBlocks), i.status = "resolved", {
		announcements: [],
		retainedRolls: {
			...br(i),
			...Object.fromEntries((e.retainedRolls ?? []).map((e) => [e.key, i.rolls[e.key]]))
		},
		state: i,
		status: "resolved"
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/dialog.ts
function H(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function Jr(e) {
	let t = e.options.filter((e) => e.description), n = [...t.length ? [
		"<ul class=\"tw:flex tw:flex-col tw:gap-2\">",
		...t.map((e) => `<li><strong>${H(e.label)}</strong><div class="tw:text-sm tw:opacity-70">${H(e.description ?? "")}</div></li>`),
		"</ul>"
	] : []];
	if (e.options.length > 4) {
		let t = [
			"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-2\">",
			"<fieldset class=\"tw:dui-fieldset\">",
			`<legend class="tw:dui-fieldset-legend">${H(e.prompt)}</legend>`,
			"<select class=\"tw:dui-select tw:w-full\" name=\"mutation-acquisition-choice\">",
			...e.options.map((e) => `<option value="${H(e.id)}">${H(e.label)}</option>`),
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
		`<p>${H(e.prompt)}</p>`,
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
async function Yr(e, t) {
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
		content: `<fieldset class="fvtt-wfrp-ratter-root tw:dui-fieldset"><legend class="tw:dui-fieldset-legend">${H(e)}</legend><input class="tw:dui-input tw:w-full" name="mutation-acquisition-value" type="text" autocomplete="off" required></fieldset>`,
		rejectClose: !1,
		window: { title: t }
	});
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
async function Xr(e, t) {
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
var Zr = {
	choose: Jr,
	input: ({ prompt: e, title: t }) => Yr(e, t),
	roll: Xr
};
function Qr(e) {
	return Object.entries(e).map(([e, t]) => `<div><dt class="tw:font-semibold">${H(e)}</dt><dd>${H(Array.isArray(t) ? t.join(", ") : String(t))}</dd></div>`);
}
async function $r(e, t) {
	let n = (t.acceptedBlocks ?? []).map((e) => `<li><span>${H(e.message)}</span></li>`), r = [
		"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-3\">",
		"<p>This mutation already has a resolved acquisition. Keep it, or explicitly reconfigure its stored results.</p>",
		"<dl class=\"tw:grid tw:grid-cols-2 tw:gap-2\">",
		...Qr(t.selections),
		...Qr(t.rolls),
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
function ei(e, t, n) {
	let r = [...e.items].filter((e) => e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 ? !1 : Br(e)?.definitionId === n), i = r.findIndex((e) => e.id === t.id), a = r.flatMap((e, t) => {
		let n = zr(Br(e)?.state?.acquisition);
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
function ti(e) {
	return L(e) ? Object.fromEntries(Object.entries(e).filter((e) => Number.isFinite(e[1]))) : {};
}
function ni(e) {
	return new Set(e?.modifiers.map((e) => e.key) ?? []);
}
function ri(e) {
	return zr(e.state?.acquisition);
}
function ii(e, t, n) {
	let r = ti(e.state?.rolls), i = Object.fromEntries((e.retainedRolls ?? []).filter((e) => typeof r[e.key] == "number").map((e) => [e.key, r[e.key]]));
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
function ai(e, t) {
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
async function oi(t, n, r, i, a, o, s) {
	let c = L(n.state) ? { ...n.state } : {}, l = ti(c.rolls);
	if (a) {
		let e = ni(o);
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
var si = 8;
function ci(e) {
	return L(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.getFlag == "function" && typeof e.toObject == "function" : !1;
}
function li(e, t) {
	return t.items.has?.(e.id) === !0 ? !0 : t.items.get?.(e.id) !== void 0 || [...t.items].some((t) => t === e);
}
function di(e) {
	let t = e.mutationAcquisitionAcceptedBlocks;
	return B(Array.isArray(t) ? t : void 0);
}
function fi(e, t) {
	e.mutationAcquisitionAcceptedBlocks = [...t];
}
function U(e, t = !1) {
	return e.abortItemCreation = !0, e.mutationAcquisitionCancelled = !0, t && (e.mutationAcquisitionRerollRequested = !0), !1;
}
async function pi(e, t, n, r, i) {
	for (let a of t) {
		if (Vr(n, a)) continue;
		let t = await Ze(e, a, i);
		if (t === "reroll") return U(r, !0);
		if (t !== "accept") return U(r);
		n.splice(0, n.length, ...B(n, [a])), fi(r, n);
	}
	return !0;
}
async function mi(e, t, n, r, i, a) {
	let o = ee(t.system.mutationType.value);
	if (!o) throw Error(`${t.name} has no physical or mental mutation classification.`);
	let s = Pe(e, {
		acquisition: n.acquisition,
		data: t.toObject(),
		name: t.name,
		nature: o
	}, r ? t.id : void 0);
	return pi(t.name, s, i, a, a.mutationAcquisitionCanReroll === !0);
}
async function hi(e, t, n) {
	if (n.skipMutationAcquisition === !0 || !ci(e)) return !0;
	let r = ye(t) ? t : ye(e.actor) ? e.actor : void 0;
	if (!r) return !0;
	let i = Br(e);
	if (!i) return !0;
	let a = li(e, r), o = ri(i), s = n.mutationAcquisitionReconfigure === !0, c = ei(r, e, i.definitionId);
	if (s && a && !c.isLatest) return ui.notifications.warn(`${e.name}: only the latest active occurrence can be reconfigured because later results depend on its retained history.`), !1;
	let l = c.occurrence, u = B(o?.acceptedBlocks, di(n));
	if (fi(n, u), !await mi(r, e, i, a, u, n)) return !1;
	let d = s ? ai(l, u) : o;
	d ??= ii(i, l, u);
	let f = [];
	for (let t = 0; t < si; t += 1) {
		let t = await qr({
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
		}, Zr);
		if (t.status === "cancelled") return U(n);
		if (f.push(...t.announcements), t.status === "blocked") {
			let r = await Ze(e.name, t.block, n.mutationAcquisitionCanReroll === !0);
			if (r === "reroll") return U(n, !0);
			if (r !== "accept") return U(n);
			u.splice(0, u.length, ...B(u, [t.block])), fi(n, u), d = {
				...t.state,
				acceptedBlocks: [...u]
			};
			continue;
		}
		let p = Fe(r, e.name, t.state, a ? e.id : void 0);
		if (!await pi(e.name, p, u, n, n.mutationAcquisitionCanReroll === !0)) return !1;
		await oi(e, i, {
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
async function gi(e) {
	let t = await fromUuid(e);
	if (!ci(t) || !ye(t.actor)) throw Error(`The UUID ${e} does not resolve to an owned mutation Item.`);
	let n = Br(t);
	if (!n) throw Error(`${t.name} has no Mutant's Handbook automation data.`);
	let r = ri(n);
	if (r?.status === "resolved" && await $r(t.name, r) === "keep") return !0;
	let i = { ...r?.status === "resolved" ? { mutationAcquisitionReconfigure: !0 } : {} }, a = await hi(t, t.actor, i);
	return a && await F(t.actor.uuid), a;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/documents.ts
function W(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function _i(e) {
	return W(e) ? e : void 0;
}
function vi(e) {
	return W(e) ? e : void 0;
}
function yi(e) {
	return W(e) ? e : void 0;
}
function bi(e) {
	return W(e.context) || (e.context = {}), e.context;
}
function xi(t) {
	let n = t.flags?.[e]?.mutationAction;
	return W(n) && typeof n.actionId == "string" ? n.actionId : void 0;
}
function Si(e, t, n) {
	let r = n.context?.mutationActionId, i = n.preData?.options?.mutationActionId, a = n.item;
	return r === t || i === t || a?.id === e.id || a?.uuid !== void 0 && a.uuid === e.uuid;
}
function Ci(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
function G(t, n) {
	return (t.itemTypes?.mutation ?? Ci(t)).filter((t) => {
		if (t.type !== void 0 && t.type !== "mutation") return !1;
		let r = t.flags?.[e], i = r?.mutationAutomation;
		return (W(i) ? i.definitionId : t.id) === n && r?.mutantsHandbookRetired !== !0 && r?.mutantsHandbookPossessionRemoved !== !0;
	}).length;
}
function wi(e, t) {
	return Ti(e, t)[0];
}
function Ti(t, n) {
	return (t.itemTypes?.mutation ?? Ci(t)).filter((t) => {
		if (t.type !== void 0 && t.type !== "mutation") return !1;
		let r = t.flags?.[e], i = r?.mutationAutomation;
		return (W(i) ? i.definitionId : t.id) === n && r?.mutantsHandbookRetired !== !0 && r?.mutantsHandbookPossessionRemoved !== !0;
	});
}
function Ei(t) {
	let n = t?.flags?.[e]?.mutationAutomation, r = t?.getFlag?.(e, "mutationAutomation"), i = W(n) ? n : W(r) ? r : void 0, a = W(i?.state) ? i.state : void 0, o = W(a?.acquisition) ? a.acquisition : void 0;
	return o?.status === "resolved" ? o : {};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/usage.ts
var Di = "mutationActionUsage", Oi = 480 * 60, ki = "dimensional-instability-teleport", Ai = /* @__PURE__ */ new Map();
function ji() {
	return Reflect.get(globalThis, "game");
}
function Mi() {
	let e = Number(ji()?.time?.worldTime);
	return Number.isFinite(e) ? e : Math.floor(Date.now() / 1e3);
}
function Ni(t) {
	let n = t.flags?.[e]?.[Di];
	if (!W(n) || n.version !== 1 || !W(n.actions)) return {
		actions: {},
		version: 1
	};
	let r = {};
	for (let [e, t] of Object.entries(n.actions)) Array.isArray(t) && (r[e] = t.filter((e) => W(e) && typeof e.id == "string" && Number.isFinite(e.at) && typeof e.period == "string" && typeof e.targetId == "string"));
	return {
		actions: r,
		version: 1
	};
}
function Pi(e, t) {
	return e === "day" ? `day:${Math.floor(t / 86400)}` : e === "scene" ? `scene:${ji()?.combat?.id ?? ji()?.scene?.id ?? "none"}` : e ?? "use";
}
function Fi(e) {
	if (typeof e == "string") return e;
	if (W(e)) for (let t of [
		"token",
		"id",
		"uuid",
		"actor"
	]) {
		let n = e[t];
		if (typeof n == "string") return n;
		if (W(n)) {
			let e = n.uuid ?? n.id;
			if (typeof e == "string") return e;
		}
	}
}
function Ii(e, t) {
	if (!e.usage?.perTarget) return ["*"];
	let n = t?.context?.targets, r = Array.isArray(n) ? n : [...ji()?.user?.targets ?? []], i = [...new Set(r.map(Fi).filter((e) => !!e))];
	return i.length ? i : ["untargeted"];
}
function Li(e, t, n = Mi()) {
	let r = Ni(t).actions[e.id] ?? [];
	if (e.usage?.period === "eight-hours" || e.id === ki) return r.filter((e) => e.at > n - Oi);
	let i = Pi(e.usage?.period, n);
	return r.filter((e) => e.period === i);
}
function Ri(e, t) {
	let n = e.usage?.max;
	return n === "tb" ? Math.max(0, Number(t.system?.characteristics?.t?.bonus) || 0) : typeof n == "number" ? n : Infinity;
}
function zi(e) {
	let t = bi(e), n = t.mutationActionUseId;
	if (typeof n == "string" && n) return n;
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return t.mutationActionUseId = r, r;
}
function Bi(e, t, n, r) {
	let i = Ri(e, t), a = Li(e, n), o = r?.context?.mutationActionUseId;
	return Ii(e, r).every((e) => {
		let t = a.filter((t) => t.targetId === e);
		return t.some((e) => e.id === o) || t.length < i;
	});
}
function Vi(e, t, n, r) {
	let i = r?.context?.mutationActionUseId;
	return typeof i == "string" && Li(e, n).some((e) => e.id === i) ? !0 : (Number(t.system?.status?.advantage?.value) || 0) >= (e.usage?.advantageCost ?? 0) && Bi(e, t, n, r);
}
function Hi(e, t) {
	if (e.mutationName !== "Dimensional Instability") return e.test?.difficulty;
	let n = [
		"average",
		"challenging",
		"difficult",
		"hard",
		"vhard"
	];
	return n[Math.min(n.length - 1, Li(e, t).length)];
}
async function Ui(e, t) {
	if (t <= 0) return;
	if (e.modifyAdvantage) {
		await e.modifyAdvantage(-t);
		return;
	}
	let n = Number(e.system?.status?.advantage?.value) || 0;
	await e.update?.({ "system.status.advantage.value": Math.max(0, n - t) });
}
async function Wi(t, n, r, i) {
	let a = zi(i);
	if (!Vi(t, n, r, i)) return !1;
	let o = Ni(r), s = o.actions[t.id] ?? [];
	if (s.some((e) => e.id === a)) return !0;
	await Ui(n, t.usage?.advantageCost ?? 0);
	let c = Mi(), l = Pi(t.usage?.period, c), u = Ii(t, i).map((e) => ({
		at: c,
		id: a,
		period: l,
		targetId: e
	})), d = s.filter((e) => e.at > c - 32 * 86400).slice(-99);
	return o.actions[t.id] = [...d, ...u], await r.update?.({ [`flags.${e}.${Di}`]: o }), !0;
}
async function Gi(e, t, n, r) {
	let i = `${n.uuid ?? n.id ?? "item"}:${e.id}`, a = (Ai.get(i) ?? Promise.resolve(!0)).catch(() => !1).then(() => Wi(e, t, n, r));
	Ai.set(i, a);
	try {
		return await a;
	} finally {
		Ai.get(i) === a && Ai.delete(i);
	}
}
function Ki(e, t) {
	return Li(e, t).length;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/card.ts
var qi = "data-ratter-mutation-action";
function K(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Ji(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : typeof e == "string" && e ? [e] : [];
}
function q(e, t) {
	let n = Ji(t);
	return n.length ? `<p><strong>${K(e)}:</strong> ${n.map(K).join("; ")}</p>` : "";
}
function Yi(e, t, n, r) {
	let i = Number(r.result?.SL), a = t.system?.characteristics?.wp, o = Math.max(1, G(t, e.mutationId)), s = [
		Number.isFinite(i) ? `SL ${i}` : void 0,
		Number.isFinite(Number(a?.value)) ? `WP ${Number(a?.value)}` : void 0,
		Number.isFinite(Number(a?.bonus)) ? `WPB ${Number(a?.bonus)}` : void 0,
		`mutation level ${o}`
	].filter((e) => !!e);
	return e.usage?.period && s.push(`uses this ${e.usage.period}: ${Ki(e, n)}`), s.join("; ");
}
function Xi(e, t) {
	if (!e.miscast || !t.result) return;
	if (t.result.tables ??= {}, !t.isFumble) {
		t.result.tables.miscast?.key === `${e.miscast}mis` && delete t.result.tables.miscast;
		return;
	}
	let n = e.miscast === "major", r = Reflect.get(globalThis, "game");
	t.result.tables.miscast = {
		class: "fumble-roll",
		key: n ? "majormis" : "minormis",
		label: r?.i18n?.localize?.(n ? "ROLL.MajorMis" : "ROLL.MinorMis") ?? (n ? "Major Miscast" : "Minor Miscast")
	};
}
function Zi(e, t, n, r) {
	let i = Ji(e.conditions), a = Et(e.id).length ? "<p><strong>Automation:</strong> After accepting the final roll, right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${qi}="${K(e.id)}">`,
		`<p><strong>${K(e.mutationName)} — ${K(e.name)}</strong></p>`,
		q("Target", e.target),
		q("Range", e.range),
		q("Duration", e.duration),
		q("Outcome", e.outcome),
		q("Rules", e.rules),
		i.length ? `<p><strong>Condition guidance:</strong> ${i.map(K).join("; ")}. Apply these only after the final roll is accepted.</p>` : "",
		`<p><strong>Rolled values:</strong> ${K(Yi(e, t, n, r))}</p>`,
		a,
		"</section>"
	].join("");
}
function Qi(e, t, n, r) {
	!Si(n, e.id, r) || !r.result || (Xi(e, r), r.result.other ??= [], r.result.other = r.result.other.filter((e) => !e.includes(qi)), r.result.other.push(Zi(e, t, n, r)));
}
function $i(e) {
	let t = Et(e.id).length ? "<p><strong>Automation:</strong> Right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${qi}="${K(e.id)}">`,
		`<h3>${K(e.mutationName)} — ${K(e.name)}</h3>`,
		q("Target", e.target),
		q("Range", e.range),
		q("Duration", e.duration),
		q("Outcome", e.outcome),
		q("Rules", e.rules),
		q("Condition guidance", e.conditions),
		t,
		"</section>"
	].join("");
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/outcome-documents.ts
function ea(t) {
	let n = t.system?.test, r = n?.options?.mutationActionId ?? n?.preData?.options?.mutationActionId;
	if (typeof r == "string") return r;
	let i = t.flags?.[e]?.mutationActionOutcome;
	return W(i) && typeof i.actionId == "string" ? i.actionId : void 0;
}
function ta(t) {
	return t.flags?.[e]?.mutationActionOutcomeApplied === !0;
}
async function na(t) {
	await t.setFlag?.(e, "mutationActionOutcomeApplied", !0);
}
function ra(e) {
	if (!W(e)) return;
	let t = e.actor;
	return W(t) ? t : e;
}
function ia(e) {
	let t = e?.targets?.filter((e) => W(e)) ?? [];
	return t.length ? t : [...Reflect.get(globalThis, "game")?.user?.targets ?? []].flatMap((e) => ra(e) ?? []);
}
async function aa(t) {
	let n = t.system?.test ? Reflect.get(t.system.test, "actor") : void 0;
	if (W(n)) return n;
	let r = t.flags?.[e]?.mutationActionOutcome, i = W(r) ? r.actorUuid : void 0;
	if (typeof i != "string") return;
	let a = await Reflect.get(globalThis, "fromUuid")?.(i);
	return W(a) ? a : void 0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/effect-helpers.ts
function J(e, t = 0) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function Y(e, t, n) {
	return {
		async: !0,
		label: e,
		options: {
			activateScript: "return true;",
			hideScript: "",
			submissionScript: "",
			targeter: !1
		},
		script: n,
		trigger: t
	};
}
function X(e, t) {
	return {
		combat: null,
		rounds: e ?? null,
		seconds: t ?? null,
		startRound: null,
		startTime: null,
		startTurn: null,
		turns: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/timed-effects.ts
var oa = "Compendium.wfrp4e-core.items.Item.EO05HX7jql0g605A";
function Z(t, n, r) {
	return {
		changes: [],
		description: r,
		disabled: !1,
		duration: X(),
		flags: {
			[e]: {
				actionId: t.id,
				automationPhase: "mutation-phase-5"
			},
			wfrp4e: {}
		},
		img: "icons/svg/clockwork.svg",
		name: n,
		statuses: [],
		system: {
			scriptData: [],
			sourceData: {},
			transferData: {
				area: { aura: {} },
				avoidTest: { value: "none" },
				documentType: "Actor",
				equipTransfer: !1,
				prompt: !1,
				type: "document"
			},
			zone: {}
		},
		transfer: !1,
		type: "base"
	};
}
function sa(e, t, n) {
	return {
		levels: Math.max(1, G(e, t.mutationId)),
		sl: J(n?.result?.SL),
		wp: J(e.system?.characteristics?.wp?.value),
		wpb: J(e.system?.characteristics?.wp?.bonus)
	};
}
async function ca(t, n, r) {
	if (!t.createEmbeddedDocuments) return;
	let { levels: i, sl: a, wpb: o } = sa(t, n, r), s = Math.max(1, o + a) * 2 ** (i - 1), c = (await Reflect.get(globalThis, "fromUuid")?.(oa))?.toObject?.();
	if (!c) return;
	delete c._id, c.name = `${n.mutationName} — Flight (${30 * i})`;
	let l = c.system ??= {}, u = l.specification ??= {};
	u.value = String(30 * i);
	let d = c.flags ??= {};
	d[e] = {
		actionId: n.id,
		automationPhase: "mutation-phase-5",
		rounds: s
	};
	let f = Array.isArray(c.effects) ? c.effects : [];
	f.push({
		...Z(n, "Levitation duration", `Expires after ${s} rounds.`),
		system: {
			scriptData: [Y("Expire Mutant's Handbook outcome", "endRound", `const key = "flags.${e}.rounds";\nconst left = Number(this.item.getFlag("${e}", "rounds")) - 1;\nif (left <= 0) return this.item.delete();\nreturn this.item.update({[key]: left});`)],
			sourceData: {},
			transferData: {
				area: { aura: {} },
				avoidTest: { value: "none" },
				documentType: "Actor",
				equipTransfer: !1,
				prompt: !1,
				type: "document"
			},
			zone: {}
		},
		transfer: !0
	}), c.effects = f, await t.createEmbeddedDocuments("Item", [c]);
}
function la(t, n, r, i, a = n) {
	let { levels: o, sl: s, wp: c, wpb: l } = sa(a, r, i);
	if (t === "invisible") {
		let e = Math.max(1, c + s) * 2 ** (o - 1), t = Z(r, "Invisible", "Ends early after an attack or conspicuously loud noise.");
		return t.duration = X(e), t.statuses = ["invisible"], t.img = "icons/svg/invisible.svg", t;
	}
	if (t === "entrancement") {
		let e = Math.max(1, l + s), t = Z(r, `${r.mutationName} — Entranced`, `The source mutant gains +20 to social interactions with this Actor for ${e} hours.`);
		return t.duration = X(void 0, e * 3600), t;
	}
	if (t === "camouflage") {
		let e = Z(r, "Chameleon Camouflage (Scene)", "+20 to Stealth while the skin still matches the surroundings; delete when the scene changes."), t = e.system;
		return t.scriptData = [Y("Expire Mutant's Handbook outcome", "dialog", "if (args.skill?.name?.toLowerCase().includes(\"stealth\")) args.fields.modifier += 20;"), Y("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();")], e;
	}
	if (t === "foresight") {
		let t = J(n.system?.status && n.system.status.fortune ? n.system.status.fortune.value : 0), i = Z(r, "Oracle Foresight (Scene)", `+10 Initiative and ${o} temporary Fortune; delete when the scene ends.`);
		i.changes = [{
			key: "system.characteristics.i.modifier",
			mode: 2,
			priority: null,
			value: "10"
		}];
		let a = i.system;
		a.scriptData = [Y("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();"), Y("Expire Mutant's Handbook outcome", "deleteEffect", `const current = Number(this.actor.system.status.fortune.value);\nif (current > ${t}) return this.actor.update({"system.status.fortune.value": ${t}});`)];
		let s = i.flags, c = s[e] ??= {};
		return c.baseFortune = t, c.fortune = o, i;
	}
	let u = Math.max(1, c);
	if (t === "temporal-surge") {
		let e = Z(r, "Temporal Surge (This Turn)", "One additional Movement and Action are available during the current turn.");
		e.duration = X();
		let t = e.system;
		return t.scriptData = [Y("Expire Mutant's Handbook outcome", "endTurn", "return this.effect.delete();")], e;
	}
	let d = Z(r, "Telekinesis Active", `May move matter at WPB yards per round for ${u} rounds.`);
	return d.duration = X(u), d;
}
async function ua(e, t, n, r, i = t) {
	if (e === "levitation") return ca(t, n, r);
	let a = la(e, t, n, r, i);
	if (await t.createEmbeddedDocuments?.("ActiveEffect", [a]), e === "foresight") {
		let e = Math.max(1, G(t, n.mutationId)), r = t.system?.status?.fortune, i = J(r?.value);
		await t.update?.({ "system.status.fortune.value": i + e });
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/form-items.ts
var da = {
	Contortionist: "Compendium.wfrp4e-core.items.Item.TaYriYcJkFuIdBKp",
	Frenzy: "Compendium.wfrp4e-core.items.Item.hXcfygzujgyMN1uI",
	Painless: "Compendium.wfrp4e-core.items.Item.wMwSRDmgiF2IdCJr"
};
function fa(t, n, r) {
	let i = /^(.*) (\d+)$/.exec(t), a = i?.[1] ?? t, o = i?.[2] ?? (a === "Fear" ? "1" : "");
	return {
		effects: [],
		flags: { [e]: {
			automationPhase: "mutation-phase-5",
			mutationForm: r
		} },
		img: "systems/wfrp4e/icons/blank.png",
		name: a,
		system: {
			description: { value: `<p>Temporary ${t} benefit supplied by the active Mutant's Handbook form.</p>` },
			specification: { value: o }
		},
		type: n
	};
}
async function pa(t, n, r) {
	let i = Reflect.get(globalThis, "fromUuid"), a = (da[t] ? await i?.(da[t]) : void 0)?.toObject?.() ?? fa(t, n, r);
	delete a._id;
	let o = W(a.flags) ? a.flags : {};
	return a.flags = o, o[e] = {
		automationPhase: "mutation-phase-5",
		mutationForm: r
	}, a;
}
async function ma(e, t, n) {
	n.length && await e.createEmbeddedDocuments?.("Item", await Promise.all(n.map(([e, n]) => pa(e, n, t))));
}
function ha(e) {
	return Array.isArray(e.grants) ? e.grants.filter(W) : [];
}
async function ga(t, n, r) {
	let i = Reflect.get(globalThis, "fromUuid"), a = [];
	for (let t of ha(r)) {
		let r = (typeof t.sourceUuid == "string" ? await i?.(t.sourceUuid) : void 0)?.toObject?.();
		if (!r) continue;
		delete r._id;
		let o = W(r.flags) ? r.flags : {};
		r.flags = o, o[e] = {
			automationPhase: "mutation-phase-5",
			mutationForm: n
		}, a.push(r);
	}
	a.length && await t.createEmbeddedDocuments?.("Item", a);
}
function _a(e) {
	return (Array.isArray(e.modifiers) ? e.modifiers.filter(W) : []).flatMap((e) => {
		let t = J(e.value, NaN);
		return Number.isFinite(t) ? e.kind === "characteristic" && typeof e.characteristic == "string" ? [{
			key: `system.characteristics.${e.characteristic}.modifier`,
			mode: 2,
			priority: null,
			value: String(t)
		}] : e.kind === "move" ? [{
			key: "system.details.move.value",
			mode: 2,
			priority: null,
			value: String(t)
		}] : [] : [];
	});
}
function va(e) {
	let t = Array.isArray(e.modifiers) ? e.modifiers.filter((e) => W(e) && e.kind === "test") : [];
	if (t.length) return Y("Resolve Mutant's Handbook form", "dialog", `const modifiers = ${JSON.stringify(t)};\nconst skillName = args.skill?.name ?? args.test?.item?.name ?? "";\nconst characteristic = args.characteristic ?? args.test?.characteristicKey;\nfor (const modifier of modifiers) {\n  const matchesSkill = (modifier.skills ?? []).some(name => skillName === name || skillName.startsWith(name + " ("));\n  const matchesCharacteristic = (modifier.characteristics ?? []).includes(characteristic);\n  if (!matchesSkill && !matchesCharacteristic) continue;\n  const current = Number(args.fields.modifier);\n  const next = current + Number(modifier.value);\n  if (Number.isFinite(next)) args.fields.modifier = next;\n}`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/forms.ts
var ya = [
	"ws",
	"bs",
	"s",
	"t",
	"ag",
	"dex"
], ba = {
	A7OLAWKXWUfh0UGU: "ethereal",
	XheCM6GZG8FhAoGp: "mirror-image",
	NDDLEunW5biRvTfy: "shapeshifter",
	JtmI1wOwKqWT4zVG: "skinwalker",
	q3sK3RsdsJxrifZP: "swarmform",
	jPlCrsK3hTgkHsTR: "warp-spasm",
	mNNavbJayRcsyeXJ: "werebeast"
};
function xa(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
async function Sa(t, n) {
	let r = xa(t).filter((t) => t.flags?.[e]?.mutationForm === n).flatMap((e) => e.id ? [e.id] : []), i = [...t.effects ?? []].filter((t) => t.flags?.[e]?.mutationForm === n).flatMap((e) => e.id ? [e.id] : []);
	return r.length && await t.deleteEmbeddedDocuments?.("Item", r), i.length && await t.deleteEmbeddedDocuments?.("ActiveEffect", i), r.length > 0 || i.length > 0;
}
async function Ca(e, t) {
	let n = ba[t];
	!n || G(e, t) > 0 || await Sa(e, n);
}
function wa(t, n, r, i, a) {
	let o = `const ids = (this.actor.items ?? []).filter(item => item.flags?.["${e}"]?.mutationForm === "${n}").map(item => item.id);\nif (ids.length) await this.actor.deleteEmbeddedDocuments("Item", ids);`;
	return {
		changes: [],
		description: r,
		disabled: !1,
		duration: X(i, a),
		flags: {
			[e]: {
				actionId: t.id,
				automationPhase: "mutation-phase-5",
				mutationForm: n
			},
			wfrp4e: {}
		},
		img: "icons/svg/mystery-man.svg",
		name: `${t.mutationName} — Active Form`,
		statuses: [],
		system: {
			scriptData: [Y("Resolve Mutant's Handbook form", "deleteEffect", o)],
			sourceData: {},
			transferData: {
				area: { aura: {} },
				avoidTest: { value: "none" },
				documentType: "Actor",
				equipTransfer: !1,
				prompt: !1,
				type: "document"
			},
			zone: {}
		},
		transfer: !1,
		type: "base"
	};
}
function Ta(e, t) {
	let n = (W(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function Ea(e) {
	return {
		amphibian: {
			move: 3,
			trait: "Swim 5"
		},
		arthropod: {
			move: 3,
			trait: "Swim 4"
		},
		"bird-bat": { trait: "Flight 30" },
		fish: { trait: "Swim 10" },
		"insect-spider": {
			move: 4,
			trait: "Flight 5"
		},
		"lizard-snake": {
			move: 5,
			trait: "Swim 4"
		},
		mollusc: {
			move: 2,
			trait: "Swim 5"
		},
		"rodent-rabbit": { move: 5 }
	}[e] ?? {};
}
async function Da(e, t, n, r, i, a) {
	if (await Sa(n, e), t === "revert") return;
	let o = Ei(wi(n, r.mutationId)), s = J(i?.result?.SL), c = wa(r, e, r.outcome), l = [];
	if (e === "ethereal") c = wa(r, e, r.outcome, Math.max(1, J(n.system?.characteristics?.wp?.bonus) + s)), l = [["Ethereal", "trait"]];
	else if (e === "mirror-image") {
		let t = Math.max(1, G(n, r.mutationId)), i = Math.max(1, J(n.system?.characteristics?.wp?.value) + s * 10) * 2 ** (t - 1);
		c = wa(r, e, r.outcome, void 0, i * 60);
	} else if (e === "shapeshifter") {
		let t = Math.max(1, J(n.system?.characteristics?.t?.bonus) + s);
		c = wa(r, e, r.outcome, void 0, t * 3600);
	} else if (e === "skinwalker" && a) {
		c.changes = ya.flatMap((e) => {
			let t = J(a.system?.characteristics?.[e]?.value) - J(n.system?.characteristics?.[e]?.value);
			return t ? [{
				key: `system.characteristics.${e}.modifier`,
				mode: 2,
				priority: null,
				value: String(t)
			}] : [];
		});
		let e = J(a.system?.details?.move?.value, NaN);
		Number.isFinite(e) && c.changes.push({
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e)
		});
	} else if (e === "swarmform") {
		let e = Ea(Ta(o, "swarm-source"));
		c.changes = [...e.move === void 0 ? [] : [{
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e.move)
		}], ...Ta(o, "swarm-size") ? [{
			key: "system.details.size.value",
			mode: 5,
			priority: null,
			value: Ta(o, "swarm-size")
		}] : []], l = [["Swarm", "trait"], ...e.trait ? [[e.trait, "trait"]] : []];
	} else if (e === "warp-spasm") {
		l = [
			["Frenzy", "talent"],
			["Berserk Charge", "talent"],
			["Contortionist", "talent"],
			["Painless", "trait"],
			["Fear", "trait"]
		];
		let e = c.system;
		e.scriptData = [
			...e.scriptData ?? [],
			Y("Resolve Mutant's Handbook form", "endCombat", "return this.effect.delete();"),
			Y("Resolve Mutant's Handbook form", "deleteEffect", "await this.actor.addCondition(\"fatigued\", 1);")
		];
	} else if (e === "werebeast") {
		c.changes = _a(o);
		let t = va(o);
		if (t) {
			let e = c.system;
			e.scriptData = [...e.scriptData ?? [], t];
		}
		await ga(n, e, o);
	}
	await ma(n, e, l), await n.createEmbeddedDocuments?.("ActiveEffect", [c]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/companions.ts
function Oa(e, t) {
	let n = (W(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function ka(e) {
	return e.split("-").filter(Boolean).map((e) => `${e[0]?.toUpperCase() ?? ""}${e.slice(1)}`).join(" ");
}
function Aa(e, t, n) {
	let r = W(e.characteristics) ? e.characteristics : {};
	e.characteristics = r;
	let i = W(r[t]) ? r[t] : {};
	r[t] = i, i.initial = n, i.advances = 0, i.modifier = 0, i.value = n;
}
function ja(e, t) {
	return [
		"personality",
		"motivation",
		"short-ambition",
		"long-ambition"
	].flatMap((n) => {
		let r = Oa(e, `${t}-${n}`);
		return r ? [`<p><strong>${ka(n)}:</strong> ${r}</p>`] : [];
	}).join("");
}
function Ma(e, t, n) {
	let r = e.name ?? "Mutant";
	if (t === "spectral-companion") {
		let e = Oa(n, "companion-type") || "ghost";
		return {
			flags: {},
			img: "icons/magic/death/undead-ghost-scream-teal.webp",
			name: Oa(n, "companion-name") || `${r}'s ${ka(e)}`,
			system: { details: { notes: { value: ja(n, "companion") } } },
			type: "creature"
		};
	}
	let i = e.toObject?.() ?? {};
	delete i._id, i.effects = [], i.flags = {}, i.folder = null, i.items = [], i.type = "creature";
	let a = W(i.system) ? i.system : {};
	if (i.system = a, t === "bodysnatcher-drone") {
		i.name = `${r}'s Bodysnatcher Drone`;
		for (let [e, t] of Object.entries({
			ag: 30,
			bs: 0,
			dex: 0,
			fel: 0,
			i: 0,
			int: 0,
			s: 0,
			t: 0,
			wp: 0,
			ws: 30
		})) Aa(a, e, t);
		return a.details = {
			...W(a.details) ? a.details : {},
			move: { value: 2 },
			size: { value: "tiny" }
		}, a.status = {
			...W(a.status) ? a.status : {},
			wounds: {
				max: 1,
				value: 1
			}
		}, i.items = [
			{
				name: "Dodge",
				type: "skill",
				system: {
					advances: { value: 0 },
					characteristic: { value: "ag" }
				}
			},
			{
				name: "Melee (Grapple)",
				type: "skill",
				system: {
					advances: { value: 0 },
					characteristic: { value: "ws" }
				}
			},
			{
				name: "Stealth",
				type: "skill",
				system: {
					advances: { value: 10 },
					characteristic: { value: "ag" }
				}
			},
			{
				name: "Wallcrawler",
				type: "trait",
				system: {
					description: { value: "<p>May traverse walls and ceilings.</p>" },
					specification: { value: "" }
				}
			}
		], i;
	}
	i.name = `${r}'s Vestigial Twin`;
	for (let t of [
		"ws",
		"bs",
		"s",
		"t",
		"ag",
		"fel"
	]) {
		let n = t === "t" || t === "fel" ? 20 : t === "ag" ? Infinity : 30, r = Number(e.system?.characteristics?.[t]?.value) || 0;
		Aa(a, t, Number.isFinite(n) ? Math.max(0, r - n) : 0);
	}
	return a.details = {
		...W(a.details) ? a.details : {},
		move: { value: 0 },
		notes: { value: ja(n, "twin") }
	}, a.status = {
		...W(a.status) ? a.status : {},
		fate: {
			max: 0,
			value: 0
		},
		resilience: {
			max: 0,
			value: 0
		}
	}, i;
}
function Na(t, n) {
	let r = t.toObject?.() ?? {};
	delete r._id, r.name = `${t.name ?? "Mutant"}'s Symbiotic Twin`, Array.isArray(r.items) && (r.items = r.items.filter((t) => {
		if (!W(t) || !W(t.flags)) return !0;
		let n = t.flags[e];
		return !W(n) || !W(n.mutationAction) ? !0 : n.mutationAction.actionId !== "symbiotic-twin-manifest";
	}));
	let i = W(r.system) ? r.system : {};
	r.system = i;
	let a = W(i.details) ? i.details : {};
	return i.details = a, a.notes = { value: ja(n, "twin") }, r;
}
function Pa(t, n) {
	let r = t.flags?.[e]?.mutationCompanions, i = W(r) ? r[n] : void 0;
	return typeof i == "string" ? [{ uuid: i }] : Array.isArray(i) ? i.flatMap((e) => W(e) && typeof e.uuid == "string" ? [{
		mutationItemId: typeof e.mutationItemId == "string" ? e.mutationItemId : void 0,
		uuid: e.uuid
	}] : []) : [];
}
async function Fa(e, t) {
	let n = Pa(e, t), r = Reflect.get(globalThis, "fromUuid");
	return r ? (await Promise.all(n.map(async (e) => await r(e.uuid) ? e : void 0))).filter((e) => e !== void 0) : n;
}
function Ia(e, t) {
	let n = new Set(t.flatMap((e) => e.mutationItemId ? [e.mutationItemId] : []));
	return e.find((e) => !e.id || !n.has(e.id)) ?? e[t.length];
}
async function La(t, n, r) {
	let i = Ti(n, r.mutationId), a = await Fa(n, t);
	if (!i.length || a.length >= i.length) return;
	let o = Ia(i, a), s = Ei(o), c = t === "symbiotic-twin" ? Na(n, s) : Ma(n, t, s), l = W(c.flags) ? c.flags : {};
	c.flags = l, l[e] = {
		automationPhase: "mutation-phase-5",
		mutationCompanion: {
			hostUuid: n.uuid ?? n.id,
			kind: t,
			mutationId: r.mutationId
		}
	};
	let u = await Reflect.get(globalThis, "Actor")?.create?.(c), d = u?.uuid ?? u?.id;
	d && (await n.update?.({ [`flags.${e}.mutationCompanions.${t}`]: [...a, {
		mutationItemId: o?.id,
		uuid: d
	}] }), t === "symbiotic-twin" && (await n.update?.({ [`flags.${e}.mutationTwinUuid`]: d }), await u?.update?.({ [`flags.${e}.mutationTwinUuid`]: n.uuid ?? n.id })));
}
var Ra = /* @__PURE__ */ new Set();
function za() {
	Hooks.on("updateActor", (t, n, r, i) => {
		let a = Reflect.get(globalThis, "game");
		if (typeof i == "string" && a?.user?.id !== i || !W(t) || !W(n)) return;
		let o = t, s = o.uuid ?? o.id, c = o.flags?.[e]?.mutationTwinUuid, l = W(n.system) ? n.system : void 0, u = W(l?.status) ? l.status : void 0, d = W(u?.wounds) ? u.wounds : void 0, f = n["system.status.wounds.value"] ?? d?.value;
		if (typeof s != "string" || typeof c != "string" || !Number.isFinite(Number(f)) || Ra.has(s)) return;
		let p = Reflect.get(globalThis, "fromUuid");
		Ra.add(c), p?.(c).then((e) => e?.update?.({ "system.status.wounds.value": Number(f) })).finally(() => Ra.delete(c));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/outcomes.ts
var Ba = /* @__PURE__ */ new WeakSet();
function Va(e) {
	return e ? typeof e.failed == "boolean" ? !e.failed : e.result?.outcome !== "failure" : !0;
}
function Ha(e, t) {
	return e.when === "always" ? !0 : e.when === "success" ? Va(t) : !Va(t);
}
function Ua(e, t, n) {
	return e === "self" ? [t] : n;
}
async function Wa(e, t) {
	let n = Reflect.get(globalThis, "Roll");
	n && await (await new n(e).evaluate()).toMessage?.({ flavor: t });
}
async function Ga(e, t, n) {
	for (let r of t) {
		let t = {
			appendTitle: ` — ${n} follow-up`,
			fields: { difficulty: e.difficulty }
		}, i = e.skill ? await r.setupSkill?.(e.skill, t) : await r.setupCharacteristic?.(e.characteristic ?? "wp", t);
		if (i?.roll && (await i.roll(), !Va(i))) {
			for (let t of e.failureConditions) {
				let e = t.condition === "broken" && r.has?.("Skittish") ? 3 : t.amount ?? 1;
				await r.addCondition?.(t.condition, e);
			}
			e.failureRoll && await Wa(e.failureRoll.formula, e.failureRoll.label);
		}
	}
}
function Ka(e, t, n) {
	let r = Number(n?.result?.SL) || 0;
	return e === "sl" ? Math.max(0, r) : e === "fellowship-plus-sl" ? Math.max(0, (Number(t.system?.characteristics?.fel?.value) || 0) + r) : e;
}
async function qa(e, t, n, r, i) {
	if (e.kind === "roll") return Wa(e.formula, e.label);
	if (e.kind === "follow-up-test") return Ga(e, n, i.name);
	if (e.kind === "companion") return La(e.companion, t, i);
	if (e.kind === "form") return Da(e.form, e.mode, t, i, r, n[0]);
	let a = Ua(e.subject, t, n);
	if (e.kind === "condition") {
		for (let n of a) {
			let i = Ka(e.amount ?? 1, t, r);
			await n.addCondition?.(e.condition, i);
		}
		return;
	}
	if (e.kind === "remove-condition") {
		let n = Ka(e.amount ?? 1, t, r);
		for (let t of a) for (let r = 0; r < n; r += 1) await t.removeCondition?.(e.condition);
		return;
	}
	if (e.kind === "heal") {
		let n = Ka(e.amount, t, r);
		for (let e of a) await e.modifyWounds?.(n);
		return;
	}
	if (e.kind === "effect") for (let n of a) await ua(e.effect, n, i, r, t);
}
function Ja(e) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(e);
}
function Ya(e) {
	let t = ea(e);
	return !!(t && Et(t).length);
}
async function Xa(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	if (Ba.has(t) || ta(t)) return !1;
	let n = ea(t), r = n ? wt(n) : void 0;
	if (!r) return !1;
	let i = t.system?.test, a = await aa(t);
	if (!a) return !1;
	let o = Et(r.id).filter((e) => Ha(e, i)), s = ia(i);
	if (o.some((e) => e.kind !== "roll" && e.subject === "targets" || e.kind === "form" && e.source === "targets") && s.length === 0) return Ja(`Target one or more Actors before applying ${r.name}.`), !1;
	Ba.add(t);
	try {
		for (let e of o) await qa(e, a, s, i, r);
		return await na(t), !0;
	} finally {
		Ba.delete(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/index.ts
var Za = /* @__PURE__ */ new WeakSet();
function Qa(e, t, n) {
	let r = wt(n), i = _i(e), a = vi(t);
	if (!r || !i || !a) return;
	let o = xi(a);
	if (!(o !== void 0 && o !== n)) return {
		action: r,
		actor: i,
		item: a
	};
}
function $a(e, t) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(`${t.name ?? "This Actor"} cannot use ${e.name}: its use limit or Advantage cost is not available.`);
}
function eo(e, t, n) {
	let r = e.test?.bonusMultiplier ?? 1, i = e.test?.bonusCharacteristic;
	if (r <= 1 || !i) return;
	let a = bi(n), o = `mutationActionDamage:${e.id}`;
	if (typeof a[o] == "number") return;
	let s = Number(t.system?.characteristics?.[i]?.bonus);
	if (!Number.isFinite(s)) return;
	let c = s * (r - 1);
	n.preData ??= {};
	let l = Number(n.preData.additionalDamage) || 0;
	n.preData.additionalDamage = l + c, a[o] = c;
}
function to(e, t) {
	let n = t.result;
	if (!n || Za.has(n)) return;
	let r = Number(bi(t)[`mutationActionDamage:${e.id}`]), i = Number(n.damage);
	!Number.isFinite(r) || r === 0 || !Number.isFinite(i) || (n.damage = i + r, n.breakdown?.damage?.other?.push({
		label: e.name,
		value: r
	}), Za.add(n));
}
function no(e, t, n, r) {
	let i = Qa(e, t, n);
	if (!i || !W(r)) return;
	let { action: a, actor: o, item: s } = i;
	if (!Vi(a, o, s)) {
		r.abort = !0, $a(a, o);
		return;
	}
	let c = W(r.fields) ? r.fields : {};
	r.fields = c;
	let l = Hi(a, s);
	l && (c.difficulty = l);
	let u = W(r.flags) ? r.flags : {};
	r.flags = u, u.mutationActionId = a.id;
}
async function ro(e, t, n, r) {
	let i = Qa(e, t, n), a = yi(r);
	if (!i || !a) return !1;
	let { action: o, actor: s, item: c } = i, l = bi(a);
	l.mutationActionId = o.id, l.mutationActionItemUuid = c.uuid ?? c.id, a.preData ??= {}, a.preData.options ??= {}, a.preData.options.mutationActionActorUuid = s.uuid ?? s.id, a.preData.options.mutationActionId = o.id, a.preData.options.mutationActionItemUuid = c.uuid ?? c.id, a.preData.options.mutationActionUseId ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	let u = await Gi(o, s, c, a);
	return u ? eo(o, s, a) : $a(o, s), u;
}
async function io(e, t, n, r) {
	let i = Qa(e, t, n), a = yi(r);
	!i || !a || (to(i.action, a), Qi(i.action, i.actor, i.item, a));
}
function ao(e, t, n) {
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return {
		appendTitle: ` — ${e.mutationName}: ${e.name}`,
		fields: { difficulty: Hi(e, n) ?? "challenging" },
		mutationActionId: e.id,
		mutationActionActorUuid: t.uuid ?? t.id,
		mutationActionItemUuid: n.uuid ?? n.id,
		mutationActionUseId: r
	};
}
async function oo(e, t, n) {
	let r = ao(e, t, n);
	if (t.setupTrait) return t.setupTrait(n, r);
	if (e.test && "skill" in e.test && t.setupSkill) return t.setupSkill(e.test.skill, r);
	if (e.test && "characteristic" in e.test && t.setupCharacteristic) return t.setupCharacteristic(e.test.characteristic, r);
}
async function so(e, t, n) {
	let r = Reflect.get(globalThis, "game"), i = $i(e), a = r?.wfrp4e?.utility?.chatDataSetup?.(i) ?? { content: i };
	a.flags = {
		...typeof a.flags == "object" && a.flags ? a.flags : {},
		"fvtt-wfrp-ratter": { mutationActionOutcome: {
			actionId: e.id,
			actorUuid: t.uuid ?? t.id,
			itemUuid: n.uuid ?? n.id
		} }
	}, await Reflect.get(globalThis, "ChatMessage")?.create?.(a);
}
async function co(e, t, n) {
	let r = Qa(e, t, n);
	if (!r) return;
	let { action: i, actor: a, item: o } = r, s = i.test ? await oo(i, a, o) : { context: ao(i, a, o) };
	if (s && await ro(a, o, i.id, s)) {
		if (i.test && s.roll) {
			await s.roll();
			return;
		}
		await so(i, a, o);
	}
}
//#endregion
//#region src/module/api/create-module-api.ts
function lo() {
	return {
		applyMutationActionOutcome: Xa,
		checkMutantsHandbookCorruption: lr,
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		prepareMutationActionDialog: no,
		prepareMutationAcquisition: hi,
		recordMutationActionUse: ro,
		reconcileMutationAutomation: F,
		removeMutationGrantOwner: En,
		resolveMutationActionTest: io,
		resolveOwnedMutationAcquisition: gi,
		title: t,
		useMutationAction: co
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function uo() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = lo();
}
//#endregion
//#region src/module/settings.ts
var fo = "useMutantsHandbookMutations";
function po() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(e, fo, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function mo() {
	return game?.settings.get(e, fo) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/context-options.ts
var ho = [
	"CHATOPT.UseFortuneReroll",
	"CHATOPT.Reroll",
	"CHATOPT.UseFortuneSL",
	"CHATOPT.DarkDeal",
	"CHATOPT.StartOpposed",
	"CHATOPT.DefendOpposed",
	"CHATOPT.CompleteUnopposed",
	"CHATOPT.EditTest"
];
function go(e) {
	let t = e.dataset.messageId;
	return (t ? game?.messages.get(t)?.system.test : void 0)?.options?.[s] === !0;
}
function _o(e) {
	let t = e.dataset.messageId;
	return t ? game?.messages.get(t) : void 0;
}
function vo(e) {
	let t = e.condition;
	e.condition = (e) => go(e) ? !1 : t ? t(e) : !0;
}
function yo() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		if (!game) return;
		let n = new Set(ho.map((e) => game.i18n.localize(e)));
		for (let e of t) n.has(e.name) && vo(e);
		t.push({
			callback: async (e) => {
				let t = _o(e);
				t && await Xa(t);
			},
			condition: (e) => {
				let t = _o(e);
				return !!(t && t.flags?.["fvtt-wfrp-ratter"]?.mutationActionOutcomeApplied !== !0 && Ya(t));
			},
			name: "Apply Mutant’s Handbook Outcome"
		});
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/hooks.ts
function bo(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (n.type !== "mutation" || typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e]?.mutationAutomation;
	return typeof r == "object" && r ? n : void 0;
}
function xo(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e];
	return typeof r?.mutationGrant == "object" || typeof r?.mutationSkillGrant == "object" ? n : void 0;
}
function So(e) {
	e.catch(Be);
}
function Co(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	return typeof n == "object" && n && typeof n.definitionId == "string" ? n.definitionId : void 0;
}
async function wo(e) {
	let t = Co(e);
	t && e.actor && await Ca(e.actor, t), e.actor && await En(e.actor.uuid, e.id);
}
function To(e) {
	return typeof e == "string" && game?.user.id === e;
}
async function Eo(e, t = {}) {
	e.actor && (e.name.trim().toLowerCase() === "chimeran curse" && t.mutationAcquisitionHandlesChimeranRetirement !== !0 && await Te(e.actor), await F(e.actor.uuid));
}
function Do() {
	Hooks.on("createItem", (e, t, n) => {
		if (!To(n)) return;
		let r = bo(e);
		r?.actor && So(Eo(r, typeof t == "object" && t ? t : {}));
	}), Hooks.on("deleteItem", (e, t, n) => {
		if (!To(n)) return;
		let r = bo(e);
		if (r?.actor) {
			So(wo(r));
			return;
		}
		let i = xo(e);
		i?.actor && So(F(i.actor.uuid));
	}), Hooks.on("updateItem", (t, n, r, i) => {
		if (!To(i)) return;
		let a = bo(t), o = a?.flags?.[e];
		a?.actor && (o?.mutantsHandbookRetired === !0 || o?.mutantsHandbookPossessionRemoved === !0) && So(wo(a));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/migration.ts
var Oo = `${e}.ratter-11-items`, ko = "The Mutant's Handbook", Ao = new Set([
	"acquisition",
	"actions",
	"automated",
	"definitionId",
	"grants",
	"manual",
	"retainedRolls",
	"selfControl",
	"status",
	"version"
]);
function Q(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function $(e) {
	return e.toObject();
}
function jo(t) {
	let n = t.flags;
	if (!Q(n)) return {};
	let r = n[e];
	return Q(r) ? r : {};
}
function Mo(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.filter(Q) : [];
}
function No(e) {
	return Array.isArray(e) ? e.map(No) : Q(e) ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, No(t)])) : e;
}
function Po(e, t) {
	return JSON.stringify(No(e)) === JSON.stringify(No(t));
}
function Fo(e) {
	let t = { ...e };
	return delete t._key, delete t._stats, t;
}
function Io(t) {
	let n = t.flags;
	if (!Q(n)) return !1;
	let r = n[e];
	return Q(r) && typeof r.automationPhase == "string";
}
function Lo(e, t) {
	if (!Q(e)) return t;
	let n = Object.fromEntries(Object.entries(e).filter(([e]) => !Ao.has(e)));
	return {
		...t,
		...n
	};
}
function Ro(t, n) {
	let r = jo(n).mutationAutomation;
	if (!Q(r)) return;
	let i = jo(t).mutationAutomation, a = Lo(i, r), o = Mo(t).filter(Io), s = Mo(n).filter(Io), c = [...s, ...Mo(t).filter((e) => !Io(e))], l = {};
	return Po(i, a) || (l[`flags.${e}.mutationAutomation`] = a), Po(o.map(Fo), s.map(Fo)) || (l.effects = c), Object.keys(l).length > 0 ? l : void 0;
}
function zo(e) {
	return Q(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.toObject == "function" : !1;
}
function Bo(e) {
	let t = jo($(e)).mutationAutomation;
	return Q(t) && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
function Vo(e) {
	return jo($(e)).sourceDocument === ko;
}
function Ho(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.uuid, t);
	for (let e of t) for (let t of e.tokens ?? []) t.actor && n.set(t.actor.uuid, t.actor);
	return [...n.values()];
}
async function Uo(e, t) {
	if (!e.deleteEmbeddedDocuments || !e.createEmbeddedDocuments) throw Error(`${e.name} does not support embedded Active Effect migration.`);
	let n = Mo($(e)).filter(Io), r = n.map((e) => e._id).filter((e) => typeof e == "string");
	if (r.length !== n.length) throw Error(`${e.name} has a managed Active Effect without an ID.`);
	r.length > 0 && await e.deleteEmbeddedDocuments("ActiveEffect", r);
	let i = Mo($(t)).filter(Io).map((e) => {
		let t = { ...e };
		return delete t._key, t;
	});
	i.length > 0 && await e.createEmbeddedDocuments("ActiveEffect", i, {
		keepId: !0,
		skipMutationAcquisition: !0
	});
}
async function Wo() {
	if (!game || game.user.isUniqueGM !== !0) return;
	let e = game.packs.get(Oo);
	if (!e) throw Error(`The required compendium ${Oo} is unavailable.`);
	let t = (await e.getDocuments()).filter(zo), n = new Map(t.map((e) => [Bo(e) ?? e.id, e])), r = new Map(t.map((e) => [e.name, e])), i = Ho(game.actors ?? [], game.scenes ?? []);
	for (let e of i) {
		let t = [], i = [];
		for (let a of Array.from(e.items).filter(zo)) {
			let e = (Bo(a) ? n.get(Bo(a)) : void 0) ?? (Vo(a) ? r.get(a.name) : void 0);
			if (!e) continue;
			let o = Ro($(a), $(e));
			o && ("effects" in o && (i.push({
				owned: a,
				source: e
			}), delete o.effects), Object.keys(o).length > 0 && t.push({
				_id: a.id,
				...o
			}));
		}
		t.length > 0 && await e.updateEmbeddedDocuments("Item", t);
		for (let e of i) await Uo(e.owned, e.source);
		await F(e.uuid);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/replacement.ts
var Go = Symbol.for(`${e}.mutantsHandbookReplacement`);
function Ko() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[Go] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, Go, { value: !0 }), e.checkCorruption = async function() {
		if (!mo()) {
			await t.call(this);
			return;
		}
		try {
			await cr(this.parent);
		} catch (e) {
			Be(e);
		}
	};
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function qo() {
	Hooks.once("init", () => {
		po(), uo(), yo(), Do(), za();
	}), Hooks.once("ready", async () => {
		Ko();
		try {
			await Wo();
		} catch (e) {
			Be(e);
		}
	});
}
//#endregion
//#region src/main.ts
qo();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map