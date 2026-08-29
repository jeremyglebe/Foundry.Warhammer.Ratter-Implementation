//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation", n = "fvtt-wfrp-ratter.ratter-11-tables", r = "modules/fvtt-wfrp-ratter/icons/mutations/mutants-handbook-mutation.png", i = "mutantsHandbookPatron", a = "mutantsHandbookChosenPatron", o = "mutantsHandbookChaosSpawn", s = "mutantsHandbookRetired", c = "mutantsHandbookPossessionRemoved", l = "mutantsHandbookCorruption", u = "mutantsHandbookPendingCorruption", d = "mutantsHandbookPendingMutation", f = {
	dwarf: "ueEWO9920dCmA7qP",
	elf: "X4hMeYoCFx77QIvv",
	gnome: "gktszioKqcA637wH",
	halfling: "4QnKxakvIARiyqAq",
	human: "2XUdBDbSoynCvCoL",
	ogre: "5hidSDB0YHyyrTVi"
}, p = "AAOqrs1CNIgUk5OI", ee = {
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
}, ne = {
	khorne: "xYZjhCQJutOjg9d2",
	nurgle: "0Cou1rcMlV2EKpES",
	slaanesh: "2Y3sAdXUrS0RElg8",
	tzeentch: "nRyJeXxAsuOe5gdV"
}, re = {
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
function ie(e) {
	return re[e.trim().toLowerCase()];
}
function m(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("physical")) return "physical";
	if (t.startsWith("mental")) return "mental";
}
function ae(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("trivial")) return "trivial";
	if (t.startsWith("minor")) return "minor";
	if (t.startsWith("major")) return "major";
	if (t.includes("chosen")) return "chosen";
}
function oe(e) {
	return Math.min(Math.max(0, Math.floor(e)), 4) * 10;
}
function se(e, t) {
	return e === "physical" ? t.toughness : t.willpower;
}
function ce(e, t) {
	return Math.max(0, e - Math.max(0, t));
}
function le(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = m(r);
		e === "mental" ? t += 1 : e === "physical" && (n += 1);
	}
	return {
		mental: t,
		physical: n,
		total: e.length
	};
}
function ue(e, t) {
	let n = [];
	return e.physical > t.toughness && n.push("physical"), e.mental > t.willpower && n.push("mental"), n;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/document-helpers.ts
function h(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function g(e) {
	return e.trim().toLowerCase();
}
function de(t, n) {
	return typeof t.getFlag == "function" ? t.getFlag(e, n) : void 0;
}
function fe(e) {
	let t = e.itemTypes, n = Object.values(t ?? {}).flatMap((e) => e ?? []), r = [];
	try {
		r = Array.from(e.items);
	} catch {}
	return [...r, ...n].filter((e, t, n) => n.findIndex((t) => t === e || typeof e.id == "string" && e.id.length > 0 && t.id === e.id) === t);
}
function _(e) {
	return e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0;
}
function v(e, t) {
	return (e.itemTypes.mutation ?? []).filter((e) => (t === void 0 || e.id !== t) && !_(e));
}
function pe(e) {
	return typeof e == "string" ? [g(e)] : Array.isArray(e) ? e.filter((e) => typeof e == "string").map(g) : [];
}
function me(e) {
	let t = de(e, "mutationAutomation");
	if (!h(t)) return;
	let n = t.state;
	if (!h(n)) return;
	let r = n.acquisition;
	if (!(!h(r) || r.status !== "resolved")) return h(r.selections) ? r.selections : void 0;
}
function y(e, t, n) {
	let r = me(e);
	if (!r) return !1;
	let i = new Set(n.map(g));
	return pe(r[t]).some((e) => i.has(e));
}
function he(e, t, n) {
	let r = g(t);
	return v(e, n).find((e) => g(e.name) === r);
}
function ge(e, t) {
	let n = g(t);
	return fe(e).some((e) => {
		if (e.type !== "talent" || typeof e.name != "string") return !1;
		let t = g(e.name);
		return t === n || t.startsWith(`${n} (`);
	});
}
function _e(e, t) {
	let n = e;
	for (let e of t) {
		if (!h(n)) return;
		n = n[e];
	}
	return n;
}
function ve(e) {
	let t = e.currentCareer, n = [...h(t) ? [t] : [], ...fe(e).filter((e) => e.type === "career" && _e(e.system, ["current", "value"]) === !0)];
	for (let e of n) {
		let t = _e(e, [
			"system",
			"careergroup",
			"value"
		]);
		if (typeof t == "string" && t.trim().length > 0) return g(t);
	}
}
function ye(e, t) {
	return v(e, t).some((e) => ["additional extremities", "additional limbs"].includes(g(e.name)) && y(e, "limb", ["legs"]));
}
function be(e, t) {
	return v(e, t).some((e) => ["additional extremities", "additional limbs"].includes(g(e.name)) && y(e, "limb", ["arms"]));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/updates.ts
async function b(e, t) {
	if (!await e.update(t, { skipCorruption: !0 })) throw Error(`Foundry prevented the required update to ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/chosen-patrons.ts
var x = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function xe(e) {
	return `Chosen of ${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
function Se(t) {
	if (t.type !== "trait") return;
	let n = typeof t.getFlag == "function" ? t.getFlag(e, a) : t.flags?.[e]?.[a];
	return x.find((e) => e === n) || x.find((e) => g(t.name) === g(xe(e)));
}
function S(e) {
	return [...new Set(Array.from(e.items).map(Se).filter((e) => e !== void 0))];
}
function C(t) {
	if (typeof t.getFlag != "function") return;
	let n = t.getFlag(e, i);
	return n === "unassigned" ? n : x.find((e) => e === n);
}
function Ce(e) {
	let t = S(e);
	if (t.length === 1) return t[0];
	if (!(t.length > 1)) return C(e);
}
async function we(t, n) {
	if (S(t).includes(n)) {
		await Te(t);
		return;
	}
	let r = `Compendium.${e}.ratter-11-items.Item.${ne[n]}`, i = await fromUuid(r);
	if (!i || i.type !== "trait") throw Error(`The required ${xe(n)} Trait is unavailable.`);
	let a = i.toObject();
	if (delete a._id, delete a._key, (await t.createEmbeddedDocuments("Item", [a], { skipSpecialisationChoice: !0 })).length !== 1) throw Error(`Foundry prevented ${xe(n)} from being added to ${t.name}.`);
	await Te(t);
}
async function Te(t) {
	C(t) !== void 0 && await b(t, { [`flags.${e}.-=${i}`]: null });
}
async function Ee(e) {
	let t = C(e);
	t && t !== "unassigned" && S(e).length === 0 && await we(e, t);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actor-state.ts
function De(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function Oe(e) {
	let t = S(e).length > 0 || Ce(e) !== void 0;
	return le((e.itemTypes.mutation ?? []).filter((e) => !_(e) && !(t && g(e.name) === "possessed")).map((e) => e.system.mutationType.value));
}
function ke(e) {
	return (e.itemTypes.mutation ?? []).some((e) => g(e.name) === "possessed" && !_(e));
}
function Ae(t) {
	return t.getFlag(e, o) === !0;
}
async function je(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => g(e.name) === "possessed" && !_(e)).map((t) => ({
		_id: t.id,
		[`flags.${e}.${c}`]: !0
	}));
	if (n.length !== 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
async function Me(t) {
	let n = v(t).filter((e) => g(e.name) === "skinwalker");
	if (n.length === 0) return [];
	let r = await t.updateEmbeddedDocuments("Item", n.map((t) => ({
		_id: t.id,
		[`flags.${e}.${s}`]: !0
	})));
	if (r.length !== n.length) {
		let e = new Set(r.map((e) => e.id)), i = n.filter((t) => e.has(t.id)).map((e) => e.id);
		try {
			await Ne(t, i);
		} catch (e) {
			throw AggregateError([e], `Foundry only partially retired Skinwalker for ${t.name}, and rollback failed.`, { cause: e });
		}
		throw Error(`Foundry prevented Skinwalker from being retired for ${t.name}.`);
	}
	return n.map((e) => e.id);
}
async function Ne(e, t) {
	if (t.length !== 0 && (await e.updateEmbeddedDocuments("Item", t.map((e) => ({
		_id: e,
		"flags.fvtt-wfrp-ratter.-=mutantsHandbookRetired": null
	})))).length !== t.length) throw Error(`Foundry prevented retired mutations from being restored for ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/pending-corruption.ts
var w = `flags.${e}.${u}`, T = `flags.${e}.-=${u}`, Pe = `flags.${e}.${d}`;
function E(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Fe(e) {
	return e === "mental" || e === "physical";
}
function Ie(e) {
	if (!(!E(e) || e.version !== 1) && (e.kind === "test" && typeof e.messageId == "string" || e.kind === "mutation" && typeof e.actorUuid == "string" && typeof e.mutationName == "string" && Fe(e.nature) && typeof e.token == "string")) return e;
}
function D(t) {
	return Ie(t.getFlag(e, u));
}
function Le(e) {
	return D(e) !== void 0;
}
async function Re(e, t) {
	await b(e, { [w]: {
		kind: "test",
		messageId: t,
		version: 1
	} });
}
async function ze(e) {
	await b(e, { [T]: null });
}
function Be(e) {
	let t = Ie(e.flags?.["fvtt-wfrp-ratter"]?.mutantsHandbookPendingMutation ?? e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPendingMutation"));
	return t?.kind === "mutation" ? t : void 0;
}
function Ve(e, t) {
	let n = e[t];
	if (E(n)) return n;
	let r = {};
	return e[t] = r, r;
}
function He(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.some((e) => {
		if (!E(e)) return !1;
		let t = e.system, n = E(t) ? t.scriptData : void 0;
		return Array.isArray(n) && n.some((e) => E(e) && e.trigger === "immediate" && typeof e.label == "string" && e.label.startsWith("Acquire ") && typeof e.script == "string" && !e.script.includes("prepareMutationAcquisition"));
	}) : !1;
}
function Ue(t, n) {
	let r = crypto.randomUUID().replaceAll("-", "").slice(0, 16), i = typeof t.img == "string" ? t.img : "icons/svg/aura.svg", a = n.nature === "physical" ? "t" : "wp", o = JSON.stringify(n.name), s = JSON.stringify(n.nature);
	return {
		_id: r,
		changes: [],
		description: "",
		disabled: !1,
		duration: {},
		flags: {
			[e]: { scope: "corruption-card" },
			wfrp4e: {}
		},
		img: i,
		name: `${n.name} — Corruption Acquisition`,
		origin: null,
		statuses: [],
		tint: "#ffffff",
		transfer: !0,
		type: "base",
		system: {
			sourceData: {},
			transferData: {
				area: { aura: {} },
				avoidTest: { value: "none" },
				documentType: "Actor",
				equipTransfer: !1,
				prompt: !1,
				type: "document"
			},
			scriptData: [{
				async: !0,
				label: `Resolve ${n.name} Corruption Card`,
				options: {
					deleteEffect: !0,
					dialog: {
						activateScript: "",
						hideScript: "",
						submissionScript: "",
						targeter: !1
					},
					immediate: { deleteEffect: !0 }
				},
				trigger: "immediate",
				script: `const options = args.options ?? {};
const actor = this.actor;
const moduleId = "${e}";
const pending = this.item.flags[moduleId].${d};
const expected = actor.getFlag(moduleId, "${u}");
const mutationName = ${o};
if (pending.actorUuid !== actor.uuid || pending.mutationName !== mutationName || pending.nature !== ${s} || expected?.kind !== "mutation" || expected.token !== pending.token) {
  ui.notifications.warn(mutationName + " is no longer the pending mutation for " + actor.name + ".");
  options.abortItemCreation = true;
  options.mutationAcquisitionCancelled = true;
  return false;
}
const resilience = Number(actor.system.status.resilience.value ?? 0);
if (resilience > 0 && await foundry.applications.api.DialogV2.confirm({
  window: {title: "Resist " + mutationName},
  content: "<p>Spend 1 Resilience to resist " + mutationName + "?</p>",
  yes: {label: "Spend Resilience"},
  no: {label: "Keep Mutation"},
  rejectClose: false
})) {
  const loss = Math.max(0, Number(actor.system.characteristics.${a}.bonus ?? 0));
  await actor.update({
    ["flags." + moduleId + ".-=${u}"]: null,
    "system.status.corruption.value": Math.max(0, Number(actor.system.status.corruption.value) - loss),
    "system.status.resilience.value": resilience - 1
  });
  options.abortItemCreation = true;
  options.mutationAcquisitionCancelled = true;
  await ChatMessage.create({content: "<p><strong>" + actor.name + "</strong> spends Resilience and resists <strong>" + mutationName + "</strong>.</p>"});
  return false;
}
options.mutationAcquisitionCanReroll = false;
options.mutationAcquisitionHandlesChimeranRetirement = true;
return true;`
			}],
			zone: {}
		}
	};
}
function We(t, n) {
	let r = structuredClone(t.data), i = Ve(Ve(r, "flags"), e);
	if (i[d] = n, !He(r)) throw Error(`${t.name} has no embedded Mutant's Handbook acquisition script and cannot be posted.`);
	return Array.isArray(r.effects) && (r.effects = [Ue(r, t), ...r.effects]), r;
}
async function Ge(e, t) {
	let n = D(e), r = {
		actorUuid: e.uuid,
		kind: "mutation",
		mutationName: t.name,
		nature: t.nature,
		token: crypto.randomUUID(),
		version: 1
	}, i = new Item.implementation(We(t, r));
	await b(e, { [w]: r });
	try {
		await i.postItem(void 0, n?.kind === "test" ? { "flags.wfrp4e.sourceMessageId": n.messageId } : void 0);
	} catch (t) {
		throw await b(e, { ...n ? { [w]: n } : { [T]: null } }), t;
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/messages.ts
function O(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while formatting a mutation message.");
	return game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${e}`, t);
}
async function k(e) {
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
function A(e) {
	ui.notifications.warn(e);
}
function Ke(e) {
	let t = e instanceof Error ? e.message : String(e), n = game ? game.i18n.format("FVTT_WFRP_RATTER.Mutations.Error", { message: t }) : `The Mutant's Handbook mutation workflow failed: ${t}`;
	console.error(e), ui.notifications.error(n);
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
		rejectClose: !0,
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
function j(e) {
	return Array.isArray(e) ? e.map(j) : typeof e == "object" && e ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e < t ? -1 : +(e > t)).map(([e, t]) => [e, j(t)])) : e;
}
function M(e) {
	return JSON.stringify(j({
		configure: e.configure ?? {},
		ranks: e.ranks ?? 1,
		scope: e.scope ?? "all",
		sourceUuid: e.sourceUuid,
		stack: e.stack ?? "singleton",
		type: e.type
	}));
}
function tt(e) {
	let t = { ...e };
	return delete t.scope, M({
		...t,
		ranks: 1
	});
}
function N(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	if (typeof t != "object" || !t || Array.isArray(t)) return;
	let n = t;
	if (!(n.stack !== "rank" || n.type !== "skill" && n.type !== "talent")) return n.ranks = 1, n.scope = "all", JSON.stringify(j(n));
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
	for (let [e, n] of Object.entries(t.configure?.system ?? {})) rt(r, e.replace(/^system\./, ""), j(n));
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
		if (JSON.stringify(j(nt(a, n))) !== JSON.stringify(j(t))) return !1;
	}
	return !(n.ranks !== void 0 && (n.type === "skill" || n.type === "talent") && Number(nt(a, "advances.value")) !== n.ranks);
}
function ot(e, t) {
	let n = e.toObject()._stats;
	return typeof n != "object" || !n ? !1 : n.compendiumSource === t;
}
function P(t) {
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
function F(t) {
	let n = t.flags?.[e]?.mutationGrantOwners;
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function st(t) {
	return t.flags?.[e]?.mutationGrantManaged === !0;
}
function ct(t) {
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
var lt = [
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
], ut = ["b5xKInMaTt8ljJVQ"];
[...lt, ...ut];
//#endregion
//#region src/functions/mutants-handbook/actions/support-item-ids.ts
var I = {
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
}, dt = [
	{
		actionType: "attack",
		conditions: ["Spitting, drooling acid onto objects, and consuming unusual materials share this TB-per-day allowance.", "Glass and gold are not damaged by the acid."],
		duration: "Immediate",
		id: "acidic-saliva-spit",
		implementation: "support",
		itemId: I["acidic-saliva-spit"],
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
		itemId: I["beast-alpha-command"],
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
		itemId: I["bloodsucker-feed"],
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
		itemId: I["bloomblight-touch-heal"],
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
		itemId: I["dimensional-instability-teleport"],
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
		itemId: I["ecstatic-milk-produce-dose"],
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
		itemId: I["entrancement-beguile"],
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
		itemId: I["evil-eye-gaze"],
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
		itemId: I["fleshcrafter-cosmetic"],
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
		itemId: I["fleshcrafter-reshape"],
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
		itemId: I["fleshcrafter-bonecraft"],
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
		itemId: I["fleshcrafter-stop-bleeding"],
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
		itemId: I["frostbite-touch"],
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
], ft = [
	{
		actionType: "utility",
		conditions: ["The skin normally adapts to the surroundings automatically.", "Passing for an unmutated person instead requires the source's Average (+20) Cool Test to resist adapting for the scene."],
		duration: "One scene or until the surroundings materially change",
		id: "chameleon-skin-camouflage",
		implementation: "support",
		itemId: I["chameleon-skin-camouflage"],
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
		conditions: ["The mutant must have stored SL in the Spelleater Gland.", "When the gland absorbs a spell, record its SL and clear any unspent energy at the end of the next Round."],
		duration: "Applied to one spell as it is cast",
		id: "spelleater-gland-spend-sl",
		implementation: "support",
		itemId: I["spelleater-gland-spend-sl"],
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
		itemId: I["ethereal-become-insubstantial"],
		miscast: "minor",
		mutationId: "A7OLAWKXWUfh0UGU",
		mutationName: "Ethereal",
		name: "Become Ethereal",
		outcome: "On success, gain the Ethereal Creature Trait and become insubstantial for the duration.",
		range: "Self",
		rules: "Applying the outcome creates the managed Ethereal form and duration; the GM adjudicates trapped limbs or body parts when it ends.",
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
		itemId: I["invisibility-vanish"],
		miscast: "minor",
		mutationId: "1YH1DgABwSXNaMI7",
		mutationName: "Invisibility",
		name: "Become Invisible",
		outcome: "On success, remain concealed from everyone without Second Sight.",
		range: "Self",
		rules: "Applying the outcome creates the timed concealment Effect; remove it early after an attack or sufficiently loud noise.",
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
		itemId: I["oracle-foresight"],
		miscast: "minor",
		mutationId: "0KO8587hDiF4PSCq",
		mutationName: "Oracle",
		name: "Moment-to-Moment Foresight",
		outcome: "On success, gain +10 Initiative and +1 Fortune per mutation level for the scene.",
		range: "Self",
		rules: "Applying the outcome creates the scene-long Initiative and Fortune bonuses and replaces an existing foresight Effect.",
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
		itemId: I["wind-caller-breeze"],
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
		itemId: I["hungering-maw-free-bite"],
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
		itemId: I["wind-caller-gust"],
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
], pt = [
	{
		actionType: "attack",
		conditions: ["First succeed at the separate Green Sovereign power Test.", "Branches count as Improvised Weapons."],
		duration: "Immediate",
		id: "green-sovereign-branch-strike",
		implementation: "support",
		itemId: I["green-sovereign-branch-strike"],
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
		itemId: I["green-sovereign-root-grapple"],
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
		itemId: I["telekinesis-hurl-projectile"],
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
		itemId: I["life-leech-combat-touch"],
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
		itemId: I["thunderhead-combat-touch"],
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
], mt = [
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
		itemId: I["gnawer-gnaw"],
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
		itemId: I["green-sovereign-command-plants"],
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
		itemId: I["green-sovereign-strike-or-grapple"],
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
		itemId: I["gut-worm-attack"],
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
		itemId: I["horrid-scream-unleash"],
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
		itemId: I["hungering-maw-grapple"],
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
		itemId: I["infernal-furnace-breath"],
		mutationId: "IUBfAizppAlcAgWL",
		mutationName: "Infernal Furnace",
		name: "Infernal Breath",
		outcome: "Resolve a Breath (TB x2, Fire) Creature Trait attack.",
		range: "As Breath (TB x2, Fire)",
		rules: "Illumination is continuous; use the separate body-Critical burst and death-explosion actions when those triggers occur.",
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
		itemId: I["levitation-rise"],
		miscast: "minor",
		mutationId: "rMh2lJZMML0W61MH",
		mutationName: "Levitation",
		name: "Levitate",
		outcome: "On success, gain Flight with a rating equal to 30 times the mutation level.",
		range: "Self",
		rules: "Applying the outcome creates the timed Flight Effect and replaces an existing Levitation Effect.",
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
		itemId: I["life-leech-touch"],
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
		itemId: I["mirror-image-disguise"],
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
		itemId: I["oracle-augury"],
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
], ht = [
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
		itemId: I["phantasmal-mind-illusion"],
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
		itemId: I["phantasmal-mind-animate"],
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
		itemId: I["piercing-tongue-attack"],
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
		itemId: I["pyrokinesis-ignite"],
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
		itemId: I["pyrokinesis-blast"],
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
		itemId: I["razor-sharp-claws-attack"],
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
		itemId: I["scrying-touch-psychometry"],
		mutationId: "EcZopIPOTXZofeHh",
		mutationName: "Scrying Touch",
		name: "Psychometry",
		outcome: "Resolve the owned Psychometry Skill using its Winds of Magic rules.",
		range: "Touch",
		rules: "The mutation grants 10 Psychometry Advances per level; apply Fatigued after an ungloved reading when the source rule is triggered.",
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
], gt = [
	{
		actionType: "control",
		conditions: ["Target every creature currently engaged with the mutant."],
		duration: "Resolve at the end of each Round",
		id: "burning-body-aura",
		implementation: "support",
		itemId: I["burning-body-aura"],
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
		itemId: I["contagious-madness-aura"],
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
		itemId: I["infernal-furnace-critical-burst"],
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
		itemId: I["infernal-furnace-death-explosion"],
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
		itemId: I["tantalising-aura"],
		mutationId: "UocYY55QaW15zWYk",
		mutationName: "Tantalising Aura",
		name: "Resolve Tantalising Aura",
		outcome: "Each target tests Average Willpower or gains Surprised and must approach the mutant.",
		range: "WPB yards",
		rules: "Select all living creatures in range, then apply the outcome from this card.",
		target: "multiple"
	}
], L = (e) => ({
	...e,
	implementation: "support",
	itemId: I[e.id]
}), _t = [
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
	L({
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
], vt = [
	{
		actionType: "control",
		conditions: ["The retained Tail result must be Mace Tail."],
		duration: "Immediate",
		id: "tail-mace-free-attack",
		implementation: "support",
		itemId: I["tail-mace-free-attack"],
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
		itemId: I["tail-prehensile-free-attack"],
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
		itemId: I["tail-scorpion-free-attack"],
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
		itemId: I["telekinesis-move-object"],
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
		itemId: I["telekinesis-hurl-weapon"],
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
		itemId: I["telepathy-project-thoughts"],
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
		itemId: I["telepathy-read-thoughts"],
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
		itemId: I["temporal-instability-surge"],
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
		itemId: I["thorns-launch"],
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
		itemId: I["thorns-unarmed"],
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
		itemId: I["thunderhead-shock"],
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
		itemId: I["thunderhead-lightning-bolt"],
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
], yt = Object.freeze([
	...dt,
	...mt,
	...ht,
	...vt,
	...pt,
	...ft,
	...gt,
	..._t
]), bt = new Map(yt.map((e) => [e.id, e])), xt = /* @__PURE__ */ new Map();
for (let e of yt) {
	let t = xt.get(e.mutationId) ?? [];
	t.push(e), xt.set(e.mutationId, t);
}
new Map([...xt].map(([e, t]) => [e, Object.freeze(t)]));
function St(e) {
	return bt.get(e);
}
//#endregion
//#region src/functions/mutants-handbook/actions/outcomes.ts
var Ct = {
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
function wt(e) {
	return Ct[e] ?? [];
}
Object.freeze(Object.keys(Ct));
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/acquisition-grants.ts
var Tt = new Set([
	"armour",
	"psychology",
	"skill",
	"talent",
	"trait",
	"weapon"
]), Et = new Set([
	"configuration",
	"rank",
	"singleton"
]), Dt = 256, Ot = new Set([
	"__proto__",
	"constructor",
	"prototype"
]), kt = /^Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Item\.[A-Za-z0-9_-]+$/, At = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, R = Symbol("invalid-acquisition-value"), jt = "bSVbWpX8AcBSIyTU", Mt = {
	mace: ["tail-mace-free-attack", "Mace Tail: Free Attack"],
	prehensile: ["tail-prehensile-free-attack", "Prehensile Tail: Free Attack"],
	scorpion: ["tail-scorpion-free-attack", "Scorpion Stinger: Free Attack"]
};
function z(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}
function B(e, t, n = 0) {
	if (e === null || typeof e == "string" || typeof e == "boolean") return e;
	if (typeof e == "number") return Number.isFinite(e) ? e : R;
	if (n >= 20 || typeof e != "object" || !e || t.has(e)) return R;
	if (t.add(e), Array.isArray(e)) {
		let r = [];
		for (let i of e) {
			let e = B(i, t, n + 1);
			if (e === R) return R;
			r.push(e);
		}
		return t.delete(e), r;
	}
	if (!z(e)) return R;
	let r = {};
	for (let [i, a] of Object.entries(e)) {
		if (Ot.has(i)) return R;
		let e = B(a, t, n + 1);
		if (e === R) return R;
		r[i] = e;
	}
	return t.delete(e), r;
}
function Nt(e) {
	let t = e.replace(/^system\./, ""), n = t.split(".");
	return t.length > 0 && n.every((e) => e && !Ot.has(e)) ? t : void 0;
}
function Pt(e) {
	if (e === void 0 || !z(e) || Object.keys(e).some((e) => e !== "name" && e !== "system")) return;
	let t = {};
	if (e.name !== void 0) {
		if (typeof e.name != "string" || e.name.trim().length === 0) return;
		t.name = e.name;
	}
	if (e.system !== void 0) {
		if (!z(e.system)) return;
		let n = {}, r = [];
		for (let [t, i] of Object.entries(e.system)) {
			let e = Nt(t), a = B(i, /* @__PURE__ */ new Set());
			if (!e || a === R || r.some((t) => e.startsWith(`${t}.`) || t.startsWith(`${e}.`))) return;
			r.push(e), n[t] = a;
		}
		t.system = n;
	}
	return t;
}
function Ft(e) {
	if (!z(e)) return;
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
	if (typeof n != "string" || !At.test(n) || typeof r != "string" || r.trim().length === 0 || typeof i != "string" || !kt.test(i) || typeof a != "string" || !Tt.has(a)) return;
	let o = e.stack ?? "singleton";
	if (typeof o != "string" || !Et.has(o) || o === "rank" && a !== "skill" && a !== "talent" || e.scope !== void 0 && e.scope !== "first" || e.aggregate !== void 0 && e.aggregate !== "latest" || e.aggregate === "latest" && o !== "configuration") return;
	let s = e.aggregateKey;
	if (s !== void 0 && (typeof s != "string" || s.trim().length === 0 || s.length > Dt) || e.ranks !== void 0 && (!Number.isSafeInteger(e.ranks) || Number(e.ranks) < 1) || e.ranks !== void 0 && a !== "skill" && a !== "talent") return;
	let c = Pt(e.configure);
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
function It(e) {
	return !z(e) || e.status !== "resolved" || e.version !== void 0 && e.version !== 1 || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !z(e.rolls) || !z(e.selections) || B(e.rolls, /* @__PURE__ */ new Set()) === R || B(e.selections, /* @__PURE__ */ new Set()) === R || !Array.isArray(e.grants) ? !1 : e.acceptedBlocks === void 0 ? !0 : Array.isArray(e.acceptedBlocks) && e.acceptedBlocks.every((e) => z(e) && Object.keys(e).every((e) => e === "kind" || e === "message") && typeof e.kind == "string" && typeof e.message == "string");
}
function Lt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!z(n) || n.definitionId === "mNNavbJayRcsyeXJ") return [];
	let r = n.state;
	if (!z(r) || !It(r.acquisition)) return [];
	let i = r.acquisition.grants.map(Ft).filter((e) => e !== void 0), a = /* @__PURE__ */ new Map();
	for (let e of i) a.set(e.key, (a.get(e.key) ?? 0) + 1);
	return i.filter((e) => a.get(e.key) === 1);
}
function Rt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!z(n)) return;
	let r = n.state;
	if (!z(r)) return;
	let i = r.acquisition;
	if (!z(i) || i.version !== void 0 && i.version !== 1) return;
	let a = i.occurrence;
	return Number.isSafeInteger(a) && Number(a) > 0 ? Number(a) : void 0;
}
function zt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!z(n) || n.definitionId !== jt) return;
	let r = n.state;
	if (!z(r)) return;
	let i = r.acquisition;
	if (!z(i) || i.status !== "resolved") return;
	let a = i.selections;
	if (!z(a) || typeof a.tail != "string") return;
	let o = Mt[a.tail];
	if (!o) return;
	let [s, c] = o;
	return {
		key: `mutation-action:${s}`,
		name: c,
		sourceUuid: `Compendium.${e}.ratter-11-items.Item.${I[s]}`,
		stack: "singleton",
		type: "trait"
	};
}
function Bt(e, t = []) {
	let n = t.map(Ft).filter((e) => e !== void 0), r = new Map(n.map((e) => [e.key, e])), i = zt(e);
	i && r.set(i.key, i);
	for (let t of Lt(e)) {
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
function V(e) {
	return Array.from(e.items);
}
function Vt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && t.items !== void 0;
}
function Ht(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function H(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.definitionId != "string" || typeof r.version != "number" || r.grants !== void 0 && !Array.isArray(r.grants))) return n;
}
function Ut(t) {
	return t.getFlag(e, c) === !0;
}
function U(e) {
	return Ut(e) || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0;
}
function Wt(e, t, n) {
	return V(e).filter((e) => e.type === "mutation" && !U(e) && H(e)?.definitionId === n).sort((e, t) => e.id.localeCompare(t.id))[0]?.id === t.id;
}
async function Gt(e, t, n) {
	t.update ? await t.update(n) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}]);
}
function Kt(e, t, n, r) {
	let i = P(e), a = F(e).map((e) => ({
		grantKey: "legacy",
		ownerId: e
	})), o = [...i?.owners ?? a];
	return o.some((e) => e.ownerId === r.ownerId && e.grantKey === r.grantKey) || o.push(r), {
		managed: i?.managed ?? st(e),
		owners: o,
		signature: n,
		sourceUuid: t.sourceUuid,
		version: 2
	};
}
function qt(e, t, n, r, i) {
	let a = V(e).filter((e) => at(e, t, n)).sort((e, t) => e.id.localeCompare(t.id)), o = a.find((e) => {
		let t = P(e);
		return t?.signature === r && t.owners.some((e) => e.ownerId === i.ownerId && e.grantKey === i.grantKey);
	});
	return (n.stack ?? "singleton") === "rank" ? o ?? a.find((e) => F(e).includes(i.ownerId)) : a.filter((e) => {
		let t = P(e);
		return t?.signature === r || !t && F(e).length === 0 && (n.type === "skill" || ot(e, n.sourceUuid));
	}).sort((e, t) => (P(e)?.managed === !0) - +(P(t)?.managed === !0) || e.id.localeCompare(t.id))[0] || a.find((e) => F(e).includes(i.ownerId)) || a.find((e) => {
		let t = P(e);
		return t?.signature === r || !t && F(e).length === 0 && ot(e, n.sourceUuid);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/owner-cleanup.ts
async function W(t, n, r) {
	let i = [];
	for (let a of V(t)) {
		let o = P(a), s = F(a), c = (o?.owners ?? []).filter((e) => {
			if (e.ownerId !== n) return !0;
			let t = r.get(e.grantKey);
			return t !== void 0 && t.signature === o?.signature && (t.itemId === void 0 || t.itemId === a.id);
		}), l = [...r.values()], u = l.some((e) => e.itemId === a.id), d = l.some((e) => e.itemId === void 0), f = s.filter((e) => e !== n || u || d);
		if (!(c.length !== (o?.owners.length ?? 0) || f.length !== s.length)) continue;
		if ((o?.managed ?? st(a)) && c.length === 0 && f.length === 0 && !ct(a)) {
			i.push(a.id);
			continue;
		}
		let p = {};
		f.length > 0 ? (p[`flags.${e}.mutationGrantOwners`] = f, st(a) && (p[`flags.${e}.mutationGrantManaged`] = !0)) : (p[`flags.${e}.-=mutationGrantManaged`] = null, p[`flags.${e}.-=mutationGrantOwners`] = null), o && c.length > 0 ? p[`flags.${e}.mutationGrant`] = {
			...o,
			owners: c
		} : o && (p[`flags.${e}.-=mutationGrant`] = null), await Gt(t, a, p);
	}
	i.length > 0 && await t.deleteEmbeddedDocuments("Item", i);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/ranked-skill-items.ts
function G(e) {
	return Array.from(e.items);
}
function K(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function Jt(e) {
	let t = e.toObject().system;
	if (typeof t != "object" || !t) return 0;
	let n = t.advances;
	if (typeof n != "object" || !n) return 0;
	let r = Number(n.value);
	return Number.isFinite(r) ? r : 0;
}
function q(e) {
	let t = ct(e);
	if (t) return {
		...t,
		legacy: !1
	};
	let n = P(e);
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
function Yt(e, t) {
	let n = Jt(e), r = q(e);
	if (!r) return Math.max(0, n);
	let i = r.legacy && t !== void 0 ? Math.max(r.appliedRanks, Math.min(t, n)) : r.appliedRanks;
	return Math.max(0, n - i);
}
function Xt(e) {
	return q(e)?.managed === !0;
}
function Zt(e, t) {
	let n = typeof e.system == "object" && e.system !== null ? e.system : {};
	e.system = n;
	let r = n.advances, i = typeof r == "object" && r ? r : {};
	n.advances = i, i.value = t;
}
function Qt(t, n) {
	let r = typeof t.flags == "object" && t.flags !== null ? t.flags : {};
	t.flags = r;
	let i = typeof r["fvtt-wfrp-ratter"] == "object" && r["fvtt-wfrp-ratter"] !== null ? r[e] : {};
	r[e] = i, i.mutationSkillGrant = n;
}
async function J(e, t, n) {
	let r = { skipExperienceChecks: !0 };
	t.update ? await t.update(n, r) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}], r);
}
function $t(t) {
	return {
		"system.advances.value": t,
		[`flags.${e}.-=mutationSkillGrant`]: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/ranked-grant-data.ts
function en(e) {
	if (e.type !== "talent") return;
	let t = P(e);
	if (!t || !N(t.signature)) return;
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
function Y(e) {
	return q(e) ?? en(e);
}
function X(e, t) {
	let n = en(e);
	if (!n) return Yt(e, t);
	let r = e.toObject().system, i = Number(r?.advances?.value ?? 0), a = t === void 0 ? n.appliedRanks : Math.max(n.appliedRanks, Math.min(t, i));
	return Math.max(0, i - a);
}
function tn(e) {
	let t = Y(e);
	return t?.managed === !1 ? 0 : t ? 2 : 1;
}
function nn(e, t) {
	return Y(e)?.owners.some((e) => N(e.signature) === t) ?? !1;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/skill-grant-reconciliation.ts
function Z(e, t) {
	return e < t ? -1 : +(e > t);
}
function rn(e, t) {
	let n = { ...t.grant };
	return delete n.ranks, at(e, { name: t.name }, n);
}
async function an(e, t) {
	let n = /* @__PURE__ */ new Map();
	return await Promise.all(t.map(async ({ grant: t, mutation: r }) => {
		if (t.type !== "skill" && t.type !== "talent") return;
		let i = tt(t);
		if (t.configure?.name || n.has(i)) return;
		let a = M(t), o = G(e).find((e) => e.type === t.type && Y(e)?.owners.some((e) => e.sourceUuid === t.sourceUuid && (e.ownerId === r.id && e.grantKey === t.key || e.signature === a)));
		if (o) {
			n.set(i, o.name);
			return;
		}
		let s = await fromUuid(t.sourceUuid);
		K(s) && s.type === t.type && n.set(i, s.name);
	})), t.flatMap(({ grant: e, mutation: t }) => {
		if (e.type !== "skill" && e.type !== "talent") return [];
		let r = tt(e);
		return [{
			grant: e,
			grantKey: e.key,
			identity: r,
			mutationName: t.name,
			name: e.configure?.name ?? n.get(r) ?? e.name,
			ownerId: t.id,
			ranks: e.ranks ?? 1,
			signature: M(e),
			sourceUuid: e.sourceUuid
		}];
	});
}
function on(e) {
	return e.map(({ grantKey: e, ownerId: t, ranks: n, signature: r, sourceUuid: i }) => ({
		grantKey: e,
		ownerId: t,
		ranks: n,
		signature: r,
		sourceUuid: i
	}));
}
async function sn(e, t) {
	let n = t[0];
	if (!n) return;
	let r = await fromUuid(n.sourceUuid);
	if (!K(r) || r.type !== n.grant.type) {
		ui.notifications.warn(`${n.mutationName}: could not grant ${n.name}. Enable its source module and reconcile mutation automation.`);
		return;
	}
	let i = it(r.toObject(), n.grant);
	if (delete i._id, delete i._key, Zt(i, 0), Qt(i, {
		appliedRanks: 0,
		managed: !0,
		owners: [],
		version: 1
	}), !(await e.createEmbeddedDocuments("Item", [i], {
		skipExperienceChecks: !0,
		skipSpecialisationChoice: !0
	})).find(K) && !G(e).some((e) => rn(e, n))) throw Error(`${n.mutationName}: Foundry prevented the ${n.name} grant.`);
	await ln(e, n.identity, t, !1);
}
async function cn(e, t) {
	let n = [];
	for (let r of t) {
		let t = Y(r);
		if (!t) continue;
		let i = X(r);
		t.managed && i === 0 && !P(r) ? n.push(r.id) : await J(e, r, $t(i));
	}
	n.length > 0 && await e.deleteEmbeddedDocuments("Item", n);
}
async function ln(t, n, r, i = !0) {
	let a = r[0], o = G(t).filter((e) => a ? rn(e, a) : nn(e, n)).sort((e, t) => tn(e) - tn(t) || Z(e.id, t.id));
	if (r.length === 0) {
		await cn(t, o);
		return;
	}
	let s = o[0];
	if (!s) {
		if (!i) throw Error(`${a?.name ?? "Ranked Item"}: Foundry did not retain the mutation grant.`);
		await sn(t, r);
		return;
	}
	let c = o.slice(1).filter((e) => Y(e));
	o.slice(1).filter((e) => !Y(e)).length > 0 && ui.notifications.warn(`${a?.name}: multiple user-owned Items share this configuration. Mutation advances were applied only to ${s.name}; review the duplicates manually.`);
	let l = r.reduce((e, t) => e + t.ranks, 0), u = X(s, l), d = {
		appliedRanks: l,
		managed: Y(s)?.managed ?? P(s)?.managed ?? !1,
		owners: on(r),
		version: 1
	};
	await J(t, s, {
		"system.advances.value": u + l,
		[`flags.${e}.mutationSkillGrant`]: d
	});
	let f = [];
	for (let e of c) {
		let n = X(e);
		(Xt(e) || Y(e)?.managed) && n === 0 && !P(e) ? f.push(e.id) : (await J(t, e, $t(n)), n > 0 && ui.notifications.warn(`${a?.name}: retained a duplicate Item containing non-mutation advances; review the duplicate manually.`));
	}
	f.length > 0 && await t.deleteEmbeddedDocuments("Item", f);
}
async function un(e, t) {
	let n = await an(e, t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.identity) ?? [];
		t.push(e), r.set(e.identity, t);
	}
	let i = /* @__PURE__ */ new Set();
	for (let t of G(e)) for (let e of Y(t)?.owners ?? []) {
		let t = N(e.signature);
		t && i.add(t);
	}
	for (let t of [...i].filter((e) => !r.has(e)).sort(Z)) await ln(e, t, []);
	for (let t of [...r.keys()].sort(Z)) await ln(e, t, (r.get(t) ?? []).sort((e, t) => Z(e.ownerId, t.ownerId) || Z(e.grantKey, t.grantKey)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation.ts
var Q = /* @__PURE__ */ new Map();
async function dn(t, n, r, i, a) {
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
async function fn(t, n, r) {
	let i = M(r), a = await fromUuid(r.sourceUuid);
	if (!Ht(a) || a.type !== r.type) return ui.notifications.warn(`${n.name}: could not grant ${r.configure?.name ?? r.key}. Enable its source module and reconcile mutation automation.`), { signature: i };
	let o = {
		grantKey: r.key,
		ownerId: n.id
	}, s = qt(t, a, r, i, o);
	if (!s) {
		let e = await dn(t, a, r, i, o);
		return e ? {
			itemId: e,
			signature: i
		} : { signature: i };
	}
	let c = Kt(s, r, i, o), l = s.flags?.["fvtt-wfrp-ratter"] ?? {};
	return JSON.stringify(P(s)) === JSON.stringify(c) && !("mutationGrantManaged" in l) && !("mutationGrantOwners" in l) || await Gt(t, s, {
		[`flags.${e}.mutationGrant`]: c,
		[`flags.${e}.-=mutationGrantManaged`]: null,
		[`flags.${e}.-=mutationGrantOwners`]: null
	}), {
		itemId: s.id,
		signature: i
	};
}
async function pn(e) {
	let t = V(e).filter((e) => e.type === "mutation" && !U(e)), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let [o, s] of t.entries()) {
		let t = H(s);
		if (!t) continue;
		let c = (a.get(t.definitionId) ?? 0) + 1;
		a.set(t.definitionId, c), r.set(s.id, /* @__PURE__ */ new Map());
		for (let a of Bt(s, t.grants)) if (!(a.scope === "first" && !Wt(e, s, t.definitionId))) if ((a.type === "skill" || a.type === "talent") && a.stack === "rank") n.push({
			grant: a,
			mutation: s
		});
		else if (a.aggregate === "latest" && a.stack === "configuration") {
			let e = `${t.definitionId}\0${a.aggregateKey ?? a.key}`, n = i.get(e) ?? [];
			n.push({
				grant: a,
				mutation: s,
				occurrence: Rt(s) ?? c,
				order: o
			}), i.set(e, n);
		} else r.get(s.id)?.set(a.key, await fn(e, s, a));
	}
	await un(e, n);
	for (let t of i.values()) {
		t.sort((e, t) => e.occurrence - t.occurrence || e.order - t.order);
		let n = t.at(-1)?.grant;
		if (n) for (let i of t) r.get(i.mutation.id)?.set(n.key, await fn(e, i.mutation, n));
	}
	for (let n of t) {
		let t = r.get(n.id);
		t && await W(e, n.id, t);
	}
	let o = new Set(V(e).filter((e) => e.type === "mutation" && !U(e) && H(e) !== void 0).map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let t of V(e)) {
		for (let e of P(t)?.owners ?? []) o.has(e.ownerId) || s.add(e.ownerId);
		for (let e of F(t)) o.has(e) || s.add(e);
	}
	for (let t of s) await W(e, t, /* @__PURE__ */ new Map());
}
async function mn(e, t) {
	let n = (Q.get(e) ?? Promise.resolve()).catch(() => void 0).then(t);
	Q.set(e, n);
	try {
		await n;
	} finally {
		Q.get(e) === n && Q.delete(e);
	}
}
async function hn(e) {
	let t = await fromUuid(e);
	if (!Vt(t)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await mn(e, () => pn(t));
}
async function gn(e, t) {
	let n = await fromUuid(e);
	if (!Vt(n)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await mn(e, async () => {
		await W(n, t, /* @__PURE__ */ new Map()), await pn(n);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/mutation-drop.ts
function _n(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function vn(e, t) {
	return se(t, _n(e));
}
function $(e) {
	return e.abortItemCreation = !0, e.mutationAcquisitionCancelled = !0, !1;
}
function yn(e, t) {
	return e.name === t.mutationName && m(e.system.mutationType.value) === t.nature;
}
async function bn(e, t, n) {
	let r = Be(e);
	if (!r) return !0;
	let i = D(t);
	if (r.actorUuid !== t.uuid) return A(`${e.name} was rolled for another Actor and cannot be acquired here.`), $(n);
	if (!yn(e, r)) return A(`${e.name} no longer matches the rolled mutation card.`), $(n);
	if (i?.kind !== "mutation" || i.token !== r.token) return A(`${e.name} is no longer awaiting acquisition for ${t.name}.`), $(n);
	let a = Number(t.system.status.resilience.value);
	if (a > 0 && await et(t.name, e.name)) {
		let i = vn(t, r.nature);
		return await b(t, {
			[T]: null,
			"system.status.corruption.value": ce(Number(t.system.status.corruption.value), i),
			"system.status.resilience.value": Math.max(0, a - 1)
		}), e.updateSource?.({ [Pe]: null }), await k(O("Resisted", {
			loss: i,
			mutation: e.name,
			name: t.name
		})), $(n);
	}
	return n.mutationAcquisitionCanReroll = !1, n.mutationAcquisitionHandlesChimeranRetirement = !0, !0;
}
async function xn(e, t) {
	for (let n of t) {
		let t = O("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		A(t), await k(t);
	}
}
async function Sn(t) {
	let n = Be(t), r = t.actor;
	if (!n || !r) return !1;
	let i = D(r);
	if (i?.kind !== "mutation" || i.token !== n.token) throw Error(`${t.name} is not the pending mutation for ${r.name}.`);
	if (!yn(t, n)) throw Error(`${t.name} no longer matches its pending mutation result.`);
	let a = vn(r, n.nature), s = [];
	try {
		t.name.trim().toLowerCase() === "chimeran curse" && (s = await Me(r));
		let n = ue(Oe(r), _n(r));
		await b(r, {
			[T]: null,
			...n.length > 0 ? { [`flags.${e}.${o}`]: !0 } : {},
			"system.status.corruption.value": ce(Number(r.system.status.corruption.value), a)
		});
		try {
			await t.update?.({ [Pe]: null }, { skipMutationAcquisition: !0 });
		} catch (e) {
			console.warn(`${t.name}: could not clear its completed mutation-drop marker.`, e);
		}
		return await k(O("Gained", {
			loss: a,
			mutation: t.name,
			name: r.name
		})), await xn(r, n), !0;
	} catch (e) {
		let n = [e];
		try {
			await Ne(r, s);
		} catch (e) {
			n.push(e);
		}
		try {
			await r.deleteEmbeddedDocuments("Item", [t.id]);
		} catch (e) {
			n.push(e);
		}
		throw n.length > 1 ? AggregateError(n, `Failed to roll back mutation acquisition for ${r.name}.`, { cause: e }) : e;
	}
}
//#endregion
export { c as $, Ee as A, me as B, Ae as C, we as D, Me as E, ye as F, ie as G, se as H, be as I, l as J, m as K, y as L, he as M, v as N, Ce as O, ve as P, te as Q, ge as R, ke as S, je as T, ce as U, pe as V, oe as W, s as X, r as Y, ee as Z, Le as _, wt as a, Be as b, Qe as c, O as d, n as et, k as f, D as g, ze as h, gn as i, t as it, b as j, S as k, Ze as l, A as m, bn as n, f as nt, St as o, Ke as p, ae as q, hn as r, e as rt, $e as s, Sn as t, p as tt, et as u, Re as v, De as w, Oe as x, Ge as y, g as z };

//# sourceMappingURL=mutation-drop-Bc32Aq0J.js.map