import { A as e, C as t, D as n, E as r, G as i, H as a, J as o, K as s, O as c, Q as l, S as u, T as d, U as ee, W as te, Z as ne, _ as re, a as f, at as ie, b as ae, c as oe, d as p, et as se, f as m, g as ce, h as le, i as ue, it as h, j as de, k as fe, m as g, nt as pe, o as me, p as _, q as he, r as v, rt as y, s as ge, t as _e, tt as ve, u as ye, v as be, w as xe, x as Se, y as Ce } from "../mutation-drop-Czf6XhDM.js";
//#region src/module/wfrp/mutants-handbook/mutation-results.ts
function we(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.type === "mutation" && typeof t.name == "string" && typeof t.toObject == "function" && !!t.system;
}
function Te(e) {
	let t = e.toObject();
	return delete t._id, delete t._key, delete t._stats, delete t.folder, delete t.ownership, t;
}
function Ee(e) {
	return {
		data: {
			effects: [],
			flags: { [y]: {
				patron: "khorne",
				sourceDocument: "The Mutant's Handbook"
			} },
			img: e.img ?? "modules/fvtt-wfrp-ratter/icons/mutations/mutants-handbook-mutation.png",
			name: e.name,
			system: {
				description: { value: e.description },
				gmdescription: { value: "" },
				modifier: { value: "" },
				modifiesSkills: { value: !1 },
				mutationType: { value: "mental" },
				source: { value: "The Mutant's Handbook" }
			},
			type: "mutation"
		},
		name: e.name,
		nature: "mental"
	};
}
async function De(e, t) {
	if (!e.documentUuid) {
		if (t === "khorne" && e.name.trim().toLowerCase() === "prejudice") return Ee(e);
		throw Error(`The table result ${e.name} does not link to a mutation Item.`);
	}
	let n = await fromUuid(e.documentUuid);
	if (!we(n)) throw Error(`The table result ${e.name} does not resolve to a mutation Item.`);
	let r = s(n.system.mutationType.value);
	if (!r) throw Error(`The mutation ${n.name} has no physical or mental classification.`);
	let i = n.flags?.[y]?.mutationAutomation?.acquisition;
	return {
		...i ? { acquisition: i } : {},
		data: Te(n),
		name: n.name,
		nature: r
	};
}
//#endregion
//#region src/module/wfrp/mutants-handbook/outcomes.ts
function Oe(e) {
	return {
		toughness: Number(e.system.characteristics.t.bonus),
		willpower: Number(e.system.characteristics.wp.bonus)
	};
}
function ke(e, t) {
	return a(t, Oe(e));
}
function Ae(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function je(e, t) {
	return Number(e.system.status.resilience.value) > 0 && await ye(e.name, t);
}
async function Me(e, t, n, r = {}) {
	let i = {
		...r,
		"system.status.corruption.value": ee(Number(e.system.status.corruption.value), t)
	};
	n && (i["system.status.resilience.value"] = Math.max(0, Number(e.system.status.resilience.value) - 1)), await de(e, i);
}
async function Ne(e, t) {
	if (!game) throw Error("Foundry game global is unavailable while applying Chosen of Chaos.");
	let r = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ChosenOutcome");
	if (await je(e, r)) {
		let n = ke(e, t);
		return await Me(e, n, !0), await m(p("Resisted", {
			loss: n,
			mutation: r,
			name: e.name
		})), !0;
	}
	let i = await ge(e.name);
	if (!i) return g(p("PatronRequired", { name: e.name })), !1;
	let a = u(e), o = ke(e, t);
	if (await n(e, i), await Me(e, o, !1), a && (await d(e), await v(e.uuid)), await m(p("Chosen", {
		loss: o,
		name: e.name,
		patron: Ae(i)
	})), a) {
		let t = p("PossessedRemoved", { name: e.name });
		g(t), await m(t);
	}
	return !0;
}
//#endregion
//#region src/module/wfrp/mutants-handbook/patron-notes.ts
var Pe = {
	khorne: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Canine, or Goat/Sheep.",
	nurgle: "Use only Ape/Monkey, Bear, Boar/Pig, Bovine, Deer/Elk, Goat/Sheep, Horse/Camel, Insect, Pachyderm, or Spider.",
	slaanesh: "Use only Amphibian, Arthropod, Fish, Feline, Lizard/Snake, or Mollusca.",
	tzeentch: "Use only Bat, Bird, Fish, Insect, Mollusca, or Spider."
}, Fe = {
	khorne: "Use only Daemonic, Mechanoid, or Metal.",
	nurgle: "Use only Daemonic, Fenbeast, or Undead.",
	slaanesh: "Use only Daemonic or Metal.",
	tzeentch: "Use only Daemonic or Mechanoid."
}, Ie = {
	khorne: "Use only Destruction, Drugs, or Pain.",
	nurgle: "Use only Devotion, Gluttony, or Service.",
	slaanesh: "Use only Art, Lust, or Pain.",
	tzeentch: "Use only Gambling, Greed, or Theft."
}, Le = {
	khorne: "Use only Leathery Hide, Fur, or Metal.",
	slaanesh: "Use only Rubbery Skin, Scales, or Carapace."
}, Re = new Set([
	"bestial arms",
	"bestial body",
	"bestial head",
	"bestial legs",
	"bestial limbs"
]), ze = new Set([
	"unnatural arms",
	"unnatural body",
	"unnatural head",
	"unnatural legs",
	"unnatural limbs"
]);
function Be(e, t) {
	let n = t.trim().toLowerCase();
	if (Re.has(n)) return Pe[e];
	if (ze.has(n)) return Fe[e];
	if (n === "addiction") return Ie[e];
	if (n === "mark of chaos") return `The mark is the Mark of ${e.charAt(0).toUpperCase()}${e.slice(1)}.`;
	if (n === "protective skin") return Le[e];
	if (e === "khorne" && n === "prejudice") return "This automation treats Prejudice as mental for Corruption reduction and mutation limits.";
	if (e === "nurgle" && n === "corrupted blood") return "The source attaches a mismatched footnote listing Leathery Hide, Bark, and Carapace; the GM must decide how to handle it.";
}
//#endregion
//#region src/module/wfrp/mutants-handbook/tables.ts
function Ve(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function He(e) {
	let t = game?.packs.get(se);
	if (!t) throw Error(`The required compendium ${se} is unavailable.`);
	let n = await t.getDocument(e);
	if (!Ve(n)) throw Error(`The required Mutant's Handbook table ${e} is unavailable.`);
	return n;
}
async function b(e, t, n = !0) {
	let r = (await (await He(e)).draw({
		displayChat: n,
		messageMode: "gm",
		recursive: !0,
		...t ? { roll: new Roll(t) } : {}
	})).results[0];
	if (!r) throw Error(`The Mutant's Handbook table ${e} returned no result.`);
	return r;
}
function Ue(e) {
	return b(pe[e]);
}
function We(e) {
	let t = te(e);
	return b(ve, t > 0 ? `1d100 + ${t}` : "1d100");
}
function Ge(e, t) {
	return b(ne[t][e], void 0, !1);
}
function Ke(e) {
	return b(l[e], void 0, !1);
}
//#endregion
//#region src/module/wfrp/mutants-handbook/workflow.ts
function qe(e) {
	return `${e.charAt(0).toUpperCase()}${e.slice(1)}`;
}
async function Je(e, t) {
	if (t !== "unassigned") return t;
	let r = await ge(e.name);
	if (!r) {
		g(p("PatronRequired", { name: e.name }));
		return;
	}
	return await n(e, r), r;
}
async function Ye(e, t) {
	let n = await Je(e, t);
	if (!n) return !1;
	let r = await De(await Ke(n), n);
	await Ce(e, r);
	let i = Be(n, r.name);
	return i && await m(p("PatronRestriction", {
		mutation: r.name,
		note: i,
		patron: qe(n)
	})), !0;
}
async function Xe(e) {
	let t = e.system.details.species.value, n = i(t) ?? await oe(e.name, t);
	if (!n) return g(p("SpeciesRequired", { name: e.name })), !1;
	let r = await Ue(n), a = s(r.name);
	if (!a) throw Error(`The nature table returned an unrecognized result: ${r.name}.`);
	let o = await We(Se(e).total), c = he(o.name);
	if (!c) throw Error(`The severity table returned an unrecognized result: ${o.name}.`);
	if (c === "chosen") return Ne(e, a);
	let l = await Ge(a, c);
	if (!l.documentUuid && he(l.name) === "chosen") return Ne(e, a);
	let u = await De(l);
	if (u.nature !== a) throw Error(`${u.name} does not match the rolled ${a} mutation table.`);
	return await Ce(e, u), !0;
}
async function Ze(e) {
	if (fe(e).length > 1) return g(p("PatronConflict", { name: e.name })), !1;
	let t = c(e);
	return t ? Ye(e, t) : Xe(e);
}
//#endregion
//#region src/module/wfrp/mutants-handbook/corruption-chat.ts
var Qe = "mutantsHandbookCorruptionFlow", $e = /* @__PURE__ */ new Set(), et = /* @__PURE__ */ new Map();
function x(e) {
	let t = e.flags?.[y]?.[Qe];
	if (typeof t != "object" || !t) return;
	let n = t;
	if (!(typeof n.actorUuid != "string" || n.status !== "complete" && n.status !== "pending" || n.version !== 1)) return n;
}
async function S(e, t) {
	if (typeof e.update != "function") throw Error("Foundry cannot store the Mutant's Handbook chat-card state.");
	await e.update({ [`flags.${y}.${Qe}`]: t });
}
async function tt(e, t) {
	let n = t.context.messageId, r = n ? game?.messages.get(n) : void 0;
	if (!n || !r) throw Error("The Endurance Test did not create a chat message to continue from.");
	let i = r.system.test?.failed ?? t.failed;
	if (await S(r, {
		actorUuid: e.uuid,
		status: i ? "pending" : "complete",
		version: 1
	}), i) try {
		await be(e, n);
	} catch (e) {
		throw await S(r, null), e;
	}
}
async function nt(e) {
	let t = x(e), n = e.id;
	if (!t || t.status !== "pending" || !n || $e.has(n)) return !1;
	$e.add(n);
	try {
		let r = await fromUuid(t.actorUuid);
		if (!xe(r)) throw Error(`${t.actorUuid} no longer resolves to a WFRP4e character Actor.`);
		let i = ce(r);
		if (i?.kind !== "test" || i.messageId !== n) throw Error(`${r.name} is no longer waiting on this Corruption Test.`);
		let a = e.system.test;
		if (!a) throw Error("The Corruption Test chat message no longer contains its WFRP Test data.");
		if (a.failed) {
			if (!await Ze(r)) return !1;
			let e = ce(r);
			e?.kind === "test" && e.messageId === n && await le(r);
		} else await le(r);
		return await S(e, {
			...t,
			status: "complete"
		}), !0;
	} finally {
		$e.delete(n);
	}
}
async function rt(e) {
	let t = e.system.test?.context.previousMessage;
	if (!t || !e.id) return !1;
	let n = game?.messages.get(t), r = n ? x(n) : void 0;
	if (!n || !r || r.status !== "pending") return !1;
	let i = await fromUuid(r.actorUuid);
	if (!xe(i)) throw Error(`${r.actorUuid} no longer resolves to a WFRP4e character Actor.`);
	let a = e.system.test?.failed;
	if (typeof a != "boolean") return !1;
	await S(e, {
		actorUuid: r.actorUuid,
		status: a ? "pending" : "complete",
		version: 1
	});
	let o = ce(i);
	return o?.kind === "test" && o.messageId === t && (a ? await be(i, e.id) : await le(i)), typeof n.delete == "function" ? await n.delete() : await S(n, null), !0;
}
async function it(e) {
	let t = e.id;
	if (!t) return !1;
	let n = et.get(t);
	if (n) return n;
	let r = rt(e).finally(() => {
		et.delete(t);
	});
	return et.set(t, r), r;
}
function at(e) {
	return game?.user.isGM === !0 || e.isAuthor === !0;
}
function ot(e, t) {
	let n = x(e);
	if (!n || e.system.test?.failed !== !1) return !1;
	if (!t.querySelector("[data-ratter-corruption-result=\"success\"]")) {
		let e = document.createElement("p");
		e.dataset.ratterCorruptionResult = "success", e.textContent = game.i18n.localize("FVTT_WFRP_RATTER.Mutations.CorruptionHeld"), (t.querySelector(".message-content") ?? t).append(e);
	}
	return n.status === "pending" && nt(e).catch(_), !0;
}
function st(e, t) {
	let n = x(e);
	if (ot(e, t) || !n || n.status !== "pending" || e.system.test?.failed !== !0 || !at(e) || t.querySelector("[data-ratter-action=\"continue-corruption\"]")) return;
	let r = document.createElement("button");
	r.type = "button", r.classList.add("chat-button"), r.dataset.ratterAction = "continue-corruption", r.innerHTML = `<i class="fa-solid fa-forward"></i> ${game.i18n.localize("FVTT_WFRP_RATTER.Mutations.ContinueCorruption")}`, r.addEventListener("click", async () => {
		r.disabled = !0;
		try {
			await nt(e) || (r.disabled = !1);
		} catch (e) {
			r.disabled = !1, _(e);
		}
	}), (t.querySelector(".message-content") ?? t).append(r);
}
function ct() {
	Hooks.on("createChatMessage", (e) => {
		it(e).catch(_);
	}), Hooks.on("renderChatMessageHTML", (e, t) => {
		if (typeof t != "object" || !t || !(t instanceof HTMLElement)) return;
		let n = e;
		st(n, t), !x(n) && n.system.test?.context.previousMessage && it(n).then(() => st(n, t)).catch(_);
	});
}
//#endregion
//#region src/module/wfrp/mutants-handbook/check.ts
var lt = /* @__PURE__ */ new Set();
async function ut(e) {
	let n = e.system.status.corruption;
	if (!(Number(n.value) <= Number(n.max) || lt.has(e.uuid) || re(e) || t(e))) {
		if (!game) throw Error("Foundry game global is unavailable during a corruption check.");
		lt.add(e.uuid);
		try {
			let t = game.i18n.localize("NAME.Endurance"), n = {
				fields: { difficulty: "challenging" },
				[o]: !0,
				skipTargets: !0,
				title: game.i18n.format("DIALOG.MutateTitle", { test: t })
			}, r = e.has(t, "skill"), i = r ? await e.setupSkill(r, n) : await e.setupCharacteristic("t", n);
			if (!i) return;
			await i.roll(), await tt(e, i);
		} finally {
			lt.delete(e.uuid);
		}
	}
}
async function dt(e) {
	let t = await fromUuid(e);
	if (!xe(t)) throw Error(`${e} does not resolve to a WFRP4e character Actor.`);
	await ut(t);
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/documents.ts
function C(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function ft(e) {
	return C(e) ? e : void 0;
}
function pt(e) {
	return C(e) ? e : void 0;
}
function mt(e) {
	return C(e) ? e : void 0;
}
function w(e) {
	return C(e.context) || (e.context = {}), e.context;
}
function ht(e) {
	let t = e.flags?.[y]?.mutationAction;
	return C(t) && typeof t.actionId == "string" ? t.actionId : void 0;
}
function gt(e, t, n) {
	let r = n.context?.mutationActionId, i = n.preData?.options?.mutationActionId, a = n.item;
	return r === t || i === t || a?.id === e.id || a?.uuid !== void 0 && a.uuid === e.uuid;
}
function _t(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
function T(e, t) {
	return (e.itemTypes?.mutation ?? _t(e)).filter((e) => {
		if (e.type !== void 0 && e.type !== "mutation") return !1;
		let n = e.flags?.[y], r = n?.mutationAutomation;
		return (C(r) ? r.definitionId : e.id) === t && n?.mutantsHandbookRetired !== !0 && n?.mutantsHandbookPossessionRemoved !== !0;
	}).length;
}
function vt(e, t) {
	return yt(e, t)[0];
}
function yt(e, t) {
	return (e.itemTypes?.mutation ?? _t(e)).filter((e) => {
		if (e.type !== void 0 && e.type !== "mutation") return !1;
		let n = e.flags?.[y], r = n?.mutationAutomation;
		return (C(r) ? r.definitionId : e.id) === t && n?.mutantsHandbookRetired !== !0 && n?.mutantsHandbookPossessionRemoved !== !0;
	});
}
function bt(e) {
	let t = e?.flags?.[y]?.mutationAutomation, n = C(t) ? t : void 0, r = C(n?.state) ? n.state : void 0, i = C(r?.acquisition) ? r.acquisition : void 0;
	return i?.status === "resolved" ? i : {};
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/usage.ts
var xt = "mutationActionUsage", St = 480 * 60, E = "dimensional-instability-teleport", D = /* @__PURE__ */ new Map();
function O() {
	return Reflect.get(globalThis, "game");
}
function Ct() {
	let e = Number(O()?.time?.worldTime);
	return Number.isFinite(e) ? e : Math.floor(Date.now() / 1e3);
}
function wt(e) {
	let t = e.flags?.[y]?.[xt];
	if (!C(t) || t.version !== 1 || !C(t.actions)) return {
		actions: {},
		version: 1
	};
	let n = {};
	for (let [e, r] of Object.entries(t.actions)) Array.isArray(r) && (n[e] = r.filter((e) => C(e) && typeof e.id == "string" && Number.isFinite(e.at) && typeof e.period == "string" && typeof e.targetId == "string"));
	return {
		actions: n,
		version: 1
	};
}
function Tt(e, t) {
	return e === "day" ? `day:${Math.floor(t / 86400)}` : e === "scene" ? `scene:${O()?.combat?.id ?? O()?.scene?.id ?? "none"}` : e ?? "use";
}
function Et(e) {
	if (typeof e == "string") return e;
	if (C(e)) for (let t of [
		"token",
		"id",
		"uuid",
		"actor"
	]) {
		let n = e[t];
		if (typeof n == "string") return n;
		if (C(n)) {
			let e = n.uuid ?? n.id;
			if (typeof e == "string") return e;
		}
	}
}
function Dt(e, t) {
	if (!e.usage?.perTarget) return ["*"];
	let n = t?.context?.targets, r = Array.isArray(n) ? n : [...O()?.user?.targets ?? []], i = [...new Set(r.map(Et).filter((e) => !!e))];
	return i.length ? i : ["untargeted"];
}
function k(e, t, n = Ct()) {
	let r = wt(t).actions[e.id] ?? [];
	if (e.id === E) return r;
	if (e.usage?.period === "eight-hours") return r.filter((e) => e.at > n - St);
	let i = Tt(e.usage?.period, n);
	return r.filter((e) => e.period === i);
}
function Ot(e, t) {
	let n = e.usage?.max;
	return n === "tb" ? Math.max(0, Number(t.system?.characteristics?.t?.bonus) || 0) : typeof n == "number" ? n : Infinity;
}
function kt(e) {
	let t = w(e), n = t.mutationActionUseId;
	if (typeof n == "string" && n) return n;
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return t.mutationActionUseId = r, r;
}
function At(e, t, n, r) {
	let i = Ot(e, t), a = k(e, n), o = r?.context?.mutationActionUseId;
	return Dt(e, r).every((e) => {
		let t = a.filter((t) => t.targetId === e);
		return t.some((e) => e.id === o) || t.length < i;
	});
}
function jt(e, t, n, r) {
	let i = r?.context?.mutationActionUseId;
	return typeof i == "string" && k(e, n).some((e) => e.id === i) ? !0 : (Number(t.system?.status?.advantage?.value) || 0) >= (e.usage?.advantageCost ?? 0) && At(e, t, n, r);
}
function Mt(e, t) {
	if (e.mutationName !== "Dimensional Instability") return e.test?.difficulty;
	let n = [
		"average",
		"challenging",
		"difficult",
		"hard",
		"vhard"
	];
	return n[Math.min(n.length - 1, k(e, t).length)];
}
async function Nt(e, t) {
	if (t <= 0) return;
	if (e.modifyAdvantage) {
		await e.modifyAdvantage(-t);
		return;
	}
	let n = Number(e.system?.status?.advantage?.value) || 0;
	await e.update?.({ "system.status.advantage.value": Math.max(0, n - t) });
}
async function Pt(e, t, n, r) {
	let i = kt(r);
	if (e.id === E) {
		let e = n.flags?.[y]?.mutationRest, t = C(e) ? e.id : "initial";
		r.preData ??= {};
		let i = r.preData.options ??= {};
		if (i.mutationActionRestEpoch ??= t, i.mutationActionRestEpoch !== t) return !0;
	}
	if (!jt(e, t, n, r)) return !1;
	let a = wt(n), o = a.actions[e.id] ?? [];
	if (o.some((e) => e.id === i)) return !0;
	await Nt(t, e.usage?.advantageCost ?? 0);
	let s = Ct(), c = Tt(e.usage?.period, s), l = Dt(e, r).map((e) => ({
		at: s,
		id: i,
		period: c,
		targetId: e
	})), u = e.id === E ? o : o.filter((e) => e.at > s - 32 * 86400).slice(-99);
	return a.actions[e.id] = [...u, ...l], await n.update?.({ [`flags.${y}.${xt}`]: a }), !0;
}
async function Ft(e, t, n, r) {
	let i = `${n.uuid ?? n.id ?? "item"}:${e.id}`, a = (D.get(i) ?? Promise.resolve(!0)).catch(() => !1).then(() => Pt(e, t, n, r));
	D.set(i, a);
	try {
		return await a;
	} finally {
		D.get(i) === a && D.delete(i);
	}
}
function It(e, t) {
	return k(e, t).length;
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/card.ts
var A = "data-ratter-mutation-action";
function j(e) {
	return String(e ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
function Lt(e) {
	return Array.isArray(e) ? e.filter((e) => typeof e == "string") : typeof e == "string" && e ? [e] : [];
}
function M(e, t) {
	let n = Lt(t);
	return n.length ? `<p><strong>${j(e)}:</strong> ${n.map(j).join("; ")}</p>` : "";
}
function Rt(e, t, n, r) {
	let i = Number(r.result?.SL), a = t.system?.characteristics?.wp, o = Math.max(1, T(t, e.mutationId)), s = [
		Number.isFinite(i) ? `SL ${i}` : void 0,
		Number.isFinite(Number(a?.value)) ? `WP ${Number(a?.value)}` : void 0,
		Number.isFinite(Number(a?.bonus)) ? `WPB ${Number(a?.bonus)}` : void 0,
		`mutation level ${o}`
	].filter((e) => !!e);
	return e.usage?.period && s.push(`uses this ${e.usage.period}: ${It(e, n)}`), s.join("; ");
}
function zt(e, t) {
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
function Bt(e, t, n, r) {
	let i = Lt(e.conditions), a = f(e.id).length ? "<p><strong>Automation:</strong> After accepting the final roll, right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${A}="${j(e.id)}">`,
		`<p><strong>${j(e.mutationName)} — ${j(e.name)}</strong></p>`,
		M("Target", e.target),
		M("Range", e.range),
		M("Duration", e.duration),
		M("Outcome", e.outcome),
		M("Rules", e.rules),
		i.length ? `<p><strong>Condition guidance:</strong> ${i.map(j).join("; ")}. Apply these only after the final roll is accepted.</p>` : "",
		`<p><strong>Rolled values:</strong> ${j(Rt(e, t, n, r))}</p>`,
		a,
		"</section>"
	].join("");
}
function Vt(e, t, n, r) {
	!gt(n, e.id, r) || !r.result || (zt(e, r), r.result.other ??= [], r.result.other = r.result.other.filter((e) => !e.includes(A)), r.result.other.push(Bt(e, t, n, r)));
}
function Ht(e) {
	let t = f(e.id).length ? "<p><strong>Automation:</strong> Right-click this chat card and choose Apply Mutant’s Handbook Outcome.</p>" : "";
	return [
		`<section ${A}="${j(e.id)}">`,
		`<h3>${j(e.mutationName)} — ${j(e.name)}</h3>`,
		M("Target", e.target),
		M("Range", e.range),
		M("Duration", e.duration),
		M("Outcome", e.outcome),
		M("Rules", e.rules),
		M("Condition guidance", e.conditions),
		t,
		"</section>"
	].join("");
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/outcome-documents.ts
function Ut(e) {
	let t = e.system?.test, n = t?.options?.mutationActionId ?? t?.preData?.options?.mutationActionId;
	if (typeof n == "string") return n;
	let r = e.flags?.[y]?.mutationActionOutcome;
	return C(r) && typeof r.actionId == "string" ? r.actionId : void 0;
}
function Wt(e) {
	return e.flags?.[y]?.mutationActionOutcomeApplied === !0;
}
async function Gt(e) {
	await e.update?.({ [`flags.${y}.mutationActionOutcomeApplied`]: !0 });
}
function Kt(e) {
	if (!C(e)) return;
	let t = e.actor;
	return C(t) ? t : e;
}
function qt(e) {
	let t = e?.targets?.filter((e) => C(e)) ?? [];
	return t.length ? t : [...Reflect.get(globalThis, "game")?.user?.targets ?? []].flatMap((e) => Kt(e) ?? []);
}
async function Jt(e) {
	let t = e.system?.test ? Reflect.get(e.system.test, "actor") : void 0;
	if (C(t)) return t;
	let n = e.flags?.[y]?.mutationActionOutcome, r = C(n) ? n.actorUuid : void 0;
	if (typeof r != "string") return;
	let i = await Reflect.get(globalThis, "fromUuid")?.(r);
	return C(i) ? i : void 0;
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/effect-helpers.ts
function N(e, t = 0) {
	let n = Number(e);
	return Number.isFinite(n) ? n : t;
}
function P(e, t, n) {
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
function F(e, t) {
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
//#region src/module/wfrp/mutants-handbook/actions/timed-effects.ts
var Yt = "Compendium.wfrp4e-core.items.Item.EO05HX7jql0g605A";
async function Xt(e, t, n) {
	let r = t === "ActiveEffect" ? e.effects : e.items, i = r ? [...r].filter((e) => e.flags?.[y]?.actionId === n).map(({ id: e }) => e).filter((e) => typeof e == "string") : [];
	i.length && await e.deleteEmbeddedDocuments?.(t, i);
}
function I(e, t, n) {
	return {
		changes: [],
		description: n,
		disabled: !1,
		duration: F(),
		flags: {
			[y]: {
				actionId: e.id,
				automationPhase: "mutation-phase-5"
			},
			wfrp4e: {}
		},
		img: "icons/svg/clockwork.svg",
		name: t,
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
function Zt(e, t, n) {
	return {
		levels: Math.max(1, T(e, t.mutationId)),
		sl: N(n?.result?.SL),
		wp: N(e.system?.characteristics?.wp?.value),
		wpb: N(e.system?.characteristics?.wp?.bonus)
	};
}
async function Qt(e, t, n) {
	if (!e.createEmbeddedDocuments) return;
	let { levels: r, sl: i, wpb: a } = Zt(e, t, n), o = Math.max(1, a + i) * 2 ** (r - 1), s = (await Reflect.get(globalThis, "fromUuid")?.(Yt))?.toObject?.();
	if (!s) return;
	await Xt(e, "Item", t.id), delete s._id, s.name = `${t.mutationName} — Flight (${30 * r})`;
	let c = s.system ??= {}, l = c.specification ??= {};
	l.value = String(30 * r);
	let u = s.flags ??= {};
	u[y] = {
		actionId: t.id,
		automationPhase: "mutation-phase-5",
		rounds: o
	};
	let d = Array.isArray(s.effects) ? s.effects : [];
	d.push({
		...I(t, "Levitation duration", `Expires after ${o} rounds.`),
		system: {
			scriptData: [P("Expire Mutant's Handbook outcome", "endRound", `const key = "flags.${y}.rounds";\nconst left = Number(this.item.flags?.["${y}"]?.rounds) - 1;\nif (left <= 0) return this.item.delete();\nreturn this.item.update({[key]: left});`)],
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
	}), s.effects = d, await e.createEmbeddedDocuments("Item", [s]);
}
function $t(e, t, n, r, i = t) {
	let { levels: a, sl: o, wp: s, wpb: c } = Zt(i, n, r);
	if (e === "invisible") {
		let e = Math.max(1, s + o) * 2 ** (a - 1), t = I(n, "Invisible", "Ends early after an attack or conspicuously loud noise.");
		return t.duration = F(e), t.statuses = ["invisible"], t.img = "icons/svg/invisible.svg", t;
	}
	if (e === "entrancement") {
		let e = Math.max(1, c + o), t = I(n, `${n.mutationName} — Entranced`, `The source mutant gains +20 to social interactions with this Actor for ${e} hours.`);
		return t.duration = F(void 0, e * 3600), t;
	}
	if (e === "camouflage") {
		let e = I(n, "Chameleon Camouflage (Scene)", "+20 to Stealth while the skin still matches the surroundings; delete when the scene changes."), t = e.system;
		return t.scriptData = [P("Expire Mutant's Handbook outcome", "dialog", "if (args.skill?.name?.toLowerCase().includes(\"stealth\")) args.fields.modifier += 20;"), P("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();")], e;
	}
	if (e === "foresight") {
		let e = N(t.system?.status && t.system.status.fortune ? t.system.status.fortune.value : 0), r = I(n, "Oracle Foresight (Scene)", `+10 Initiative and ${a} temporary Fortune; delete when the scene ends.`);
		r.changes = [{
			key: "system.characteristics.i.modifier",
			mode: 2,
			priority: null,
			value: "10"
		}];
		let i = r.system;
		i.scriptData = [P("Expire Mutant's Handbook outcome", "endCombat", "return this.effect.delete();"), P("Expire Mutant's Handbook outcome", "deleteEffect", `const current = Number(this.actor.system.status.fortune.value);\nif (current > ${e}) return this.actor.update({"system.status.fortune.value": ${e}});`)];
		let o = r.flags, s = o[y] ??= {};
		return s.baseFortune = e, s.fortune = a, r;
	}
	let l = Math.max(1, s);
	if (e === "temporal-surge") {
		let e = I(n, "Temporal Surge (This Turn)", "One additional Movement and Action are available during the current turn.");
		e.duration = F();
		let t = e.system;
		return t.scriptData = [P("Expire Mutant's Handbook outcome", "endTurn", "return this.effect.delete();")], e;
	}
	let u = I(n, "Telekinesis Active", `May move matter at WPB yards per round for ${l} rounds.`);
	return u.duration = F(l), u;
}
async function en(e, t, n, r, i = t) {
	if (e === "levitation") return Qt(t, n, r);
	await Xt(t, "ActiveEffect", n.id);
	let a = $t(e, t, n, r, i);
	if (await t.createEmbeddedDocuments?.("ActiveEffect", [a]), e === "foresight") {
		let e = Math.max(1, T(t, n.mutationId)), r = t.system?.status?.fortune, i = N(r?.value);
		await t.update?.({ "system.status.fortune.value": i + e });
	}
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/form-items.ts
var tn = {
	Contortionist: "Compendium.wfrp4e-core.items.Item.TaYriYcJkFuIdBKp",
	Frenzy: "Compendium.wfrp4e-core.items.Item.hXcfygzujgyMN1uI",
	Painless: "Compendium.wfrp4e-core.items.Item.wMwSRDmgiF2IdCJr"
};
function nn(e, t, n) {
	let r = /^(.*) (\d+)$/.exec(e), i = r?.[1] ?? e, a = r?.[2] ?? (i === "Fear" ? "1" : "");
	return {
		effects: [],
		flags: { [y]: {
			automationPhase: "mutation-phase-5",
			mutationForm: n
		} },
		img: "systems/wfrp4e/icons/blank.png",
		name: i,
		system: {
			description: { value: `<p>Temporary ${e} benefit supplied by the active Mutant's Handbook form.</p>` },
			specification: { value: a }
		},
		type: t
	};
}
async function rn(e, t, n) {
	let r = Reflect.get(globalThis, "fromUuid"), i = (tn[e] ? await r?.(tn[e]) : void 0)?.toObject?.() ?? nn(e, t, n);
	delete i._id;
	let a = C(i.flags) ? i.flags : {};
	return i.flags = a, a[y] = {
		automationPhase: "mutation-phase-5",
		mutationForm: n
	}, i;
}
async function an(e, t, n) {
	n.length && await e.createEmbeddedDocuments?.("Item", await Promise.all(n.map(([e, n]) => rn(e, n, t))));
}
function on(e) {
	return Array.isArray(e.grants) ? e.grants.filter(C) : [];
}
async function sn(e, t, n) {
	let r = Reflect.get(globalThis, "fromUuid"), i = [];
	for (let e of on(n)) {
		let n = (typeof e.sourceUuid == "string" ? await r?.(e.sourceUuid) : void 0)?.toObject?.();
		if (!n) continue;
		delete n._id;
		let a = C(n.flags) ? n.flags : {};
		n.flags = a, a[y] = {
			automationPhase: "mutation-phase-5",
			mutationForm: t
		}, i.push(n);
	}
	i.length && await e.createEmbeddedDocuments?.("Item", i);
}
function cn(e) {
	return (Array.isArray(e.modifiers) ? e.modifiers.filter(C) : []).flatMap((e) => {
		let t = N(e.value, NaN);
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
function ln(e) {
	let t = Array.isArray(e.modifiers) ? e.modifiers.filter((e) => C(e) && e.kind === "test") : [];
	if (t.length) return P("Resolve Mutant's Handbook form", "dialog", `const modifiers = ${JSON.stringify(t)};\nconst skillName = args.skill?.name ?? args.test?.item?.name ?? "";\nconst characteristic = args.characteristic ?? args.test?.characteristicKey;\nfor (const modifier of modifiers) {\n  const matchesSkill = (modifier.skills ?? []).some(name => skillName === name || skillName.startsWith(name + " ("));\n  const matchesCharacteristic = (modifier.characteristics ?? []).includes(characteristic);\n  if (!matchesSkill && !matchesCharacteristic) continue;\n  const current = Number(args.fields.modifier);\n  const next = current + Number(modifier.value);\n  if (Number.isFinite(next)) args.fields.modifier = next;\n}`);
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/forms.ts
var un = [
	"ws",
	"bs",
	"s",
	"t",
	"ag",
	"dex"
], dn = {
	A7OLAWKXWUfh0UGU: "ethereal",
	XheCM6GZG8FhAoGp: "mirror-image",
	NDDLEunW5biRvTfy: "shapeshifter",
	JtmI1wOwKqWT4zVG: "skinwalker",
	q3sK3RsdsJxrifZP: "swarmform",
	jPlCrsK3hTgkHsTR: "warp-spasm",
	mNNavbJayRcsyeXJ: "werebeast"
};
function fn(e) {
	try {
		return e.items ? [...e.items] : [];
	} catch {
		return [];
	}
}
async function pn(e, t) {
	let n = fn(e).filter((e) => e.flags?.[y]?.mutationForm === t).flatMap((e) => e.id ? [e.id] : []), r = [...e.effects ?? []].filter((e) => e.flags?.[y]?.mutationForm === t).flatMap((e) => e.id ? [e.id] : []);
	return n.length && await e.deleteEmbeddedDocuments?.("Item", n), r.length && await e.deleteEmbeddedDocuments?.("ActiveEffect", r), n.length > 0 || r.length > 0;
}
async function mn(e, t) {
	let n = dn[t];
	!n || T(e, t) > 0 || await pn(e, n);
}
function L(e, t, n, r, i) {
	let a = `const ids = (this.actor.items ?? []).filter(item => item.flags?.["${y}"]?.mutationForm === "${t}").map(item => item.id);\nif (ids.length) await this.actor.deleteEmbeddedDocuments("Item", ids);`;
	return {
		changes: [],
		description: n,
		disabled: !1,
		duration: F(r, i),
		flags: {
			[y]: {
				actionId: e.id,
				automationPhase: "mutation-phase-5",
				mutationForm: t
			},
			wfrp4e: {}
		},
		img: "icons/svg/mystery-man.svg",
		name: `${e.mutationName} — Active Form`,
		statuses: [],
		system: {
			scriptData: [P("Resolve Mutant's Handbook form", "deleteEffect", a)],
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
function hn(e, t) {
	let n = (C(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function gn(e) {
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
async function _n(e, t, n, r, i, a) {
	if (await pn(n, e), t === "revert") return;
	let o = bt(vt(n, r.mutationId)), s = N(i?.result?.SL), c = L(r, e, r.outcome), l = [];
	if (e === "ethereal") c = L(r, e, r.outcome, Math.max(1, N(n.system?.characteristics?.wp?.bonus) + s)), l = [["Ethereal", "trait"]];
	else if (e === "mirror-image") {
		let t = Math.max(1, T(n, r.mutationId)), i = Math.max(1, N(n.system?.characteristics?.wp?.value) + s * 10) * 2 ** (t - 1);
		c = L(r, e, r.outcome, void 0, i * 60);
	} else if (e === "shapeshifter") {
		let t = Math.max(1, N(n.system?.characteristics?.t?.bonus) + s);
		c = L(r, e, r.outcome, void 0, t * 3600);
	} else if (e === "skinwalker" && a) {
		c.changes = un.flatMap((e) => {
			let t = N(a.system?.characteristics?.[e]?.value) - N(n.system?.characteristics?.[e]?.value);
			return t ? [{
				key: `system.characteristics.${e}.modifier`,
				mode: 2,
				priority: null,
				value: String(t)
			}] : [];
		});
		let e = N(a.system?.details?.move?.value, NaN);
		Number.isFinite(e) && c.changes.push({
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e)
		});
	} else if (e === "swarmform") {
		let e = gn(hn(o, "swarm-source"));
		c.changes = [...e.move === void 0 ? [] : [{
			key: "system.details.move.value",
			mode: 5,
			priority: null,
			value: String(e.move)
		}], ...hn(o, "swarm-size") ? [{
			key: "system.details.size.value",
			mode: 5,
			priority: null,
			value: hn(o, "swarm-size")
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
			P("Resolve Mutant's Handbook form", "endCombat", "return this.effect.delete();"),
			P("Resolve Mutant's Handbook form", "deleteEffect", "await this.actor.addCondition(\"fatigued\", 1);")
		];
	} else if (e === "werebeast") {
		c.changes = cn(o);
		let t = ln(o);
		if (t) {
			let e = c.system;
			e.scriptData = [...e.scriptData ?? [], t];
		}
		await sn(n, e, o);
	}
	await an(n, e, l), await n.createEmbeddedDocuments?.("ActiveEffect", [c]);
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/companions.ts
function vn(e, t) {
	let n = (C(e.selections) ? e.selections : {})[t];
	return String(Array.isArray(n) ? n[0] ?? "" : n ?? "");
}
function yn(e) {
	return e.split("-").filter(Boolean).map((e) => `${e[0]?.toUpperCase() ?? ""}${e.slice(1)}`).join(" ");
}
function bn(e, t, n) {
	let r = C(e.characteristics) ? e.characteristics : {};
	e.characteristics = r;
	let i = C(r[t]) ? r[t] : {};
	r[t] = i, i.initial = n, i.advances = 0, i.modifier = 0, i.value = n;
}
function xn(e, t) {
	return [
		"personality",
		"motivation",
		"short-ambition",
		"long-ambition"
	].flatMap((n) => {
		let r = vn(e, `${t}-${n}`);
		return r ? [`<p><strong>${yn(n)}:</strong> ${r}</p>`] : [];
	}).join("");
}
function Sn(e, t, n) {
	let r = e.name ?? "Mutant";
	if (t === "spectral-companion") {
		let e = vn(n, "companion-type") || "ghost";
		return {
			flags: {},
			img: "icons/magic/death/undead-ghost-scream-teal.webp",
			name: vn(n, "companion-name") || `${r}'s ${yn(e)}`,
			system: { details: { notes: { value: xn(n, "companion") } } },
			type: "creature"
		};
	}
	let i = e.toObject?.() ?? {};
	delete i._id, i.effects = [], i.flags = {}, i.folder = null, i.items = [], i.type = "creature";
	let a = C(i.system) ? i.system : {};
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
		})) bn(a, e, t);
		return a.details = {
			...C(a.details) ? a.details : {},
			move: { value: 2 },
			size: { value: "tiny" }
		}, a.status = {
			...C(a.status) ? a.status : {},
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
		bn(a, t, Number.isFinite(n) ? Math.max(0, r - n) : 0);
	}
	return a.details = {
		...C(a.details) ? a.details : {},
		move: { value: 0 },
		notes: { value: xn(n, "twin") }
	}, a.status = {
		...C(a.status) ? a.status : {},
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
function Cn(e, t) {
	let n = e.toObject?.() ?? {};
	delete n._id, n.name = `${e.name ?? "Mutant"}'s Symbiotic Twin`, Array.isArray(n.items) && (n.items = n.items.filter((e) => {
		if (!C(e) || !C(e.flags)) return !0;
		let t = e.flags[y];
		return !C(t) || !C(t.mutationAction) ? !0 : t.mutationAction.actionId !== "symbiotic-twin-manifest";
	}));
	let r = C(n.system) ? n.system : {};
	n.system = r;
	let i = C(r.details) ? r.details : {};
	return r.details = i, i.notes = { value: xn(t, "twin") }, n;
}
function wn(e, t) {
	let n = e.flags?.[y]?.mutationCompanions, r = C(n) ? n[t] : void 0;
	return typeof r == "string" ? [{ uuid: r }] : Array.isArray(r) ? r.flatMap((e) => C(e) && typeof e.uuid == "string" ? [{
		uuid: e.uuid,
		...typeof e.mutationItemId == "string" ? { mutationItemId: e.mutationItemId } : {}
	}] : []) : [];
}
async function Tn(e, t) {
	let n = wn(e, t), r = Reflect.get(globalThis, "fromUuid");
	return r ? (await Promise.all(n.map(async (e) => await r(e.uuid) ? e : void 0))).filter((e) => e !== void 0) : n;
}
function En(e, t) {
	let n = new Set(t.flatMap((e) => e.mutationItemId ? [e.mutationItemId] : []));
	return e.find((e) => !e.id || !n.has(e.id)) ?? e[t.length];
}
async function Dn(e, t, n) {
	let r = yt(t, n.mutationId), i = await Tn(t, e);
	if (!r.length || i.length >= r.length) return;
	let a = En(r, i), o = bt(a), s = e === "symbiotic-twin" ? Cn(t, o) : Sn(t, e, o), c = C(s.flags) ? s.flags : {};
	s.flags = c, c[y] = {
		automationPhase: "mutation-phase-5",
		mutationCompanion: {
			hostUuid: t.uuid ?? t.id,
			kind: e,
			mutationId: n.mutationId
		}
	};
	let l = await Reflect.get(globalThis, "Actor")?.create?.(s), u = l?.uuid ?? l?.id;
	u && (await t.update?.({ [`flags.${y}.mutationCompanions.${e}`]: [...i, {
		mutationItemId: a?.id,
		uuid: u
	}] }), e === "symbiotic-twin" && (await t.update?.({ [`flags.${y}.mutationTwinUuid`]: u }), await l?.update?.({ [`flags.${y}.mutationTwinUuid`]: t.uuid ?? t.id })));
}
var On = /* @__PURE__ */ new Set();
function kn() {
	Hooks.on("updateActor", (e, t, n, r) => {
		let i = Reflect.get(globalThis, "game");
		if (typeof r == "string" && i?.user?.id !== r || !C(e) || !C(t)) return;
		let a = e, o = a.uuid ?? a.id, s = a.flags?.[y]?.mutationTwinUuid, c = C(t.system) ? t.system : void 0, l = C(c?.status) ? c.status : void 0, u = C(l?.wounds) ? l.wounds : void 0, d = t["system.status.wounds.value"] ?? u?.value;
		if (typeof o != "string" || typeof s != "string" || !Number.isFinite(Number(d)) || On.has(o)) return;
		let ee = Reflect.get(globalThis, "fromUuid");
		On.add(s), ee?.(s).then((e) => e?.update?.({ "system.status.wounds.value": Number(d) })).finally(() => On.delete(s));
	});
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/outcomes.ts
var An = /* @__PURE__ */ new WeakSet();
function jn(e) {
	return e ? typeof e.failed == "boolean" ? !e.failed : e.result?.outcome !== "failure" : !0;
}
function Mn(e, t) {
	return e.when === "always" ? !0 : e.when === "success" ? jn(t) : !jn(t);
}
function Nn(e, t, n) {
	return e === "self" ? [t] : n;
}
async function Pn(e, t) {
	let n = Reflect.get(globalThis, "Roll");
	n && await (await new n(e).evaluate()).toMessage?.({ flavor: t });
}
async function Fn(e, t, n) {
	for (let r of t) {
		let t = {
			appendTitle: ` — ${n} follow-up`,
			fields: { difficulty: e.difficulty }
		}, i = e.skill ? await r.setupSkill?.(e.skill, t) : await r.setupCharacteristic?.(e.characteristic ?? "wp", t);
		if (i?.roll && (await i.roll(), !jn(i))) {
			for (let t of e.failureConditions) {
				let e = t.condition === "broken" && r.has?.("Skittish") ? 3 : t.amount ?? 1;
				await r.addCondition?.(t.condition, e);
			}
			e.failureRoll && await Pn(e.failureRoll.formula, e.failureRoll.label);
		}
	}
}
function In(e, t, n) {
	let r = Number(n?.result?.SL) || 0;
	return e === "sl" ? Math.max(0, r) : e === "fellowship-plus-sl" ? Math.max(0, (Number(t.system?.characteristics?.fel?.value) || 0) + r) : e;
}
async function Ln(e, t, n, r, i) {
	if (e.kind === "roll") return Pn(e.formula, e.label);
	if (e.kind === "follow-up-test") return Fn(e, n, i.name);
	if (e.kind === "companion") return Dn(e.companion, t, i);
	if (e.kind === "form") return _n(e.form, e.mode, t, i, r, n[0]);
	let a = Nn(e.subject, t, n);
	if (e.kind === "condition") {
		for (let n of a) {
			let i = In(e.amount ?? 1, t, r);
			await n.addCondition?.(e.condition, i);
		}
		return;
	}
	if (e.kind === "remove-condition") {
		let n = In(e.amount ?? 1, t, r);
		for (let t of a) for (let r = 0; r < n; r += 1) await t.removeCondition?.(e.condition);
		return;
	}
	if (e.kind === "heal") {
		let n = In(e.amount, t, r);
		for (let e of a) await e.modifyWounds?.(n);
		return;
	}
	if (e.kind === "effect") for (let n of a) await en(e.effect, n, i, r, t);
}
function Rn(e) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(e);
}
function zn(e) {
	let t = Ut(e);
	return !!(t && f(t).length);
}
async function Bn(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	if (An.has(t) || Wt(t)) return !1;
	let n = Ut(t), r = n ? me(n) : void 0;
	if (!r) return !1;
	let i = t.system?.test, a = await Jt(t);
	if (!a) return !1;
	let o = f(r.id).filter((e) => Mn(e, i)), s = qt(i);
	if (o.some((e) => e.kind !== "roll" && e.subject === "targets" || e.kind === "form" && e.source === "targets") && s.length === 0) return Rn(`Target one or more Actors before applying ${r.name}.`), !1;
	An.add(t);
	try {
		for (let e of o) await Ln(e, a, s, i, r);
		return await Gt(t), !0;
	} finally {
		An.delete(t);
	}
}
//#endregion
//#region src/module/wfrp/mutants-handbook/actions/index.ts
var Vn = /* @__PURE__ */ new WeakSet();
function R(e, t, n) {
	let r = me(n), i = ft(e), a = pt(t);
	if (!r || !i || !a) return;
	let o = ht(a);
	if (!(o !== void 0 && o !== n)) return {
		action: r,
		actor: i,
		item: a
	};
}
function Hn(e, t) {
	Reflect.get(globalThis, "ui")?.notifications?.warn?.(`${t.name ?? "This Actor"} cannot use ${e.name}: its use limit or Advantage cost is not available.`);
}
function Un(e, t, n) {
	let r = e.test?.bonusMultiplier ?? 1, i = e.test?.bonusCharacteristic;
	if (r <= 1 || !i) return;
	let a = w(n), o = `mutationActionDamage:${e.id}`;
	if (typeof a[o] == "number") return;
	let s = Number(t.system?.characteristics?.[i]?.bonus);
	if (!Number.isFinite(s)) return;
	let c = s * (r - 1);
	n.preData ??= {};
	let l = Number(n.preData.additionalDamage) || 0;
	n.preData.additionalDamage = l + c, a[o] = c;
}
function Wn(e, t) {
	let n = t.result;
	if (!n || Vn.has(n)) return;
	let r = Number(w(t)[`mutationActionDamage:${e.id}`]), i = Number(n.damage);
	!Number.isFinite(r) || r === 0 || !Number.isFinite(i) || (n.damage = i + r, n.breakdown?.damage?.other?.push({
		label: e.name,
		value: r
	}), Vn.add(n));
}
function Gn(e, t, n, r) {
	let i = R(e, t, n);
	if (!i || !C(r)) return;
	let { action: a, actor: o, item: s } = i;
	if (!jt(a, o, s)) {
		r.abort = !0, Hn(a, o);
		return;
	}
	let c = C(r.fields) ? r.fields : {};
	r.fields = c;
	let l = Mt(a, s);
	l && (c.difficulty = l);
	let u = C(r.flags) ? r.flags : {};
	r.flags = u, u.mutationActionId = a.id;
}
async function Kn(e, t, n, r) {
	let i = R(e, t, n), a = mt(r);
	if (!i || !a) return !1;
	let { action: o, actor: s, item: c } = i, l = w(a);
	l.mutationActionId = o.id, l.mutationActionItemUuid = c.uuid ?? c.id, a.preData ??= {}, a.preData.options ??= {}, a.preData.options.mutationActionActorUuid = s.uuid ?? s.id, a.preData.options.mutationActionId = o.id, a.preData.options.mutationActionItemUuid = c.uuid ?? c.id, a.preData.options.mutationActionUseId ??= globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	let u = await Ft(o, s, c, a);
	return u ? Un(o, s, a) : Hn(o, s), u;
}
async function qn(e, t, n, r) {
	let i = R(e, t, n), a = mt(r);
	!i || !a || (Wn(i.action, a), Vt(i.action, i.actor, i.item, a));
}
function Jn(e, t, n) {
	let r = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
	return {
		appendTitle: ` — ${e.mutationName}: ${e.name}`,
		fields: { difficulty: Mt(e, n) ?? "challenging" },
		mutationActionId: e.id,
		mutationActionActorUuid: t.uuid ?? t.id,
		mutationActionItemUuid: n.uuid ?? n.id,
		mutationActionUseId: r
	};
}
async function Yn(e, t, n) {
	let r = Jn(e, t, n);
	if (t.setupTrait) return t.setupTrait(n, r);
	if (e.test && "skill" in e.test && t.setupSkill) return t.setupSkill(e.test.skill, r);
	if (e.test && "characteristic" in e.test && t.setupCharacteristic) return t.setupCharacteristic(e.test.characteristic, r);
}
async function Xn(e, t, n) {
	let r = Reflect.get(globalThis, "game"), i = Ht(e), a = r?.wfrp4e?.utility?.chatDataSetup?.(i) ?? { content: i };
	a.flags = {
		...typeof a.flags == "object" && a.flags ? a.flags : {},
		[y]: { mutationActionOutcome: {
			actionId: e.id,
			actorUuid: t.uuid ?? t.id,
			itemUuid: n.uuid ?? n.id
		} }
	}, await Reflect.get(globalThis, "ChatMessage")?.create?.(a);
}
async function Zn(e, t, n) {
	let r = R(e, t, n);
	if (!r) return;
	let { action: i, actor: a, item: o } = r, s = i.test ? await Yn(i, a, o) : { context: Jn(i, a, o) };
	if (s && await Kn(a, o, i.id, s)) {
		if (i.test && s.roll) {
			await s.roll();
			return;
		}
		await Xn(i, a, o);
	}
}
//#endregion
//#region src/module/foundry/api/create-package-api.ts
function Qn() {
	return {
		applyMutationActionOutcome: Bn,
		checkMutantsHandbookCorruption: dt,
		id: h,
		logStatus() {
			console.log(`${ie} is loaded.`);
		},
		prepareMutationActionDialog: Gn,
		recordMutationActionUse: Kn,
		reconcileMutationAutomation: v,
		removeMutationGrantOwner: ue,
		resolveMutationActionTest: qn,
		title: ie,
		useMutationAction: Zn
	};
}
//#endregion
//#region src/module/foundry/api/register-package-api.ts
function $n() {
	if (!game) throw Error("Foundry game global is unavailable during module API registration.");
	let e = game.modules.get(h);
	if (!e) throw Error(`Foundry module registry entry was not found for ${h}.`);
	e.api = Qn();
}
//#endregion
//#region src/module/foundry/settings.ts
var er = "useMutantsHandbookMutations";
function tr() {
	if (!game) throw Error("Foundry game global is unavailable during settings registration.");
	game.settings.register(h, er, {
		config: !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Hint",
		name: "FVTT_WFRP_RATTER.Settings.MutantsHandbook.Name",
		scope: "world",
		type: Boolean
	});
}
function nr() {
	return game?.settings.get(h, er) === !0;
}
//#endregion
//#region src/module/foundry/compendiums/settings.ts
var rr = "keepCompendiumsTidy";
function ir() {
	if (!game?.user) throw Error("Foundry user is unavailable during Compendium tidy setting registration.");
	game.settings.register(h, rr, {
		config: game.user.isGM === !0,
		default: !1,
		hint: "FVTT_WFRP_RATTER.Settings.KeepCompendiumsTidy.Hint",
		name: "FVTT_WFRP_RATTER.Settings.KeepCompendiumsTidy.Name",
		scope: "world",
		type: Boolean
	});
}
//#endregion
//#region src/module/foundry/compendiums/queue.ts
var z = /* @__PURE__ */ new WeakMap();
async function ar(e, t) {
	let n = (z.get(e) ?? Promise.resolve()).catch(() => void 0).then(async () => {
		let e = globalThis.navigator?.locks;
		e ? await e.request("foundry:folder-tidy", t) : await t();
	});
	z.set(e, n);
	try {
		await n;
	} finally {
		z.get(e) === n && z.delete(e);
	}
}
//#endregion
//#region src/module/foundry/compendiums/merge.ts
async function or(e, t, n, r) {
	for (let [, n] of r.entries()) if (n.folder?.id === e.id && (await n.setFolder(t), n.folder?.id !== t.id)) throw Error(`Could not move a pack out of ${e.name}.`);
	for (let r of n.filter((t) => t.folder?.id === e.id)) if (await r.update({ folder: t.id }), r.folder?.id !== t.id) throw Error(`Could not move folder ${r.name}.`);
	if (!await e.delete({
		deleteSubfolders: !1,
		deleteContents: !1
	})) throw Error(`Could not delete empty duplicate folder ${e.name}.`);
	n.splice(n.indexOf(e), 1);
}
async function sr(e, t, n, r) {
	for (let [e, i] of t.entries()) if (i.folder && n.has(i.folder.id) && !r.has(e) && (await i.setFolder(null), i.folder)) throw Error(`Could not move unrelated pack ${e} to the sidebar root.`);
	for (let t of e) if (t.folder && n.has(t.folder.id) && !n.has(t.id) && (await t.update({ folder: null }), t.folder)) throw Error(`Could not move unrelated folder ${t.name} to the sidebar root.`);
}
//#endregion
//#region src/module/functions/compendiums/folders.ts
function cr(e, t) {
	return t.filter((t) => t.folder?.id === e.id);
}
function B(e, t) {
	let n = new Set([e.id]);
	for (let r of cr(e, t)) for (let e of B(r, t)) n.add(e);
	return n;
}
function V(e, t) {
	let n = new Set(e.packs.map((e) => `${t}.${e}`));
	for (let r of e.folders) for (let e of V(r, t)) n.add(e);
	return n;
}
function H(e, t, n, r) {
	let i = B(e, t), a = !1;
	for (let [e, t] of n.entries()) !t.folder || !i.has(t.folder.id) || r.has(e) && (a = !0);
	return a;
}
function lr(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	function r(e, i) {
		let a = `${i}/${e.name}`;
		if (t.has(a)) throw Error(`Duplicate Compendium folder declaration: ${a}`);
		t.add(a);
		for (let t of e.packs) {
			if (n.has(t)) throw Error(`Duplicate Compendium pack declaration: ${t}`);
			n.add(t);
		}
		for (let t of e.folders) r(t, a);
	}
	for (let t of e) r(t, "");
}
//#endregion
//#region src/module/foundry/compendiums/tidy.ts
async function ur(e, t, n) {
	if (e.length < 2 || e.every((t, n) => typeof t.sort == "number" && Number.isFinite(t.sort) && (n === 0 || t.sort > (e[n - 1]?.sort ?? -Infinity)))) return;
	let r = Math.max(0, ...t.filter((e) => e.folder?.id === n.id).map((e) => typeof e.sort == "number" && Number.isFinite(e.sort) ? e.sort : 0));
	for (let [t, i] of e.entries()) {
		let e = r + (t + 1) * 1e5;
		if (!Number.isSafeInteger(e)) throw Error(`Cannot safely sort Compendium folders under ${n.name}.`);
		await i.update({ sort: e });
	}
}
async function dr(e, t) {
	await ar(e, () => fr(e, t));
}
async function fr(e, t) {
	if (e.user.isGM !== !0 || e.user.isActiveGM !== !0) return;
	let n = e.modules.get(h);
	if (!n) throw Error(`Foundry module registry entry was not found for ${h}.`);
	let r = Array.from(n.packFolders ?? []);
	if (lr(r), r.length === 0) return;
	for (let t of r) for (let n of V(t, h)) if (!e.packs.has(n)) throw Error(`Declared Compendium ${n} was not found.`);
	let i = Array.from(e.folders ?? []).filter((e) => e.type === "Compendium"), a = /* @__PURE__ */ new Set();
	async function o(n, r) {
		let s = V(n, h), c = i.filter((e) => e.name === n.name && !a.has(e.id) && (!r || !B(e, i).has(r.id))).sort((t, n) => Number(H(n, i, e.packs, s)) - Number(H(t, i, e.packs, s)) || t.id.localeCompare(n.id)), l = c.find((e) => (e.folder?.id ?? null) === (r?.id ?? null));
		if (!l) if (l = c.find((t) => H(t, i, e.packs, s) && (!r || !B(t, i).has(r.id))), l) {
			if (r && B(l, i).has(r.id)) throw Error(`Moving ${n.name} under ${r.name} would make a folder cycle.`);
			let e = r?.id ?? null;
			if (await l.update({ folder: e }) === void 0 && (l.folder?.id ?? null) !== e) throw Error(`Could not move Compendium folder ${n.name}; the update was not applied.`);
		} else {
			if (l = await t({
				name: n.name,
				type: "Compendium",
				folder: r?.id ?? null,
				sorting: n.sorting,
				...n.color ? { color: n.color } : {}
			}), !l) throw Error(`Could not create Compendium folder ${n.name}.`);
			i.push(l);
		}
		a.add(l.id);
		for (let t of c) if (t.id !== l.id && !((t.folder?.id ?? null) !== (r?.id ?? null) && !H(t, i, e.packs, s))) {
			if (B(t, i).has(l.id)) throw Error(`Cannot merge ancestor folder ${t.name} into its descendant.`);
			await or(t, l, i, e.packs);
		}
		let u = {};
		if (l.sorting !== n.sorting && (u.sorting = n.sorting), n.color !== void 0 && n.color !== null && String(l.color) !== String(n.color) && (u.color = String(n.color)), Object.keys(u).length > 0 && await l.update(u) === void 0 && (l.sorting !== n.sorting || n.color !== void 0 && n.color !== null && String(l.color) !== String(n.color))) throw Error(`Could not configure Compendium folder ${n.name}; the update was not applied.`);
		for (let t of n.packs) {
			let n = `${h}.${t}`, r = e.packs.get(n);
			if (!r) throw Error(`Declared Compendium ${n} was not found.`);
			r.folder?.id !== l.id && await r.setFolder(l);
		}
		let d = [];
		for (let e of n.folders) d.push(await o(e, l));
		return !r && n.sorting === "m" && await ur(d, i, l), l;
	}
	for (let e of r) await o(e, null);
	let s = new Set(r.flatMap((e) => [...V(e, h)]));
	await sr(i, e.packs, a, s);
}
async function pr() {
	!game?.user.isGM || !game.user.isActiveGM || game.settings.get("fvtt-wfrp-ratter", "keepCompendiumsTidy") === !0 && await dr(game, (e) => CONFIG.Folder.documentClass.create(e));
}
//#endregion
//#region src/module/wfrp/mutants-handbook/context-options.ts
function mr(e) {
	let t = e.dataset.messageId;
	return t ? game?.messages.get(t) : void 0;
}
function hr() {
	Hooks.on("getChatMessageContextOptions", (e, t) => {
		game && t.push({
			callback: async (e) => {
				let t = mr(e);
				t && await Bn(t);
			},
			condition: (e) => {
				let t = mr(e);
				return !!(t && t.flags?.drowsy?.mutationActionOutcomeApplied !== !0 && zn(t));
			},
			name: "Apply Mutant’s Handbook Outcome"
		});
	});
}
//#endregion
//#region src/module/wfrp/mutants-handbook/automation/hooks.ts
function gr(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	if (t.type !== "mutation" || typeof t.id != "string" || typeof t.actor?.uuid != "string") return;
	let n = t.flags?.[y]?.mutationAutomation;
	return typeof n == "object" && n ? t : void 0;
}
function _r(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	if (typeof t.id != "string" || typeof t.actor?.uuid != "string") return;
	let n = t.flags?.[y];
	return typeof n?.mutationGrant == "object" || typeof n?.mutationSkillGrant == "object" ? t : void 0;
}
function vr(e) {
	if (typeof e != "object" || !e) return;
	let t = e;
	if (!(t.type !== "mutation" || typeof t.id != "string" || typeof t.actor?.uuid != "string" || typeof t.getFlag != "function")) return ae(t) ? t : void 0;
}
function U(e) {
	e.catch(_);
}
async function yr(e, t, n, r) {
	if (!W(r) || typeof e != "object" || !e || typeof t != "object" || !t || !("disabled" in t)) return;
	let i = e, a = i.flags?.[y];
	if (i.parent?.documentName !== "Item" || a?.lightAutomation !== !0) return;
	let o = Array.isArray(i.scripts) ? i.scripts : [];
	await Promise.all(o.filter((e) => e.trigger === "updateDocument" && e.options?.runIfDisabled === !0).map((e) => e.execute({
		data: t,
		document: i,
		options: n,
		type: "effect",
		user: r
	})));
}
function br(e) {
	let t = [];
	for (let n of e.itemTypes?.mutation ?? []) {
		let e = n.flags?.[y];
		if (!(e?.mutantsHandbookRetired === !0 || e?.mutantsHandbookPossessionRemoved === !0)) for (let e of n.effects ?? []) e.flags?.drowsy?.lightAutomation === !0 && e.active !== !1 && e.disabled !== !0 && e._source?.disabled !== !0 && t.push(e);
	}
	return t;
}
async function xr(e) {
	if (game?.user.isUniqueGM !== !0 || typeof e != "object" || !e) return;
	let t = /* @__PURE__ */ new Set();
	for (let n of e.scene?.tokens ?? []) n.actor && t.add(n.actor);
	for (let e of t) for (let t of br(e)) {
		let e = Array.isArray(t.scripts) ? t.scripts : [];
		for (let t of e) t.trigger === "immediate" && await t.execute({});
	}
}
function Sr(e) {
	let t = e.flags?.[y]?.mutationAutomation;
	return typeof t == "object" && t && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
async function Cr(e) {
	let t = Sr(e);
	t && e.actor && await mn(e.actor, t), e.actor && await ue(e.actor.uuid, e.id);
}
function W(e) {
	return typeof e == "string" && game?.user.id === e;
}
async function wr(e, t = {}) {
	e.actor && !await _e(e) && e.name.trim().toLowerCase() === "chimeran curse" && t.mutationAcquisitionHandlesChimeranRetirement !== !0 && await r(e.actor);
}
function Tr() {
	Hooks.on("canvasReady", (e) => {
		U(xr(e));
	}), Hooks.on("updateActiveEffect", (e, t, n, r) => {
		U(yr(e, t, n, r));
	}), Hooks.on("createItem", (e, t, n) => {
		if (!W(n)) return;
		let r = gr(e) ?? vr(e);
		r?.actor && U(wr(r, typeof t == "object" && t ? t : {}));
	}), Hooks.on("deleteItem", (e, t, n) => {
		if (!W(n)) return;
		let r = gr(e);
		if (r?.actor) {
			U(Cr(r));
			return;
		}
		let i = _r(e);
		i?.actor && U(v(i.actor.uuid));
	}), Hooks.on("updateItem", (e, t, n, r) => {
		if (!W(r)) return;
		let i = gr(e), a = i?.flags?.[y];
		i?.actor && (a?.mutantsHandbookRetired === !0 || a?.mutantsHandbookPossessionRemoved === !0) && U(Cr(i));
	});
}
//#endregion
//#region src/module/wfrp/mutants-handbook/automation/migration.ts
var Er = `${h}.special-r11-mutants-items`, Dr = "The Mutant's Handbook", Or = 7, kr = new Set(["nqE2hnmX2A3Mg5I1", "mNNavbJayRcsyeXJ"]), Ar = new Set([
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
function G(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function K(e) {
	return e.toObject();
}
function q(e) {
	let t = e.flags;
	if (!G(t)) return {};
	let n = t[y];
	return G(n) ? n : {};
}
function J(e) {
	let t = e.effects;
	return Array.isArray(t) ? t.filter(G) : [];
}
function Y(e) {
	return Array.isArray(e) ? e.map(Y) : G(e) ? Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t)).map(([e, t]) => [e, Y(t)])) : e;
}
function jr(e, t) {
	return JSON.stringify(Y(e)) === JSON.stringify(Y(t));
}
function Mr(e) {
	let t = { ...e };
	return delete t._key, delete t._stats, t;
}
function Nr(e, t) {
	let n = new Map(J(e).filter(X).map((e) => [e._id, e]));
	return J(t).filter(X).map((e) => {
		let t = n.get(e._id);
		return t && typeof t.disabled == "boolean" ? {
			...e,
			disabled: t.disabled
		} : e;
	});
}
function X(e) {
	let t = e.flags;
	if (!G(t)) return !1;
	let n = t[y];
	return G(n) && typeof n.automationPhase == "string";
}
function Pr(e, t) {
	if (!G(e)) return t;
	let n = Object.fromEntries(Object.entries(e).filter(([e]) => !Ar.has(e))), r = e.version, i = t.version, a = t.definitionId, o = n.state, s = G(o) ? o.acquisition : void 0;
	return typeof r == "number" && r < Or && typeof i == "number" && i >= Or && typeof a == "string" && kr.has(a) && G(o) && G(s) && s.status === "resolved" && (n = {
		...n,
		state: {
			...o,
			acquisition: {
				...s,
				grants: [],
				modifiers: [],
				status: "pending"
			}
		}
	}), {
		...t,
		...n
	};
}
function Fr(e, t) {
	let n = q(t).mutationAutomation;
	if (!G(n)) return;
	let r = q(e).mutationAutomation, i = Pr(r, n), a = J(e).filter(X), o = Nr(e, t), s = [...o, ...J(e).filter((e) => !X(e))], c = {};
	return jr(r, i) || (c[`flags.${y}.mutationAutomation`] = i), jr(a.map(Mr), o.map(Mr)) || (c.effects = s), Object.keys(c).length > 0 ? c : void 0;
}
function Ir(e) {
	return G(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.toObject == "function" : !1;
}
function Lr(e) {
	let t = q(K(e)).mutationAutomation;
	return G(t) && typeof t.definitionId == "string" ? t.definitionId : void 0;
}
function Rr(e) {
	let t = q(K(e)).mutationAutomation;
	if (!G(t)) return !1;
	let n = t.definitionId, r = t.state, i = G(r) ? r.acquisition : void 0;
	return typeof n == "string" && kr.has(n) && G(i) && i.status === "pending";
}
function zr(e) {
	return q(K(e)).sourceDocument === Dr;
}
function Br(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of e) n.set(t.uuid, t);
	for (let e of t) for (let t of e.tokens ?? []) t.actor && n.set(t.actor.uuid, t.actor);
	return [...n.values()];
}
async function Vr(e, t) {
	if (!e.deleteEmbeddedDocuments || !e.createEmbeddedDocuments) throw Error(`${e.name} does not support embedded Active Effect migration.`);
	let n = J(K(e)).filter(X), r = n.map((e) => e._id).filter((e) => typeof e == "string");
	if (r.length !== n.length) throw Error(`${e.name} has a managed Active Effect without an ID.`);
	let i = Nr(K(e), K(t)).map((e) => {
		let t = { ...e };
		return delete t._key, t;
	});
	r.length > 0 && await e.deleteEmbeddedDocuments("ActiveEffect", r), i.length > 0 && await e.createEmbeddedDocuments("ActiveEffect", i, {
		keepId: !0,
		skipMutationAcquisition: !0
	});
}
async function Hr() {
	if (!game || game.user.isUniqueGM !== !0) return;
	let t = game.packs.get(Er);
	if (!t) throw Error(`The required compendium ${Er} is unavailable.`);
	let n = (await t.getDocuments()).filter(Ir), r = new Map(n.map((e) => [Lr(e) ?? e.id, e])), i = new Map(n.map((e) => [e.name, e])), a = Br(game.actors ?? [], game.scenes ?? []);
	for (let t of a) {
		await e(t);
		let n = [], a = [];
		for (let e of Array.from(t.items).filter(Ir)) {
			let t = (Lr(e) ? r.get(Lr(e)) : void 0) ?? (zr(e) ? i.get(e.name) : void 0);
			if (!t) continue;
			let o = Fr(K(e), K(t));
			o && ("effects" in o && (a.push({
				owned: e,
				source: t
			}), delete o.effects), Object.keys(o).length > 0 && n.push({
				_id: e.id,
				...o
			}));
		}
		n.length > 0 && await t.updateEmbeddedDocuments("Item", n);
		for (let e of a) await Vr(e.owned, e.source);
		let o = Array.from(t.items).filter(Ir).filter(Rr);
		if (o.length > 0) {
			let { resolveOwnedMutationAcquisition: e } = await import("../runtime-uh9Ji-44.js");
			for (let t of o) {
				if (!t.uuid) throw Error(`${t.name} has no UUID for acquisition repair.`);
				await e(t.uuid);
			}
		}
		await v(t.uuid);
	}
}
//#endregion
//#region src/module/wfrp/mutants-handbook/replacement.ts
var Ur = Symbol.for(`${h}.mutantsHandbookReplacement`);
function Wr() {
	let e = CONFIG.Actor.dataModels.character.prototype;
	if (e[Ur] === !0) return;
	let t = e.checkCorruption;
	if (typeof t != "function") throw Error("WFRP4e's character corruption check is unavailable.");
	Object.defineProperty(e, Ur, { value: !0 }), e.checkCorruption = async function() {
		if (!nr()) {
			await t.call(this);
			return;
		}
		try {
			await ut(this.parent);
		} catch (e) {
			_(e);
		}
	};
}
var Gr = "wfrp4e-customizer-apps.species", Kr = "fvtt-wfrp-ratter.ratter-species", Z = "Ratter Species requires Drowsy's WFRP4e Customizers to be enabled and its Species Item type registered. Enable Customizers and reload the world before opening or importing these Items.";
function Q(e) {
	return e.modules.get("wfrp4e-customizer-apps")?.active === !0 && typeof e.models[Gr] == "function";
}
var qr = /* @__PURE__ */ new WeakSet(), Jr = /* @__PURE__ */ new WeakSet();
function Yr(e, t, n) {
	if (Jr.has(e)) return;
	Jr.add(e);
	let r = e.importFromCompendium;
	e.importFromCompendium = async function(e, i, ...a) {
		return e.collection === "fvtt-wfrp-ratter.ratter-species" && !t() ? (n(Z), null) : r.call(this, e, i, ...a);
	};
}
function Xr(e, t, n) {
	if (!qr.has(e)) {
		qr.add(e);
		for (let r of [
			"getDocument",
			"getDocuments",
			"importAll",
			"importDialog"
		]) {
			let i = e[r];
			e[r] = async function(...e) {
				return t() ? i.apply(this, e) : (n(Z), r === "getDocuments" || r === "importAll" ? [] : null);
			};
		}
	}
}
function Zr(e) {
	return e.type === Gr && e.flags?.drowsy?.speciesTemplate?.version === 1;
}
async function Qr(e, t, n, r, i) {
	let a = `Compendium.${t}.${n}.`;
	if (!e?.startsWith(a)) return;
	let o = e.slice(a.length);
	if (!/^[A-Za-z0-9]{16}$/.test(o)) throw Error(`Invalid Ratter species dependency: ${e}`);
	let s = r.contents.find((t) => t._stats?.compendiumSource === e), c = i.get(t);
	if (!c) throw Error(`Missing Ratter dependency pack: ${t}`);
	let l = s ?? await r.importFromCompendium(c, o);
	if (!l) throw Error(`Could not import Ratter species dependency: ${e}`);
	return {
		uuid: l.uuid,
		id: l.id,
		name: l.name
	};
}
async function $r(e, t) {
	if (e.parent || e.pack || !Zr(e) || !Q(t)) return !1;
	let n = {}, r = await Qr(e.system?.subspeciesOf?.uuid, Kr, "Item", t.items, t.packs), i = await Qr(e.system?.tables?.career?.uuid, "fvtt-wfrp-ratter.ratter-10-tables", "RollTable", t.tables, t.packs);
	return r && (n["system.subspeciesOf"] = r), i && (n["system.tables.career"] = i), Object.keys(n).length ? (await e.update(n), !0) : !1;
}
function $() {
	let e = Reflect.get(globalThis, "game"), t = Reflect.get(globalThis, "CONFIG");
	return {
		modules: e.modules,
		models: t.Item.dataModels,
		packs: e.packs,
		items: e.items,
		tables: e.tables
	};
}
function ei() {
	let e = () => {
		let e = game?.packs.get(Kr);
		e && Xr(e, () => Q($()), (e) => ui.notifications.warn(e)), Yr($().items, () => Q($()), (e) => ui.notifications.warn(e));
	};
	Hooks.on("setup", e), Hooks.once("ready", () => {
		e(), game?.user.isGM && !Q($()) && ui.notifications.warn(Z);
	});
	let t = /* @__PURE__ */ new WeakSet();
	Hooks.on("renderCompendium", (e, n) => {
		if (!(e.collection?.collection !== "fvtt-wfrp-ratter.ratter-species" || !(n instanceof HTMLElement) || t.has(n))) {
			t.add(n);
			for (let e of [
				"click",
				"contextmenu",
				"dragstart"
			]) n.addEventListener(e, (e) => {
				Q($()) || !(e.target instanceof Element) || !e.target.closest("[data-entry-id]") || (e.preventDefault(), e.stopImmediatePropagation(), ui.notifications.warn(Z));
			}, { capture: !0 });
		}
	});
	let n = /* @__PURE__ */ new Set(), r = !1, i = async () => {
		if (r) return;
		r = !0;
		let e = !1;
		try {
			for (; n.size;) {
				let t = n.values().next().value;
				if (!t) break;
				n.delete(t), e = await $r(t, $()) || e;
			}
			e && ui.notifications.warn("Ratter species imported and world references linked. Reload the world to register Vampire and its bloodlines in Customizers character creation. Choose a starting bloodline gift and five different Weaknesses manually.");
		} catch (e) {
			n.clear(), ui.notifications.error(`Ratter species references could not be linked: ${e instanceof Error ? e.message : String(e)}. Correct the world parent/career references before reloading.`);
		} finally {
			r = !1;
		}
	};
	Hooks.on("createItem", (e, t, r) => {
		let a = e;
		r !== game?.user.id || !game?.user.isGM || a.parent || a.pack || !Zr(a) || (n.add(a), Promise.resolve().then(i));
	});
}
//#endregion
//#region src/module/init/register-hooks.ts
function ti() {
	Hooks.once("init", () => {
		tr(), $n(), hr(), ct(), Tr(), kn(), ei();
	}), Hooks.once("setup", () => {
		ir();
	}), Hooks.once("ready", async () => {
		Wr();
		try {
			await pr();
		} catch (e) {
			console.error("Ratter Compendium sidebar tidy-up failed.", e), ui.notifications.error("Ratter Compendium cleanup failed and may be incomplete. See the console for details.");
		}
		try {
			await Hr(), await xr(Reflect.get(globalThis, "canvas"));
		} catch (e) {
			_(e);
		}
	});
}
//#endregion
//#region src/module/init/index.ts
ti();
//#endregion

//# sourceMappingURL=fvtt-wfrp-ratter.mjs.map