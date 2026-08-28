//#region src/module/constants.ts
var e = "fvtt-wfrp-ratter", t = "Drowsy's WFRP4e Ratter Implementation", n = "fvtt-wfrp-ratter.ratter-11-tables", r = "mutantsHandbookPatron", i = "mutantsHandbookChaosSpawn", a = "mutantsHandbookRetired", o = "mutantsHandbookPossessionRemoved", s = "mutantsHandbookCorruption", c = "mutantsHandbookPendingCorruption", l = "mutantsHandbookPendingMutation", u = {
	dwarf: "ueEWO9920dCmA7qP",
	elf: "X4hMeYoCFx77QIvv",
	gnome: "gktszioKqcA637wH",
	halfling: "4QnKxakvIARiyqAq",
	human: "2XUdBDbSoynCvCoL",
	ogre: "5hidSDB0YHyyrTVi"
}, d = "AAOqrs1CNIgUk5OI", f = {
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
}, p = {
	khorne: "ymLfyXm3vCnKqMqV",
	nurgle: "rG3ht32Wh5SAVuNz",
	slaanesh: "QHWmoKtujyUHxfG1",
	tzeentch: "MuS2keCF2SFOZYCg"
}, ee = {
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
function te(e) {
	return ee[e.trim().toLowerCase()];
}
function ne(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("physical")) return "physical";
	if (t.startsWith("mental")) return "mental";
}
function re(e) {
	let t = e.trim().toLowerCase();
	if (t.startsWith("trivial")) return "trivial";
	if (t.startsWith("minor")) return "minor";
	if (t.startsWith("major")) return "major";
	if (t.includes("chosen")) return "chosen";
}
function ie(e) {
	return Math.min(Math.max(0, Math.floor(e)), 4) * 10;
}
function ae(e, t) {
	return e === "physical" ? t.toughness : t.willpower;
}
function oe(e, t) {
	return Math.max(0, e - Math.max(0, t));
}
function se(e) {
	let t = 0, n = 0;
	for (let r of e) {
		let e = ne(r);
		e === "mental" ? t += 1 : e === "physical" && (n += 1);
	}
	return {
		mental: t,
		physical: n,
		total: e.length
	};
}
function ce(e, t) {
	let n = [];
	return e.physical > t.toughness && n.push("physical"), e.mental > t.willpower && n.push("mental"), n;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/document-helpers.ts
function m(e) {
	return e.trim().toLowerCase();
}
function le(e) {
	return e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0;
}
function ue(e, t) {
	return (e.itemTypes.mutation ?? []).filter((e) => (t === void 0 || e.id !== t) && !le(e));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actor-state.ts
var de = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch",
	"unassigned"
];
function fe(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "character" && typeof t.name == "string" && typeof t.uuid == "string" && typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && typeof t.getFlag == "function" && typeof t.has == "function" && typeof t.setupCharacteristic == "function" && typeof t.setupSkill == "function" && typeof t.update == "function" && typeof t.updateEmbeddedDocuments == "function";
}
function pe(e) {
	let t = me(e) !== void 0;
	return se((e.itemTypes.mutation ?? []).filter((e) => !le(e) && !(t && m(e.name) === "possessed")).map((e) => e.system.mutationType.value));
}
function me(t) {
	let n = t.getFlag(e, r);
	return de.find((e) => e === n);
}
function he(e) {
	return (e.itemTypes.mutation ?? []).some((e) => m(e.name) === "possessed" && !le(e));
}
function ge(t) {
	return t.getFlag(e, i) === !0;
}
async function _e(t) {
	let n = (t.itemTypes.mutation ?? []).filter((e) => m(e.name) === "possessed" && !le(e)).map((t) => ({
		_id: t.id,
		[`flags.${e}.${o}`]: !0
	}));
	if (n.length !== 0 && (await t.updateEmbeddedDocuments("Item", n)).length !== n.length) throw Error(`Foundry prevented Possessed from being retired for ${t.name}.`);
}
async function ve(t) {
	let n = ue(t).filter((e) => m(e.name) === "skinwalker");
	if (n.length === 0) return [];
	let r = await t.updateEmbeddedDocuments("Item", n.map((t) => ({
		_id: t.id,
		[`flags.${e}.${a}`]: !0
	})));
	if (r.length !== n.length) {
		let e = new Set(r.map((e) => e.id)), i = n.filter((t) => e.has(t.id)).map((e) => e.id);
		try {
			await ye(t, i);
		} catch (e) {
			throw AggregateError([e], `Foundry only partially retired Skinwalker for ${t.name}, and rollback failed.`, { cause: e });
		}
		throw Error(`Foundry prevented Skinwalker from being retired for ${t.name}.`);
	}
	return n.map((e) => e.id);
}
async function ye(e, t) {
	if (t.length !== 0 && (await e.updateEmbeddedDocuments("Item", t.map((e) => ({
		_id: e,
		"flags.fvtt-wfrp-ratter.-=mutantsHandbookRetired": null
	})))).length !== t.length) throw Error(`Foundry prevented retired mutations from being restored for ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/mutation-results.ts
function be(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function xe(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function Se(t) {
	return {
		data: {
			effects: [],
			flags: { [e]: {
				patron: "khorne",
				sourceDocument: "The Mutant's Handbook"
			} },
			img: t.img ?? "modules/fvtt-wfrp-ratter/icons/mutations/mutants-handbook-mutation.png",
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
async function Ce(t, n) {
	if (!t.documentUuid) {
		if (n === "khorne" && t.name.trim().toLowerCase() === "prejudice") return Se(t);
		throw Error(`The table result ${t.name} does not link to a mutation Item.`);
	}
	let r = await fromUuid(t.documentUuid);
	if (!be(r)) throw Error(`The table result ${t.name} does not resolve to a mutation Item.`);
	let i = ne(r.system.mutationType.value);
	if (!i) throw Error(`The mutation ${r.name} has no physical or mental classification.`);
	let a = r.getFlag(e, "mutationAutomation")?.acquisition;
	return {
		...a ? { acquisition: a } : {},
		data: xe(r),
		name: r.name,
		nature: i
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/updates.ts
async function h(e, t) {
	if (!await e.update(t, { skipCorruption: !0 })) throw Error(`Foundry prevented the required update to ${e.name}.`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/pending-corruption.ts
var we = `flags.${e}.${c}`, Te = `flags.${e}.-=${c}`, Ee = `flags.${e}.${l}`;
function g(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function De(e) {
	return e === "mental" || e === "physical";
}
function Oe(e) {
	if (!(!g(e) || e.version !== 1) && (e.kind === "test" && typeof e.messageId == "string" || e.kind === "mutation" && typeof e.actorUuid == "string" && typeof e.mutationName == "string" && De(e.nature) && typeof e.token == "string")) return e;
}
function _(t) {
	return Oe(t.getFlag(e, c));
}
function ke(e) {
	return _(e) !== void 0;
}
async function Ae(e, t) {
	await h(e, { [we]: {
		kind: "test",
		messageId: t,
		version: 1
	} });
}
async function je(e) {
	await h(e, { [Te]: null });
}
function Me(e) {
	let t = Oe(e.flags?.["fvtt-wfrp-ratter"]?.mutantsHandbookPendingMutation ?? e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPendingMutation"));
	return t?.kind === "mutation" ? t : void 0;
}
function Ne(e, t) {
	let n = e[t];
	if (g(n)) return n;
	let r = {};
	return e[t] = r, r;
}
function Pe(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.some((e) => {
		if (!g(e)) return !1;
		let t = e.system, n = g(t) ? t.scriptData : void 0;
		return Array.isArray(n) && n.some((e) => g(e) && e.trigger === "immediate" && typeof e.label == "string" && e.label.startsWith("Acquire ") && typeof e.script == "string" && !e.script.includes("prepareMutationAcquisition"));
	}) : !1;
}
function Fe(t, n) {
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
const pending = this.item.flags[moduleId].${l};
const expected = actor.getFlag(moduleId, "${c}");
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
    ["flags." + moduleId + ".-=${c}"]: null,
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
function Ie(t, n) {
	let r = structuredClone(t.data), i = Ne(Ne(r, "flags"), e);
	if (i[l] = n, !Pe(r)) throw Error(`${t.name} has no embedded Mutant's Handbook acquisition script and cannot be posted.`);
	return Array.isArray(r.effects) && (r.effects = [Fe(r, t), ...r.effects]), r;
}
async function Le(e, t) {
	let n = _(e), r = {
		actorUuid: e.uuid,
		kind: "mutation",
		mutationName: t.name,
		nature: t.nature,
		token: crypto.randomUUID(),
		version: 1
	}, i = new Item.implementation(Ie(t, r));
	await h(e, { [we]: r });
	try {
		await i.postItem(void 0, n?.kind === "test" ? { "flags.wfrp4e.sourceMessageId": n.messageId } : void 0);
	} catch (t) {
		throw await h(e, { ...n ? { [we]: n } : { [Te]: null } }), t;
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/messages.ts
function v(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while formatting a mutation message.");
	return game.i18n.format(`FVTT_WFRP_RATTER.Mutations.${e}`, t);
}
async function y(e) {
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
function b(e) {
	ui.notifications.warn(e);
}
function x(e) {
	let t = e instanceof Error ? e.message : String(e), n = game ? game.i18n.format("FVTT_WFRP_RATTER.Mutations.Error", { message: t }) : `The Mutant's Handbook mutation workflow failed: ${t}`;
	console.error(e), ui.notifications.error(n);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/dialogs.ts
var Re = [
	"human",
	"dwarf",
	"elf",
	"halfling",
	"gnome",
	"ogre"
], ze = [
	"khorne",
	"nurgle",
	"slaanesh",
	"tzeentch"
];
function Be(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Ve(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a species profile.");
	let n = await foundry.applications.api.DialogV2.wait({
		buttons: Re.map((e) => ({
			action: e,
			label: Be(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesPrompt", {
			name: e,
			species: t || game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpecies")
		}),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.UnknownSpeciesTitle") }
	});
	return Re.find((e) => e === n);
}
async function He(e) {
	if (!game) throw Error("Foundry game global is unavailable while choosing a Chaos patron.");
	let t = await foundry.applications.api.DialogV2.wait({
		buttons: ze.map((e) => ({
			action: e,
			label: Be(e)
		})),
		content: game.i18n.format("FVTT_WFRP_RATTER.Mutations.PatronPrompt", { name: e }),
		rejectClose: !1,
		window: { title: game.i18n.localize("FVTT_WFRP_RATTER.Mutations.PatronTitle") }
	});
	return ze.find((e) => e === t);
}
async function Ue(e, t) {
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
function S(e) {
	return Array.isArray(e) ? e.map(S) : typeof e == "object" && e ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e < t ? -1 : +(e > t)).map(([e, t]) => [e, S(t)])) : e;
}
function C(e) {
	return JSON.stringify(S({
		configure: e.configure ?? {},
		ranks: e.ranks ?? 1,
		scope: e.scope ?? "all",
		sourceUuid: e.sourceUuid,
		stack: e.stack ?? "singleton",
		type: e.type
	}));
}
function We(e) {
	let t = { ...e };
	return delete t.scope, C({
		...t,
		ranks: 1
	});
}
function Ge(e) {
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	if (typeof t != "object" || !t || Array.isArray(t)) return;
	let n = t;
	if (!(n.stack !== "rank" || n.type !== "skill" && n.type !== "talent")) return n.ranks = 1, n.scope = "all", JSON.stringify(S(n));
}
function Ke(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function qe(e, t, n) {
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
function Je(e, t) {
	t.configure?.name && (e.name = t.configure.name);
	let n = e.system, r = typeof n == "object" && n ? n : {};
	e.system = r;
	for (let [e, n] of Object.entries(t.configure?.system ?? {})) qe(r, e.replace(/^system\./, ""), S(n));
	return t.ranks !== void 0 && (t.type === "skill" || t.type === "talent") && qe(r, "advances.value", t.ranks), e;
}
function Ye(e, t, n) {
	if (e.type !== n.type) return !1;
	let r = e.toObject(), i = n.configure?.name ?? t.name;
	if (r.name !== i) return !1;
	let a = r.system;
	if (typeof a != "object" || !a) return !1;
	for (let [e, t] of Object.entries(n.configure?.system ?? {})) {
		let n = e.replace(/^system\./, "");
		if (JSON.stringify(S(Ke(a, n))) !== JSON.stringify(S(t))) return !1;
	}
	return !(n.ranks !== void 0 && (n.type === "skill" || n.type === "talent") && Number(Ke(a, "advances.value")) !== n.ranks);
}
function Xe(e, t) {
	let n = e.toObject()._stats;
	return typeof n != "object" || !n ? !1 : n.compendiumSource === t;
}
function w(t) {
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
function T(t) {
	let n = t.flags?.[e]?.mutationGrantOwners;
	return Array.isArray(n) ? n.filter((e) => typeof e == "string") : [];
}
function Ze(t) {
	return t.flags?.[e]?.mutationGrantManaged === !0;
}
function Qe(t) {
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
var $e = [
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
], et = ["b5xKInMaTt8ljJVQ"];
[...$e, ...et];
//#endregion
//#region src/functions/mutants-handbook/actions/support-item-ids.ts
var E = {
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
}, tt = [
	{
		actionType: "attack",
		conditions: ["Spitting, drooling acid onto objects, and consuming unusual materials share this TB-per-day allowance.", "Glass and gold are not damaged by the acid."],
		duration: "Immediate",
		id: "acidic-saliva-spit",
		implementation: "support",
		itemId: E["acidic-saliva-spit"],
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
		itemId: E["beast-alpha-command"],
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
		itemId: E["bloodsucker-feed"],
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
		itemId: E["bloomblight-touch-heal"],
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
		itemId: E["dimensional-instability-teleport"],
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
		itemId: E["ecstatic-milk-produce-dose"],
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
		itemId: E["entrancement-beguile"],
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
		itemId: E["evil-eye-gaze"],
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
		itemId: E["fleshcrafter-cosmetic"],
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
		itemId: E["fleshcrafter-reshape"],
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
		itemId: E["fleshcrafter-bonecraft"],
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
		itemId: E["fleshcrafter-stop-bleeding"],
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
		itemId: E["frostbite-touch"],
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
], nt = [
	{
		actionType: "utility",
		conditions: ["The skin normally adapts to the surroundings automatically.", "Passing for an unmutated person instead requires the source's Average (+20) Cool Test to resist adapting for the scene."],
		duration: "One scene or until the surroundings materially change",
		id: "chameleon-skin-camouflage",
		implementation: "support",
		itemId: E["chameleon-skin-camouflage"],
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
		itemId: E["spelleater-gland-spend-sl"],
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
		itemId: E["ethereal-become-insubstantial"],
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
		itemId: E["invisibility-vanish"],
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
		itemId: E["oracle-foresight"],
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
		itemId: E["wind-caller-breeze"],
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
		itemId: E["hungering-maw-free-bite"],
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
		itemId: E["wind-caller-gust"],
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
], rt = [
	{
		actionType: "attack",
		conditions: ["First succeed at the separate Green Sovereign power Test.", "Branches count as Improvised Weapons."],
		duration: "Immediate",
		id: "green-sovereign-branch-strike",
		implementation: "support",
		itemId: E["green-sovereign-branch-strike"],
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
		itemId: E["green-sovereign-root-grapple"],
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
		itemId: E["telekinesis-hurl-projectile"],
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
		itemId: E["life-leech-combat-touch"],
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
		itemId: E["thunderhead-combat-touch"],
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
], it = [
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
		itemId: E["gnawer-gnaw"],
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
		itemId: E["green-sovereign-command-plants"],
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
		itemId: E["green-sovereign-strike-or-grapple"],
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
		itemId: E["gut-worm-attack"],
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
		itemId: E["horrid-scream-unleash"],
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
		itemId: E["hungering-maw-grapple"],
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
		itemId: E["infernal-furnace-breath"],
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
		itemId: E["levitation-rise"],
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
		itemId: E["life-leech-touch"],
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
		itemId: E["mirror-image-disguise"],
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
		itemId: E["oracle-augury"],
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
], at = [
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
		itemId: E["phantasmal-mind-illusion"],
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
		itemId: E["phantasmal-mind-animate"],
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
		itemId: E["piercing-tongue-attack"],
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
		itemId: E["pyrokinesis-ignite"],
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
		itemId: E["pyrokinesis-blast"],
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
		itemId: E["razor-sharp-claws-attack"],
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
		itemId: E["scrying-touch-psychometry"],
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
], ot = [
	{
		actionType: "control",
		conditions: ["Target every creature currently engaged with the mutant."],
		duration: "Resolve at the end of each Round",
		id: "burning-body-aura",
		implementation: "support",
		itemId: E["burning-body-aura"],
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
		itemId: E["contagious-madness-aura"],
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
		itemId: E["infernal-furnace-critical-burst"],
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
		itemId: E["infernal-furnace-death-explosion"],
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
		itemId: E["tantalising-aura"],
		mutationId: "UocYY55QaW15zWYk",
		mutationName: "Tantalising Aura",
		name: "Resolve Tantalising Aura",
		outcome: "Each target tests Average Willpower or gains Surprised and must approach the mutant.",
		range: "WPB yards",
		rules: "Select all living creatures in range, then apply the outcome from this card.",
		target: "multiple"
	}
], D = (e) => ({
	...e,
	implementation: "support",
	itemId: E[e.id]
}), st = [
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
	D({
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
], ct = [
	{
		actionType: "control",
		conditions: ["The retained Tail result must be Mace Tail."],
		duration: "Immediate",
		id: "tail-mace-free-attack",
		implementation: "support",
		itemId: E["tail-mace-free-attack"],
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
		itemId: E["tail-prehensile-free-attack"],
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
		itemId: E["tail-scorpion-free-attack"],
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
		itemId: E["telekinesis-move-object"],
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
		itemId: E["telekinesis-hurl-weapon"],
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
		itemId: E["telepathy-project-thoughts"],
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
		itemId: E["telepathy-read-thoughts"],
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
		itemId: E["temporal-instability-surge"],
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
		itemId: E["thorns-launch"],
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
		itemId: E["thorns-unarmed"],
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
		itemId: E["thunderhead-shock"],
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
		itemId: E["thunderhead-lightning-bolt"],
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
], lt = Object.freeze([
	...tt,
	...it,
	...at,
	...ct,
	...rt,
	...nt,
	...ot,
	...st
]), ut = new Map(lt.map((e) => [e.id, e])), dt = /* @__PURE__ */ new Map();
for (let e of lt) {
	let t = dt.get(e.mutationId) ?? [];
	t.push(e), dt.set(e.mutationId, t);
}
new Map([...dt].map(([e, t]) => [e, Object.freeze(t)]));
function ft(e) {
	return ut.get(e);
}
//#endregion
//#region src/functions/mutants-handbook/actions/outcomes.ts
var pt = {
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
function O(e) {
	return pt[e] ?? [];
}
Object.freeze(Object.keys(pt));
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/acquisition-grants.ts
var mt = new Set([
	"armour",
	"psychology",
	"skill",
	"talent",
	"trait",
	"weapon"
]), ht = new Set([
	"configuration",
	"rank",
	"singleton"
]), gt = 256, _t = new Set([
	"__proto__",
	"constructor",
	"prototype"
]), vt = /^Compendium\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.Item\.[A-Za-z0-9_-]+$/, yt = /^[A-Za-z0-9][A-Za-z0-9:_-]{0,127}$/, k = Symbol("invalid-acquisition-value"), bt = "bSVbWpX8AcBSIyTU", xt = {
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
		if (_t.has(i)) return k;
		let e = j(a, t, n + 1);
		if (e === k) return k;
		r[i] = e;
	}
	return t.delete(e), r;
}
function St(e) {
	let t = e.replace(/^system\./, ""), n = t.split(".");
	return t.length > 0 && n.every((e) => e && !_t.has(e)) ? t : void 0;
}
function Ct(e) {
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
			let e = St(t), a = j(i, /* @__PURE__ */ new Set());
			if (!e || a === k || r.some((t) => e.startsWith(`${t}.`) || t.startsWith(`${e}.`))) return;
			r.push(e), n[t] = a;
		}
		t.system = n;
	}
	return t;
}
function wt(e) {
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
	if (typeof n != "string" || !yt.test(n) || typeof r != "string" || r.trim().length === 0 || typeof i != "string" || !vt.test(i) || typeof a != "string" || !mt.has(a)) return;
	let o = e.stack ?? "singleton";
	if (typeof o != "string" || !ht.has(o) || o === "rank" && a !== "skill" && a !== "talent" || e.scope !== void 0 && e.scope !== "first" || e.aggregate !== void 0 && e.aggregate !== "latest" || e.aggregate === "latest" && o !== "configuration") return;
	let s = e.aggregateKey;
	if (s !== void 0 && (typeof s != "string" || s.trim().length === 0 || s.length > gt) || e.ranks !== void 0 && (!Number.isSafeInteger(e.ranks) || Number(e.ranks) < 1) || e.ranks !== void 0 && a !== "skill" && a !== "talent") return;
	let c = Ct(e.configure);
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
function Tt(e) {
	return !A(e) || e.status !== "resolved" || e.version !== void 0 && e.version !== 1 || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !A(e.rolls) || !A(e.selections) || j(e.rolls, /* @__PURE__ */ new Set()) === k || j(e.selections, /* @__PURE__ */ new Set()) === k || !Array.isArray(e.grants) ? !1 : e.acceptedBlocks === void 0 ? !0 : Array.isArray(e.acceptedBlocks) && e.acceptedBlocks.every((e) => A(e) && Object.keys(e).every((e) => e === "kind" || e === "message") && typeof e.kind == "string" && typeof e.message == "string");
}
function Et(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n) || n.definitionId === "mNNavbJayRcsyeXJ") return [];
	let r = n.state;
	if (!A(r) || !Tt(r.acquisition)) return [];
	let i = r.acquisition.grants.map(wt).filter((e) => e !== void 0), a = /* @__PURE__ */ new Map();
	for (let e of i) a.set(e.key, (a.get(e.key) ?? 0) + 1);
	return i.filter((e) => a.get(e.key) === 1);
}
function Dt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n)) return;
	let r = n.state;
	if (!A(r)) return;
	let i = r.acquisition;
	if (!A(i) || i.version !== void 0 && i.version !== 1) return;
	let a = i.occurrence;
	return Number.isSafeInteger(a) && Number(a) > 0 ? Number(a) : void 0;
}
function Ot(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (!A(n) || n.definitionId !== bt) return;
	let r = n.state;
	if (!A(r)) return;
	let i = r.acquisition;
	if (!A(i) || i.status !== "resolved") return;
	let a = i.selections;
	if (!A(a) || typeof a.tail != "string") return;
	let o = xt[a.tail];
	if (!o) return;
	let [s, c] = o;
	return {
		key: `mutation-action:${s}`,
		name: c,
		sourceUuid: `Compendium.${e}.ratter-11-items.Item.${E[s]}`,
		stack: "singleton",
		type: "trait"
	};
}
function kt(e, t = []) {
	let n = t.map(wt).filter((e) => e !== void 0), r = new Map(n.map((e) => [e.key, e])), i = Ot(e);
	i && r.set(i.key, i);
	for (let t of Et(e)) {
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
function At(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.createEmbeddedDocuments == "function" && typeof t.deleteEmbeddedDocuments == "function" && t.items !== void 0;
}
function jt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function Mt(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.definitionId != "string" || typeof r.version != "number" || r.grants !== void 0 && !Array.isArray(r.grants))) return n;
}
function Nt(t) {
	return t.getFlag(e, o) === !0;
}
function Pt(e) {
	return Nt(e) || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0;
}
function Ft(e, t, n) {
	return M(e).filter((e) => e.type === "mutation" && !Pt(e) && Mt(e)?.definitionId === n).sort((e, t) => e.id.localeCompare(t.id))[0]?.id === t.id;
}
async function It(e, t, n) {
	t.update ? await t.update(n) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}]);
}
function Lt(e, t, n, r) {
	let i = w(e), a = T(e).map((e) => ({
		grantKey: "legacy",
		ownerId: e
	})), o = [...i?.owners ?? a];
	return o.some((e) => e.ownerId === r.ownerId && e.grantKey === r.grantKey) || o.push(r), {
		managed: i?.managed ?? Ze(e),
		owners: o,
		signature: n,
		sourceUuid: t.sourceUuid,
		version: 2
	};
}
function Rt(e, t, n, r, i) {
	let a = M(e).filter((e) => Ye(e, t, n)).sort((e, t) => e.id.localeCompare(t.id)), o = a.find((e) => {
		let t = w(e);
		return t?.signature === r && t.owners.some((e) => e.ownerId === i.ownerId && e.grantKey === i.grantKey);
	});
	return (n.stack ?? "singleton") === "rank" ? o ?? a.find((e) => T(e).includes(i.ownerId)) : a.filter((e) => {
		let t = w(e);
		return t?.signature === r || !t && T(e).length === 0 && (n.type === "skill" || Xe(e, n.sourceUuid));
	}).sort((e, t) => (w(e)?.managed === !0) - +(w(t)?.managed === !0) || e.id.localeCompare(t.id))[0] || a.find((e) => T(e).includes(i.ownerId)) || a.find((e) => {
		let t = w(e);
		return t?.signature === r || !t && T(e).length === 0 && Xe(e, n.sourceUuid);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/owner-cleanup.ts
async function zt(t, n, r) {
	let i = [];
	for (let a of M(t)) {
		let o = w(a), s = T(a), c = (o?.owners ?? []).filter((e) => {
			if (e.ownerId !== n) return !0;
			let t = r.get(e.grantKey);
			return t !== void 0 && t.signature === o?.signature && (t.itemId === void 0 || t.itemId === a.id);
		}), l = [...r.values()], u = l.some((e) => e.itemId === a.id), d = l.some((e) => e.itemId === void 0), f = s.filter((e) => e !== n || u || d);
		if (!(c.length !== (o?.owners.length ?? 0) || f.length !== s.length)) continue;
		if ((o?.managed ?? Ze(a)) && c.length === 0 && f.length === 0 && !Qe(a)) {
			i.push(a.id);
			continue;
		}
		let p = {};
		f.length > 0 ? (p[`flags.${e}.mutationGrantOwners`] = f, Ze(a) && (p[`flags.${e}.mutationGrantManaged`] = !0)) : (p[`flags.${e}.-=mutationGrantManaged`] = null, p[`flags.${e}.-=mutationGrantOwners`] = null), o && c.length > 0 ? p[`flags.${e}.mutationGrant`] = {
			...o,
			owners: c
		} : o && (p[`flags.${e}.-=mutationGrant`] = null), await It(t, a, p);
	}
	i.length > 0 && await t.deleteEmbeddedDocuments("Item", i);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/ranked-skill-items.ts
function Bt(e) {
	return Array.from(e.items);
}
function Vt(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return typeof t.name == "string" && typeof t.type == "string" && typeof t.toObject == "function";
}
function Ht(e) {
	let t = e.toObject().system;
	if (typeof t != "object" || !t) return 0;
	let n = t.advances;
	if (typeof n != "object" || !n) return 0;
	let r = Number(n.value);
	return Number.isFinite(r) ? r : 0;
}
function Ut(e) {
	let t = Qe(e);
	if (t) return {
		...t,
		legacy: !1
	};
	let n = w(e);
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
function Wt(e, t) {
	let n = Ht(e), r = Ut(e);
	if (!r) return Math.max(0, n);
	let i = r.legacy && t !== void 0 ? Math.max(r.appliedRanks, Math.min(t, n)) : r.appliedRanks;
	return Math.max(0, n - i);
}
function Gt(e) {
	return Ut(e)?.managed === !0;
}
function Kt(e, t) {
	let n = typeof e.system == "object" && e.system !== null ? e.system : {};
	e.system = n;
	let r = n.advances, i = typeof r == "object" && r ? r : {};
	n.advances = i, i.value = t;
}
function qt(t, n) {
	let r = typeof t.flags == "object" && t.flags !== null ? t.flags : {};
	t.flags = r;
	let i = typeof r["fvtt-wfrp-ratter"] == "object" && r["fvtt-wfrp-ratter"] !== null ? r[e] : {};
	r[e] = i, i.mutationSkillGrant = n;
}
async function Jt(e, t, n) {
	let r = { skipExperienceChecks: !0 };
	t.update ? await t.update(n, r) : await e.updateEmbeddedDocuments("Item", [{
		_id: t.id,
		...n
	}], r);
}
function Yt(t) {
	return {
		"system.advances.value": t,
		[`flags.${e}.-=mutationSkillGrant`]: null
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation/ranked-grant-data.ts
function Xt(e) {
	if (e.type !== "talent") return;
	let t = w(e);
	if (!t || !Ge(t.signature)) return;
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
	return Ut(e) ?? Xt(e);
}
function Zt(e, t) {
	let n = Xt(e);
	if (!n) return Wt(e, t);
	let r = e.toObject().system, i = Number(r?.advances?.value ?? 0), a = t === void 0 ? n.appliedRanks : Math.max(n.appliedRanks, Math.min(t, i));
	return Math.max(0, i - a);
}
function Qt(e) {
	let t = N(e);
	return t?.managed === !1 ? 0 : t ? 2 : 1;
}
function $t(e, t) {
	return N(e)?.owners.some((e) => Ge(e.signature) === t) ?? !1;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/skill-grant-reconciliation.ts
function P(e, t) {
	return e < t ? -1 : +(e > t);
}
function en(e, t) {
	let n = { ...t.grant };
	return delete n.ranks, Ye(e, { name: t.name }, n);
}
async function tn(e, t) {
	let n = /* @__PURE__ */ new Map();
	return await Promise.all(t.map(async ({ grant: t, mutation: r }) => {
		if (t.type !== "skill" && t.type !== "talent") return;
		let i = We(t);
		if (t.configure?.name || n.has(i)) return;
		let a = C(t), o = Bt(e).find((e) => e.type === t.type && N(e)?.owners.some((e) => e.sourceUuid === t.sourceUuid && (e.ownerId === r.id && e.grantKey === t.key || e.signature === a)));
		if (o) {
			n.set(i, o.name);
			return;
		}
		let s = await fromUuid(t.sourceUuid);
		Vt(s) && s.type === t.type && n.set(i, s.name);
	})), t.flatMap(({ grant: e, mutation: t }) => {
		if (e.type !== "skill" && e.type !== "talent") return [];
		let r = We(e);
		return [{
			grant: e,
			grantKey: e.key,
			identity: r,
			mutationName: t.name,
			name: e.configure?.name ?? n.get(r) ?? e.name,
			ownerId: t.id,
			ranks: e.ranks ?? 1,
			signature: C(e),
			sourceUuid: e.sourceUuid
		}];
	});
}
function nn(e) {
	return e.map(({ grantKey: e, ownerId: t, ranks: n, signature: r, sourceUuid: i }) => ({
		grantKey: e,
		ownerId: t,
		ranks: n,
		signature: r,
		sourceUuid: i
	}));
}
async function rn(e, t) {
	let n = t[0];
	if (!n) return;
	let r = await fromUuid(n.sourceUuid);
	if (!Vt(r) || r.type !== n.grant.type) {
		ui.notifications.warn(`${n.mutationName}: could not grant ${n.name}. Enable its source module and reconcile mutation automation.`);
		return;
	}
	let i = Je(r.toObject(), n.grant);
	if (delete i._id, delete i._key, Kt(i, 0), qt(i, {
		appliedRanks: 0,
		managed: !0,
		owners: [],
		version: 1
	}), !(await e.createEmbeddedDocuments("Item", [i], {
		skipExperienceChecks: !0,
		skipSpecialisationChoice: !0
	})).find(Vt) && !Bt(e).some((e) => en(e, n))) throw Error(`${n.mutationName}: Foundry prevented the ${n.name} grant.`);
	await on(e, n.identity, t, !1);
}
async function an(e, t) {
	let n = [];
	for (let r of t) {
		let t = N(r);
		if (!t) continue;
		let i = Zt(r);
		t.managed && i === 0 && !w(r) ? n.push(r.id) : await Jt(e, r, Yt(i));
	}
	n.length > 0 && await e.deleteEmbeddedDocuments("Item", n);
}
async function on(t, n, r, i = !0) {
	let a = r[0], o = Bt(t).filter((e) => a ? en(e, a) : $t(e, n)).sort((e, t) => Qt(e) - Qt(t) || P(e.id, t.id));
	if (r.length === 0) {
		await an(t, o);
		return;
	}
	let s = o[0];
	if (!s) {
		if (!i) throw Error(`${a?.name ?? "Ranked Item"}: Foundry did not retain the mutation grant.`);
		await rn(t, r);
		return;
	}
	let c = o.slice(1).filter((e) => N(e));
	o.slice(1).filter((e) => !N(e)).length > 0 && ui.notifications.warn(`${a?.name}: multiple user-owned Items share this configuration. Mutation advances were applied only to ${s.name}; review the duplicates manually.`);
	let l = r.reduce((e, t) => e + t.ranks, 0), u = Zt(s, l), d = {
		appliedRanks: l,
		managed: N(s)?.managed ?? w(s)?.managed ?? !1,
		owners: nn(r),
		version: 1
	};
	await Jt(t, s, {
		"system.advances.value": u + l,
		[`flags.${e}.mutationSkillGrant`]: d
	});
	let f = [];
	for (let e of c) {
		let n = Zt(e);
		(Gt(e) || N(e)?.managed) && n === 0 && !w(e) ? f.push(e.id) : (await Jt(t, e, Yt(n)), n > 0 && ui.notifications.warn(`${a?.name}: retained a duplicate Item containing non-mutation advances; review the duplicate manually.`));
	}
	f.length > 0 && await t.deleteEmbeddedDocuments("Item", f);
}
async function sn(e, t) {
	let n = await tn(e, t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = r.get(e.identity) ?? [];
		t.push(e), r.set(e.identity, t);
	}
	let i = /* @__PURE__ */ new Set();
	for (let t of Bt(e)) for (let e of N(t)?.owners ?? []) {
		let t = Ge(e.signature);
		t && i.add(t);
	}
	for (let t of [...i].filter((e) => !r.has(e)).sort(P)) await on(e, t, []);
	for (let t of [...r.keys()].sort(P)) await on(e, t, (r.get(t) ?? []).sort((e, t) => P(e.ownerId, t.ownerId) || P(e.grantKey, t.grantKey)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/grant-reconciliation.ts
var cn = /* @__PURE__ */ new Map();
async function ln(t, n, r, i, a) {
	let o = Je(n.toObject(), r);
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
async function un(t, n, r) {
	let i = C(r), a = await fromUuid(r.sourceUuid);
	if (!jt(a) || a.type !== r.type) return ui.notifications.warn(`${n.name}: could not grant ${r.configure?.name ?? r.key}. Enable its source module and reconcile mutation automation.`), { signature: i };
	let o = {
		grantKey: r.key,
		ownerId: n.id
	}, s = Rt(t, a, r, i, o);
	if (!s) {
		let e = await ln(t, a, r, i, o);
		return e ? {
			itemId: e,
			signature: i
		} : { signature: i };
	}
	let c = Lt(s, r, i, o), l = s.flags?.["fvtt-wfrp-ratter"] ?? {};
	return JSON.stringify(w(s)) === JSON.stringify(c) && !("mutationGrantManaged" in l) && !("mutationGrantOwners" in l) || await It(t, s, {
		[`flags.${e}.mutationGrant`]: c,
		[`flags.${e}.-=mutationGrantManaged`]: null,
		[`flags.${e}.-=mutationGrantOwners`]: null
	}), {
		itemId: s.id,
		signature: i
	};
}
async function dn(e) {
	let t = M(e).filter((e) => e.type === "mutation" && !Pt(e)), n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
	for (let [o, s] of t.entries()) {
		let t = Mt(s);
		if (!t) continue;
		let c = (a.get(t.definitionId) ?? 0) + 1;
		a.set(t.definitionId, c), r.set(s.id, /* @__PURE__ */ new Map());
		for (let a of kt(s, t.grants)) if (!(a.scope === "first" && !Ft(e, s, t.definitionId))) if ((a.type === "skill" || a.type === "talent") && a.stack === "rank") n.push({
			grant: a,
			mutation: s
		});
		else if (a.aggregate === "latest" && a.stack === "configuration") {
			let e = `${t.definitionId}\0${a.aggregateKey ?? a.key}`, n = i.get(e) ?? [];
			n.push({
				grant: a,
				mutation: s,
				occurrence: Dt(s) ?? c,
				order: o
			}), i.set(e, n);
		} else r.get(s.id)?.set(a.key, await un(e, s, a));
	}
	await sn(e, n);
	for (let t of i.values()) {
		t.sort((e, t) => e.occurrence - t.occurrence || e.order - t.order);
		let n = t.at(-1)?.grant;
		if (n) for (let i of t) r.get(i.mutation.id)?.set(n.key, await un(e, i.mutation, n));
	}
	for (let n of t) {
		let t = r.get(n.id);
		t && await zt(e, n.id, t);
	}
	let o = new Set(M(e).filter((e) => e.type === "mutation" && !Pt(e) && Mt(e) !== void 0).map((e) => e.id)), s = /* @__PURE__ */ new Set();
	for (let t of M(e)) {
		for (let e of w(t)?.owners ?? []) o.has(e.ownerId) || s.add(e.ownerId);
		for (let e of T(t)) o.has(e) || s.add(e);
	}
	for (let t of s) await zt(e, t, /* @__PURE__ */ new Map());
}
async function fn(e, t) {
	let n = (cn.get(e) ?? Promise.resolve()).catch(() => void 0).then(t);
	cn.set(e, n);
	try {
		await n;
	} finally {
		cn.get(e) === n && cn.delete(e);
	}
}
async function pn(e) {
	let t = await fromUuid(e);
	if (!At(t)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await fn(e, () => dn(t));
}
async function mn(e, t) {
	let n = await fromUuid(e);
	if (!At(n)) throw Error(`Mutation automation could not resolve Actor ${e}.`);
	await fn(e, async () => {
		await zt(n, t, /* @__PURE__ */ new Map()), await dn(n);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/outcomes.ts
var hn = `flags.${e}.${r}`;
function gn(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function _n(e, t) {
	return ae(t, gn(e));
}
function vn(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function yn(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await Ue(e.name, t);
}
async function bn(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": oe(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await h(e, i);
}
async function xn(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let n = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await yn(e, n)) {
		let r = _n(e, t);
		await bn(e, r, !0), await y(v("Resisted", {
			loss: r,
			mutation: n,
			name: e.name
		}));
		return;
	}
	let r = await He(e.name), i = r ?? "unassigned", a = he(e), o = _n(e, t);
	if (await bn(e, o, !1, { [hn]: i }), a && (await _e(e), await pn(e.uuid)), await y(v(r ? "Chosen" : "ChosenUnassigned", {
		loss: o,
		name: e.name,
		patron: r ? vn(r) : "Chaos"
	})), a) {
		let t = v("PossessedRemoved", { name: e.name });
		b(t), await y(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/patron-notes.ts
var Sn = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, Cn = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, wn = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, Tn = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, En = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), Dn = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function On(e, t) {
	let n = t.trim().toLowerCase();
	if (En.has(n)) return Sn[e];
	if (Dn.has(n)) return Cn[e];
	if (n === "addiction") return wn[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return Tn[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/tables.ts
function kn(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function An(e) {
	let t = game?.packs.get(n);
	if (!t) throw Error(`The required compendium ${n} is unavailable.`);
	let r = await t.getDocument(e);
	if (!kn(r)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return r;
}
async function F(e, t, n = !0) {
	let r = (await (await An(e)).draw({
		displayChat: n,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!r) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return r;
}
function jn(e) {
	return F(u[e]);
}
function Mn(e) {
	let t = ie(e);
	return F(d, t > 0 ? `1d100 + ${t}` : "1d100");
}
function Nn(e, t) {
	return F(f[t][e], void 0, !1);
}
function Pn(e) {
	return F(p[e], void 0, !1);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/workflow.ts
var Fn = `flags.${e}.${r}`;
function In(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Ln(e, t) {
	if (t !== "unassigned") return t;
	let n = await He(e.name);
	if (!n) {
		b(v("PatronRequired", { name: e.name }));
		return;
	}
	return await h(e, { [Fn]: n }), n;
}
async function Rn(e, t) {
	let n = await Ln(e, t);
	if (!n) return !1;
	let r = await Ce(await Pn(n), n);
	await Le(e, r);
	let i = On(n, r.name);
	return i && await y(v("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: In(n)
	})), !0;
}
async function zn(e) {
	let t = e.system.details.species.value, n = te(t) ?? await Ve(e.name, t);
	if (!n) return b(v("SpeciesRequired", { name: e.name })), !1;
	let r = await jn(n), i = ne(r.name);
	if (!i) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let a = await Mn(pe(e).total), o = re(a.name);
	if (!o) throw Error(`The severity table returned an unrecognized result: ${a.name}.`);
	if (o === "chosen") return await xn(e, i), !0;
	let s = await Nn(i, o);
	if (!s.documentUuid && re(s.name) === "chosen") return await xn(e, i), !0;
	let c = await Ce(s);
	if (c.nature !== i) throw Error(`${c.name} does not match the rolled ${i} mutation table.`);
	return await Le(e, c), !0;
}
async function Bn(e) {
	let t = me(e);
	return t ? Rn(e, t) : zn(e);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/corruption-chat.ts
var Vn = "mutantsHandbookCorruptionFlow", Hn = /* @__PURE__ */ new Set(), Un = /* @__PURE__ */ new Map();
function I(t) {
	let n = t.flags?.[e]?.[Vn];
	if (typeof n != "object" || !n) return;
	let r = n;
	if (!(typeof r.actorUuid != "string" || r.status !== "complete" && r.status !== "pending" || r.version !== 1)) return r;
}
async function L(t, n) {
	if (typeof t.setFlag != "function") throw Error("Foundry cannot store the Mutant's Handbook chat-card state.");
	await t.setFlag(e, Vn, n);
}
async function Wn(e, t) {
	let n = t.context.messageId, r = n ? game?.messages.get(n) : void 0;
	if (!n || !r) throw Error("The Endurance Test did not create a chat message to continue from.");
	let i = r.system.test?.failed ?? t.failed;
	if (await L(r, {
		actorUuid: e.uuid,
		status: i ? "pending" : "complete",
		version: 1
	}), i) try {
		await Ae(e, n);
	} catch (e) {
		throw await L(r, null), e;
	}
}
async function Gn(e) {
	let t = I(e), n = e.id;
	if (!t || t.status !== "pending" || !n || Hn.has(n)) return !1;
	Hn.add(n);
	try {
		let r = await fromUuid(t.actorUuid);
		if (!fe(r)) throw Error(`${t.actorUuid} no longer resolves to a WFRP4e character Actor.`);
		let i = _(r);
		if (i?.kind !== "test" || i.messageId !== n) throw Error(`${r.name} is no longer waiting on this Corruption Test.`);
		let a = e.system.test;
		if (!a) throw Error("The Corruption Test chat message no longer contains its WFRP Test data.");
		if (a.failed) {
			if (!await Bn(r)) return !1;
			let e = _(r);
			e?.kind === "test" && e.messageId === n && await je(r);
		} else await je(r);
		return await L(e, {
			...t,
			status: "complete"
		}), !0;
	} finally {
		Hn.delete(n);
	}
}
async function Kn(e) {
	let t = e.system.test?.context.previousMessage;
	if (!t || !e.id) return !1;
	let n = game?.messages.get(t), r = n ? I(n) : void 0;
	if (!n || !r || r.status !== "pending") return !1;
	let i = await fromUuid(r.actorUuid);
	if (!fe(i)) throw Error(`${r.actorUuid} no longer resolves to a WFRP4e character Actor.`);
	let a = e.system.test?.failed;
	if (typeof a != "boolean") return !1;
	await L(e, {
		actorUuid: r.actorUuid,
		status: a ? "pending" : "complete",
		version: 1
	});
	let o = _(i);
	return o?.kind === "test" && o.messageId === t && (a ? await Ae(i, e.id) : await je(i)), typeof n.delete == "function" ? await n.delete() : await L(n, null), !0;
}
async function qn(e) {
	let t = e.id;
	if (!t) return !1;
	let n = Un.get(t);
	if (n) return n;
	let r = Kn(e).finally(() => {
		Un.delete(t);
	});
	return Un.set(t, r), r;
}
function Jn(e) {
	return game?.user.isGM === !0 || e.isAuthor === !0;
}
function Yn(e, t) {
	let n = I(e);
	if (!n || e.system.test?.failed !== !1) return !1;
	if (!t.querySelector("[data-ratter-corruption-result=\"success\"]")) {
		let e = document.createElement("p");
		e.dataset.ratterCorruptionResult = "success", e.textContent = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.CorruptionHeld"), (t.querySelector(".message-content") ?? t).append(e);
	}
	return n.status === "pending" && Gn(e).catch(x), !0;
}
function Xn(e, t) {
	let n = I(e);
	if (Yn(e, t) || !n || n.status !== "pending" || e.system.test?.failed !== !0 || !Jn(e) || t.querySelector("[data-ratter-action=\"continue-corruption\"]")) return;
	let r = document.createElement("button");
	r.type = "button", r.classList.add("chat-button"), r.dataset.ratterAction = "continue-corruption", r.innerHTML = `<i class="fa-solid fa-forward"></i> ${game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ContinueCorruption")}`, r.addEventListener("click", async () => {
		r.disabled = !0;
		try {
			await Gn(e) || (r.disabled = !1);
		} catch (e) {
			r.disabled = !1, x(e);
		}
	}), (t.querySelector(".message-content") ?? t).append(r);
}
function Zn() {
	Hooks.on("createChatMessage", (e) => {
		qn(e).catch(x);
	}), Hooks.on("renderChatMessageHTML", (e, t) => {
		if (typeof t != "object" || !t || !(t instanceof HTMLElement)) return;
		let n = e;
		Xn(n, t), !I(n) && n.system.test?.context.previousMessage && qn(n).then(() => Xn(n, t)).catch(x);
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/check.ts
var Qn = /* @__PURE__ */ new Set();
async function $n(e) {
	let t = e.system.status.corruption;
	if (!(Number(t.value) <= Number(t.max) || Qn.has(e.uuid) || ke(e) || ge(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		Qn.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[s]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await Wn(e, i);
		} finally {
			Qn.delete(e.uuid);
		}
	}
}
async function er(e) {
	let t = await fromUuid(e);
	if (!fe(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await $n(t);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/documents.ts
function R(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function tr(e) {
	return R(e) ? e : void 0;
}
function nr(e) {
	return R(e) ? e : void 0;
}
function rr(e) {
	return R(e) ? e : void 0;
}
function z(e) {
	return R(e.context) || (e.context = {}), e.context;
}
function ir(t) {
	let n = t.flags?.[e]?.mutationAction;
	return R(n) && typeof n.actionId == "string" ? n.actionId : void 0;
}
function ar(e, t, n) {
	let r = n.context?.mutationActionId, i = n.preData?.options?.mutationActionId, a = n.item;
	return r === t || i === t || a?.id === e.id || a?.uuid !== void 0 && a.uuid === e.uuid;
}
function or(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
function B(t, n) {
	return (t.itemTypes?.mutation ?? or(t)).filter((t) => {
		if (t.type !== void 0 && t.type !== "mutation") return !1;
		let r = t.flags?.[e], i = r?.mutationAutomation;
		return (R(i) ? i.definitionId : t.id) === n && r?.mutantsHandbookRetired !== !0 && r?.mutantsHandbookPossessionRemoved !== !0;
	}).length;
}
function sr(e, t) {
	return cr(e, t)[0];
}
function cr(t, n) {
	return (t.itemTypes?.mutation ?? or(t)).filter((t) => {
		if (t.type !== void 0 && t.type !== "mutation") return !1;
		let r = t.flags?.[e], i = r?.mutationAutomation;
		return (R(i) ? i.definitionId : t.id) === n && r?.mutantsHandbookRetired !== !0 && r?.mutantsHandbookPossessionRemoved !== !0;
	});
}
function lr(t) {
	let n = t?.flags?.[e]?.mutationAutomation, r = t?.getFlag?.(e, "mutationAutomation"), i = R(n) ? n : R(r) ? r : void 0, a = R(i?.state) ? i.state : void 0, o = R(a?.acquisition) ? a.acquisition : void 0;
	return o?.status === "resolved" ? o : {};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/usage.ts
var ur = "mutationActionUsage", dr = 480 * 60, fr = "dimensional-instability-teleport", V = /* @__PURE__ */ new Map();
function H() {
	return Reflect.get(globalThis, "game");
}
function pr() {
	let e = Number(H()?.time?.worldTime);
	return Number.isFinite(e) ? e : Math.floor(Date.now() / 1e3);
}
function mr(t) {
	let n = t.flags?.[e]?.[ur];
	if (!R(n) || n.version !== 1 || !R(n.actions)) return {
		actions: {},
		version: 1
	};
	let r = {};
	for (let [e, t] of Object.entries(n.actions)) Array.isArray(t) && (r[e] = t.filter((e) => R(e) && typeof e.id == "string" && Number.isFinite(e.at) && typeof e.period == "string" && typeof e.targetId == "string"));
	return {
		actions: r,
		version: 1
	};
}
function hr(e, t) {
	return e === "day" ? `day:${Math.floor(t / 86400)}` : e === "scene" ? `scene:${H()?.combat?.id ?? H()?.scene?.id ?? "none"}` : e ?? "use";
}
function gr(e) {
	if (typeof e == "string") return e;
	if (R(e)) for (let t of [
		"token",
		"id",
		"uuid",
		"actor"
	]) {
		let n = e[t];
		if (typeof n == "string") return n;
		if (R(n)) {
			let e = n.uuid ?? n.id;
			if (typeof e == "string") return e;
		}
	}
}
function _r(e, t) {
	if (!e.usage?.perTarget) return ["*"];
	let n = t?.context?.targets, r = Array.isArray(n) ? n : [...H()?.user?.targets ?? []], i = [...new Set(r.map(gr).filter((e) => !!e))];
	return i.length ? i : ["untargeted"];
}
function U(e, t, n = pr()) {
	let r = mr(t).actions[e.id] ?? [];
	if (e.usage?.period === "eight-hours" || e.id === fr) return r.filter((e) => e.at > n - dr);
	let i = hr(e.usage?.period, n);
	return r.filter((e) => e.period === i);
}
function vr(e, t) {
	let n = e.usage?.max;
	return n === "tb" ? Math.max(0, Number(t.system?.characteristics?.t?.bonus) || 0) : typeof n == "number" ? n : Infinity;
}
function yr(e) {
	let t = z(e), n = t.mutationActionUseId;
	if (typeof n == "string" && n) return n;
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return t.mutationActionUseId = r, r;
}
function br(e, t, n, r) {
	let i = vr(e, t), a = U(e, n), o = r?.context?.mutationActionUseId;
	return _r(e, r).every((e) => {
		let t = a.filter((t) => t.targetId === e);
		return t.some((e) => e.id === o) || t.length < i;
	});
}
function xr(e, t, n, r) {
	let i = r?.context?.mutationActionUseId;
	return typeof i == "string" && U(e, n).some((e) => e.id === i) ? !0 : (Number(t.system?.status?.advantage?.value) || 0) >= (e.usage?.advantageCost ?? 0) && br(e, t, n, r);
}
function Sr(e, t) {
	if (e.mutationName !== "Dimensional Instability") return e.test?.difficulty;
	let n = [
		"average",
		"challenging",
		"difficult",
		"hard",
		"vhard"
	];
	return n[Math.min(n.length - 1, U(e, t).length)];
}
async function Cr(e, t) {
	if (t <= 0) return;
	if (e.modifyAdvantage) {
		await e.modifyAdvantage(-t);
		return;
	}
	let n = Number(e.system?.status?.advantage?.value) || 0;
	await e.update?.({ "system.status.advantage.value": Math.max(0, n - t) });
}
async function wr(t, n, r, i) {
	let a = yr(i);
	if (!xr(t, n, r, i)) return !1;
	let o = mr(r), s = o.actions[t.id] ?? [];
	if (s.some((e) => e.id === a)) return !0;
	await Cr(n, t.usage?.advantageCost ?? 0);
	let c = pr(), l = hr(t.usage?.period, c), u = _r(t, i).map((e) => ({
		at: c,
		id: a,
		period: l,
		targetId: e
	})), d = s.filter((e) => e.at > c - 32 * 86400).slice(-99);
	return o.actions[t.id] = [...d, ...u], await r.update?.({ [`flags.${e}.${ur}`]: o }), !0;
}
async function Tr(e, t, n, r) {
	let i = `${n.uuid ?? n.id ?? "item"}:${e.id}`, a = (V.get(i) ?? Promise.resolve(!0)).catch(() => !1).then(() => wr(e, t, n, r));
	V.set(i, a);
	try {
		return await a;
	} finally {
		V.get(i) === a && V.delete(i);
	}
}
function Er(e, t) {
	return U(e, t).length;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/card.ts
var Dr = "data-ratter-mutation-action";
function W(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Or(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : typeof e == "string" && e ? [e] : [];
}
function G(e, t) {
	let n = Or(t);
	return n.length ? `<p><strong>${W(e)}:</strong> ${n.map(W).join("; ")}</p>` : "";
}
function kr(e, t, n, r) {
	let i = Number(r.result?.SL), a = t.system?.characteristics?.wp, o = Math.max(1, B(t, e.mutationId)), s = [
		Number.isFinite(i) ? `SL ${i}` : void 0,
		Number.isFinite(Number(a?.value)) ? `WP ${Number(a?.value)}` : void 0,
		Number.isFinite(Number(a?.bonus)) ? `WPB ${Number(a?.bonus)}` : void 0,
		`mutation level ${o}`
	].filter((e) => !!e);
	return e.usage?.period && s.push(`uses this ${e.usage.period}: ${Er(e, n)}`), s.join("; ");
}
function Ar(e, t) {
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
function jr(e, t, n, r) {
	let i = Or(e.conditions), a = O(e.id).length ? "<p><strong>Automation:</strong> After accepting the final roll, right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${Dr}="${W(e.id)}">`,
		`<p><strong>${W(e.mutationName)} — ${W(e.name)}</strong></p>`,
		G("Target", e.target),
		G("Range", e.range),
		G("Duration", e.duration),
		G("Outcome", e.outcome),
		G("Rules", e.rules),
		i.length ? `<p><strong>Condition guidance:</strong> ${i.map(W).join("; ")}. Apply these only after the final roll is accepted.</p>` : "",
		`<p><strong>Rolled values:</strong> ${W(kr(e, t, n, r))}</p>`,
		a,
		"</section>"
	].join("");
}
function Mr(e, t, n, r) {
	!ar(n, e.id, r) || !r.result || (Ar(e, r), r.result.other ??= [], r.result.other = r.result.other.filter((e) => !e.includes(Dr)), r.result.other.push(jr(e, t, n, r)));
}
function Nr(e) {
	let t = O(e.id).length ? "<p><strong>Automation:</strong> Right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${Dr}="${W(e.id)}">`,
		`<h3>${W(e.mutationName)} — ${W(e.name)}</h3>`,
		G("Target", e.target),
		G("Range", e.range),
		G("Duration", e.duration),
		G("Outcome", e.outcome),
		G("Rules", e.rules),
		G("Condition guidance", e.conditions),
		t,
		"</section>"
	].join("");
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/outcome-documents.ts
function Pr(t) {
	let n = t.system?.test, r = n?.options?.mutationActionId ?? n?.preData?.options?.mutationActionId;
	if (typeof r == "string") return r;
	let i = t.flags?.[e]?.mutationActionOutcome;
	return R(i) && typeof i.actionId == "string" ? i.actionId : void 0;
}
function Fr(t) {
	return t.flags?.[e]?.mutationActionOutcomeApplied === !0;
}
async function Ir(t) {
	await t.setFlag?.(e, "mutationActionOutcomeApplied", !0);
}
function Lr(e) {
	if (!R(e)) return;
	let t = e.actor;
	return R(t) ? t : e;
}
function Rr(e) {
	let t = e?.targets?.filter((e) => R(e)) ?? [];
	return t.length ? t : [...Reflect.get(globalThis, "game")?.user?.targets ?? []].flatMap((e) => Lr(e) ?? []);
}
async function zr(t) {
	let n = t.system?.test ? Reflect.get(t.system.test, "actor") : void 0;
	if (R(n)) return n;
	let r = t.flags?.[e]?.mutationActionOutcome, i = R(r) ? r.actorUuid : void 0;
	if (typeof i != "string") return;
	let a = await Reflect.get(globalThis, "fromUuid")?.(i);
	return R(a) ? a : void 0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/effect-helpers.ts
function K(e, t = 0) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function q(e, t, n) {
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
function J(e, t) {
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
var Br = "Compendium.wfrp4e-core.items.Item.EO05HX7jql0g605A";
async function Vr(t, n, r) {
	let i = n === "ActiveEffect" ? t.effects : t.items, a = i ? [...i].filter((t) => t.flags?.[e]?.actionId === r).map(({ id: e }) => e).filter((e) => typeof e == "string") : [];
	a.length && await t.deleteEmbeddedDocuments?.(n, a);
}
function Y(t, n, r) {
	return {
		changes: [],
		description: r,
		disabled: !1,
		duration: J(),
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
function Hr(e, t, n) {
	return {
		levels: Math.max(1, B(e, t.mutationId)),
		sl: K(n?.result?.SL),
		wp: K(e.system?.characteristics?.wp?.value),
		wpb: K(e.system?.characteristics?.wp?.bonus)
	};
}
async function Ur(t, n, r) {
	if (!t.createEmbeddedDocuments) return;
	let { levels: i, sl: a, wpb: o } = Hr(t, n, r), s = Math.max(1, o + a) * 2 ** (i - 1), c = (await Reflect.get(globalThis, "fromUuid")?.(Br))?.toObject?.();
	if (!c) return;
	await Vr(t, "Item", n.id), delete c._id, c.name = `${n.mutationName} — Flight (${30 * i})`;
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
		...Y(n, "Levitation duration", `Expires after ${s} rounds.`),
		system: {
			scriptData: [q("Expire Mutant's Handbook outcome", "endRound", `const key = "flags.${e}.rounds";\nconst left = Number(this.item.getFlag("${e}", "rounds")) - 1;\nif (left <= 0) return this.item.delete();\nreturn this.item.update({[key]: left});`)],
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
function Wr(t, n, r, i, a = n) {
	let { levels: o, sl: s, wp: c, wpb: l } = Hr(a, r, i);
	if (t === "invisible") {
		let e = Math.max(1, c + s) * 2 ** (o - 1), t = Y(r, "Invisible", "Ends early after an attack or conspicuously loud noise.");
		return t.duration = J(e), t.statuses = ["invisible"], t.img = "icons/svg/invisible.svg", t;
	}
	if (t === "entrancement") {
		let e = Math.max(1, l + s), t = Y(r, `${r.mutationName} — Entranced`, `The source mutant gains +20 to social interactions with this Actor for ${e} hours.`);
		return t.duration = J(void 0, e * 3600), t;
	}
	if (t === "camouflage") {
		let e = Y(r, "Chameleon Camouflage (Scene)", "+20 to Stealth while the skin still matches the surroundings; delete when the scene changes."), t = e.system;
		return t.scriptData = [q("Expire Mutant's Handbook outcome", "dialog", "if (args.skill?.name?.toLowerCase().includes(\"stealth\")) args.fields.modifier += 20;"), q("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();")], e;
	}
	if (t === "foresight") {
		let t = K(n.system?.status && n.system.status.fortune ? n.system.status.fortune.value : 0), i = Y(r, "Oracle Foresight (Scene)", `+10 Initiative and ${o} temporary Fortune; delete when the scene ends.`);
		i.changes = [{
			key: "system.characteristics.i.modifier",
			mode: 2,
			priority: null,
			value: "10"
		}];
		let a = i.system;
		a.scriptData = [q("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();"), q("Expire Mutant's Handbook outcome", "deleteEffect", `const current = Number(this.actor.system.status.fortune.value);\nif (current > ${t}) return this.actor.update({"system.status.fortune.value": ${t}});`)];
		let s = i.flags, c = s[e] ??= {};
		return c.baseFortune = t, c.fortune = o, i;
	}
	let u = Math.max(1, c);
	if (t === "temporal-surge") {
		let e = Y(r, "Temporal Surge (This Turn)", "One additional Movement and Action are available during the current turn.");
		e.duration = J();
		let t = e.system;
		return t.scriptData = [q("Expire Mutant's Handbook outcome", "endTurn", "return this.effect.delete();")], e;
	}
	let d = Y(r, "Telekinesis Active", `May move matter at WPB yards per round for ${u} rounds.`);
	return d.duration = J(u), d;
}
async function Gr(e, t, n, r, i = t) {
	if (e === "levitation") return Ur(t, n, r);
	await Vr(t, "ActiveEffect", n.id);
	let a = Wr(e, t, n, r, i);
	if (await t.createEmbeddedDocuments?.("ActiveEffect", [a]), e === "foresight") {
		let e = Math.max(1, B(t, n.mutationId)), r = t.system?.status?.fortune, i = K(r?.value);
		await t.update?.({ "system.status.fortune.value": i + e });
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/form-items.ts
var Kr = {
	Contortionist: "Compendium.wfrp4e-core.items.Item.TaYriYcJkFuIdBKp",
	Frenzy: "Compendium.wfrp4e-core.items.Item.hXcfygzujgyMN1uI",
	Painless: "Compendium.wfrp4e-core.items.Item.wMwSRDmgiF2IdCJr"
};
function qr(t, n, r) {
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
async function Jr(t, n, r) {
	let i = Reflect.get(globalThis, "fromUuid"), a = (Kr[t] ? await i?.(Kr[t]) : void 0)?.toObject?.() ?? qr(t, n, r);
	delete a._id;
	let o = R(a.flags) ? a.flags : {};
	return a.flags = o, o[e] = {
		automationPhase: "mutation-phase-5",
		mutationForm: r
	}, a;
}
async function Yr(e, t, n) {
	n.length && await e.createEmbeddedDocuments?.("Item", await Promise.all(n.map(([e, n]) => Jr(e, n, t))));
}
function Xr(e) {
	return Array.isArray(e.grants) ? e.grants.filter(R) : [];
}
async function Zr(t, n, r) {
	let i = Reflect.get(globalThis, "fromUuid"), a = [];
	for (let t of Xr(r)) {
		let r = (typeof t.sourceUuid == "string" ? await i?.(t.sourceUuid) : void 0)?.toObject?.();
		if (!r) continue;
		delete r._id;
		let o = R(r.flags) ? r.flags : {};
		r.flags = o, o[e] = {
			automationPhase: "mutation-phase-5",
			mutationForm: n
		}, a.push(r);
	}
	a.length && await t.createEmbeddedDocuments?.("Item", a);
}
function Qr(e) {
	return (Array.isArray(e.modifiers) ? e.modifiers.filter(R) : []).flatMap((e) => {
		let t = K(e.value, NaN);
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
function $r(e) {
	let t = Array.isArray(e.modifiers) ? e.modifiers.filter((e) => R(e) && e.kind === "test") : [];
	if (t.length) return q("Resolve Mutant's Handbook form", "dialog", `const modifiers = ${JSON.stringify(t)};\nconst skillName = args.skill?.name ?? args.test?.item?.name ?? "";\nconst characteristic = args.characteristic ?? args.test?.characteristicKey;\nfor (const modifier of modifiers) {\n  const matchesSkill = (modifier.skills ?? []).some(name => skillName === name || skillName.startsWith(name + " ("));\n  const matchesCharacteristic = (modifier.characteristics ?? []).includes(characteristic);\n  if (!matchesSkill && !matchesCharacteristic) continue;\n  const current = Number(args.fields.modifier);\n  const next = current + Number(modifier.value);\n  if (Number.isFinite(next)) args.fields.modifier = next;\n}`);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/forms.ts
var ei = [
	"ws",
	"bs",
	"s",
	"t",
	"ag",
	"dex"
], ti = {
	A7OLAWKXWUfh0UGU: "ethereal",
	XheCM6GZG8FhAoGp: "mirror-image",
	NDDLEunW5biRvTfy: "shapeshifter",
	JtmI1wOwKqWT4zVG: "skinwalker",
	q3sK3RsdsJxrifZP: "swarmform",
	jPlCrsK3hTgkHsTR: "warp-spasm",
	mNNavbJayRcsyeXJ: "werebeast"
};
function ni(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
async function ri(t, n) {
	let r = ni(t).filter((t) => t.flags?.[e]?.mutationForm === n).flatMap((e) => e.id ? [e.id] : []), i = [...t.effects ?? []].filter((t) => t.flags?.[e]?.mutationForm === n).flatMap((e) => e.id ? [e.id] : []);
	return r.length && await t.deleteEmbeddedDocuments?.("Item", r), i.length && await t.deleteEmbeddedDocuments?.("ActiveEffect", i), r.length > 0 || i.length > 0;
}
async function ii(e, t) {
	let n = ti[t];
	!n || B(e, t) > 0 || await ri(e, n);
}
function ai(t, n, r, i, a) {
	let o = `const ids = (this.actor.items ?? []).filter(item => item.flags?.["${e}"]?.mutationForm === "${n}").map(item => item.id);\nif (ids.length) await this.actor.deleteEmbeddedDocuments("Item", ids);`;
	return {
		changes: [],
		description: r,
		disabled: !1,
		duration: J(i, a),
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
			scriptData: [q("Resolve Mutant's Handbook form", "deleteEffect", o)],
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
function oi(e, t) {
	let n = (R(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function si(e) {
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
async function ci(e, t, n, r, i, a) {
	if (await ri(n, e), t === "revert") return;
	let o = lr(sr(n, r.mutationId)), s = K(i?.result?.SL), c = ai(r, e, r.outcome), l = [];
	if (e === "ethereal") c = ai(r, e, r.outcome, Math.max(1, K(n.system?.characteristics?.wp?.bonus) + s)), l = [["Ethereal", "trait"]];
	else if (e === "mirror-image") {
		let t = Math.max(1, B(n, r.mutationId)), i = Math.max(1, K(n.system?.characteristics?.wp?.value) + s * 10) * 2 ** (t - 1);
		c = ai(r, e, r.outcome, void 0, i * 60);
	} else if (e === "shapeshifter") {
		let t = Math.max(1, K(n.system?.characteristics?.t?.bonus) + s);
		c = ai(r, e, r.outcome, void 0, t * 3600);
	} else if (e === "skinwalker" && a) {
		c.changes = ei.flatMap((e) => {
			let t = K(a.system?.characteristics?.[e]?.value) - K(n.system?.characteristics?.[e]?.value);
			return t ? [{
				key: `system.characteristics.${e}.modifier`,
				mode: 2,
				priority: null,
				value: String(t)
			}] : [];
		});
		let e = K(a.system?.details?.move?.value, NaN);
		Number.isFinite(e) && c.changes.push({
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e)
		});
	} else if (e === "swarmform") {
		let e = si(oi(o, "swarm-source"));
		c.changes = [...e.move === void 0 ? [] : [{
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e.move)
		}], ...oi(o, "swarm-size") ? [{
			key: "system.details.size.value",
			mode: 5,
			priority: null,
			value: oi(o, "swarm-size")
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
			q("Resolve Mutant's Handbook form", "endCombat", "return this.effect.delete();"),
			q("Resolve Mutant's Handbook form", "deleteEffect", "await this.actor.addCondition(\"fatigued\", 1);")
		];
	} else if (e === "werebeast") {
		c.changes = Qr(o);
		let t = $r(o);
		if (t) {
			let e = c.system;
			e.scriptData = [...e.scriptData ?? [], t];
		}
		await Zr(n, e, o);
	}
	await Yr(n, e, l), await n.createEmbeddedDocuments?.("ActiveEffect", [c]);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/companions.ts
function li(e, t) {
	let n = (R(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function di(e) {
	return e.split("-").filter(Boolean).map((e) => `${e[0]?.toUpperCase() ?? ""}${e.slice(1)}`).join(" ");
}
function fi(e, t, n) {
	let r = R(e.characteristics) ? e.characteristics : {};
	e.characteristics = r;
	let i = R(r[t]) ? r[t] : {};
	r[t] = i, i.initial = n, i.advances = 0, i.modifier = 0, i.value = n;
}
function pi(e, t) {
	return [
		"personality",
		"motivation",
		"short-ambition",
		"long-ambition"
	].flatMap((n) => {
		let r = li(e, `${t}-${n}`);
		return r ? [`<p><strong>${di(n)}:</strong> ${r}</p>`] : [];
	}).join("");
}
function mi(e, t, n) {
	let r = e.name ?? "Mutant";
	if (t === "spectral-companion") {
		let e = li(n, "companion-type") || "ghost";
		return {
			flags: {},
			img: "icons/magic/death/undead-ghost-scream-teal.webp",
			name: li(n, "companion-name") || `${r}'s ${di(e)}`,
			system: { details: { notes: { value: pi(n, "companion") } } },
			type: "creature"
		};
	}
	let i = e.toObject?.() ?? {};
	delete i._id, i.effects = [], i.flags = {}, i.folder = null, i.items = [], i.type = "creature";
	let a = R(i.system) ? i.system : {};
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
		})) fi(a, e, t);
		return a.details = {
			...R(a.details) ? a.details : {},
			move: { value: 2 },
			size: { value: "tiny" }
		}, a.status = {
			...R(a.status) ? a.status : {},
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
		fi(a, t, Number.isFinite(n) ? Math.max(0, r - n) : 0);
	}
	return a.details = {
		...R(a.details) ? a.details : {},
		move: { value: 0 },
		notes: { value: pi(n, "twin") }
	}, a.status = {
		...R(a.status) ? a.status : {},
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
function hi(t, n) {
	let r = t.toObject?.() ?? {};
	delete r._id, r.name = `${t.name ?? "Mutant"}'s Symbiotic Twin`, Array.isArray(r.items) && (r.items = r.items.filter((t) => {
		if (!R(t) || !R(t.flags)) return !0;
		let n = t.flags[e];
		return !R(n) || !R(n.mutationAction) ? !0 : n.mutationAction.actionId !== "symbiotic-twin-manifest";
	}));
	let i = R(r.system) ? r.system : {};
	r.system = i;
	let a = R(i.details) ? i.details : {};
	return i.details = a, a.notes = { value: pi(n, "twin") }, r;
}
function gi(t, n) {
	let r = t.flags?.[e]?.mutationCompanions, i = R(r) ? r[n] : void 0;
	return typeof i == "string" ? [{ uuid: i }] : Array.isArray(i) ? i.flatMap((e) => R(e) && typeof e.uuid == "string" ? [{
		mutationItemId: typeof e.mutationItemId == "string" ? e.mutationItemId : void 0,
		uuid: e.uuid
	}] : []) : [];
}
async function _i(e, t) {
	let n = gi(e, t), r = Reflect.get(globalThis, "fromUuid");
	return r ? (await Promise.all(n.map(async (e) => await r(e.uuid) ? e : void 0))).filter((e) => e !== void 0) : n;
}
function vi(e, t) {
	let n = new Set(t.flatMap((e) => e.mutationItemId ? [e.mutationItemId] : []));
	return e.find((e) => !e.id || !n.has(e.id)) ?? e[t.length];
}
async function yi(t, n, r) {
	let i = cr(n, r.mutationId), a = await _i(n, t);
	if (!i.length || a.length >= i.length) return;
	let o = vi(i, a), s = lr(o), c = t === "symbiotic-twin" ? hi(n, s) : mi(n, t, s), l = R(c.flags) ? c.flags : {};
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
var bi = /* @__PURE__ */ new Set();
function xi() {
	Hooks.on("updateActor", (t, n, r, i) => {
		let a = Reflect.get(globalThis, "game");
		if (typeof i == "string" && a?.user?.id !== i || !R(t) || !R(n)) return;
		let o = t, s = o.uuid ?? o.id, c = o.flags?.[e]?.mutationTwinUuid, l = R(n.system) ? n.system : void 0, u = R(l?.status) ? l.status : void 0, d = R(u?.wounds) ? u.wounds : void 0, f = n["system.status.wounds.value"] ?? d?.value;
		if (typeof s != "string" || typeof c != "string" || !Number.isFinite(Number(f)) || bi.has(s)) return;
		let p = Reflect.get(globalThis, "fromUuid");
		bi.add(c), p?.(c).then((e) => e?.update?.({ "system.status.wounds.value": Number(f) })).finally(() => bi.delete(c));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/outcomes.ts
var Si = /* @__PURE__ */ new WeakSet();
function Ci(e) {
	return e ? typeof e.failed == "boolean" ? !e.failed : e.result?.outcome !== "failure" : !0;
}
function wi(e, t) {
	return e.when === "always" ? !0 : e.when === "success" ? Ci(t) : !Ci(t);
}
function Ti(e, t, n) {
	return e === "self" ? [t] : n;
}
async function Ei(e, t) {
	let n = Reflect.get(globalThis, "Roll");
	n && await (await new n(e).evaluate()).toMessage?.({ flavor: t });
}
async function Di(e, t, n) {
	for (let r of t) {
		let t = {
			appendTitle: ` — ${n} follow-up`,
			fields: { difficulty: e.difficulty }
		}, i = e.skill ? await r.setupSkill?.(e.skill, t) : await r.setupCharacteristic?.(e.characteristic ?? "wp", t);
		if (i?.roll && (await i.roll(), !Ci(i))) {
			for (let t of e.failureConditions) {
				let e = t.condition === "broken" && r.has?.("Skittish") ? 3 : t.amount ?? 1;
				await r.addCondition?.(t.condition, e);
			}
			e.failureRoll && await Ei(e.failureRoll.formula, e.failureRoll.label);
		}
	}
}
function Oi(e, t, n) {
	let r = Number(n?.result?.SL) || 0;
	return e === "sl" ? Math.max(0, r) : e === "fellowship-plus-sl" ? Math.max(0, (Number(t.system?.characteristics?.fel?.value) || 0) + r) : e;
}
async function ki(e, t, n, r, i) {
	if (e.kind === "roll") return Ei(e.formula, e.label);
	if (e.kind === "follow-up-test") return Di(e, n, i.name);
	if (e.kind === "companion") return yi(e.companion, t, i);
	if (e.kind === "form") return ci(e.form, e.mode, t, i, r, n[0]);
	let a = Ti(e.subject, t, n);
	if (e.kind === "condition") {
		for (let n of a) {
			let i = Oi(e.amount ?? 1, t, r);
			await n.addCondition?.(e.condition, i);
		}
		return;
	}
	if (e.kind === "remove-condition") {
		let n = Oi(e.amount ?? 1, t, r);
		for (let t of a) for (let r = 0; r < n; r += 1) await t.removeCondition?.(e.condition);
		return;
	}
	if (e.kind === "heal") {
		let n = Oi(e.amount, t, r);
		for (let e of a) await e.modifyWounds?.(n);
		return;
	}
	if (e.kind === "effect") for (let n of a) await Gr(e.effect, n, i, r, t);
}
function Ai(e) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(e);
}
function ji(e) {
	let t = Pr(e);
	return !!(t && O(t).length);
}
async function Mi(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	if (Si.has(t) || Fr(t)) return !1;
	let n = Pr(t), r = n ? ft(n) : void 0;
	if (!r) return !1;
	let i = t.system?.test, a = await zr(t);
	if (!a) return !1;
	let o = O(r.id).filter((e) => wi(e, i)), s = Rr(i);
	if (o.some((e) => e.kind !== "roll" && e.subject === "targets" || e.kind === "form" && e.source === "targets") && s.length === 0) return Ai(`Target one or more Actors before applying ${r.name}.`), !1;
	Si.add(t);
	try {
		for (let e of o) await ki(e, a, s, i, r);
		return await Ir(t), !0;
	} finally {
		Si.delete(t);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/actions/index.ts
var Ni = /* @__PURE__ */ new WeakSet();
function Pi(e, t, n) {
	let r = ft(n), i = tr(e), a = nr(t);
	if (!r || !i || !a) return;
	let o = ir(a);
	if (!(o !== void 0 && o !== n)) return {
		action: r,
		actor: i,
		item: a
	};
}
function Fi(e, t) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(`${t.name ?? "This Actor"} cannot use ${e.name}: its use limit or Advantage cost is not available.`);
}
function Ii(e, t, n) {
	let r = e.test?.bonusMultiplier ?? 1, i = e.test?.bonusCharacteristic;
	if (r <= 1 || !i) return;
	let a = z(n), o = `mutationActionDamage:${e.id}`;
	if (typeof a[o] == "number") return;
	let s = Number(t.system?.characteristics?.[i]?.bonus);
	if (!Number.isFinite(s)) return;
	let c = s * (r - 1);
	n.preData ??= {};
	let l = Number(n.preData.additionalDamage) || 0;
	n.preData.additionalDamage = l + c, a[o] = c;
}
function Li(e, t) {
	let n = t.result;
	if (!n || Ni.has(n)) return;
	let r = Number(z(t)[`mutationActionDamage:${e.id}`]), i = Number(n.damage);
	!Number.isFinite(r) || r === 0 || !Number.isFinite(i) || (n.damage = i + r, n.breakdown?.damage?.other?.push({
		label: e.name,
		value: r
	}), Ni.add(n));
}
function Ri(e, t, n, r) {
	let i = Pi(e, t, n);
	if (!i || !R(r)) return;
	let { action: a, actor: o, item: s } = i;
	if (!xr(a, o, s)) {
		r.abort = !0, Fi(a, o);
		return;
	}
	let c = R(r.fields) ? r.fields : {};
	r.fields = c;
	let l = Sr(a, s);
	l && (c.difficulty = l);
	let u = R(r.flags) ? r.flags : {};
	r.flags = u, u.mutationActionId = a.id;
}
async function zi(e, t, n, r) {
	let i = Pi(e, t, n), a = rr(r);
	if (!i || !a) return !1;
	let { action: o, actor: s, item: c } = i, l = z(a);
	l.mutationActionId = o.id, l.mutationActionItemUuid = c.uuid ?? c.id, a.preData ??= {}, a.preData.options ??= {}, a.preData.options.mutationActionActorUuid = s.uuid ?? s.id, a.preData.options.mutationActionId = o.id, a.preData.options.mutationActionItemUuid = c.uuid ?? c.id, a.preData.options.mutationActionUseId ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	let u = await Tr(o, s, c, a);
	return u ? Ii(o, s, a) : Fi(o, s), u;
}
async function Bi(e, t, n, r) {
	let i = Pi(e, t, n), a = rr(r);
	!i || !a || (Li(i.action, a), Mr(i.action, i.actor, i.item, a));
}
function Vi(e, t, n) {
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return {
		appendTitle: ` — ${e.mutationName}: ${e.name}`,
		fields: { difficulty: Sr(e, n) ?? "challenging" },
		mutationActionId: e.id,
		mutationActionActorUuid: t.uuid ?? t.id,
		mutationActionItemUuid: n.uuid ?? n.id,
		mutationActionUseId: r
	};
}
async function Hi(e, t, n) {
	let r = Vi(e, t, n);
	if (t.setupTrait) return t.setupTrait(n, r);
	if (e.test && "skill" in e.test && t.setupSkill) return t.setupSkill(e.test.skill, r);
	if (e.test && "characteristic" in e.test && t.setupCharacteristic) return t.setupCharacteristic(e.test.characteristic, r);
}
async function Ui(e, t, n) {
	let r = Reflect.get(globalThis, "game"), i = Nr(e), a = r?.wfrp4e?.utility?.chatDataSetup?.(i) ?? { content: i };
	a.flags = {
		...typeof a.flags == "object" && a.flags ? a.flags : {},
		"fvtt-wfrp-ratter": { mutationActionOutcome: {
			actionId: e.id,
			actorUuid: t.uuid ?? t.id,
			itemUuid: n.uuid ?? n.id
		} }
	}, await Reflect.get(globalThis, "ChatMessage")?.create?.(a);
}
async function Wi(e, t, n) {
	let r = Pi(e, t, n);
	if (!r) return;
	let { action: i, actor: a, item: o } = r, s = i.test ? await Hi(i, a, o) : { context: Vi(i, a, o) };
	if (s && await zi(a, o, i.id, s)) {
		if (i.test && s.roll) {
			await s.roll();
			return;
		}
		await Ui(i, a, o);
	}
}
//#endregion
//#region src/module/api/create-module-api.ts
function Gi() {
	return {
		applyMutationActionOutcome: Mi,
		checkMutantsHandbookCorruption: er,
		id: e,
		logStatus() {
			console.log(`${t} is loaded.`);
		},
		prepareMutationActionDialog: Ri,
		recordMutationActionUse: zi,
		reconcileMutationAutomation: pn,
		removeMutationGrantOwner: mn,
		resolveMutationActionTest: Bi,
		title: t,
		useMutationAction: Wi
	};
}
//#endregion
//#region src/module/api/register-module-api.ts
function Ki() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let t = game.modules.get(e);
	if (!t) throw Error(`Foundry module registry entry was not found for ${e}.`);
	t.api = Gi();
}
//#endregion
//#region src/module/settings.ts
var qi = "useMutantsHandbookMutations";
function Ji() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(e, qi, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function Yi() {
	return game?.settings.get(e, qi) === !0;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/context-options.ts
function Xi(e) {
	let t = e.dataset.messageId;
	return t ? game?.messages.get(t) : void 0;
}
function Zi() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		game && t.push({
			callback: async (e) => {
				let t = Xi(e);
				t && await Mi(t);
			},
			condition: (e) => {
				let t = Xi(e);
				return !!(t && t.flags?.["fvtt-wfrp-ratter"]?.mutationActionOutcomeApplied !== !0 && ji(t));
			},
			name: "Apply Mutant’s Handbook Outcome"
		});
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/mutation-drop.ts
function Qi(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function $i(e, t) {
	return ae(t, Qi(e));
}
function ea(e, t) {
	return e.name === t.mutationName && ne(e.system.mutationType.value) === t.nature;
}
async function ta(e, t) {
	for (let n of t) {
		let t = v("ChaosSpawn", {
			bonus: n === "physical" ? "Toughness Bonus" : "Willpower Bonus",
			name: e.name,
			nature: n
		});
		b(t), await y(t);
	}
}
async function na(t) {
	let n = Me(t), r = t.actor;
	if (!n || !r) return !1;
	let a = _(r);
	if (a?.kind !== "mutation" || a.token !== n.token) throw Error(`${t.name} is not the pending mutation for ${r.name}.`);
	if (!ea(t, n)) throw Error(`${t.name} no longer matches its pending mutation result.`);
	let o = $i(r, n.nature), s = [];
	try {
		t.name.trim().toLowerCase() === "chimeran curse" && (s = await ve(r));
		let n = ce(pe(r), Qi(r));
		await h(r, {
			[Te]: null,
			...n.length > 0 ? { [`flags.${e}.${i}`]: !0 } : {},
			"system.status.corruption.value": oe(Number(r.system.status.corruption.value), o)
		});
		try {
			await t.update?.({ [Ee]: null }, { skipMutationAcquisition: !0 });
		} catch (e) {
			console.warn(`${t.name}: could not clear its completed mutation-drop marker.`, e);
		}
		return await y(v("Gained", {
			loss: o,
			mutation: t.name,
			name: r.name
		})), await ta(r, n), !0;
	} catch (e) {
		let n = [e];
		try {
			await ye(r, s);
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
//#region src/module/wfrp4e/mutants-handbook/automation/hooks.ts
function ra(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (n.type !== "mutation" || typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e]?.mutationAutomation;
	return typeof r == "object" && r ? n : void 0;
}
function ia(t) {
	if (typeof t != "object" || !t) return;
	let n = t;
	if (typeof n.id != "string" || typeof n.actor?.uuid != "string") return;
	let r = n.flags?.[e];
	return typeof r?.mutationGrant == "object" || typeof r?.mutationSkillGrant == "object" ? n : void 0;
}
function aa(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	if (!(t.type !== "mutation" || typeof t.id != "string" || typeof t.actor?.uuid != "string" || typeof t.getFlag != "function")) return Me(t) ? t : void 0;
}
function oa(e) {
	e.catch(x);
}
function sa(t) {
	let n = t.flags?.[e]?.mutationAutomation;
	return typeof n == "object" && n && typeof n.definitionId == "string" ? n.definitionId : void 0;
}
async function ca(e) {
	let t = sa(e);
	t && e.actor && await ii(e.actor, t), e.actor && await mn(e.actor.uuid, e.id);
}
function la(e) {
	return typeof e == "string" && game?.user.id === e;
}
async function ua(e, t = {}) {
	e.actor && !await na(e) && e.name.trim().toLowerCase() === "chimeran curse" && t.mutationAcquisitionHandlesChimeranRetirement !== !0 && await ve(e.actor);
}
function da() {
	Hooks.on("createItem", (e, t, n) => {
		if (!la(n)) return;
		let r = ra(e) ?? aa(e);
		r?.actor && oa(ua(r, typeof t == "object" && t ? t : {}));
	}), Hooks.on("deleteItem", (e, t, n) => {
		if (!la(n)) return;
		let r = ra(e);
		if (r?.actor) {
			oa(ca(r));
			return;
		}
		let i = ia(e);
		i?.actor && oa(pn(i.actor.uuid));
	}), Hooks.on("updateItem", (t, n, r, i) => {
		if (!la(i)) return;
		let a = ra(t), o = a?.flags?.[e];
		a?.actor && (o?.mutantsHandbookRetired === !0 || o?.mutantsHandbookPossessionRemoved === !0) && oa(ca(a));
	});
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/automation/migration.ts
var fa = `${e}.ratter-11-items`, pa = "The Mutant's Handbook", ma = new Set([
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
function X(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function Z(e) {
	return e.toObject();
}
function ha(t) {
	let n = t.flags;
	if (!X(n)) return {};
	let r = n[e];
	return X(r) ? r : {};
}
function Q(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.filter(X) : [];
}
function ga(e) {
	return Array.isArray(e) ? e.map(ga) : X(e) ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, ga(t)])) : e;
}
function _a(e, t) {
	return JSON.stringify(ga(e)) === JSON.stringify(ga(t));
}
function va(e) {
	let t = { ...e };
	return delete t._key, delete t._stats, t;
}
function $(t) {
	let n = t.flags;
	if (!X(n)) return !1;
	let r = n[e];
	return X(r) && typeof r.automationPhase == "string";
}
function ya(e, t) {
	if (!X(e)) return t;
	let n = Object.fromEntries(Object.entries(e).filter(([e]) => !ma.has(e)));
	return {
		...t,
		...n
	};
}
function ba(t, n) {
	let r = ha(n).mutationAutomation;
	if (!X(r)) return;
	let i = ha(t).mutationAutomation, a = ya(i, r), o = Q(t).filter($), s = Q(n).filter($), c = [...s, ...Q(t).filter((e) => !$(e))], l = {};
	return _a(i, a) || (l[`flags.${e}.mutationAutomation`] = a), _a(o.map(va), s.map(va)) || (l.effects = c), Object.keys(l).length > 0 ? l : void 0;
}
function xa(e) {
	return X(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.toObject == "function" : !1;
}
function Sa(e) {
	let t = ha(Z(e)).mutationAutomation;
	return X(t) && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
function Ca(e) {
	return ha(Z(e)).sourceDocument === pa;
}
function wa(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.uuid, t);
	for (let e of t) for (let t of e.tokens ?? []) t.actor && n.set(t.actor.uuid, t.actor);
	return [...n.values()];
}
async function Ta(e, t) {
	if (!e.deleteEmbeddedDocuments || !e.createEmbeddedDocuments) throw Error(`${e.name} does not support embedded Active Effect migration.`);
	let n = Q(Z(e)).filter($), r = n.map((e) => e._id).filter((e) => typeof e == "string");
	if (r.length !== n.length) throw Error(`${e.name} has a managed Active Effect without an ID.`);
	r.length > 0 && await e.deleteEmbeddedDocuments("ActiveEffect", r);
	let i = Q(Z(t)).filter($).map((e) => {
		let t = { ...e };
		return delete t._key, t;
	});
	i.length > 0 && await e.createEmbeddedDocuments("ActiveEffect", i, {
		keepId: !0,
		skipMutationAcquisition: !0
	});
}
async function Ea() {
	if (!game || game.user.isUniqueGM !== !0) return;
	let e = game.packs.get(fa);
	if (!e) throw Error(`The required compendium ${fa} is unavailable.`);
	let t = (await e.getDocuments()).filter(xa), n = new Map(t.map((e) => [Sa(e) ?? e.id, e])), r = new Map(t.map((e) => [e.name, e])), i = wa(game.actors ?? [], game.scenes ?? []);
	for (let e of i) {
		let t = [], i = [];
		for (let a of Array.from(e.items).filter(xa)) {
			let e = (Sa(a) ? n.get(Sa(a)) : void 0) ?? (Ca(a) ? r.get(a.name) : void 0);
			if (!e) continue;
			let o = ba(Z(a), Z(e));
			o && ("effects" in o && (i.push({
				owned: a,
				source: e
			}), delete o.effects), Object.keys(o).length > 0 && t.push({
				_id: a.id,
				...o
			}));
		}
		t.length > 0 && await e.updateEmbeddedDocuments("Item", t);
		for (let e of i) await Ta(e.owned, e.source);
		await pn(e.uuid);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/replacement.ts
var Da = Symbol.for(`${e}.mutantsHandbookReplacement`);
function Oa() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[Da] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, Da, { value: !0 }), e.checkCorruption = async function() {
		if (!Yi()) {
			await t.call(this);
			return;
		}
		try {
			await $n(this.parent);
		} catch (e) {
			x(e);
		}
	};
}
//#endregion
//#region src/module/hooks/register-module-hooks.ts
function ka() {
	Hooks.once("init", () => {
		Ji(), Ki(), Zi(), Zn(), da(), xi();
	}), Hooks.once("ready", async () => {
		Oa();
		try {
			await Ea();
		} catch (e) {
			x(e);
		}
	});
}
//#endregion
//#region src/main.ts
ka();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map