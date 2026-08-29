import { B as e, F as t, I as n, K as r, L as i, M as a, N as o, O as s, P as c, R as l, V as u, l as d, n as f, r as p, rt as m, w as h, z as g } from "./mutation-drop-Bc32Aq0J.js";
//#region src/module/wfrp4e/mutants-handbook/acquisition-eligibility.ts
var ee = new Set([
	"bachtrachian suckers",
	"bestial legs",
	"centauroid",
	"clubfoot",
	"hopper",
	"prehensile feet",
	"unnatural legs"
]);
function te(t, r) {
	let a = new Set(["left", "right"]), s = !1;
	for (let n of o(t, r)) {
		let t = g(n.name), r = e(n);
		if (t === "razor-sharp claws" && a.clear(), t === "pincer claw") {
			let e = u(r?.["pincer-hand"]);
			e.length === 0 && (s = !0);
			for (let t of e) (t === "left" || t === "right") && a.delete(t);
		}
		if (t === "beweaponed extremities") {
			let e = u(r?.arms);
			if (e.includes("both")) a.clear();
			else if (e.includes("one")) {
				let e = u(r?.["weapon-side"]);
				e.length === 0 && (s = !0);
				for (let t of e) (t === "left" || t === "right") && a.delete(t);
			} else s = !0;
		}
		if (t === "atrophy" && i(n, "atrophied-part", ["arm", "hand"])) {
			let e = u(r?.["atrophy-side"]);
			e.length === 0 && (s = !0);
			for (let t of e) (t === "left" || t === "right") && a.delete(t);
		}
	}
	return {
		ambiguous: s,
		extraArms: n(t, r),
		primaryHands: a
	};
}
function _(e, t, n, r, a) {
	return o(e, a).some((e) => g(e.name) === g(t) && i(e, n, r));
}
function v(e) {
	return {
		kind: "eligibility",
		message: e
	};
}
function ne(e, r, o) {
	let u = g(r.name), d = [];
	if (u === "chosen one" && l(e, "Arcane Magic") && d.push(v(`${r.name} cannot be acquired with Arcane Magic.`)), u === "false wizard") {
		s(e) === "khorne" && d.push(v(`${r.name} cannot be acquired by a Chosen of Khorne.`));
		let t = ["Bless", "Invoke"].filter((t) => l(e, t));
		t.length > 0 && d.push(v(`${r.name} cannot be acquired with ${t.join(" or ")}.`));
	}
	if (u === "malign sorcerer" && s(e) === "khorne" && d.push(v(`${r.name} cannot be acquired with Khorne as patron.`)), u === "prince of nothing") {
		let t = c(e);
		t === "noble" ? d.push(v(`${r.name} cannot be acquired by an actual Noble.`)) : t === void 0 && d.push(v(`Confirm that ${e.name} is not an actual Noble before acquiring ${r.name}.`));
	}
	if (u === "headless") {
		let t = a(e, "Elongated Limbs", o);
		t && i(t, "limb", ["neck"]) && d.push(v(`${r.name} cannot be acquired with Elongated Limbs (Neck).`));
	}
	if (u === "wings" && _(e, "Wings", "wing-size", ["huge"], o) && d.push(v(`${r.name} cannot be acquired again after reaching Huge wings.`)), u === "beweaponed extremities" && _(e, "Beweaponed Extremities", "arms", ["both"], o) && d.push(v(`${r.name} cannot be acquired again because a prior acquisition transformed both arms.`)), u === "pincer claw" || u === "razor-sharp claws") {
		let t = te(e, o);
		t.primaryHands.size === 0 && !t.extraArms && !t.ambiguous ? d.push(v(`${r.name} requires at least one ordinary clawless hand.`)) : (t.primaryHands.size === 0 || t.extraArms || t.ambiguous) && d.push(v(`Confirm that ${e.name} has an ordinary clawless hand that can receive ${r.name}; non-left/right or legacy hand anatomy cannot be inferred safely.`));
	}
	return u === "overgrown arm" && n(e, o) && d.push(v(`Confirm which arm receives ${r.name}; resolved extra arms are not limited to the tracked left/right choices.`)), ee.has(u) && a(e, "Blob", o) && !t(e, o) && d.push(v(`${r.name} alters legs, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), d;
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition-blocks.ts
var re = {
	"additional appendages": ["location", ["foot"]],
	atrophy: ["atrophied-part", [
		"foot",
		"leg",
		"toes"
	]],
	"elongated limbs": ["limb", ["legs"]],
	"extra joints": ["jointed-limbs", ["legs"]]
}, ie = {
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
function y(e) {
	return e.filter((t, n) => e.findIndex((e) => e.kind === t.kind && e.message === t.message) === n);
}
function ae(e, t, n) {
	let r = o(e, n), i = r.filter((e) => g(e.name) === g(t.name)).length, a = t.acquisition?.max, s = [];
	a !== void 0 && i >= a && s.push({
		kind: "maximum",
		message: `${t.name} has reached its acquisition maximum of ${a}.`
	}), s.push(...ne(e, t, n));
	for (let e of t.acquisition?.conflicts ?? []) r.some((t) => g(t.name) === g(e)) && s.push({
		kind: "conflict",
		message: `${t.name} conflicts with the existing ${e} mutation.`
	});
	return y(s);
}
function oe(e, n, r, i) {
	if (r.status !== "resolved") return [];
	let o = g(n), s = [];
	o === "elongated limbs" && u(r.selections.limb).includes("neck") && a(e, "Headless", i) && s.push(v(`${n} (Neck) cannot be acquired with Headless.`));
	let c = re[o];
	if (c && u(r.selections[c[0]]).some((e) => c[1].includes(e)) && a(e, "Blob", i) && !t(e, i) && s.push(v(`${n} selected a leg-altering result, but ${e.name} has Blob and no resolved Additional Extremities (Legs).`)), o === "questing eye") {
		let e = r.selections["questing-eye"], t = typeof e == "string" && e.trim().length > 0 ? `“${e.trim()}” is` : "the chosen eye is";
		s.push(v(`Confirm that ${t} an existing eye available to receive ${n}; exact eye anatomy is not reliably detectable.`));
	}
	if (a(e, "Hairless", i)) {
		let e = ie[o];
		(o === "protective skin" && u(r.selections.skin).includes("fur") || e !== void 0 && u(r.selections["bestial-source"]).some((t) => e.includes(t))) && s.push(v(`${n} selected a hair or fur result, but Hairless prevents that manifestation; confirm whether to keep or reroll it.`));
	}
	return y(s);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/dialog.ts
function b(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#39;");
}
async function se(e) {
	let t = e.options.filter((e) => e.description), n = [...t.length ? [
		"<ul class=\"tw:flex tw:flex-col tw:gap-2\">",
		...t.map((e) => `<li><strong>${b(e.label)}</strong><div class="tw:text-sm tw:opacity-70">${b(e.description ?? "")}</div></li>`),
		"</ul>"
	] : []];
	if (e.options.length > 4) {
		let t = [
			"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-2\">",
			"<fieldset class=\"tw:dui-fieldset\">",
			`<legend class="tw:dui-fieldset-legend">${b(e.prompt)}</legend>`,
			"<select class=\"tw:dui-select tw:w-full\" name=\"mutation-acquisition-choice\">",
			...e.options.map((e) => `<option value="${b(e.id)}">${b(e.label)}</option>`),
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
		`<p>${b(e.prompt)}</p>`,
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
async function ce(e, t) {
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
		content: `<fieldset class="fvtt-wfrp-ratter-root tw:dui-fieldset"><legend class="tw:dui-fieldset-legend">${b(e)}</legend><input class="tw:dui-input tw:w-full" name="mutation-acquisition-value" type="text" autocomplete="off" required></fieldset>`,
		rejectClose: !1,
		window: { title: t }
	});
	return typeof n == "string" && n.length > 0 ? n : void 0;
}
function x(e) {
	return typeof e == "object" && !!e && "draw" in e;
}
async function S(e, t, n) {
	if (n) {
		let e = await fromUuid(n);
		if (!x(e)) throw Error(`${t}: required RollTable is unavailable.`);
		let r = await e.draw({
			displayChat: !0,
			messageMode: "gm",
			recursive: !1
		}), i = r.roll.total;
		if (typeof i != "number" || !Number.isFinite(i)) throw Error(`${t}: RollTable did not produce a finite total.`);
		let a = r.results.length === 1 ? r.results[0]?.flags?.[m]?.acquisitionOptionId : void 0;
		return {
			...typeof a == "string" ? { optionId: a } : {},
			total: i
		};
	}
	let r = new Roll(e);
	await r.evaluate({ allowInteractive: !1 });
	let i = r.total;
	if (typeof i != "number" || !Number.isFinite(i)) throw Error(`Acquisition roll ${e} did not produce a finite total.`);
	return {
		announce: async () => {
			await r.toMessage({ flavor: t });
		},
		total: i
	};
}
var C = {
	choose: se,
	input: ({ prompt: e, title: t }) => ce(e, t),
	roll: S
};
function w(e) {
	return Object.entries(e).map(([e, t]) => `<div><dt class="tw:font-semibold">${b(e)}</dt><dd>${b(Array.isArray(t) ? t.join(", ") : String(t))}</dd></div>`);
}
async function le(e, t) {
	let n = (t.acceptedBlocks ?? []).map((e) => `<li><span>${b(e.message)}</span></li>`), r = [
		"<div class=\"fvtt-wfrp-ratter-root tw:flex tw:flex-col tw:gap-3\">",
		"<p>This mutation already has a resolved acquisition. Keep it, or explicitly reconfigure its stored results.</p>",
		"<dl class=\"tw:grid tw:grid-cols-2 tw:gap-2\">",
		...w(t.selections),
		...w(t.rolls),
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
//#region src/module/wfrp4e/mutants-handbook/acquisition/values.ts
function T(e, t, n) {
	let r = e[t];
	return Array.isArray(r) ? r[n] : n === 0 ? r : void 0;
}
function ue(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let t of n) {
		let n = t.selections[e];
		for (let e of Array.isArray(n) ? n : n === void 0 ? [] : [n]) r.add(e);
	}
	return t.filter((e) => !r.has(e.id));
}
function E(e, t, n, r) {
	let i = e[t], a = Array.isArray(i) ? [...i] : i === void 0 ? [] : [i];
	a[n] = r, e[t] = a.length === 1 ? a[0] : a;
}
function de(e, t) {
	let n = e;
	for (let e of t) {
		if (typeof n != "object" || !n) return;
		n = n[e];
	}
	return n;
}
function fe(e, t, n) {
	return de({
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
function D(e, t) {
	return Array.isArray(e) || Array.isArray(t) ? JSON.stringify(e) === JSON.stringify(t) : e === t;
}
function O(e, t, n) {
	return (e ?? []).every((e) => {
		let r = fe(e, t, n), i = e.value;
		switch (e.operator) {
			case "equals": return D(r, i);
			case "notEquals": return !D(r, i);
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
function k(e) {
	let { ranks: t, ...n } = e;
	return n;
}
function pe(e, t) {
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
	if (JSON.stringify(k(r)) !== JSON.stringify(k(t))) throw Error(`Acquisition grants reuse the incompatible key ${t.key}.`);
	t.stack === "rank" && (e[n] = {
		...r,
		ranks: (r.ranks ?? 1) + (t.ranks ?? 1)
	});
}
function me(e, t) {
	let n = e.findIndex((e) => e.key === t.key);
	if (n < 0) {
		e.push({ ...t });
		return;
	}
	if (JSON.stringify(e[n]) !== JSON.stringify(t)) throw Error(`Acquisition modifiers reuse the incompatible key ${t.key}.`);
}
function A(e, t) {
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
function he(e) {
	let t = new Set(e.modifiers.map((e) => e.key));
	return Object.fromEntries(Object.entries(e.rolls).filter(([e, n]) => t.has(e) && typeof n == "number" && Number.isFinite(n)));
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/materialize.ts
function ge(e, t, n) {
	let { roll: r, ...i } = e;
	return {
		...i,
		key: t,
		...n === void 0 ? {} : { value: n }
	};
}
function _e(e, t, n) {
	let r = (r) => r.replaceAll(/{{([^{}]+)}}/g, (r, i) => {
		let a = T(t.selections, i.trim(), n);
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
async function ve(e, t, n, r) {
	for (let t of r.grants ?? []) pe(e.state.grants, _e(t, e.state, n));
	for (let i of r.modifiers ?? []) {
		let r = `${t.key}:${e.state.occurrence}:${n + 1}:${i.key}`, a = "roll" in i ? i.roll : void 0, o = e.state.rolls[r];
		if (Array.isArray(o) && (o = o[0]), a && (typeof o != "number" || !Number.isFinite(o))) {
			let n = await e.services.roll(a, `${e.mutationName}: ${t.prompt}`);
			o = n.total, e.state.rolls[r] = o, n.announce && e.announcements.push(n.announce);
		}
		if (a && (typeof o != "number" || !Number.isFinite(o))) throw Error(`The acquisition modifier ${i.key} did not resolve a roll.`);
		let s = ge(i, r, a ? o : void 0);
		me(e.state.modifiers, s), a && typeof o == "number" && (e.topLevelRolls[r] = o);
	}
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/signals.ts
var j = Symbol("acquisition-cancelled"), M = {
	depth: 8,
	resolutions: 32,
	tableRolls: 20
}, N = class {
	block;
	constructor(e) {
		this.block = e;
	}
};
function P(e, t, n, r) {
	return {
		kind: n,
		message: `${e}: ${t} ${r}.`
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/state.ts
function F(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var ye = new Set([
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
]), be = new Set([
	"ceil",
	"floor",
	"round"
]);
function I(e, t) {
	let n = new Set(t);
	return Object.keys(e).every((e) => n.has(e));
}
function xe(e) {
	return typeof e == "string" && e.trim().length > 0 && e.length <= 256;
}
function L(e) {
	return typeof e == "number" && Number.isFinite(e);
}
function R(e) {
	return typeof e == "string" && ye.has(e);
}
function z(e) {
	return e === void 0 || e === "first";
}
function B(e) {
	let t = e.roll;
	return (typeof t == "string" && t.trim().length > 0) !== L(e.value);
}
function Se(e) {
	return e === void 0 || Array.isArray(e) && e.every((e) => typeof e == "string" && e.trim().length > 0);
}
function Ce(e) {
	return e === void 0 || Array.isArray(e) && e.every(R);
}
function we(e) {
	if (!F(e) || !xe(e.key) || typeof e.kind != "string") return;
	let t = e.key;
	switch (e.kind) {
		case "characteristic": return !I(e, [
			"characteristic",
			"key",
			"kind",
			"roll",
			"scope",
			"value"
		]) || !R(e.characteristic) || !z(e.scope) || !B(e) ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristic",
			...typeof e.roll == "string" ? { roll: e.roll } : {},
			...e.scope === "first" ? { scope: "first" } : {},
			...L(e.value) ? { value: e.value } : {}
		};
		case "characteristicCap": return !I(e, [
			"characteristic",
			"key",
			"kind",
			"maximum"
		]) || !R(e.characteristic) || !L(e.maximum) || e.maximum < 0 ? void 0 : {
			characteristic: e.characteristic,
			key: t,
			kind: "characteristicCap",
			maximum: e.maximum
		};
		case "move":
		case "status": return !I(e, [
			"key",
			"kind",
			"scope",
			"value"
		]) || !z(e.scope) || !L(e.value) ? void 0 : {
			key: t,
			kind: e.kind,
			...e.scope === "first" ? { scope: "first" } : {},
			value: e.value
		};
		case "moveMultiplier": return !I(e, [
			"key",
			"kind",
			"round",
			"value"
		]) || typeof e.round != "string" || !be.has(e.round) || !L(e.value) ? void 0 : {
			key: t,
			kind: "moveMultiplier",
			round: e.round,
			value: e.value
		};
		case "sizeStep": return !I(e, [
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
			return !I(e, [
				"characteristics",
				"key",
				"kind",
				"roll",
				"skills",
				"value"
			]) || !Se(n) || !Ce(r) || !(n?.length || r?.length) || !B(e) ? void 0 : {
				...r ? { characteristics: [...r] } : {},
				key: t,
				kind: "test",
				...typeof e.roll == "string" ? { roll: e.roll } : {},
				...n ? { skills: [...n] } : {},
				...L(e.value) ? { value: e.value } : {}
			};
		}
		case "wounds": return !I(e, [
			"key",
			"kind",
			"value"
		]) || !L(e.value) ? void 0 : {
			key: t,
			kind: "wounds",
			value: e.value
		};
		default: return;
	}
}
function Te(e) {
	return !F(e) || typeof e.message != "string" ? !1 : [
		"conflict",
		"eligibility",
		"exhausted",
		"maximum"
	].includes(String(e.kind));
}
function V(...e) {
	let t = e.flatMap((e) => e ?? []).filter(Te);
	return t.filter((e, n) => t.findIndex((t) => t.kind === e.kind && t.message === e.message) === n);
}
function H(e, t) {
	if (!F(e)) return !1;
	let n = (e) => typeof e === t && (t !== "number" || Number.isFinite(e));
	return Object.values(e).every((e) => n(e) || Array.isArray(e) && e.every(n));
}
function U(e) {
	if (!F(e) || e.version !== 1 || e.status !== "pending" && e.status !== "resolved" || !Number.isSafeInteger(e.occurrence) || Number(e.occurrence) < 1 || !H(e.rolls, "number") || !H(e.selections, "string") || !Array.isArray(e.grants)) return;
	let t = Array.isArray(e.modifiers) ? e.modifiers.map(we).filter((e) => e !== void 0) : [];
	return {
		acceptedBlocks: V(Array.isArray(e.acceptedBlocks) ? e.acceptedBlocks : void 0),
		grants: e.grants,
		modifiers: t,
		occurrence: Number(e.occurrence),
		rolls: e.rolls,
		selections: e.selections,
		status: e.status,
		version: 1
	};
}
function W(e) {
	let t = e.getFlag(m, "mutationAutomation");
	return F(t) && F(t.acquisition) ? t : void 0;
}
function G(e, t) {
	return e.some((e) => e.kind === t.kind && e.message === t.message);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/progression.ts
function K(e, t, n, r, i, a) {
	if (!r) throw Error(`Acquisition step ${n.key} has no fallback option.`);
	let o = P(e.mutationName, n.prompt, i, a);
	if (G(t.acceptedBlocks ?? [], o)) return r;
	throw new N(o);
}
function Ee(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = T(a?.occurrence === e.occurrence - 1 ? a.selections : {}, n.key, r), s = i.findIndex((e) => e.id === o);
	return s < 0 ? K(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : s >= i.length - 1 ? K(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1];
}
function De(e, t, n, r, i) {
	let a = e.previousStates?.at(-1), o = T(a?.selections ?? {}, n.key, r) ?? n.initial, s = i.findIndex((e) => e.id === o);
	return s < 0 ? K(e, t, n, i[0], "eligibility", "cannot advance because no earlier resolved result is available") : O(n.advanceWhen, t, e.facts ?? {}) ? s >= i.length - 1 ? K(e, t, n, i[s], "exhausted", "has no further result remaining") : i[s + 1] : i[s];
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/repeat.ts
function Oe(e, t, n) {
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
async function ke(e) {
	let { executionIndex: t, mutationName: n, previousStates: r, services: i, state: a, step: o } = e;
	if (T(a.selections, o.key, t) !== void 0) return;
	let s;
	a.occurrence > 1 && o.repeat === "copy-first" && (s = T(r.find((e) => e.occurrence === 1)?.selections ?? {}, o.key, t));
	let c = new Set(r.flatMap((e) => {
		let t = e.selections[o.key];
		return Array.isArray(t) ? t : t === void 0 ? [] : [t];
	})), l;
	for (let e = 0; s === void 0 && e < 10; e += 1) {
		let e = await i.input({
			prompt: o.prompt,
			title: n
		});
		if (e === void 0) throw j;
		l = e, (o.repeat !== "unique" || !c.has(e)) && (s = e);
	}
	if (s === void 0) {
		let e = P(n, o.prompt, "exhausted", "has no unique value remaining");
		if (!G(a.acceptedBlocks ?? [], e)) throw new N(e);
		s = l;
	}
	if (s === void 0) throw Error(`Acquisition step ${o.key} has no text fallback.`);
	E(a.selections, o.key, t, s);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/engine.ts
var Ae = class {
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
		this.request = e, this.services = t, this.previous = e.previousStates ?? [], this.facts = e.facts ?? {}, this.state = A(e.initialState, e.occurrence), this.state.acceptedBlocks = V(this.state.acceptedBlocks, e.acceptedBlocks), this.stepsByKey = new Map((e.steps ?? []).map((e) => [e.key, e]));
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
			if (e === j) return { status: "cancelled" };
			if (e instanceof N) return {
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
		if (t > M.depth) throw Error("Mutation acquisition nesting exceeds its safe limit.");
		if (!O(e.when, this.state, this.facts)) return;
		let n = Oe(e, this.request.occurrence, this.previous);
		if (n) {
			let t = P(this.request.mutationName, e.prompt, "eligibility", n);
			if (!G(this.state.acceptedBlocks ?? [], t)) throw new N(t);
		}
		let r = Math.max(1, Math.trunc(e.count ?? 1));
		for (let n = 0; n < r; n += 1) await this.resolveStep(e, t);
	}
	async resolveStep(e, t) {
		if (this.resolutions += 1, this.resolutions > M.resolutions) throw Error("Mutation acquisition contains too many nested resolutions.");
		let n = this.executionCounts.get(e.key) ?? 0;
		if (this.executionCounts.set(e.key, n + 1), e.kind === "text") {
			await ke({
				executionIndex: n,
				mutationName: this.request.mutationName,
				previousStates: this.previous,
				services: this.services,
				state: this.state,
				step: e
			});
			return;
		}
		let r = (e.options ?? []).filter((e) => O(e.when, this.state, this.facts));
		if (r.length === 0) throw Error(`Acquisition step ${e.key} has no options.`);
		let i = T(this.state.selections, e.key, n), a = i ? r.find((e) => e.id === i) : await this.resolveOption(e, n, r);
		if (!a) throw Error(`Acquisition step ${e.key} retained an unknown option.`);
		if (E(this.state.selections, e.key, n, a.id), a.next) {
			let n = this.stepsByKey.get(a.next);
			if (!n) throw Error(`Acquisition step ${e.key} references missing ${a.next}.`);
			await this.visit(n, t + 1);
		}
		await ve(this, e, n, a);
	}
	async resolveOption(e, t, n) {
		let r = this.request.occurrence > 1;
		if (!r && e.initial) {
			let t = n.find((t) => t.id === e.initial);
			if (!t) throw Error(`Acquisition step ${e.key} has no initial option.`);
			return t;
		}
		if (r && e.repeat === "copy-first") {
			let r = T(this.previous.find((e) => e.occurrence === 1)?.selections ?? {}, e.key, t), i = n.find((e) => e.id === r);
			if (i) return i;
		}
		if (r && e.repeat === "advance") return Ee(this.request, this.state, e, t, n);
		if (r && e.repeat === "conditional-advance") return De(this.request, this.state, e, t, n);
		let i = r && e.repeat === "unique" ? ue(e.key, n, [...this.previous, this.state]) : n;
		if (i.length === 0) {
			let r = T(this.previous.at(-1)?.selections ?? {}, e.key, t);
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
		for (let r = 0; r < M.tableRolls; r += 1) {
			let r = await this.roll(e.formula ?? "1d100", `${this.request.mutationName}: ${e.prompt}`, e.tableUuid), i = r.optionId ? n.find((e) => e.id === r.optionId) : void 0, a = n.filter((e) => r.total >= (e.min ?? -Infinity) && r.total <= (e.max ?? Infinity));
			if (!i && a.length === 0) continue;
			let o = i ?? (a.length === 1 ? a[0] : await this.choose(e, a));
			return E(this.state.rolls, e.key, t, r.total), r.announce && this.announcements.push(r.announce), o;
		}
		return K(this.request, this.state, e, n.at(-1), "exhausted", "has no further result remaining");
	}
	async choose(e, t) {
		let n = await this.services.choose({
			options: t,
			prompt: e.prompt,
			title: this.request.mutationName
		});
		if (n === void 0) throw j;
		let r = t.find((e) => e.id === n);
		if (!r) throw Error(`Acquisition dialog returned unknown option ${n}.`);
		return r;
	}
	async roll(e, t, n) {
		let r = await this.services.roll(e, t, n);
		if (!Number.isFinite(r.total)) throw Error(`Acquisition roll ${e} was not finite.`);
		return r;
	}
};
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/resolve.ts
async function je(e, t) {
	let n = e.initialState, r = (e.retainedRolls ?? []).every((e) => Number.isFinite(n?.rolls[e.key]));
	if (n?.status !== "resolved" || !r) return new Ae(e, t).run();
	let i = A(n, e.occurrence);
	return i.grants = [...n.grants], i.modifiers = [...n.modifiers], i.acceptedBlocks = V(n.acceptedBlocks, e.acceptedBlocks), i.status = "resolved", {
		announcements: [],
		retainedRolls: {
			...he(i),
			...Object.fromEntries((e.retainedRolls ?? []).map((e) => [e.key, i.rolls[e.key]]))
		},
		state: i,
		status: "resolved"
	};
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/history.ts
function Me(e, t, n) {
	let r = [...e.items].filter((e) => e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookPossessionRemoved") === !0 || e.getFlag("fvtt-wfrp-ratter", "mutantsHandbookRetired") === !0 ? !1 : W(e)?.definitionId === n), i = r.findIndex((e) => e.id === t.id), a = r.flatMap((e, t) => {
		let n = U(W(e)?.state?.acquisition);
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
function q(e) {
	return F(e) ? Object.fromEntries(Object.entries(e).filter((e) => Number.isFinite(e[1]))) : {};
}
function Ne(e) {
	return new Set(e?.modifiers.map((e) => e.key) ?? []);
}
function J(e) {
	return U(e.state?.acquisition);
}
function Pe(e, t, n) {
	let r = q(e.state?.rolls), i = Object.fromEntries((e.retainedRolls ?? []).filter((e) => typeof r[e.key] == "number").map((e) => [e.key, r[e.key]]));
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
function Fe(e, t) {
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
async function Ie(e, t, n, r, i, a, o) {
	let s = F(t.state) ? { ...t.state } : {}, c = q(s.rolls);
	if (i) {
		let e = Ne(a);
		for (let n of t.retainedRolls ?? []) e.add(n.key);
		for (let t of e) delete c[t];
	}
	let l = {
		...s,
		acquisition: n.state,
		rolls: {
			...c,
			...n.retainedRolls
		}
	}, u = { [`flags.${m}.mutationAutomation.state`]: l };
	if (!r) {
		if (!e.updateSource) throw Error(`Foundry cannot stage acquisition state for ${e.name}.`);
		e.updateSource(u);
		return;
	}
	if (!e.update) throw Error(`Foundry cannot update acquisition state for ${e.name}.`);
	await e.update(u, o);
}
//#endregion
//#region src/module/wfrp4e/mutants-handbook/acquisition/runtime.ts
var Le = 8;
function Y(e) {
	return F(e) ? e.type === "mutation" && typeof e.id == "string" && typeof e.name == "string" && typeof e.getFlag == "function" && typeof e.toObject == "function" : !1;
}
function X(e, t) {
	return t.items.has?.(e.id) === !0 ? !0 : t.items.get?.(e.id) !== void 0 || [...t.items].some((t) => t === e);
}
function Re(e) {
	let t = e.mutationAcquisitionAcceptedBlocks;
	return V(Array.isArray(t) ? t : void 0);
}
function Z(e, t) {
	e.mutationAcquisitionAcceptedBlocks = [...t];
}
function Q(e, t = !1) {
	return e.abortItemCreation = !0, e.mutationAcquisitionCancelled = !0, t && (e.mutationAcquisitionRerollRequested = !0), !1;
}
async function $(e, t, n, r, i) {
	for (let a of t) {
		if (G(n, a)) continue;
		let t = await d(e, a, i);
		if (t === "reroll") return Q(r, !0);
		if (t !== "accept") return Q(r);
		n.splice(0, n.length, ...V(n, [a])), Z(r, n);
	}
	return !0;
}
async function ze(e, t, n, i, a, o) {
	let s = r(t.system.mutationType.value);
	if (!s) throw Error(`${t.name} has no physical or mental mutation classification.`);
	let c = ae(e, {
		acquisition: n.acquisition,
		data: t.toObject(),
		name: t.name,
		nature: s
	}, i ? t.id : void 0);
	return $(t.name, c, a, o, o.mutationAcquisitionCanReroll === !0);
}
async function Be(e, t, n) {
	if (n.skipMutationAcquisition === !0 || !Y(e)) return !0;
	let r = h(t) ? t : h(e.actor) ? e.actor : void 0;
	if (!r) return !0;
	if (!await f(e, r, n)) return !1;
	let i = W(e);
	if (!i) return !0;
	let a = X(e, r), o = J(i), s = n.mutationAcquisitionReconfigure === !0, c = Me(r, e, i.definitionId);
	if (s && a && !c.isLatest) return ui.notifications.warn(`${e.name}: only the latest active occurrence can be reconfigured because later results depend on its retained history.`), !1;
	let l = c.occurrence, u = V(o?.acceptedBlocks, Re(n));
	if (Z(n, u), !await ze(r, e, i, a, u, n)) return !1;
	let p = s ? Fe(l, u) : o;
	p ??= Pe(i, l, u);
	let m = [];
	for (let t = 0; t < Le; t += 1) {
		let t = await je({
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
			...p ? { initialState: p } : {},
			mutationName: e.name,
			occurrence: l,
			previousStates: c.previousStates,
			retainedRolls: i.retainedRolls ?? [],
			steps: i.acquisition.steps ?? []
		}, C);
		if (t.status === "cancelled") return Q(n);
		if (m.push(...t.announcements), t.status === "blocked") {
			let r = await d(e.name, t.block, n.mutationAcquisitionCanReroll === !0);
			if (r === "reroll") return Q(n, !0);
			if (r !== "accept") return Q(n);
			u.splice(0, u.length, ...V(u, [t.block])), Z(n, u), p = {
				...t.state,
				acceptedBlocks: [...u]
			};
			continue;
		}
		let f = oe(r, e.name, t.state, a ? e.id : void 0);
		if (!await $(e.name, f, u, n, n.mutationAcquisitionCanReroll === !0)) return !1;
		await Ie(e, i, {
			...t,
			state: {
				...t.state,
				acceptedBlocks: [...u]
			}
		}, a, s, o, n);
		for (let e of m) await e();
		return !0;
	}
	throw Error(`Acquisition review for ${e.name} exceeded its safe limit.`);
}
async function Ve(e) {
	let t = await fromUuid(e);
	if (!Y(t) || !h(t.actor)) throw Error(`The UUID ${e} does not resolve to an owned mutation Item.`);
	let n = W(t);
	if (!n) throw Error(`${t.name} has no Mutant's Handbook automation data.`);
	let r = J(n);
	if (r?.status === "resolved" && await le(t.name, r) === "keep") return !0;
	let i = { ...r?.status === "resolved" ? { mutationAcquisitionReconfigure: !0 } : {} }, a = await Be(t, t.actor, i);
	return a && await p(t.actor.uuid), a;
}
//#endregion
export { Ve as resolveOwnedMutationAcquisition };

//# sourceMappingURL=runtime-CMwf_G8N.js.map