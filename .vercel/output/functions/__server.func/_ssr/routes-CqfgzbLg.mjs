import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as RotateCcw, c as Hourglass, d as Car, f as Camera, i as Search, l as Clock, o as Plus, r as Trash2, s as Pencil, t as Upload, u as Check } from "../_libs/lucide-react.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CqfgzbLg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DB_NAME = "dark-rent";
var STORE = "album";
function albumKey(name) {
	return name.trim().replace(/\s+/g, " ").toLowerCase();
}
function fileStem(key) {
	return (key.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "car").slice(0, 80);
}
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
async function albumGet(name) {
	const key = albumKey(name);
	if (!key || typeof indexedDB === "undefined") return null;
	try {
		const db = await openDb();
		return await new Promise((resolve) => {
			const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
			req.onsuccess = () => resolve(typeof req.result === "string" ? req.result : null);
			req.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}
async function writeNamedFile(key, dataUrl) {
	const storage = navigator.storage;
	if (!storage.getDirectory) return;
	const handle = await (await (await storage.getDirectory()).getDirectoryHandle("dark-rent-album", { create: true })).getFileHandle(`${fileStem(key)}.png`, { create: true });
	const blob = await (await fetch(dataUrl)).blob();
	const writable = await handle.createWritable();
	await writable.write(blob);
	await writable.close();
}
async function albumPut(name, dataUrl) {
	const key = albumKey(name);
	if (!key || !dataUrl || typeof indexedDB === "undefined") return;
	try {
		const db = await openDb();
		await new Promise((resolve) => {
			const tx = db.transaction(STORE, "readwrite");
			tx.objectStore(STORE).put(dataUrl, key);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		});
	} catch {}
	try {
		await writeNamedFile(key, dataUrl);
	} catch {}
}
var API_SERVERS = {
	RU1: "Арбатский",
	RU2: "Тверской",
	RU3: "Кутузовский"
};
var STORAGE_KEY = "garage-db-v1";
var BACKUP_KIND = "garazh-backup";
var BACKUP_MARKER = "===== GARAZH-BACKUP-V1 =====";
var APP_NAME = "Dark Rent";
var TZ = "Europe/Moscow";
var PLATE_LETTERS = "АВЕКМНОРСТУХ";
var LAT_TO_CYR = {
	A: "А",
	B: "В",
	E: "Е",
	K: "К",
	M: "М",
	H: "Н",
	O: "О",
	P: "Р",
	C: "С",
	T: "Т",
	Y: "У",
	X: "Х"
};
function moscowParts(date = /* @__PURE__ */ new Date()) {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: TZ,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		weekday: "short",
		hourCycle: "h23"
	}).formatToParts(date);
	const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
	const year = get("year");
	const month = get("month");
	const day = get("day");
	return {
		year,
		month,
		day,
		hour: get("hour"),
		minute: get("minute"),
		weekday: get("weekday"),
		dateKey: `${year}-${month}-${day}`,
		monthKey: `${year}-${month}`
	};
}
function weekKey(date = /* @__PURE__ */ new Date()) {
	const weekday = {
		Mon: 0,
		Tue: 1,
		Wed: 2,
		Thu: 3,
		Fri: 4,
		Sat: 5,
		Sun: 6
	}[moscowParts(date).weekday] ?? 0;
	return moscowParts(/* @__PURE__ */ new Date(date.getTime() - weekday * 864e5)).dateKey;
}
function periodKeys(date = /* @__PURE__ */ new Date()) {
	const t = moscowParts(date);
	return {
		todayKey: t.dateKey,
		weekKey: weekKey(date),
		monthKey: t.monthKey
	};
}
function formatDate(at) {
	return new Intl.DateTimeFormat("ru-RU", {
		timeZone: TZ,
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	}).format(new Date(at));
}
function formatTime(at) {
	return new Intl.DateTimeFormat("ru-RU", {
		timeZone: TZ,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(new Date(at));
}
function money(value) {
	return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0)} руб.`;
}
function parseMoney(raw) {
	const n = Number(String(raw).replace(",", ".").replace(/\s/g, ""));
	return Number.isFinite(n) && n >= 0 ? n : NaN;
}
function percent(value) {
	const n = Number.isFinite(value) ? Math.max(0, value) : 0;
	return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(n)}%`;
}
function hoursLabel(value) {
	if (!Number.isFinite(value) || value <= 0) return "0 Ч";
	if (value < 1) return `${Math.max(1, Math.round(value * 60))} мин`;
	const h = Math.floor(value);
	const m = Math.round((value - h) * 60);
	return m === 0 ? `${h} Ч` : `${h} Ч ${m} мин`;
}
function mapLetter(ch) {
	const up = ch.toUpperCase();
	const mapped = LAT_TO_CYR[up] ?? up;
	return PLATE_LETTERS.includes(mapped) ? mapped : "";
}
function sanitizePlate(raw) {
	let letter1 = "";
	let digits = "";
	let letters2 = "";
	for (const ch of raw) {
		if (!letter1) {
			const mapped = mapLetter(ch);
			if (mapped) letter1 = mapped;
			continue;
		}
		if (digits.length < 3) {
			if (/\d/.test(ch)) digits += ch;
			else {
				const mapped = mapLetter(ch);
				if (mapped && digits.length === 3 && letters2.length < 2) letters2 += mapped;
			}
			continue;
		}
		if (letters2.length < 2) {
			const mapped = mapLetter(ch);
			if (mapped) letters2 += mapped;
		}
	}
	return `${letter1}${digits}${letters2}`;
}
function sanitizeRegion(raw) {
	return raw.replace(/\D/g, "").slice(0, 3);
}
function isPlate(value) {
	return new RegExp(`^[${PLATE_LETTERS}]\\d{3}[${PLATE_LETTERS}]{2}$`).test(value);
}
function isRegion(value) {
	return /^\d{2,3}$/.test(value);
}
function formatPlate(plate, region) {
	if (!plate && !region) return "";
	return region ? `${plate}  ${region}` : plate;
}
function splitPlate(plate) {
	const match = plate.match(new RegExp(`^([${PLATE_LETTERS}])(\\d{3})([${PLATE_LETTERS}]{2})$`));
	if (match) return {
		letter: match[1] ?? "",
		digits: match[2] ?? "",
		letters: match[3] ?? ""
	};
	return {
		letter: plate.slice(0, 1),
		digits: plate.slice(1, 4),
		letters: plate.slice(4, 6)
	};
}
function newId() {
	return crypto.randomUUID();
}
function readCarImage(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			let width = img.width;
			let height = img.height;
			if (width > 640 || height > 640) {
				const scale = 640 / Math.max(width, height);
				width = Math.round(width * scale);
				height = Math.round(height * scale);
			}
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d", { alpha: true });
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("canvas"));
				return;
			}
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(img, 0, 0, width, height);
			URL.revokeObjectURL(url);
			resolve(/png|webp/i.test(file.type) || /\.(png|webp)$/i.test(file.name) ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", .82));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("image"));
		};
		img.src = url;
	});
}
var clickCtx = null;
function playClick() {
	try {
		const Ctor = window.AudioContext || window.webkitAudioContext;
		if (!Ctor) return;
		clickCtx ??= new Ctor();
		if (clickCtx.state === "suspended") clickCtx.resume();
		const osc = clickCtx.createOscillator();
		const gain = clickCtx.createGain();
		osc.type = "square";
		osc.frequency.value = 920;
		gain.gain.setValueAtTime(.045, clickCtx.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, clickCtx.currentTime + .045);
		osc.connect(gain);
		gain.connect(clickCtx.destination);
		osc.start();
		osc.stop(clickCtx.currentTime + .05);
	} catch {}
}
function asLogs(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((row) => {
		const log = asLog(row);
		return log ? [log] : [];
	});
}
function refreshCarPeriod(car, date = /* @__PURE__ */ new Date()) {
	const keys = periodKeys(date);
	const next = {
		...car,
		logs: Array.isArray(car.logs) ? car.logs : [],
		monthLogs: Array.isArray(car.monthLogs) ? car.monthLogs : []
	};
	if (car.todayKey !== keys.todayKey) {
		next.earnedToday = 0;
		next.todayKey = keys.todayKey;
	}
	if (car.weekKey !== keys.weekKey) {
		next.earnedWeek = 0;
		next.logs = [];
		next.weekKey = keys.weekKey;
	}
	if (car.monthKey !== keys.monthKey) {
		next.earnedMonth = 0;
		next.monthLogs = [];
		next.monthKey = keys.monthKey;
	}
	return next;
}
function asNumber(value, fallback = 0) {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asLog(value) {
	if (!value || typeof value !== "object") return null;
	const row = value;
	const amount = asNumber(row.amount, NaN);
	const hours = asNumber(row.hours, NaN);
	const at = asNumber(row.at, NaN);
	if (!Number.isFinite(amount) || !Number.isFinite(hours) || !Number.isFinite(at)) return null;
	return {
		id: typeof row.id === "string" && row.id ? row.id : newId(),
		at,
		hours,
		amount,
		kind: row.kind === "daily" ? "daily" : "hourly"
	};
}
function normalizeCar(raw) {
	if (!raw || typeof raw !== "object") return null;
	const e = raw;
	if (!e.id || !e.name) return null;
	const keys = periodKeys();
	const logs = asLogs(e.logs);
	const monthLogs = asLogs(e.monthLogs);
	const createdAt = asNumber(e.createdAt, Date.now());
	return refreshCarPeriod({
		...e,
		id: String(e.id),
		name: String(e.name),
		model: typeof e.model === "string" ? e.model.trim() : "",
		plate: typeof e.plate === "string" ? e.plate : "",
		region: typeof e.region === "string" ? e.region : "",
		imageData: typeof e.imageData === "string" ? e.imageData : null,
		price: asNumber(e.price),
		scrapPrice: asNumber(e.scrapPrice),
		officialPrice: typeof e.officialPrice === "number" && Number.isFinite(e.officialPrice) ? e.officialPrice : null,
		expenses: asNumber(e.expenses),
		repairs: asNumber(e.repairs),
		hourlyRate: typeof e.hourlyRate === "number" && Number.isFinite(e.hourlyRate) ? e.hourlyRate : null,
		dailyRate: typeof e.dailyRate === "number" && Number.isFinite(e.dailyRate) ? e.dailyRate : null,
		hours: asNumber(e.hours),
		earnedToday: asNumber(e.earnedToday),
		earnedWeek: asNumber(e.earnedWeek),
		earnedMonth: asNumber(e.earnedMonth),
		earnedTotal: asNumber(e.earnedTotal),
		todayKey: typeof e.todayKey === "string" ? e.todayKey : keys.todayKey,
		weekKey: typeof e.weekKey === "string" ? e.weekKey : keys.weekKey,
		monthKey: typeof e.monthKey === "string" ? e.monthKey : keys.monthKey,
		logs,
		monthLogs: monthLogs.length ? monthLogs : logs,
		createdAt,
		ownedFrom: asNumber(e.ownedFrom, createdAt)
	});
}
function repairsOf(car) {
	return Number.isFinite(car.repairs) ? Math.max(0, car.repairs) : 0;
}
/** What still has to be earned back: purchase + repairs − scrap. */
function obligation(car) {
	return car.price + repairsOf(car) - car.scrapPrice;
}
function paybackRatio(car) {
	return car.scrapPrice <= 0 ? 0 : Math.max(0, Math.min(1, car.earnedTotal / car.scrapPrice));
}
function leftover(car) {
	return Math.max(0, obligation(car) - car.earnedTotal);
}
function surplus(car) {
	const base = obligation(car);
	if (base <= 0) return Math.max(0, car.earnedTotal);
	return Math.max(0, car.earnedTotal - base);
}
function paybackPercent(car) {
	const base = obligation(car);
	if (base <= 0) return car.earnedTotal > 0 ? 100 : 0;
	return Math.max(0, Math.min(100, car.earnedTotal / base * 100));
}
function sellOutcome(car, salePrice) {
	const net = salePrice + car.earnedTotal - car.price - repairsOf(car);
	return {
		net,
		loss: net < 0
	};
}
function recommendSellPrice(car, market) {
	const avg = market && market.averagePrice > 0 ? market.averagePrice : 0;
	const min = market && market.minPrice > 0 ? market.minPrice : 0;
	const max = market && market.maxPrice > 0 ? market.maxPrice : 0;
	const anchor = avg || (min > 0 && max > 0 ? (min + max) / 2 : 0);
	const gap = leftover(car);
	if (!anchor) {
		const owe = Math.max(0, obligation(car) - car.earnedTotal);
		return Math.round(owe > 0 ? owe : Math.max(car.scrapPrice, 0));
	}
	let price = anchor;
	if (gap > 0) price = anchor + Math.min(gap, anchor * .18);
	else if (ratingModel(car).active.key === "terrible") price = anchor * .94;
	if (max > 0) price = Math.min(price, max);
	if (min > 0 && price < min) price = min;
	return Math.max(0, Math.round(price));
}
function compactMoney(value) {
	const n = Math.round(Number.isFinite(value) ? value : 0);
	if (Math.abs(n) >= 1e6) {
		const m = n / 1e6;
		return `${Math.abs(m) >= 10 ? String(Math.round(m)) : trimNum(m)} млн`;
	}
	if (Math.abs(n) >= 1e4) return `${trimNum(n / 1e3)}т`;
	return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n);
}
function trimNum(value) {
	const rounded = Math.round(value * 10) / 10;
	return String(rounded).replace(".", ",");
}
function rateChip(amount, unit) {
	return `${compactMoney(amount)} ₽ / ${unit}`;
}
function tariffQuote(car, kind, duration) {
	const rate = kind === "daily" ? car.dailyRate : car.hourlyRate;
	if (rate == null || !Number.isFinite(rate)) return null;
	return Math.round(rate * duration);
}
function reached(earned, target) {
	return target != null && target > 0 && earned >= target;
}
function filterCars(cars, query) {
	const q = query.trim().toLowerCase();
	if (!q) return cars;
	const compact = q.replace(/\s+/g, "");
	return cars.filter((car) => {
		const plate = `${car.plate}${car.region}`.toLowerCase();
		return car.name.toLowerCase().includes(q) || plate.includes(compact);
	});
}
function dateKeyToMs(dateKey) {
	const [year, month, day] = dateKey.split("-").map(Number);
	return Date.UTC(year || 1970, (month || 1) - 1, day || 1);
}
function daysOwned(car, date = /* @__PURE__ */ new Date()) {
	const from = Number.isFinite(car.ownedFrom) ? car.ownedFrom : car.createdAt;
	const fromKey = moscowParts(new Date(from)).dateKey;
	const nowKey = moscowParts(date).dateKey;
	const diff = Math.floor((dateKeyToMs(nowKey) - dateKeyToMs(fromKey)) / 864e5);
	return Math.max(1, diff + 1);
}
function ownedFromForDays(days, date = /* @__PURE__ */ new Date()) {
	const n = Math.max(1, Math.floor(days));
	const nowKey = moscowParts(date).dateKey;
	return dateKeyToMs(nowKey) - (n - 1) * 864e5;
}
function daysWord(n) {
	const abs = Math.abs(n) % 100;
	const d = abs % 10;
	if (abs > 10 && abs < 20) return "дней";
	if (d === 1) return "день";
	if (d >= 2 && d <= 4) return "дня";
	return "дней";
}
function uniqueLogs(car) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const row of [...car.monthLogs ?? [], ...car.logs ?? []]) {
		if (seen.has(row.id)) continue;
		seen.add(row.id);
		out.push(row);
	}
	return out;
}
function latestRent(car) {
	const all = uniqueLogs(car);
	if (!all.length) return null;
	return all.reduce((best, row) => row.at > best.at ? row : best);
}
function applyUndoLastRent(car, date = /* @__PURE__ */ new Date()) {
	const log = latestRent(car);
	if (!log) return {
		car,
		undone: null
	};
	const keys = periodKeys(date);
	const logKeys = periodKeys(new Date(log.at));
	return {
		undone: log,
		car: {
			...car,
			hours: Math.max(0, car.hours - log.hours),
			earnedToday: logKeys.todayKey === keys.todayKey ? Math.max(0, car.earnedToday - log.amount) : car.earnedToday,
			earnedWeek: logKeys.weekKey === keys.weekKey ? Math.max(0, car.earnedWeek - log.amount) : car.earnedWeek,
			earnedMonth: logKeys.monthKey === keys.monthKey ? Math.max(0, car.earnedMonth - log.amount) : car.earnedMonth,
			earnedTotal: Math.max(0, car.earnedTotal - log.amount),
			logs: car.logs.filter((row) => row.id !== log.id),
			monthLogs: (car.monthLogs ?? []).filter((row) => row.id !== log.id)
		}
	};
}
function applyExpenseDelta(car, amount, sign) {
	const delta = amount * sign;
	return {
		...car,
		expenses: Math.max(0, car.expenses + delta),
		price: Math.max(0, car.price + delta)
	};
}
function applyRepairDelta(car, amount, sign) {
	return {
		...car,
		repairs: Math.max(0, repairsOf(car) + amount * sign)
	};
}
function ratingModel(car) {
	const t = paybackRatio(car);
	const n = paybackPercent(car) / 100;
	const rest = leftover(car);
	const expenseShare = car.price > 0 ? Math.min(1, car.expenses / Math.max(car.price, 1)) : 0;
	const trips = typeof car.trips === "number" ? Number(car.trips) : uniqueLogs(car).length;
	const logCount = uniqueLogs(car).length;
	const hours = car.hours;
	const excellent = Math.max(0, Math.min(1, t * .55 + n * .35 + (car.earnedTotal > 0 ? .1 : 0) - expenseShare * .25));
	const popular = Math.max(0, Math.min(1, Math.min(1, trips / 12) * .45 + Math.min(1, logCount / 5) * .35 + Math.min(1, hours / 80) * .2));
	const terrible = Math.max(0, Math.min(1, (1 - t) * .35 + expenseShare * .3 + (car.price > 0 ? Math.min(1, rest / car.price) * .25 : .2) + (car.earnedTotal <= 0 && trips === 0 ? .2 : 0)));
	const average = Math.max(0, Math.min(1, 1 - Math.abs(.45 - t) * 1.2 - Math.abs(.35 - popular) * .4));
	const ratings = [
		{
			key: "excellent",
			label: "Отличная",
			color: "#3cb85c",
			score: excellent
		},
		{
			key: "popular",
			label: "Популярная",
			color: "#5aa0d6",
			score: popular
		},
		{
			key: "average",
			label: "Средняя",
			color: "#c4c4cc",
			score: average
		},
		{
			key: "terrible",
			label: "Ужасная",
			color: "#e04444",
			score: terrible
		}
	];
	return {
		ratings,
		active: ratings.reduce((a, b) => b.score > a.score ? b : a)
	};
}
var RATING_HINT = {
	excellent: "Машина закрывает вложения быстро — держать и крутить.",
	popular: "Парк её разбирает. Спрос держится, простои короткие.",
	average: "Рабочая лошадка без перекоса: ни простоя, ни ажиотажа.",
	terrible: "Слабая отдача и долгий простой. Имеет смысл пересмотреть цену или продать."
};
function popularityScore(car, date = /* @__PURE__ */ new Date()) {
	const now = date.getTime();
	const weekAgo = now - 6048e5;
	const recent = uniqueLogs(car).filter((row) => row.at >= weekAgo);
	const trips = recent.length;
	const hours = recent.reduce((sum, row) => sum + row.hours, 0);
	const last = recent.reduce((best, row) => row.at > best ? row.at : best, 0);
	const recency = last ? Math.max(0, 1 - (now - last) / 432e6) : 0;
	const tripScore = Math.min(1, trips / 9);
	const hourScore = Math.min(1, hours / 36);
	return Math.max(0, Math.min(1, tripScore * .5 + hourScore * .35 + recency * .15));
}
function popularityMeta(score) {
	if (score < .18) return {
		label: "Непопулярная",
		hint: "Редко уходит. Спрос почти стоит."
	};
	if (score < .38) return {
		label: "Слабый спрос",
		hint: "Берут нерегулярно — шкала ещё холодная."
	};
	if (score < .58) return {
		label: "Рабочий ритм",
		hint: "Стабильные выезды без перегрева."
	};
	if (score < .8) return {
		label: "Высокий спрос",
		hint: "Часто в аренде, простои короткие."
	};
	return {
		label: "Пик популярности",
		hint: "Машину разбирают. Это верх шкалы."
	};
}
function popularityColor(score) {
	const stops = [
		[0, [
			90,
			12,
			12
		]],
		[.22, [
			196,
			43,
			43
		]],
		[.42, [
			214,
			96,
			28
		]],
		[.62, [
			214,
			176,
			48
		]],
		[.82, [
			96,
			176,
			72
		]],
		[1, [
			44,
			168,
			78
		]]
	];
	const t = Math.max(0, Math.min(1, score));
	let i = 0;
	while (i < stops.length - 1 && t > stops[i + 1][0]) i += 1;
	const a = stops[i];
	const b = stops[Math.min(i + 1, stops.length - 1)];
	const span = b[0] - a[0] || 1;
	const u = (t - a[0]) / span;
	const rgb = a[1].map((ch, idx) => Math.round(ch + (b[1][idx] - ch) * u));
	return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
}
var WIZARD_ORDER = [
	"acquire",
	"name",
	"plate",
	"image",
	"buy",
	"official",
	"scrap",
	"tariff"
];
function wizardPath(acquire, imageSkipped) {
	return WIZARD_ORDER.filter((step) => {
		if (step === "buy" && acquire !== "paid") return false;
		if (step === "image" && imageSkipped) return false;
		return true;
	});
}
function isApiServer(value) {
	return value === "RU1" || value === "RU2" || value === "RU3";
}
var TOAST_MS = 4e3;
var noopStorage = {
	getItem: () => null,
	setItem: () => {},
	removeItem: () => {}
};
function patchCar(cars, id, fn) {
	return cars.map((car) => car.id === id ? fn(refreshCarPeriod(car)) : car);
}
var useGarage = create()(persist((set, get) => ({
	cars: [],
	search: "",
	overlay: "none",
	subModal: "none",
	wizardStep: "acquire",
	draftAcquire: null,
	draftName: "",
	draftPlate: "",
	draftRegion: "",
	draftImage: null,
	draftPrice: "",
	draftScrap: "",
	draftHourly: "",
	draftDaily: "",
	imageSkipped: false,
	detailsId: null,
	deleteId: null,
	rentId: null,
	rentKind: null,
	rentStep: "pick",
	rentDuration: "",
	rentAmount: "",
	draftOfficial: "",
	draftExpense: "",
	expenseSign: 1,
	expenseTarget: "expense",
	tariffKind: "hourly",
	tariffScope: "wizard",
	tariffDraft: "",
	draftSale: "",
	saleNet: 0,
	saleGood: true,
	saleDetail: "",
	apiKey: "",
	apiServer: null,
	apiPulse: 0,
	draftEarnToday: "",
	draftEarnWeek: "",
	draftEarnMonth: "",
	draftEarnTotal: "",
	draftCarName: "",
	draftModel: "",
	draftOwnedDays: "",
	logRange: "week",
	pendingImport: null,
	toasts: [],
	setSearch: (search) => set({ search }),
	openWizard: () => set({
		overlay: "wizard",
		subModal: "none",
		wizardStep: "acquire",
		draftAcquire: null,
		draftName: "",
		draftPlate: "",
		draftRegion: "",
		draftImage: null,
		draftPrice: "",
		draftScrap: "",
		draftHourly: "",
		draftDaily: "",
		draftOfficial: "",
		imageSkipped: false
	}),
	closeOverlay: () => {
		const s = get();
		if (s.subModal === "sell-result") return;
		if (s.subModal === "tariff-edit" && s.tariffScope === "car") {
			set({ subModal: "tariff" });
			return;
		}
		if (s.subModal !== "none") {
			set({ subModal: "none" });
			return;
		}
		if (s.overlay === "market") {
			set({ overlay: "details" });
			return;
		}
		set({
			overlay: "none",
			detailsId: null,
			deleteId: null,
			rentId: null,
			rentKind: null,
			rentStep: "pick",
			pendingImport: null
		});
	},
	setDraftName: (draftName) => set({ draftName }),
	setDraftPlate: (draftPlate) => set({ draftPlate }),
	setDraftRegion: (draftRegion) => set({ draftRegion }),
	setDraftImage: (draftImage) => set({ draftImage }),
	setDraftPrice: (draftPrice) => set({ draftPrice }),
	setDraftScrap: (draftScrap) => set({ draftScrap }),
	setDraftAcquire: (draftAcquire) => set({ draftAcquire }),
	pickAcquire: (draftAcquire) => set({
		draftAcquire,
		draftPrice: draftAcquire === "free" ? "0" : get().draftPrice,
		wizardStep: "name"
	}),
	wizardNext: async () => {
		const s = get();
		const index = wizardPath(s.draftAcquire, s.imageSkipped).indexOf(s.wizardStep);
		const go = (wizardStep, extra = {}) => {
			set({
				wizardStep,
				...extra
			});
			return true;
		};
		if (s.wizardStep === "acquire") {
			if (!s.draftAcquire) {
				s.pushToast("Выберите, бесплатно авто или платно", "error");
				return false;
			}
			return go("name");
		}
		if (s.wizardStep === "name") {
			if (!s.draftName.trim()) {
				s.pushToast("Введите название авто", "error");
				return false;
			}
			return go("plate");
		}
		if (s.wizardStep === "plate") {
			if (!isPlate(s.draftPlate)) {
				s.pushToast("Введите госномер: буква, три цифры, две буквы", "error");
				return false;
			}
			if (!isRegion(s.draftRegion)) {
				s.pushToast("Введите регион (2 или 3 цифры)", "error");
				return false;
			}
			const known = await albumGet(s.draftName);
			if (known) return go(s.draftAcquire === "paid" ? "buy" : "official", {
				draftImage: known,
				imageSkipped: true
			});
			return go("image", { imageSkipped: false });
		}
		if (s.wizardStep === "image") {
			if (s.draftImage) albumPut(s.draftName, s.draftImage);
			return go(s.draftAcquire === "paid" ? "buy" : "official");
		}
		if (s.wizardStep === "buy") {
			if (!s.draftPrice.trim() || !Number.isFinite(parseMoney(s.draftPrice))) {
				s.pushToast("Введите, за сколько купили авто", "error");
				return false;
			}
			return go("official");
		}
		if (s.wizardStep === "official") {
			if (!s.draftOfficial.trim() || !Number.isFinite(parseMoney(s.draftOfficial))) {
				s.pushToast("Введите госстоимость", "error");
				return false;
			}
			return go("scrap");
		}
		if (s.wizardStep === "scrap") {
			if (!s.draftScrap.trim() || !Number.isFinite(parseMoney(s.draftScrap))) {
				s.pushToast("Введите цену свалки", "error");
				return false;
			}
			return go("tariff");
		}
		if (index < 0) return false;
		return s.finishWizard();
	},
	wizardBack: () => {
		const s = get();
		const path = wizardPath(s.draftAcquire, s.imageSkipped);
		const index = path.indexOf(s.wizardStep);
		const prev = index > 0 ? path[index - 1] : null;
		if (prev) set({ wizardStep: prev });
	},
	finishWizard: () => {
		const s = get();
		const name = s.draftName.trim();
		if (!name) {
			s.pushToast("Введите название авто", "error");
			return false;
		}
		const hourly = parseMoney(s.draftHourly);
		const daily = parseMoney(s.draftDaily);
		if (!s.draftHourly.trim() || !Number.isFinite(hourly) || !s.draftDaily.trim() || !Number.isFinite(daily)) {
			s.pushToast("Задайте часовой и суточный тариф", "error");
			return false;
		}
		const official = parseMoney(s.draftOfficial);
		const keys = periodKeys();
		const now = Date.now();
		if (s.draftImage) albumPut(name, s.draftImage);
		set({
			cars: [{
				id: newId(),
				name,
				model: "",
				plate: s.draftPlate,
				region: s.draftRegion,
				imageData: s.draftImage,
				price: s.draftAcquire === "free" ? 0 : parseMoney(s.draftPrice) || 0,
				scrapPrice: parseMoney(s.draftScrap) || 0,
				officialPrice: Number.isFinite(official) ? official : null,
				expenses: 0,
				repairs: 0,
				hourlyRate: hourly,
				dailyRate: daily,
				hours: 0,
				earnedToday: 0,
				earnedWeek: 0,
				earnedMonth: 0,
				earnedTotal: 0,
				todayKey: keys.todayKey,
				weekKey: keys.weekKey,
				monthKey: keys.monthKey,
				logs: [],
				monthLogs: [],
				createdAt: now,
				ownedFrom: now
			}, ...s.cars],
			overlay: "none",
			wizardStep: "acquire",
			subModal: "none"
		});
		get().pushToast(`Автомобиль «${name}» добавлен`, "info");
		return true;
	},
	openReset: () => set({
		overlay: "reset",
		subModal: "none"
	}),
	confirmReset: () => {
		set({
			cars: [],
			overlay: "none"
		});
		get().pushToast("База данных полностью очищена", "info");
	},
	openRent: (id) => set({
		overlay: "rent",
		subModal: "none",
		rentId: id,
		rentKind: null,
		rentStep: "pick",
		rentDuration: "",
		rentAmount: ""
	}),
	setRentKind: (rentKind) => set({
		rentKind,
		rentStep: "duration",
		rentDuration: ""
	}),
	setRentDuration: (rentDuration) => set({ rentDuration }),
	setRentAmount: (rentAmount) => set({ rentAmount }),
	pickRentDuration: (value) => {
		const max = get().rentKind === "daily" ? 7 : 24;
		const n = Math.round(value);
		if (!Number.isFinite(n) || n < 1 || n > max) return;
		set({
			rentDuration: String(n),
			rentStep: "amount",
			rentAmount: ""
		});
	},
	fillRentFromTariff: () => {
		const s = get();
		const car = s.cars.find((row) => row.id === s.rentId);
		if (!car || !s.rentKind) return false;
		const duration = Number(String(s.rentDuration).replace(",", ".").replace(/\s/g, ""));
		const quote = tariffQuote(car, s.rentKind, duration);
		if (quote == null) {
			s.pushToast("Тариф для этого типа ещё не задан", "error");
			return false;
		}
		set({ rentAmount: String(quote) });
		return true;
	},
	rentNext: () => {
		const s = get();
		if (s.rentStep === "pick" || !s.rentKind) {
			s.pushToast("Выберите тип аренды", "error");
			return false;
		}
		if (s.rentStep === "duration") {
			const n = Number(String(s.rentDuration).replace(",", ".").replace(/\s/g, ""));
			if (!Number.isFinite(n) || n <= 0) {
				s.pushToast(s.rentKind === "daily" ? "Введите количество суток" : "Введите количество часов", "error");
				return false;
			}
			set({
				rentStep: "amount",
				rentAmount: ""
			});
			return true;
		}
		const amount = parseMoney(s.rentAmount);
		if (!s.rentAmount.trim() || !Number.isFinite(amount)) {
			s.pushToast("Введите сумму", "error");
			return false;
		}
		const duration = Number(String(s.rentDuration).replace(",", ".").replace(/\s/g, ""));
		const hours = s.rentKind === "daily" ? duration * 24 : duration;
		const id = s.rentId;
		if (!id) return false;
		const current = get().cars.find((car) => car.id === id);
		const log = {
			id: newId(),
			at: Date.now(),
			hours,
			amount,
			kind: s.rentKind ?? "hourly"
		};
		set({
			cars: patchCar(get().cars, id, (car) => ({
				...car,
				hours: car.hours + hours,
				earnedToday: car.earnedToday + amount,
				earnedWeek: car.earnedWeek + amount,
				earnedMonth: car.earnedMonth + amount,
				earnedTotal: car.earnedTotal + amount,
				logs: [log, ...car.logs],
				monthLogs: [log, ...car.monthLogs ?? []]
			})),
			overlay: "none",
			rentId: null,
			rentKind: null,
			rentStep: "pick"
		});
		if (current) get().pushToast(`«${current.name}» сдан в аренду`, "info");
		return true;
	},
	rentBack: () => {
		const s = get();
		if (s.rentStep === "amount") set({ rentStep: "duration" });
		else if (s.rentStep === "duration") set({
			rentStep: "pick",
			rentKind: null
		});
		else s.closeOverlay();
	},
	openDelete: (id) => set({
		overlay: "delete",
		deleteId: id,
		subModal: "none"
	}),
	confirmDelete: () => {
		const id = get().deleteId;
		const current = get().cars.find((car) => car.id === id);
		set({
			cars: get().cars.filter((car) => car.id !== id),
			overlay: "none",
			deleteId: null,
			detailsId: null
		});
		if (current) get().pushToast(`«${current.name}» удалён`, "info");
	},
	openDetails: (id) => {
		set({
			cars: get().cars.map((car) => car.id === id ? refreshCarPeriod(car) : car),
			overlay: "details",
			detailsId: id,
			subModal: "none",
			logRange: "week"
		});
	},
	bootCheck: () => {
		set({ cars: get().cars.flatMap((car) => {
			const next = normalizeCar(car);
			return next ? [next] : [];
		}) });
	},
	refreshCar: (id) => {
		set({ cars: get().cars.map((car) => car.id === id ? refreshCarPeriod(car) : car) });
		get().pushToast("Информация обновлена", "info");
	},
	openOfficial: () => {
		const s = get();
		const car = s.cars.find((row) => row.id === s.detailsId);
		set({
			subModal: "official",
			draftOfficial: car?.officialPrice == null ? "" : String(car.officialPrice)
		});
	},
	setDraftOfficial: (draftOfficial) => set({ draftOfficial }),
	saveOfficial: () => {
		const s = get();
		const value = parseMoney(s.draftOfficial);
		if (!Number.isFinite(value)) {
			s.pushToast("Введите госстоимость", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				officialPrice: value
			})),
			subModal: "none"
		});
		get().pushToast("Госстоимость сохранена", "info");
		return true;
	},
	openExpense: () => set({
		subModal: "expense",
		draftExpense: "",
		expenseSign: 1,
		expenseTarget: "expense"
	}),
	openExpenseSub: () => set({
		subModal: "expense",
		draftExpense: "",
		expenseSign: -1,
		expenseTarget: "expense"
	}),
	openRepair: () => set({
		subModal: "expense",
		draftExpense: "",
		expenseSign: 1,
		expenseTarget: "repair"
	}),
	openRepairSub: () => set({
		subModal: "expense",
		draftExpense: "",
		expenseSign: -1,
		expenseTarget: "repair"
	}),
	setDraftExpense: (draftExpense) => set({ draftExpense }),
	saveExpense: () => {
		const s = get();
		const value = parseMoney(s.draftExpense);
		if (!Number.isFinite(value) || value <= 0) {
			s.pushToast("Введите сумму расхода", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => s.expenseTarget === "repair" ? applyRepairDelta(car, value, s.expenseSign) : applyExpenseDelta(car, value, s.expenseSign)),
			subModal: "none"
		});
		const repair = s.expenseTarget === "repair";
		get().pushToast(s.expenseSign < 0 ? repair ? "Ремонт убавлен" : "Расход убавлен" : repair ? "Ремонт добавлен" : "Расход добавлен", "info");
		return true;
	},
	openEditEarn: () => {
		const s = get();
		const found = s.cars.find((car) => car.id === s.detailsId);
		if (!found) return;
		const car = refreshCarPeriod(found);
		set({
			subModal: "edit-earn",
			draftEarnToday: String(car.earnedToday),
			draftEarnWeek: String(car.earnedWeek),
			draftEarnMonth: String(car.earnedMonth),
			draftEarnTotal: String(car.earnedTotal)
		});
	},
	setDraftEarnToday: (draftEarnToday) => set({ draftEarnToday }),
	setDraftEarnWeek: (draftEarnWeek) => set({ draftEarnWeek }),
	setDraftEarnMonth: (draftEarnMonth) => set({ draftEarnMonth }),
	setDraftEarnTotal: (draftEarnTotal) => set({ draftEarnTotal }),
	saveEditEarn: () => {
		const s = get();
		const today = parseMoney(s.draftEarnToday);
		const week = parseMoney(s.draftEarnWeek);
		const month = parseMoney(s.draftEarnMonth);
		const total = parseMoney(s.draftEarnTotal);
		if (![
			today,
			week,
			month,
			total
		].every(Number.isFinite)) {
			s.pushToast("Введите суммы", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				earnedToday: today,
				earnedWeek: week,
				earnedMonth: month,
				earnedTotal: total
			})),
			subModal: "none"
		});
		get().pushToast("Заработок обновлён", "info");
		return true;
	},
	openClearLog: () => set({ subModal: "clear-log" }),
	confirmClearLog: () => {
		const id = get().detailsId;
		if (!id) return;
		const range = get().logRange;
		set({
			cars: patchCar(get().cars, id, (car) => range === "month" ? {
				...car,
				monthLogs: []
			} : {
				...car,
				logs: []
			}),
			subModal: "none"
		});
		get().pushToast(range === "month" ? "Месячный лог очищен" : "Недельный лог очищен", "info");
	},
	setLogRange: (logRange) => set({ logRange }),
	setCarImage: (id, imageData) => {
		set({ cars: patchCar(get().cars, id, (car) => ({
			...car,
			imageData
		})) });
		get().pushToast("Изображение сохранено", "info");
	},
	openRename: () => {
		const s = get();
		set({
			subModal: "rename",
			draftCarName: s.cars.find((row) => row.id === s.detailsId)?.name ?? ""
		});
	},
	setDraftCarName: (draftCarName) => set({ draftCarName }),
	saveRename: () => {
		const s = get();
		const name = s.draftCarName.trim();
		if (!name) {
			s.pushToast("Введите название авто", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				name
			})),
			subModal: "none"
		});
		get().pushToast("Название обновлено", "info");
		return true;
	},
	openModel: () => {
		const s = get();
		set({
			subModal: "model",
			draftModel: s.cars.find((row) => row.id === s.detailsId)?.model ?? ""
		});
	},
	setDraftModel: (draftModel) => set({ draftModel }),
	saveModel: () => {
		const s = get();
		const model = s.draftModel.trim().replace(/\s+/g, " ");
		if (model.length > 48) {
			s.pushToast("Слишком длинная модель", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				model
			})),
			subModal: "none"
		});
		get().pushToast(model ? "Модель сохранена" : "Модель очищена", "info");
		return true;
	},
	openOwnedDays: () => {
		const s = get();
		const car = s.cars.find((row) => row.id === s.detailsId);
		if (!car) return;
		set({
			subModal: "owned-days",
			draftOwnedDays: String(daysOwned(car))
		});
	},
	setDraftOwnedDays: (draftOwnedDays) => set({ draftOwnedDays }),
	saveOwnedDays: () => {
		const s = get();
		const n = Number(String(s.draftOwnedDays).replace(",", ".").replace(/\s/g, ""));
		if (!Number.isFinite(n) || n < 1) {
			s.pushToast("Введите количество дней", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				ownedFrom: ownedFromForDays(Math.floor(n))
			})),
			subModal: "none"
		});
		get().pushToast("Срок владения обновлён", "info");
		return true;
	},
	openPlate: () => {
		const s = get();
		const car = s.cars.find((row) => row.id === s.detailsId);
		set({
			subModal: "plate",
			draftPlate: car?.plate ?? "",
			draftRegion: car?.region ?? ""
		});
	},
	savePlate: () => {
		const s = get();
		if (!isPlate(s.draftPlate)) {
			s.pushToast("Введите госномер: буква, три цифры, две буквы", "error");
			return false;
		}
		if (!isRegion(s.draftRegion)) {
			s.pushToast("Введите регион (2 или 3 цифры)", "error");
			return false;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				plate: s.draftPlate,
				region: s.draftRegion
			})),
			subModal: "none"
		});
		get().pushToast("Госномер обновлён", "info");
		return true;
	},
	openTariff: () => set({ subModal: "tariff" }),
	openTariffEdit: (tariffKind, tariffScope) => {
		const s = get();
		if (tariffScope === "wizard") {
			set({
				subModal: "tariff-edit",
				tariffKind,
				tariffScope,
				tariffDraft: tariffKind === "daily" ? s.draftDaily : s.draftHourly
			});
			return;
		}
		const car = s.cars.find((row) => row.id === s.detailsId);
		const current = tariffKind === "daily" ? car?.dailyRate : car?.hourlyRate;
		set({
			subModal: "tariff-edit",
			tariffKind,
			tariffScope,
			tariffDraft: current == null ? "" : String(current)
		});
	},
	setTariffDraft: (tariffDraft) => set({ tariffDraft }),
	saveTariffEdit: () => {
		const s = get();
		const value = parseMoney(s.tariffDraft);
		if (!s.tariffDraft.trim() || !Number.isFinite(value)) {
			s.pushToast("Введите тариф", "error");
			return false;
		}
		if (s.tariffScope === "wizard") {
			set({
				subModal: "none",
				draftHourly: s.tariffKind === "hourly" ? String(value) : s.draftHourly,
				draftDaily: s.tariffKind === "daily" ? String(value) : s.draftDaily
			});
			return true;
		}
		const id = s.detailsId;
		if (!id) return false;
		set({
			cars: patchCar(s.cars, id, (car) => ({
				...car,
				hourlyRate: s.tariffKind === "hourly" ? value : car.hourlyRate,
				dailyRate: s.tariffKind === "daily" ? value : car.dailyRate
			})),
			subModal: "tariff"
		});
		get().pushToast("Тариф сохранён", "info");
		return true;
	},
	openSell: () => set({
		subModal: "sell-ask",
		draftSale: ""
	}),
	setDraftSale: (draftSale) => set({ draftSale }),
	confirmSell: () => {
		const s = get();
		const sale = parseMoney(s.draftSale);
		if (!s.draftSale.trim() || !Number.isFinite(sale)) {
			s.pushToast("Введите, за сколько продали", "error");
			return false;
		}
		const car = s.cars.find((row) => row.id === s.detailsId);
		if (!car) return false;
		set({
			overlay: "none",
			subModal: "sell-result",
			saleNet: sellOutcome(car, sale).net,
			saleGood: sellOutcome(car, sale).net >= 0,
			saleDetail: ""
		});
		return true;
	},
	presentSale: (result) => set({
		overlay: "none",
		subModal: "sell-result",
		saleNet: result.net,
		saleGood: result.good,
		saleDetail: result.text
	}),
	acceptSell: () => {
		const id = get().detailsId;
		const current = get().cars.find((car) => car.id === id);
		set({
			cars: get().cars.filter((car) => car.id !== id),
			overlay: "none",
			subModal: "none",
			detailsId: null,
			deleteId: null
		});
		if (current) get().pushToast(`«${current.name}» продан и убран из базы`, "info");
	},
	openApi: () => set({
		overlay: "api",
		subModal: "none"
	}),
	setApiKey: (apiKey) => set({ apiKey }),
	selectApiServer: (apiServer) => set({
		apiServer,
		apiPulse: Date.now()
	}),
	openMarket: () => set({ overlay: "market" }),
	openUndoRent: () => set({ subModal: "undo-rent" }),
	confirmUndoRent: () => {
		const id = get().detailsId;
		if (!id) return;
		const found = get().cars.find((car) => car.id === id);
		if (!found) return;
		const { car, undone } = applyUndoLastRent(found);
		if (!undone) {
			get().pushToast("Последней аренды нет", "error");
			set({ subModal: "none" });
			return;
		}
		set({
			cars: get().cars.map((row) => row.id === id ? car : row),
			subModal: "none"
		});
		get().pushToast("Последняя аренда отменена", "info");
	},
	requestImport: (cars) => {
		if (!cars.length) {
			get().pushToast("В файле нет автомобилей", "error");
			return;
		}
		if (get().cars.length === 0) {
			set({
				cars,
				overlay: "none",
				pendingImport: null
			});
			get().pushToast(`Загружено автомобилей: ${cars.length}`, "info");
			return;
		}
		set({
			overlay: "import-confirm",
			subModal: "none",
			pendingImport: cars
		});
	},
	confirmImport: () => {
		const cars = get().pendingImport ?? [];
		set({
			cars,
			overlay: "none",
			pendingImport: null,
			detailsId: null,
			deleteId: null
		});
		get().pushToast(`Загружено автомобилей: ${cars.length}`, "info");
	},
	cancelImport: () => set({
		overlay: "none",
		pendingImport: null
	}),
	pushToast: (text, kind = "info") => {
		const id = newId();
		set({ toasts: [...get().toasts.slice(-2), {
			id,
			text,
			kind
		}] });
		if (typeof window !== "undefined") window.setTimeout(() => get().dismissToast(id), TOAST_MS);
	},
	dismissToast: (id) => set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
}), {
	name: STORAGE_KEY,
	version: 6,
	storage: createJSONStorage(() => typeof window === "undefined" ? noopStorage : localStorage),
	partialize: (state) => ({
		cars: state.cars,
		apiKey: state.apiKey,
		apiServer: state.apiServer
	}),
	migrate: (persisted) => {
		const data = persisted ?? {};
		return {
			cars: (data.cars ?? []).flatMap((row) => {
				const car = normalizeCar(row);
				return car ? [car] : [];
			}),
			apiKey: typeof data.apiKey === "string" ? data.apiKey : "",
			apiServer: isApiServer(data.apiServer) ? data.apiServer : null
		};
	},
	merge: (persisted, current) => {
		const data = persisted ?? {};
		return {
			...current,
			cars: (data.cars ?? []).flatMap((row) => {
				const car = normalizeCar(row);
				return car ? [car] : [];
			}),
			apiKey: typeof data.apiKey === "string" ? data.apiKey : "",
			apiServer: isApiServer(data.apiServer) ? data.apiServer : null
		};
	}
}));
var QUALITY = [
	{
		max: 5e5,
		color: "#9a9aa4"
	},
	{
		max: 1e6,
		color: "#8ed4ff"
	},
	{
		max: 25e5,
		color: "#6b2d9b"
	},
	{
		max: 5e6,
		color: "#e23b3b"
	},
	{
		max: 1e7,
		color: "#e4bc4a"
	},
	{
		max: Number.POSITIVE_INFINITY,
		color: "#5ee6cf"
	}
];
function qualityColor(price) {
	const value = price == null || !Number.isFinite(price) ? 0 : price;
	return QUALITY.find((tier) => value <= tier.max)?.color ?? "#5ee6cf";
}
function QualityPip({ price, className = "" }) {
	const color = qualityColor(price);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `quality-pip ${className}`,
		style: {
			background: color,
			boxShadow: `0 0 8px 1px ${color}`
		},
		"aria-hidden": "true"
	});
}
function CarCard({ car }) {
	const openRent = useGarage((s) => s.openRent);
	const openDelete = useGarage((s) => s.openDelete);
	const openDetails = useGarage((s) => s.openDetails);
	const plate = formatPlate(car.plate, car.region);
	const ref = (0, import_react.useRef)(null);
	const [sheen, setSheen] = (0, import_react.useState)(0);
	const tilt = (event) => {
		const el = ref.current;
		if (!el) return;
		const box = el.getBoundingClientRect();
		const px = (event.clientX - box.left) / box.width - .5;
		const py = (event.clientY - box.top) / box.height - .5;
		el.style.transition = "transform 0.05s linear";
		el.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
	};
	const rest = () => {
		const el = ref.current;
		if (!el) return;
		el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
		el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref,
		className: "car-tilt flex w-44 shrink-0 flex-col overflow-hidden bg-surface shadow-[var(--shadow-border)] md:w-48",
		onMouseMove: tilt,
		onMouseEnter: () => setSheen((n) => n + 1),
		onMouseLeave: rest,
		children: [
			sheen > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "card-sheen",
				"aria-hidden": "true"
			}, sheen) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-[1] flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex min-w-0 items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: hoursLabel(car.hours)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QualityPip, { price: car.officialPrice })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "car-photo h-28 bg-surface md:h-32",
				children: car.imageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: car.imageData,
					alt: car.name,
					className: "car-photo-img",
					draggable: false
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-full items-center justify-center text-xs text-subtle",
					children: "Нет фото"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-2.5 pt-2 pb-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "truncate text-sm font-semibold text-fg",
					children: car.name
				}), plate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 truncate text-xs tracking-wide text-muted tabular-nums",
					children: plate
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "card-action",
				onClick: () => {
					playClick();
					openRent(car.id);
				},
				children: "Сдать в аренду"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "card-action",
				onClick: () => {
					playClick();
					openDetails(car.id);
				},
				children: "Подробнее"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "card-action",
				onClick: () => {
					playClick();
					openDelete(car.id);
				},
				children: "Удалить"
			})
		]
	});
}
function CarGlyph({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinejoin: "round",
		strokeLinecap: "round",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 14.5h1.15c.28 1.35 1.48 2.35 2.9 2.35s2.62-1 2.9-2.35h4.2c.28 1.35 1.48 2.35 2.9 2.35s2.62-1 2.9-2.35H21v-3.05l-2.15-3.95h-5.2L11.4 5.5H7.15L5.05 11.5H3z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "7.05",
				cy: "16.85",
				r: "1.15",
				fill: "currentColor",
				stroke: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16.95",
				cy: "16.85",
				r: "1.15",
				fill: "currentColor",
				stroke: "none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5.2 11.5h13.1" })
		]
	});
}
function ApiGlyph({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 9 4.5 12 8 15" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M16 9 19.5 12 16 15" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M13.2 6.5 10.8 17.5" })
		]
	});
}
function DarkRentLogo({ size = "md", animated = true, stack = false }) {
	const scale = size === "lg" ? "text-[2.6rem] md:text-[3.4rem]" : size === "sm" ? "text-[1.05rem]" : "text-[1.35rem]";
	const rent = size === "lg" ? "text-[1.85rem] md:text-[2.35rem]" : size === "sm" ? "text-[0.92rem]" : "text-[1.12rem]";
	if (stack) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center leading-none",
		"aria-label": "Dark Rent",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[4.4rem] font-extrabold tracking-[0.16em] text-fg md:text-[6.2rem]",
			children: "DARK"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-2 text-[1.35rem] font-medium tracking-[0.46em] text-[#8d8d98] md:text-[1.7rem]",
			children: "RENT"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `logo-mark inline-flex items-baseline gap-[0.12em] leading-none ${animated ? "logo-breathe" : ""}`,
		"aria-label": "Dark Rent",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-extrabold tracking-[0.08em] text-fg ${scale}`,
			children: "DARK"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-semibold tracking-[0.04em] text-muted ${rent}`,
			children: "Rent"
		})]
	});
}
function downloadBlob(filename, contents, mime) {
	const blob = new Blob([`\uFEFF${contents}`], { type: `${mime};charset=utf-8` });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
function backupFilename(date = /* @__PURE__ */ new Date()) {
	const t = moscowParts(date);
	return `garage-log-${t.year}-${t.month}-${t.day}.txt`;
}
function readableLog(cars, date = /* @__PURE__ */ new Date()) {
	const t = moscowParts(date);
	const lines = [
		"Выгрузка лога Dark Rent",
		`Дата: ${t.day}.${t.month}.${t.year} ${t.hour}:${t.minute} (МСК)`,
		`Автомобилей: ${cars.length}`,
		"Полная копия базы (карточки, фото, история и заработок) сохранена в блоке ниже.",
		"Не удаляйте строку GARAZH-BACKUP — она нужна, чтобы загрузить авто обратно.",
		""
	];
	if (cars.length === 0) {
		lines.push("Автомобилей в базе нет.");
		return lines.join("\r\n");
	}
	cars.forEach((car, index) => {
		const trips = typeof car.trips === "number" ? car.trips : car.logs?.length ?? 0;
		const plate = formatPlate(car.plate, car.region) || "—";
		const official = car.officialPrice == null ? "не заполнено" : money(car.officialPrice);
		lines.push([
			`${index + 1}. ${car.name}`,
			`Госномер: ${plate}`,
			`Цена: ${money(car.price)}`,
			`Госстоимость: ${official}`,
			`Слив по свалке: ${money(car.scrapPrice)}`,
			`Расходы: ${money(car.expenses)}`,
			`За день: ${money(car.earnedToday)}`,
			`За неделю: ${money(car.earnedWeek)}`,
			`За месяц: ${money(car.earnedMonth)}`,
			`Всего: ${money(car.earnedTotal)}`,
			`Выездов: ${trips}`,
			`Часов: ${hoursLabel(car.hours)}`
		].join(" | "));
	});
	return lines.join("\r\n");
}
function buildBackup(cars, date = /* @__PURE__ */ new Date()) {
	const t = moscowParts(date);
	return {
		kind: BACKUP_KIND,
		app: APP_NAME,
		version: 6,
		exportedAt: date.getTime(),
		exportedAtMsk: `${t.day}.${t.month}.${t.year} ${t.hour}:${t.minute}`,
		summary: readableLog(cars, date),
		cars
	};
}
function exportGarageLog(cars) {
	const backup = buildBackup(cars);
	const body = `${backup.summary}\r\n\r\n${BACKUP_MARKER}\r\n${JSON.stringify(backup)}`;
	downloadBlob(backupFilename(), body, "text/plain");
}
function carsFromUnknown(raw) {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw.flatMap((row) => {
		const car = normalizeCar(row);
		return car ? [car] : [];
	});
	if (typeof raw !== "object") return [];
	const obj = raw;
	if (obj.kind === "garazh-backup" && Array.isArray(obj.cars)) return carsFromUnknown(obj.cars);
	if (obj.state && typeof obj.state === "object") {
		const state = obj.state;
		if (Array.isArray(state.cars)) return carsFromUnknown(state.cars);
	}
	if (Array.isArray(obj.cars)) return carsFromUnknown(obj.cars);
	return [];
}
function parseMoneyField(raw) {
	if (!raw || raw === "не заполнено" || raw === "—") return NaN;
	return parseMoney(raw.replace(/руб\.?/gi, ""));
}
function parseHoursField(raw) {
	const text = raw.trim();
	if (!text) return 0;
	const hours = text.match(/(\d+(?:[.,]\d+)?)\s*Ч/i);
	const mins = text.match(/(\d+)\s*мин/i);
	const h = hours ? Number(hours[1].replace(",", ".")) : 0;
	const m = mins ? Number(mins[1]) : 0;
	return (Number.isFinite(h) ? h : 0) + (Number.isFinite(m) ? m / 60 : 0);
}
function parsePlateField(raw) {
	const cleaned = raw.replace(/—/g, " ").trim();
	if (!cleaned) return {
		plate: "",
		region: ""
	};
	const parts = cleaned.split(/\s+/);
	if (parts.length >= 2) return {
		plate: parts[0] ?? "",
		region: parts[parts.length - 1] ?? ""
	};
	return {
		plate: cleaned,
		region: ""
	};
}
function parseLegacyText(text) {
	const cars = [];
	for (const line of text.split(/\r?\n/)) {
		if (!/^\s*\d+\.\s+/.test(line) || !line.includes("|")) continue;
		const chunks = line.split("|").map((part) => part.trim());
		const name = (chunks[0] ?? "").replace(/^\s*\d+\.\s+/, "").trim();
		if (!name) continue;
		const fields = {};
		for (const chunk of chunks.slice(1)) {
			const idx = chunk.indexOf(":");
			if (idx === -1) continue;
			fields[chunk.slice(0, idx).trim()] = chunk.slice(idx + 1).trim();
		}
		const plateInfo = parsePlateField(fields["Госномер"] ?? "");
		const officialRaw = fields["Госстоимость"];
		const official = officialRaw ? parseMoneyField(officialRaw) : NaN;
		const now = Date.now();
		const car = normalizeCar({
			id: newId(),
			name,
			plate: plateInfo.plate,
			region: plateInfo.region,
			imageData: null,
			price: parseMoneyField(fields["Цена"] ?? "0") || 0,
			scrapPrice: parseMoneyField(fields["Слив по свалке"] ?? "0") || 0,
			officialPrice: Number.isFinite(official) ? official : null,
			expenses: parseMoneyField(fields["Расходы"] ?? "0") || 0,
			hours: parseHoursField(fields["Часов"] ?? "0"),
			earnedToday: parseMoneyField(fields["За день"] ?? "0") || 0,
			earnedWeek: parseMoneyField(fields["За неделю"] ?? "0") || 0,
			earnedMonth: parseMoneyField(fields["За месяц"] ?? "0") || 0,
			earnedTotal: parseMoneyField(fields["Всего"] ?? "0") || 0,
			logs: [],
			createdAt: now
		});
		if (car) cars.push(car);
	}
	return cars;
}
function parseBackupText(text) {
	const trimmed = text.replace(/^\uFEFF/, "").trim();
	if (!trimmed) return [];
	const marker = trimmed.indexOf(BACKUP_MARKER);
	if (marker !== -1) {
		const jsonPart = trimmed.slice(marker + BACKUP_MARKER.length).trim();
		try {
			const cars = carsFromUnknown(JSON.parse(jsonPart));
			if (cars.length) return cars;
		} catch {}
	}
	if (trimmed.startsWith("{") || trimmed.startsWith("[")) try {
		const cars = carsFromUnknown(JSON.parse(trimmed));
		if (cars.length) return cars;
	} catch {}
	return parseLegacyText(trimmed);
}
async function parseBackupFile(file) {
	return parseBackupText(await file.text());
}
function GarageHeader() {
	const count = useGarage((s) => s.cars.length);
	const search = useGarage((s) => s.search);
	const setSearch = useGarage((s) => s.setSearch);
	const openWizard = useGarage((s) => s.openWizard);
	const openReset = useGarage((s) => s.openReset);
	const cars = useGarage((s) => s.cars);
	const pushToast = useGarage((s) => s.pushToast);
	const requestImport = useGarage((s) => s.requestImport);
	const fileRef = (0, import_react.useRef)(null);
	const exportLog = () => {
		playClick();
		if (!cars.length) {
			pushToast("В базе нет автомобилей");
			return;
		}
		exportGarageLog(cars);
		pushToast("Лог выгружен");
	};
	const pickImport = () => {
		playClick();
		fileRef.current?.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "garage-header relative z-[70] shrink-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".txt,.json,.garazh,application/json,text/plain",
				className: "hidden",
				onChange: async (event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (!file) return;
					try {
						const imported = await parseBackupFile(file);
						requestImport(imported);
					} catch {
						pushToast("Не удалось прочитать файл", "error");
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col gap-3 px-4 pt-3 pb-3 md:flex-row md:items-center md:gap-4 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 md:contents",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkRentLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: ["Автомобилей: ", count]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-block size-2 rounded-full bg-primary-hi",
									title: "База онлайн"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-3 md:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
									onClick: pickImport,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarGlyph, { className: "size-3.5" }), "Загрузить авто"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
									onClick: exportLog,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Выгрузить лог"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
									onClick: () => {
										playClick();
										openReset();
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Сброс"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "relative hidden min-w-0 w-full sm:block md:ml-2 md:w-52 md:shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field h-10 pl-9",
							placeholder: "Поиск",
							value: search,
							onChange: (event) => setSearch(event.target.value),
							"aria-label": "Поиск"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center md:pointer-events-none md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg md:pointer-events-auto",
							onClick: () => {
								playClick();
								openWizard();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "size-4 shrink-0",
								strokeWidth: 2.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Новое авто" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 items-center gap-4 md:pointer-events-auto md:flex md:right-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
								onClick: pickImport,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarGlyph, { className: "size-3.5" }), "Загрузить авто"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
								onClick: exportLog,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }), "Выгрузить лог"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex min-h-10 items-center gap-1.5 text-sm text-muted hover:text-fg",
								onClick: () => {
									playClick();
									openReset();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Сброс"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pb-3 sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field h-10 pl-9",
						placeholder: "Поиск",
						value: search,
						onChange: (event) => setSearch(event.target.value),
						"aria-label": "Поиск"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "header-pulse-line",
				"aria-hidden": "true"
			})
		]
	});
}
var ORDER = [
	"RU1",
	"RU2",
	"RU3"
];
function ApiPanel() {
	const apiKey = useGarage((s) => s.apiKey);
	const apiServer = useGarage((s) => s.apiServer);
	const apiPulse = useGarage((s) => s.apiPulse);
	const setApiKey = useGarage((s) => s.setApiKey);
	const selectApiServer = useGarage((s) => s.selectApiServer);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const saved = apiServer ? API_SERVERS[apiServer] : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "backdrop-enter backdrop-blurred fixed inset-0 z-40 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-enter modal-shell relative w-full max-w-md overflow-hidden",
			role: "dialog",
			"aria-modal": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "modal-cap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "modal-cap-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "modal-cap-title",
						children: "API"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "modal-x",
						"aria-label": "Закрыть",
						onClick: () => {
							playClick();
							closeOverlay();
						},
						children: "×"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "header-pulse-line",
					"aria-hidden": "true"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-7 pt-6 pb-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-xs leading-relaxed text-muted",
						children: "Ключ сохранится на этом устройстве. Запросы уходят только когда вы сами обновляете рынок."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-6 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mb-1.5 block text-xs text-muted",
							children: "API ключ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							autoFocus: true,
							type: "password",
							autoComplete: "off",
							placeholder: "Вставьте ключ",
							value: apiKey,
							onChange: (event) => setApiKey(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2",
						children: ORDER.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `btn-fill h-12 w-full text-sm ${apiServer === id ? "btn-green" : "btn-ghost"}`,
							onClick: () => {
								playClick();
								selectApiServer(id);
							},
							children: API_SERVERS[id]
						}, id))
					}),
					apiServer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "api-saved mt-6 flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "api-check",
								"aria-hidden": "true",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									viewBox: "0 0 48 48",
									className: "size-14",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										cx: "24",
										cy: "24",
										r: "21",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "1.6"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										d: "M15 24.5 21 30.5 33.5 17",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2.2",
										strokeLinecap: "round",
										strokeLinejoin: "round"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-medium",
								children: "Данные сохранены"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-subtle",
								children: ["ваш сервер ", saved]
							})
						]
					}, apiPulse) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-center text-xs text-subtle",
						children: "Сервер ещё не выбран"
					})
				]
			})]
		})
	});
}
function rotate(v, ax, ay) {
	const [x, y, z] = v;
	const cosY = Math.cos(ay);
	const sinY = Math.sin(ay);
	const x1 = x * cosY - z * sinY;
	const z1 = x * sinY + z * cosY;
	const cosX = Math.cos(ax);
	const sinX = Math.sin(ax);
	return [
		x1,
		y * cosX - z1 * sinX,
		y * sinX + z1 * cosX
	];
}
function project(v, cx, cy, scale) {
	const persp = 2.6 / (2.6 - v[2]);
	return [
		cx + v[0] * scale * persp,
		cy - v[1] * scale * persp,
		persp
	];
}
function drawMedian(ctx, w, h, ratings, active) {
	ctx.clearRect(0, 0, w, h);
	const cx = w / 2;
	const cy = h / 2 + 2;
	const ax = .52;
	const ay = .72;
	const byKey = Object.fromEntries(ratings.map((row) => [row.key, row]));
	const arms = [
		{
			key: "excellent",
			v: [
				-1,
				.15,
				-.2
			],
			color: byKey.excellent?.color ?? "#3cb85c",
			score: byKey.excellent?.score ?? 0
		},
		{
			key: "popular",
			v: [
				1,
				.2,
				.15
			],
			color: byKey.popular?.color ?? "#5aa0d6",
			score: byKey.popular?.score ?? 0
		},
		{
			key: "average",
			v: [
				-.15,
				-1,
				.2
			],
			color: byKey.average?.color ?? "#c4c4cc",
			score: byKey.average?.score ?? 0
		},
		{
			key: "terrible",
			v: [
				.2,
				.05,
				1
			],
			color: byKey.terrible?.color ?? "#e04444",
			score: byKey.terrible?.score ?? 0
		}
	];
	const top = [
		0,
		1.05,
		0
	];
	const bot = [
		0,
		-1.05,
		0
	];
	const equator = arms.map((arm) => {
		const pull = Math.max(0, Math.min(1, arm.score));
		const len = .16 + Math.pow(pull, .75) * 1.5;
		return {
			...arm,
			v: [
				arm.v[0] * len,
				arm.v[1] * len,
				arm.v[2] * len
			]
		};
	});
	const rotFaces = [
		[
			top,
			equator[0].v,
			equator[2].v,
			equator[0].color,
			(equator[0].score + equator[2].score) / 2
		],
		[
			top,
			equator[1].v,
			equator[0].v,
			equator[1].color,
			(equator[1].score + equator[0].score) / 2
		],
		[
			top,
			equator[3].v,
			equator[1].v,
			equator[3].color,
			(equator[3].score + equator[1].score) / 2
		],
		[
			top,
			equator[2].v,
			equator[3].v,
			"#889",
			.3
		],
		[
			bot,
			equator[2].v,
			equator[0].v,
			equator[2].color,
			(equator[2].score + equator[0].score) / 2
		],
		[
			bot,
			equator[0].v,
			equator[1].v,
			equator[0].color,
			.35
		],
		[
			bot,
			equator[1].v,
			equator[3].v,
			equator[1].color,
			.35
		],
		[
			bot,
			equator[3].v,
			equator[2].v,
			equator[3].color,
			(equator[3].score + equator[2].score) / 2
		]
	].map((face) => {
		const a = rotate(face[0], ax, ay);
		const b = rotate(face[1], ax, ay);
		const c = rotate(face[2], ax, ay);
		const z = (a[2] + b[2] + c[2]) / 3;
		return {
			a,
			b,
			c,
			color: face[3],
			score: face[4],
			z
		};
	}).sort((l, r) => l.z - r.z);
	const scale = Math.min(w, h) * .28;
	for (const face of rotFaces) {
		const pa = project(face.a, cx, cy, scale);
		const pb = project(face.b, cx, cy, scale);
		const pc = project(face.c, cx, cy, scale);
		ctx.beginPath();
		ctx.moveTo(pa[0], pa[1]);
		ctx.lineTo(pb[0], pb[1]);
		ctx.lineTo(pc[0], pc[1]);
		ctx.closePath();
		ctx.fillStyle = hexAlpha(face.color, .16 + face.score * .28);
		ctx.fill();
		ctx.strokeStyle = hexAlpha(face.color, .45 + face.score * .35);
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	const p = project(rotate([
		0,
		0,
		0
	], ax, ay), cx, cy, scale);
	const glow = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 18);
	glow.addColorStop(0, hexAlpha(active.color, .85));
	glow.addColorStop(.4, hexAlpha(active.color, .25));
	glow.addColorStop(1, hexAlpha(active.color, 0));
	ctx.fillStyle = glow;
	ctx.beginPath();
	ctx.arc(p[0], p[1], 18, 0, Math.PI * 2);
	ctx.fill();
}
function hexAlpha(color, a) {
	if (color.startsWith("#") && color.length === 7) {
		const n = Number.parseInt(color.slice(1), 16);
		return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
	}
	return color;
}
function MedianScene({ car }) {
	const wrapRef = (0, import_react.useRef)(null);
	const ref = (0, import_react.useRef)(null);
	const { ratings, active } = ratingModel(car);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		const wrap = wrapRef.current;
		if (!canvas || !wrap) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		let w = 220;
		let h = 180;
		const paint = () => {
			const model = ratingModel(car);
			drawMedian(ctx, w, h, model.ratings, model.active);
		};
		const resize = () => {
			w = Math.max(180, wrap.clientWidth);
			h = Math.max(180, wrap.clientHeight);
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			paint();
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(wrap);
		return () => observer.disconnect();
	}, [car]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative min-h-52 w-full flex-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
			ref,
			className: "absolute inset-0 h-full w-full",
			"aria-hidden": "true"
		}), ratings.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `pointer-events-none absolute text-[10px] font-medium tracking-wide ${row.key === "excellent" ? "top-2 left-2" : row.key === "popular" ? "top-2 right-2 text-right" : row.key === "average" ? "bottom-2 left-2" : "right-2 bottom-2 text-right"}`,
			style: {
				color: row.color,
				opacity: row.key === active.key ? 1 : .55
			},
			children: row.label
		}, row.key))]
	});
}
function PopularityScale({ car }) {
	const score = popularityScore(car);
	const meta = popularityMeta(score);
	const color = popularityColor(score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1.5 flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] tracking-wide text-muted",
					children: "Популярность"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-medium",
					style: { color },
					children: meta.label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "popularity-scale",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popularity-ticks",
					"aria-hidden": "true",
					children: Array.from({ length: 21 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: i % 5 === 0 ? "major" : "minor" }, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "popularity-fill",
					style: {
						width: `${Math.max(4, score * 100)}%`,
						background: color
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-center text-[10px] leading-snug text-subtle",
				children: meta.hint
			})
		]
	});
}
function MedianPanel({ car }) {
	const owned = daysOwned(car);
	const ready = owned >= 7;
	const { active } = ratingModel(car);
	const left = Math.max(0, 7 - owned);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "median-frame mt-4 flex min-h-64 w-full flex-1 flex-col",
		children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedianScene, { car }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-center text-sm font-semibold",
				style: { color: active.color },
				children: active.label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 px-1 text-center text-[11px] leading-snug text-subtle",
				children: RATING_HINT[active.key]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopularityScale, { car })
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center px-3 py-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hourglass, {
					className: "size-8 text-subtle",
					strokeWidth: 1.4
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm font-medium text-fg",
					children: "Медиана пока закрыта"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-[11px] leading-relaxed text-subtle",
					children: [
						"Для корректной оценки нужно минимум ",
						7,
						" дней во владении. Сейчас ",
						owned,
						" из ",
						7,
						left ? ` — осталось ${left}.` : "."
					]
				})
			]
		})
	});
}
function RussianPlate({ plate, region }) {
	const parts = splitPlate(plate);
	const letter = parts.letter || "·";
	const digits = (parts.digits || "···").padEnd(3, "·").slice(0, 3);
	const letters = (parts.letters || "··").padEnd(2, "·").slice(0, 2);
	const code = region || "··";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ru-plate",
		"aria-label": `Госномер ${plate} ${region}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ru-plate-main",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ru-plate-row",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ru-plate-letter",
							children: letter
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ru-plate-digits",
							children: digits.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ch }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ru-plate-letters",
							children: letters.split("").map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ch }, i))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ru-plate-split",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ru-plate-region",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ru-plate-code",
						children: code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ru-plate-rus",
						children: "RUS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ru-plate-flag",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
						]
					})
				]
			})
		]
	});
}
function hueFor(value) {
	return value <= .5 ? value * 2 * 42 : 42 + (value - .5) * 2 * 88;
}
function PaybackBar({ value }) {
	const t = Math.max(0, Math.min(1, value));
	const color = `hsl(${hueFor(t)} 82% 52%)`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "payback-track",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "payback-fill",
				style: {
					width: `${Math.max(t > 0 ? 2 : 0, t * 100)}%`,
					background: color
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-center text-xs tabular-nums text-muted",
			children: percent(t * 100)
		})]
	});
}
function CheckMark({ on }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex size-5 shrink-0 items-center justify-center border ${on ? "border-primary-hi" : "border-subtle"}`,
		"aria-hidden": "true",
		children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3.5 text-primary-hi",
			strokeWidth: 3
		}) : null
	});
}
function TextAction({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "inline-flex min-h-8 items-center gap-1 text-xs text-muted hover:text-fg",
		onClick: () => {
			playClick();
			onClick();
		},
		children
	});
}
function SignStack({ label, onPlus, onMinus }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute top-1/2 right-1 flex -translate-y-1/2 flex-col gap-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "sign-btn",
			"aria-label": `Добавить ${label}`,
			onClick: () => {
				playClick();
				onPlus();
			},
			children: "+"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "sign-btn",
			"aria-label": `Убавить ${label}`,
			onClick: () => {
				playClick();
				onMinus();
			},
			children: "−"
		})]
	});
}
function StatRow({ label, value, checked, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-line py-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "min-w-0 flex-1 text-xs text-muted",
					children: label
				}),
				action,
				checked == null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckMark, { on: checked })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm font-medium tabular-nums",
			children: value
		})]
	});
}
function InfoRow({ label, value, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-end justify-between gap-4 border-b border-line py-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: "flex items-center gap-2 font-medium tabular-nums",
			children: [value, action]
		})]
	});
}
function WideButton({ children, onClick, tone = "ghost" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `btn-fill h-11 w-full overflow-hidden text-sm tracking-[0.14em] ${tone === "quiet" ? "btn-quiet" : "btn-ghost"}`,
		onClick: () => {
			playClick();
			onClick();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 truncate",
			children
		})
	});
}
function DetailsOverlay({ car }) {
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const refreshCar = useGarage((s) => s.refreshCar);
	const openOfficial = useGarage((s) => s.openOfficial);
	const openExpense = useGarage((s) => s.openExpense);
	const openExpenseSub = useGarage((s) => s.openExpenseSub);
	const openRepair = useGarage((s) => s.openRepair);
	const openRepairSub = useGarage((s) => s.openRepairSub);
	const openTariff = useGarage((s) => s.openTariff);
	const openPlate = useGarage((s) => s.openPlate);
	const openMarket = useGarage((s) => s.openMarket);
	const openSell = useGarage((s) => s.openSell);
	const openEditEarn = useGarage((s) => s.openEditEarn);
	const openClearLog = useGarage((s) => s.openClearLog);
	const openRename = useGarage((s) => s.openRename);
	const openModel = useGarage((s) => s.openModel);
	const openOwnedDays = useGarage((s) => s.openOwnedDays);
	const openUndoRent = useGarage((s) => s.openUndoRent);
	const setCarImage = useGarage((s) => s.setCarImage);
	const logRange = useGarage((s) => s.logRange);
	const setLogRange = useGarage((s) => s.setLogRange);
	const pushToast = useGarage((s) => s.pushToast);
	const fileRef = (0, import_react.useRef)(null);
	const ratio = paybackPercent(car) / 100;
	const owned = daysOwned(car);
	const extra = surplus(car);
	const activeLogs = logRange === "month" ? car.monthLogs ?? [] : car.logs;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "backdrop-enter backdrop-blurred fixed inset-0 z-40 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "modal-enter mx-auto flex h-full w-full max-w-[74rem] flex-col px-3 py-5 md:px-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "details-board min-h-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "details-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-1 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextAction, {
									onClick: () => refreshCar(car.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-3.5" }), "Обновить"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaybackBar, { value: ratio }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Госстоимость",
								value: car.officialPrice == null ? "не заполнено" : money(car.officialPrice),
								checked: reached(car.earnedTotal, car.officialPrice),
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAction, {
									onClick: openOfficial,
									children: car.officialPrice == null ? "Заполнить" : "Изменить"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Цена",
								value: money(car.price),
								checked: reached(car.earnedTotal, car.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Слив по свалке",
								value: money(car.scrapPrice),
								checked: reached(car.earnedTotal, car.scrapPrice)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 border-b border-line py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Разница"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `mt-1 text-sm font-medium tabular-nums ${extra > 0 ? "text-primary-hi" : ""}`,
									children: extra > 0 ? `+ ${money(extra)}` : money(leftover(car))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Проценты"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-medium tabular-nums",
									children: percent(paybackPercent(car))
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative border-b border-line py-2.5 pr-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignStack, {
										label: "расход",
										onPlus: openExpense,
										onMinus: openExpenseSub
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Расходы"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium tabular-nums",
										children: money(car.expenses)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative border-b border-line py-2.5 pr-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignStack, {
										label: "ремонт",
										onPlus: openRepair,
										onMinus: openRepairSub
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Ремонт"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium tabular-nums",
										children: money(car.repairs || 0)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MedianPanel, { car })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pulse-rule",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "details-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: "image/png,image/jpeg,image/webp,image/bmp",
								className: "hidden",
								onChange: async (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									if (!file) return;
									try {
										const data = await readCarImage(file);
										setCarImage(car.id, data);
										albumPut(car.name, data);
									} catch {
										pushToast("Не удалось прочитать файл", "error");
									}
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "car-photo mb-3 h-36 bg-surface",
								children: [
									car.imageData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: car.imageData,
										alt: "",
										className: "car-photo-img"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "flex h-full w-full flex-col items-center justify-center gap-2",
										onClick: () => {
											playClick();
											fileRef.current?.click();
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
											className: "size-10 text-fg opacity-[0.14]",
											strokeWidth: 1.25
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs tracking-wide text-fg opacity-25",
											children: "Добавить изображение"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "car-rgb",
										"aria-hidden": "true"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QualityPip, {
										price: car.officialPrice,
										className: "on-photo"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-center text-base font-semibold",
									children: car.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAction, {
									onClick: openRename,
									children: "Изменить"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "plate-well mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RussianPlate, {
									plate: car.plate,
									region: car.region
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs text-muted hover:text-fg",
									onClick: () => {
										playClick();
										openPlate();
									},
									children: "Изменить"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 space-y-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
										label: "Во владении",
										value: `${owned} ${daysWord(owned)}`,
										action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextAction, {
											onClick: openOwnedDays,
											children: "Изменить"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3 border-b border-line py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-muted",
											children: "Тариф"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "btn-fill btn-ghost h-8 min-w-28 px-3 text-xs",
											onClick: () => {
												playClick();
												openTariff();
											},
											children: "Подробнее"
										}) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
										label: "Сегодня",
										value: money(car.earnedToday)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
										label: "За неделю",
										value: money(car.earnedWeek)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
										label: "За месяц",
										value: money(car.earnedMonth)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoRow, {
										label: "Всего",
										value: money(car.earnedTotal)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextAction, {
									onClick: openEditEarn,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" }), "Редактировать"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto flex flex-col gap-2.5 pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideButton, {
										onClick: openUndoRent,
										children: "Отменить последнюю аренду"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideButton, {
										onClick: openModel,
										children: car.model ? `Модель · ${car.model}` : "Модель"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideButton, {
										onClick: openMarket,
										children: "Рынок авто"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideButton, {
										onClick: openSell,
										children: "Продать авто"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WideButton, {
										onClick: closeOverlay,
										children: "Закрыть"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pulse-rule",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "details-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `text-xs tracking-wide ${logRange === "week" ? "text-fg" : "text-subtle hover:text-muted"}`,
									onClick: () => {
										playClick();
										setLogRange("week");
									},
									children: "Неделя"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: `text-xs tracking-wide ${logRange === "month" ? "text-fg" : "text-subtle hover:text-muted"}`,
									onClick: () => {
										playClick();
										setLogRange("month");
									},
									children: "Месяц"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TextAction, {
										onClick: openClearLog,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Очистить"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-box min-h-0 flex-1 overflow-y-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[1.1fr_0.7fr_0.6fr_1fr] gap-x-2 border-b border-line px-2 py-1.5 text-[11px] text-subtle",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Дата" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Время" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Часы" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Цена" })
								]
							}), activeLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 py-6 text-center text-xs text-subtle",
								children: "Пока нет записей"
							}) : activeLogs.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[1.1fr_0.7fr_0.6fr_1fr] gap-x-2 border-b border-line px-2 py-2 text-xs tabular-nums",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(row.at) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatTime(row.at) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hoursLabel(row.hours) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(row.amount) })
								]
							}, row.id))]
						})]
					})
				]
			})
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var WINDOW_MS = 6e4;
var MAX_CALLS = 5;
var recent = [];
function marketSlotsLeft(now = Date.now()) {
	const fresh = recent.filter((at) => now - at < WINDOW_MS);
	recent.splice(0, recent.length, ...fresh);
	return MAX_CALLS - fresh.length;
}
function markMarketCall(now = Date.now()) {
	recent.push(now);
}
function foldName(value) {
	return value.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "");
}
function matchVehicle(vehicles, carName, modelCode = "") {
	const code = foldName(modelCode);
	if (code) {
		const exactCode = vehicles.find((row) => foldName(row.model) === code || foldName(row.modelName) === code);
		if (exactCode) return exactCode;
		const fuzzyCode = vehicles.find((row) => {
			const model = foldName(row.model);
			const name = foldName(row.modelName);
			return model && (model.includes(code) || code.includes(model)) || name && (name.includes(code) || code.includes(name));
		});
		if (fuzzyCode) return fuzzyCode;
	}
	const needle = foldName(carName);
	if (!needle) return null;
	const exact = vehicles.find((row) => foldName(row.modelName) === needle || foldName(row.model) === needle);
	if (exact) return exact;
	return vehicles.find((row) => {
		const name = foldName(row.modelName);
		const model = foldName(row.model);
		return name.includes(needle) || needle.includes(name) || model && (model.includes(needle) || needle.includes(model));
	}) ?? null;
}
var fetchMarketplace = createServerFn({ method: "POST" }).validator((input) => {
	const apiKey = input.apiKey.trim();
	const serverId = input.serverId;
	if (!apiKey) throw new Error("Введите API ключ");
	if (serverId !== "RU1" && serverId !== "RU2" && serverId !== "RU3") throw new Error("Выберите сервер");
	return {
		apiKey,
		serverId
	};
}).handler(createSsrRpc("5dcf996188cea6e81485fbaab4e99d5c4d3c01274181abd6c6625ca67f26a49c"));
function MarketPanel() {
	const apiKey = useGarage((s) => s.apiKey);
	const apiServer = useGarage((s) => s.apiServer);
	const detailsId = useGarage((s) => s.detailsId);
	const car = useGarage((s) => s.cars.find((row) => row.id === detailsId) ?? null);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const pushToast = useGarage((s) => s.pushToast);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [row, setRow] = (0, import_react.useState)(null);
	const [period, setPeriod] = (0, import_react.useState)(null);
	const serverName = apiServer ? API_SERVERS[apiServer] : "Сервер не выбран";
	const advised = car && row ? recommendSellPrice(car, row) : null;
	const refresh = async () => {
		if (!car) return;
		if (!apiKey.trim()) {
			pushToast("Сначала сохраните API ключ", "error");
			setError("Нет API ключа. Откройте API и вставьте ключ.");
			return;
		}
		if (!apiServer) {
			pushToast("Выберите сервер в окне API", "error");
			setError("Сервер не выбран.");
			return;
		}
		if (!car.model.trim()) {
			pushToast("Сначала укажите модель машины", "error");
			setError("У этой машины не задана модель. Откройте карточку и нажмите «Модель».");
			return;
		}
		if (marketSlotsLeft() <= 0) {
			pushToast("Лимит: 5 запросов в минуту", "error");
			setError("Слишком часто. Можно 5 обновлений за 60 секунд.");
			return;
		}
		markMarketCall();
		setLoading(true);
		setError("");
		try {
			const result = await fetchMarketplace({ data: {
				apiKey: apiKey.trim(),
				serverId: apiServer
			} });
			if (!result.ok) {
				setRow(null);
				setError(result.message);
				pushToast(result.message, "error");
				return;
			}
			setPeriod(result.data.periodDays);
			const found = matchVehicle(result.data.vehicles, car.name, car.model);
			setRow(found);
			if (!found) setError(`На ${serverName} нет модели «${car.model}».`);
		} catch {
			setError("Не удалось получить рынок.");
			pushToast("Не удалось получить рынок", "error");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "backdrop-enter backdrop-blurred fixed inset-0 z-40 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-enter mx-auto flex h-full w-full max-w-3xl flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "modal-cap shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "modal-cap-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "modal-cap-title",
							children: "Рынок авто"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "modal-x",
							"aria-label": "Закрыть",
							onClick: () => {
								playClick();
								closeOverlay();
							},
							children: "×"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "header-pulse-line",
						"aria-hidden": "true"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 px-5 pt-5 pb-4 md:px-7",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-extrabold tracking-[0.08em] text-fg",
							children: serverName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 truncate text-sm text-muted",
							children: [car?.name ?? "Машина не выбрана", car?.model ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-subtle",
								children: [" · ", car.model]
							}) : null]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm text-muted hover:text-fg",
						onClick: () => {
							playClick();
							refresh();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: `size-3.5 ${loading ? "animate-spin" : ""}` }), "Обновить"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "market-stage mx-4 mb-5 min-h-0 flex-1 overflow-y-auto p-5 md:mx-6 md:p-6",
					children: [
						!car ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Откройте рынок из карточки машины."
						}) : null,
						car && !row && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: [
								"Нажмите «Обновить» — запрос уйдёт только тогда. Рынок ищется по модели",
								car.model ? ` «${car.model}»` : "",
								"."
							]
						}), !car.model ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-subtle",
							children: "Сначала задайте модель в карточке, иначе сервер не поймёт машину."
						}) : null] }) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: error
						}) : null,
						row && car ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[0.68rem] font-semibold tracking-[0.22em] text-subtle uppercase",
								children: "Название"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1 text-2xl font-extrabold tracking-wide",
								children: row.modelName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-subtle",
								children: [
									"Модель ",
									row.model || car.model,
									period ? ` · статистика за ${period} дн.` : ""
								]
							}),
							advised != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "market-hero mt-5 px-5 py-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold tracking-[0.18em] text-[#e4bc4a] uppercase",
									children: "Рекомендуемая цена"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-4xl font-extrabold tracking-wide text-fg tabular-nums",
									children: money(advised)
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-3 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
										label: "Сейчас на продаже",
										value: `${row.totalCount} шт.`,
										accent: "#8ed4ff"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
										label: "Продано",
										value: `${row.soldCount} шт.`,
										accent: "#e4bc4a"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
										label: "Минимальная",
										value: money(row.minPrice),
										accent: "#9a9aa4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
										label: "Максимальная",
										value: money(row.maxPrice),
										accent: "#e23b3b"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
										label: "Средняя по рынку",
										value: money(row.averagePrice),
										accent: "#3cb85c",
										wide: true
									})
								]
							})
						] }) : null
					]
				})
			]
		})
	});
}
function Tile({ label, value, accent, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `market-tile px-4 py-3.5 ${wide ? "sm:col-span-2" : ""}`,
		style: { ["--accent"]: accent },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xl font-bold tabular-nums",
			children: value
		})]
	});
}
function Actions({ nextLabel, onNext, backLabel, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 flex flex-wrap items-center justify-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: onNext,
			children: nextLabel
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: onBack,
			children: backLabel
		})]
	});
}
function WizardModal() {
	const step = useGarage((s) => s.wizardStep);
	const draftName = useGarage((s) => s.draftName);
	const draftPlate = useGarage((s) => s.draftPlate);
	const draftRegion = useGarage((s) => s.draftRegion);
	const draftImage = useGarage((s) => s.draftImage);
	const draftPrice = useGarage((s) => s.draftPrice);
	const draftScrap = useGarage((s) => s.draftScrap);
	const draftOfficial = useGarage((s) => s.draftOfficial);
	const draftHourly = useGarage((s) => s.draftHourly);
	const draftDaily = useGarage((s) => s.draftDaily);
	const setDraftName = useGarage((s) => s.setDraftName);
	const setDraftPlate = useGarage((s) => s.setDraftPlate);
	const setDraftRegion = useGarage((s) => s.setDraftRegion);
	const setDraftImage = useGarage((s) => s.setDraftImage);
	const setDraftPrice = useGarage((s) => s.setDraftPrice);
	const setDraftScrap = useGarage((s) => s.setDraftScrap);
	const setDraftOfficial = useGarage((s) => s.setDraftOfficial);
	const pickAcquire = useGarage((s) => s.pickAcquire);
	const wizardNext = useGarage((s) => s.wizardNext);
	const wizardBack = useGarage((s) => s.wizardBack);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const openTariffEdit = useGarage((s) => s.openTariffEdit);
	const pushToast = useGarage((s) => s.pushToast);
	const fileRef = (0, import_react.useRef)(null);
	const next = () => {
		playClick();
		wizardNext();
	};
	const back = () => {
		playClick();
		if (step === "name") closeOverlay();
		else wizardBack();
	};
	let body = null;
	if (step === "acquire") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 flex flex-col gap-3 sm:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-24 flex-1 px-4 text-sm",
			onClick: () => {
				playClick();
				pickAcquire("free");
			},
			children: "Бесплатно"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-24 flex-1 px-4 text-sm",
			onClick: () => {
				playClick();
				pickAcquire("paid");
			},
			children: "Платно"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})
	})] });
	else if (step === "name") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto mt-6 w-full max-w-xs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field",
			autoFocus: true,
			placeholder: "Например: Benefactor Schafter",
			value: draftName,
			onChange: (event) => setDraftName(event.target.value),
			onKeyDown: (event) => {
				if (event.key === "Enter") next();
			}
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		nextLabel: "Далее",
		onNext: next,
		backLabel: "Назад",
		onBack: back
	})] });
	else if (step === "plate") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mt-6 flex w-full max-w-sm items-end justify-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-xs text-muted",
				children: "Номер"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field font-semibold tracking-[0.18em]",
				autoFocus: true,
				placeholder: "А123АА",
				value: draftPlate,
				maxLength: 6,
				onChange: (event) => setDraftPlate(sanitizePlate(event.target.value)),
				onKeyDown: (event) => {
					if (event.key === "Enter") next();
				},
				"aria-label": "Госномер"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "block w-[4.75rem] shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-xs text-muted",
				children: "Регион"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field px-2 text-center font-semibold tabular-nums",
				inputMode: "numeric",
				placeholder: "777",
				value: draftRegion,
				maxLength: 3,
				onChange: (event) => setDraftRegion(sanitizeRegion(event.target.value)),
				onKeyDown: (event) => {
					if (event.key === "Enter") next();
				},
				"aria-label": "Регион"
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		nextLabel: "Далее",
		onNext: next,
		backLabel: "Назад",
		onBack: back
	})] });
	else if (step === "image") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-center text-xs text-muted",
			children: draftImage ? "Файл выбран и попадёт в локальный альбом по названию." : "Можно пропустить."
		}),
		draftImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-4 h-28 w-full max-w-xs overflow-hidden bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: draftImage,
				alt: "",
				className: "h-full w-full object-contain"
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex justify-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/png,image/jpeg,image/webp,image/bmp",
				className: "hidden",
				onChange: async (event) => {
					const file = event.target.files?.[0];
					event.target.value = "";
					if (!file) return;
					try {
						const data = await readCarImage(file);
						setDraftImage(data);
						albumPut(draftName, data);
						pushToast("Изображение сохранено в альбом", "info");
					} catch {
						pushToast("Не удалось прочитать файл", "error");
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-40 px-6 text-sm",
				onClick: () => {
					playClick();
					fileRef.current?.click();
				},
				children: "Открыть файл"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
			nextLabel: "Далее",
			onNext: next,
			backLabel: "Назад",
			onBack: back
		})
	] });
	else if (step === "buy") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mt-6 w-full max-w-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field",
			autoFocus: true,
			inputMode: "decimal",
			placeholder: "0",
			value: draftPrice,
			onChange: (event) => setDraftPrice(event.target.value),
			onKeyDown: (event) => {
				if (event.key === "Enter") next();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-right text-xs text-subtle",
			children: "руб."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		nextLabel: "Далее",
		onNext: next,
		backLabel: "Назад",
		onBack: back
	})] });
	else if (step === "official") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mt-6 w-full max-w-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field",
			autoFocus: true,
			inputMode: "decimal",
			placeholder: "0",
			value: draftOfficial,
			onChange: (event) => setDraftOfficial(event.target.value),
			onKeyDown: (event) => {
				if (event.key === "Enter") next();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-right text-xs text-subtle",
			children: "руб."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		nextLabel: "Далее",
		onNext: next,
		backLabel: "Назад",
		onBack: back
	})] });
	else if (step === "scrap") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto mt-6 w-full max-w-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			className: "field",
			autoFocus: true,
			inputMode: "decimal",
			placeholder: "0",
			value: draftScrap,
			onChange: (event) => setDraftScrap(event.target.value),
			onKeyDown: (event) => {
				if (event.key === "Enter") next();
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-right text-xs text-subtle",
			children: "руб."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
		nextLabel: "Далее",
		onNext: next,
		backLabel: "Назад",
		onBack: back
	})] });
	else {
		const hourly = draftHourly.trim() ? parseMoney(draftHourly) : NaN;
		const daily = draftDaily.trim() ? parseMoney(draftDaily) : NaN;
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-xs text-muted",
				children: "Задайте цену за час и за сутки. Потом создадим карточку."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn-fill btn-ghost h-20 flex-col px-3 text-sm",
					onClick: () => {
						playClick();
						openTariffEdit("hourly", "wizard");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Часовой" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: Number.isFinite(hourly) ? rateChip(hourly, "час") : "не задан"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn-fill btn-ghost h-20 flex-col px-3 text-sm",
					onClick: () => {
						playClick();
						openTariffEdit("daily", "wizard");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Суточный" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted",
						children: Number.isFinite(daily) ? rateChip(daily, "день") : "не задан"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Actions, {
				nextLabel: "Создать",
				onNext: next,
				backLabel: "Назад",
				onBack: back
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "backdrop-enter backdrop-blurred fixed inset-0 z-40 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "modal-enter modal-shell w-full max-w-md overflow-hidden",
			role: "dialog",
			"aria-modal": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "modal-cap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-cap-row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "modal-cap-title",
						children: {
							acquire: "Как получили авто?",
							name: "Название авто",
							plate: "Госномер",
							image: "Изображение",
							buy: "За сколько купили авто?",
							official: "Госцена",
							scrap: "Цена свалки",
							tariff: "Тариф"
						}[step]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "header-pulse-line",
					"aria-hidden": "true"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-7 pt-6 pb-7",
				children: body
			})]
		})
	});
}
function Modal({ title, titleClass, children, wide, roomy, layer, blur }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `backdrop-enter fixed inset-0 flex items-center justify-center p-4 ${layer === "sub" ? "z-50" : "z-40"} ${blur ? "backdrop-blurred" : "backdrop-plain"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `modal-enter modal-shell w-full overflow-hidden ${roomy ? "max-w-xl" : wide ? "max-w-md" : "max-w-sm"}`,
			role: "dialog",
			"aria-modal": "true",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "modal-cap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "modal-cap-row",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: `modal-cap-title ${titleClass ?? ""}`,
						children: title
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "header-pulse-line",
					"aria-hidden": "true"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-7 pt-6 pb-7",
				children
			})]
		})
	});
}
function ModalActions({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-8 flex flex-wrap items-center justify-center gap-4",
		children
	});
}
function RentOverlay() {
	const rentKind = useGarage((s) => s.rentKind);
	const rentStep = useGarage((s) => s.rentStep);
	const rentDuration = useGarage((s) => s.rentDuration);
	const rentAmount = useGarage((s) => s.rentAmount);
	const setRentKind = useGarage((s) => s.setRentKind);
	useGarage((s) => s.setRentDuration);
	const setRentAmount = useGarage((s) => s.setRentAmount);
	const rentNext = useGarage((s) => s.rentNext);
	const rentBack = useGarage((s) => s.rentBack);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	if (rentStep === "pick") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		wide: true,
		blur: true,
		title: "Сдать в аренду",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 flex flex-col gap-3 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-24 flex-1 flex-col gap-2 px-4 text-sm",
				onClick: () => {
					playClick();
					setRentKind("hourly");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
					className: "size-7 text-fg",
					strokeWidth: 1.6
				}), "Почасовая"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-24 flex-1 flex-col gap-2 px-4 text-sm",
				onClick: () => {
					playClick();
					setRentKind("daily");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
					className: "size-7 text-fg",
					strokeWidth: 1.6
				}), "Посуточная"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalActions, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		}) })]
	});
	if (rentStep === "duration") {
		const daily = rentKind === "daily";
		const count = daily ? 7 : 24;
		const pick = useGarage.getState().pickRentDuration;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			roomy: true,
			blur: true,
			title: daily ? "На сколько суток ушла машина?" : "На сколько часов ушла машина?",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mx-auto mt-6 grid w-full gap-1.5 ${daily ? "max-w-md grid-cols-7" : "grid-cols-6"}`,
				children: Array.from({ length: count }, (_, i) => i + 1).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: `btn-fill h-9 text-xs ${rentDuration === String(n) ? "btn-green" : "btn-ghost"}`,
					onClick: () => {
						playClick();
						pick(n);
					},
					children: n
				}, n))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalActions, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					rentBack();
				},
				children: "Назад"
			}) })]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		blur: true,
		title: "За сколько ушла машина?",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-6 w-full max-w-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field pr-28",
					autoFocus: true,
					inputMode: "decimal",
					placeholder: "0",
					value: rentAmount,
					onChange: (event) => setRentAmount(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							playClick();
							rentNext();
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute top-1/2 right-3 -translate-y-1/2 text-xs font-semibold text-muted hover:text-fg",
					onClick: () => {
						playClick();
						useGarage.getState().fillRentFromTariff();
					},
					children: "По тарифу"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-right text-xs text-subtle",
				children: "руб."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				rentNext();
			},
			children: "Далее"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				rentBack();
			},
			children: "Назад"
		})] })]
	});
}
function SubModals() {
	const subModal = useGarage((s) => s.subModal);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const draftOfficial = useGarage((s) => s.draftOfficial);
	const setDraftOfficial = useGarage((s) => s.setDraftOfficial);
	const saveOfficial = useGarage((s) => s.saveOfficial);
	const draftExpense = useGarage((s) => s.draftExpense);
	const setDraftExpense = useGarage((s) => s.setDraftExpense);
	const saveExpense = useGarage((s) => s.saveExpense);
	const expenseSign = useGarage((s) => s.expenseSign);
	const expenseTarget = useGarage((s) => s.expenseTarget);
	const draftEarnToday = useGarage((s) => s.draftEarnToday);
	const draftEarnWeek = useGarage((s) => s.draftEarnWeek);
	const draftEarnMonth = useGarage((s) => s.draftEarnMonth);
	const draftEarnTotal = useGarage((s) => s.draftEarnTotal);
	const setDraftEarnToday = useGarage((s) => s.setDraftEarnToday);
	const setDraftEarnWeek = useGarage((s) => s.setDraftEarnWeek);
	const setDraftEarnMonth = useGarage((s) => s.setDraftEarnMonth);
	const setDraftEarnTotal = useGarage((s) => s.setDraftEarnTotal);
	const saveEditEarn = useGarage((s) => s.saveEditEarn);
	const confirmClearLog = useGarage((s) => s.confirmClearLog);
	const logRange = useGarage((s) => s.logRange);
	const draftCarName = useGarage((s) => s.draftCarName);
	const setDraftCarName = useGarage((s) => s.setDraftCarName);
	const saveRename = useGarage((s) => s.saveRename);
	const draftModel = useGarage((s) => s.draftModel);
	const setDraftModel = useGarage((s) => s.setDraftModel);
	const saveModel = useGarage((s) => s.saveModel);
	const draftOwnedDays = useGarage((s) => s.draftOwnedDays);
	const setDraftOwnedDays = useGarage((s) => s.setDraftOwnedDays);
	const saveOwnedDays = useGarage((s) => s.saveOwnedDays);
	const confirmUndoRent = useGarage((s) => s.confirmUndoRent);
	const savePlate = useGarage((s) => s.savePlate);
	const draftPlate = useGarage((s) => s.draftPlate);
	const draftRegion = useGarage((s) => s.draftRegion);
	const setDraftPlate = useGarage((s) => s.setDraftPlate);
	const setDraftRegion = useGarage((s) => s.setDraftRegion);
	const openTariffEdit = useGarage((s) => s.openTariffEdit);
	const tariffKind = useGarage((s) => s.tariffKind);
	const tariffDraft = useGarage((s) => s.tariffDraft);
	const setTariffDraft = useGarage((s) => s.setTariffDraft);
	const saveTariffEdit = useGarage((s) => s.saveTariffEdit);
	const draftSale = useGarage((s) => s.draftSale);
	const setDraftSale = useGarage((s) => s.setDraftSale);
	const confirmSell = useGarage((s) => s.confirmSell);
	useGarage((s) => s.presentSale);
	const acceptSell = useGarage((s) => s.acceptSell);
	const saleNet = useGarage((s) => s.saleNet);
	useGarage((s) => s.saleGood);
	useGarage((s) => s.saleDetail);
	const detailsId = useGarage((s) => s.detailsId);
	const car = useGarage((s) => s.cars).find((row) => row.id === detailsId);
	const [selling, setSelling] = (0, import_react.useState)(false);
	if (subModal === "official") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Введите госстоимость",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-6 w-full max-w-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				autoFocus: true,
				inputMode: "decimal",
				placeholder: "0",
				value: draftOfficial,
				onChange: (event) => setDraftOfficial(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter") {
						playClick();
						saveOfficial();
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-right text-xs text-subtle",
				children: "руб."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				saveOfficial();
			},
			children: "Далее"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "expense") {
		const sub = expenseSign < 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			layer: "sub",
			title: expenseTarget === "repair" ? sub ? "Убавить ремонт" : "Добавить ремонт" : sub ? "Убавить расходы" : "Добавить расходы",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-6 w-full max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					autoFocus: true,
					inputMode: "decimal",
					placeholder: "0",
					value: draftExpense,
					onChange: (event) => setDraftExpense(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							playClick();
							saveExpense();
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-right text-xs text-subtle",
					children: "руб."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					saveExpense();
				},
				children: "Далее"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })]
		});
	}
	if (subModal === "edit-earn") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		wide: true,
		title: "Редактировать",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-6 w-full max-w-xs space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1.5 block text-xs text-muted",
						children: "Сегодня"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "decimal",
						value: draftEarnToday,
						onChange: (event) => setDraftEarnToday(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1.5 block text-xs text-muted",
						children: "За неделю"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "decimal",
						value: draftEarnWeek,
						onChange: (event) => setDraftEarnWeek(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1.5 block text-xs text-muted",
						children: "За месяц"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "decimal",
						value: draftEarnMonth,
						onChange: (event) => setDraftEarnMonth(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1.5 block text-xs text-muted",
						children: "Всего"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						inputMode: "decimal",
						value: draftEarnTotal,
						onChange: (event) => setDraftEarnTotal(event.target.value)
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				saveEditEarn();
			},
			children: "Далее"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "rename") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Название авто",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-6 w-full max-w-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				autoFocus: true,
				value: draftCarName,
				onChange: (event) => setDraftCarName(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter") {
						playClick();
						saveRename();
					}
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				saveRename();
			},
			children: "Сохранить"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "owned-days") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Дней во владении",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-6 w-full max-w-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				className: "field",
				autoFocus: true,
				inputMode: "numeric",
				value: draftOwnedDays,
				onChange: (event) => setDraftOwnedDays(event.target.value),
				onKeyDown: (event) => {
					if (event.key === "Enter") {
						playClick();
						saveOwnedDays();
					}
				}
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				saveOwnedDays();
			},
			children: "Сохранить"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "undo-rent") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Отменить последнюю аренду?",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center text-sm leading-relaxed text-muted",
			children: "Вы точно хотите отменить последнюю аренду? Сумма и запись исчезнут из логов."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-red h-11 min-w-36 px-5 text-sm",
			onClick: () => {
				playClick();
				confirmUndoRent();
			},
			children: "Отменить"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Назад"
		})] })]
	});
	if (subModal === "clear-log") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Очистить лог?",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-center text-sm leading-relaxed text-muted",
			children: logRange === "month" ? "Вы уверены, что хотите очистить лог за месяц?" : "Вы уверены, что хотите очистить лог за неделю?"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-red h-11 min-w-36 px-5 text-sm",
			onClick: () => {
				playClick();
				confirmClearLog();
			},
			children: "Очистить"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "plate") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		wide: true,
		title: "Госномер",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-6 flex w-full max-w-sm items-end justify-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-xs text-muted",
					children: "Номер"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field font-semibold tracking-[0.18em]",
					autoFocus: true,
					placeholder: "А123АА",
					value: draftPlate,
					maxLength: 6,
					onChange: (event) => setDraftPlate(sanitizePlate(event.target.value)),
					"aria-label": "Госномер"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block w-[4.75rem] shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-xs text-muted",
					children: "Регион"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field px-2 text-center font-semibold tabular-nums",
					inputMode: "numeric",
					placeholder: "777",
					value: draftRegion,
					maxLength: 3,
					onChange: (event) => setDraftRegion(sanitizeRegion(event.target.value)),
					"aria-label": "Регион"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				savePlate();
			},
			children: "Сохранить"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
			onClick: () => {
				playClick();
				closeOverlay();
			},
			children: "Отмена"
		})] })]
	});
	if (subModal === "tariff") {
		const hourly = car?.hourlyRate;
		const daily = car?.dailyRate;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			layer: "sub",
			wide: true,
			title: "Тариф",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Часовой"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium tabular-nums",
						children: hourly == null ? "не задан" : `${money(hourly)} / час`
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-fill btn-ghost h-9 px-3 text-xs",
						onClick: () => {
							playClick();
							openTariffEdit("hourly", "car");
						},
						children: "Изменить"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 border border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Суточный"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium tabular-nums",
						children: daily == null ? "не задан" : `${money(daily)} / день`
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-fill btn-ghost h-9 px-3 text-xs",
						onClick: () => {
							playClick();
							openTariffEdit("daily", "car");
						},
						children: "Изменить"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalActions, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Закрыть"
			}) })]
		});
	}
	if (subModal === "tariff-edit") {
		const daily = tariffKind === "daily";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			layer: "sub",
			title: daily ? "Суточный тариф" : "Часовой тариф",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-6 w-full max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					autoFocus: true,
					inputMode: "decimal",
					placeholder: "0",
					value: tariffDraft,
					onChange: (event) => setTariffDraft(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							playClick();
							saveTariffEdit();
						}
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-right text-xs text-subtle",
					children: daily ? "руб. в день" : "руб. в час"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					saveTariffEdit();
				},
				children: "Сохранить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })]
		});
	}
	if (subModal === "model") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Модель",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs leading-relaxed text-muted",
				children: "Код модели для рынка. Например, sultan2."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-5 w-full max-w-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "field",
					autoFocus: true,
					placeholder: "sultan2",
					value: draftModel,
					onChange: (event) => setDraftModel(event.target.value),
					onKeyDown: (event) => {
						if (event.key === "Enter") {
							playClick();
							saveModel();
						}
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					saveModel();
				},
				children: "Сохранить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-6 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })
		]
	});
	if (subModal === "sell-ask") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		layer: "sub",
		title: "Продать авто?",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-sm leading-relaxed text-muted",
				children: "Вы точно хотите продать авто? Карточка удалится после итога."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-5 w-full max-w-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1.5 block text-xs text-muted",
						children: "За сколько продали"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "field",
						autoFocus: true,
						inputMode: "decimal",
						placeholder: "0",
						value: draftSale,
						onChange: (event) => setDraftSale(event.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-right text-xs text-subtle",
						children: "руб."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-36 px-5 text-sm",
				onClick: () => {
					playClick();
					confirmSell();
				},
				children: "Подтвердить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })
		]
	});
	if (subModal === "sell-result") {
		const loss = saleNet < 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			layer: "sub",
			blur: true,
			title: loss ? "Плохо" : "Хорошо",
			titleClass: loss ? "is-bad" : "is-good",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-sm leading-relaxed text-muted",
				children: loss ? `Вы продали машину себе в минус на ${money(Math.abs(saleNet))}.` : `Вы заработали с продажи этой машины ${money(saleNet)}.`
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModalActions, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-36 px-6 text-sm",
				onClick: () => {
					playClick();
					acceptSell();
				},
				children: "Принять"
			}) })]
		});
	}
	return null;
}
function GarageOverlays() {
	const overlay = useGarage((s) => s.overlay);
	const subModal = useGarage((s) => s.subModal);
	const detailsId = useGarage((s) => s.detailsId);
	const deleteId = useGarage((s) => s.deleteId);
	const cars = useGarage((s) => s.cars);
	const pendingImport = useGarage((s) => s.pendingImport);
	const closeOverlay = useGarage((s) => s.closeOverlay);
	const confirmReset = useGarage((s) => s.confirmReset);
	const confirmDelete = useGarage((s) => s.confirmDelete);
	const confirmImport = useGarage((s) => s.confirmImport);
	const cancelImport = useGarage((s) => s.cancelImport);
	const detailsCar = cars.find((car) => car.id === detailsId);
	const deleteCar = cars.find((car) => car.id === deleteId);
	(0, import_react.useEffect)(() => {
		if (overlay === "none" && subModal === "none") return;
		function onKey(event) {
			if (event.key === "Escape") {
				playClick();
				closeOverlay();
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		overlay,
		subModal,
		closeOverlay
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		overlay === "reset" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			title: "Сбросить весь учёт?",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-sm leading-relaxed text-muted",
				children: [
					"Все автомобили будут удалены безвозвратно.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"База данных станет пустой."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-red h-11 min-w-36 px-5 text-sm",
				onClick: () => {
					playClick();
					confirmReset();
				},
				children: "Да, сбросить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })]
		}) : null,
		overlay === "import-confirm" && pendingImport ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			wide: true,
			title: "Загрузить автомобили?",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-sm leading-relaxed text-muted",
				children: [
					"Текущие карточки будут заменены данными из файла.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					"Будет загружено автомобилей: ",
					pendingImport.length,
					"."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-green h-11 min-w-36 px-5 text-sm",
				onClick: () => {
					playClick();
					confirmImport();
				},
				children: "Загрузить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
				onClick: () => {
					playClick();
					cancelImport();
				},
				children: "Отмена"
			})] })]
		}) : null,
		overlay === "delete" && deleteCar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
			title: "Удалить автомобиль?",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-center text-sm leading-relaxed text-muted",
				children: [
					"«",
					deleteCar.name,
					"» будет удалён безвозвратно."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ModalActions, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-red h-11 min-w-36 px-5 text-sm",
				onClick: () => {
					playClick();
					confirmDelete();
				},
				children: "Удалить"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-fill btn-ghost h-11 min-w-32 px-5 text-sm",
				onClick: () => {
					playClick();
					closeOverlay();
				},
				children: "Отмена"
			})] })]
		}) : null,
		overlay === "details" && detailsCar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailsOverlay, { car: detailsCar }) : null,
		overlay === "rent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RentOverlay, {}) : null,
		subModal === "none" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubModals, {}),
		overlay === "wizard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WizardModal, {}) : null,
		overlay === "api" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiPanel, {}) : null,
		overlay === "market" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarketPanel, {}) : null
	] });
}
function GarageToasts() {
	const toasts = useGarage((s) => s.toasts);
	if (toasts.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed right-4 bottom-28 z-50 flex w-max max-w-xs flex-col-reverse gap-2",
		children: toasts.map((toast) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `pointer-events-auto px-6 py-4 text-center text-sm text-fg ${toast.kind === "error" ? "bg-toast-err" : "bg-toast"}`,
			children: toast.text
		}, toast.id))
	});
}
function headerHeight() {
	const header = document.querySelector(".garage-header");
	if (!header) return 0;
	return Math.max(0, header.getBoundingClientRect().height);
}
function spawn(w, top, h) {
	const span = Math.max(48, h - top);
	const angle = Math.random() * Math.PI * 2;
	const speed = .12 + Math.random() * .42;
	return {
		x: Math.random() * w,
		y: top + Math.random() * span,
		z: .35 + Math.random() * 1,
		vx: Math.cos(angle) * speed,
		vy: Math.sin(angle) * speed * .85,
		life: Math.random() * 4,
		max: 10 + Math.random() * 16
	};
}
function AmbientDust() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let w = 0;
		let h = 0;
		let top = 0;
		let raf = 0;
		let motes = [];
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const resize = () => {
			const nextW = window.innerWidth;
			const nextH = window.innerHeight;
			const nextTop = headerHeight();
			const rebuild = motes.length === 0 || Math.abs(nextW - w) > 48 || Math.abs(nextH - h) > 80;
			w = nextW;
			h = nextH;
			top = nextTop;
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (rebuild) {
				const count = reduced ? 40 : Math.round(Math.min(220, w * Math.max(1, h - top) / 8500));
				motes = Array.from({ length: count }, () => spawn(w, top, h));
			}
		};
		const tick = () => {
			top = headerHeight();
			ctx.clearRect(0, 0, w, h);
			for (const mote of motes) {
				mote.x += mote.vx * mote.z;
				mote.y += mote.vy * mote.z;
				mote.life += .016;
				if (mote.x < -16) mote.x = w + 8;
				else if (mote.x > w + 16) mote.x = -8;
				if (mote.y < top) mote.y = h - 6;
				else if (mote.y > h + 8) mote.y = top + 4;
				if (mote.life > mote.max) Object.assign(mote, spawn(w, top, h));
				if (mote.y < top) continue;
				const fade = .65 + .35 * Math.sin(mote.life / mote.max * Math.PI);
				const depth = .45 + mote.z * .55;
				const alpha = .46 * fade * depth;
				const size = .6 + mote.z * .9;
				ctx.beginPath();
				ctx.fillStyle = `rgba(226,226,234,${alpha})`;
				ctx.arc(mote.x, mote.y, size, 0, Math.PI * 2);
				ctx.fill();
			}
			if (!reduced) raf = window.requestAnimationFrame(tick);
		};
		resize();
		window.addEventListener("resize", resize);
		tick();
		return () => {
			window.cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "pointer-events-none fixed inset-0 z-[60]",
		"aria-hidden": "true"
	});
}
var SPLASH_MS = 3200;
var SPLASH_SWAP_MS = 1400;
var LANES = Array.from({ length: 42 }, (_, index) => {
	const side = index < 21 ? -1 : 1;
	const step = index < 21 ? 20 - index : index - 21;
	return {
		angle: side * (1.15 + step * 2.05),
		hue: (index * 23 + 210) % 360,
		delay: -(index * .09 % 1.55),
		width: step % 5 === 0 ? 2.4 : 1.15
	};
});
function makeDust(w, h) {
	return {
		x: Math.random() * w,
		y: h * (.35 + Math.random() * .65),
		z: .15 + Math.random() * .85,
		vx: (Math.random() - .5) * .18,
		vy: -.04 - Math.random() * .12,
		life: Math.random(),
		max: 4 + Math.random() * 6
	};
}
function SplashScreen({ onDone }) {
	const bootCheck = useGarage((s) => s.bootCheck);
	const canvasRef = (0, import_react.useRef)(null);
	const [phase, setPhase] = (0, import_react.useState)("load");
	(0, import_react.useLayoutEffect)(() => {
		const finish = () => bootCheck();
		const unsub = useGarage.persist.onFinishHydration(finish);
		if (useGarage.persist.hasHydrated()) finish();
		const swap = window.setInterval(() => {
			setPhase((current) => current === "load" ? "venom" : "load");
		}, SPLASH_SWAP_MS);
		const done = window.setTimeout(() => onDone(), SPLASH_MS);
		return () => {
			unsub();
			window.clearInterval(swap);
			window.clearTimeout(done);
		};
	}, [bootCheck, onDone]);
	(0, import_react.useLayoutEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		let w = 0;
		let h = 0;
		let raf = 0;
		let dust = [];
		const resize = () => {
			w = window.innerWidth;
			h = window.innerHeight;
			canvas.width = Math.floor(w * dpr);
			canvas.height = Math.floor(h * dpr);
			canvas.style.width = `${w}px`;
			canvas.style.height = `${h}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			dust = Array.from({ length: reduced ? 40 : 180 }, () => makeDust(w, h));
		};
		const frame = () => {
			ctx.clearRect(0, 0, w, h);
			for (const mote of dust) {
				if (!reduced) {
					mote.x += mote.vx * mote.z;
					mote.y += mote.vy * mote.z;
					mote.life += .016;
					if (mote.life > mote.max || mote.y < h * .28) Object.assign(mote, makeDust(w, h), { life: 0 });
				}
				const fade = Math.sin(mote.life / mote.max * Math.PI);
				const size = .35 + mote.z * .7;
				ctx.fillStyle = `rgba(230,230,236,${.07 * fade * mote.z})`;
				ctx.fillRect(mote.x, mote.y, size, size);
			}
		};
		resize();
		frame();
		window.addEventListener("resize", resize);
		const loop = () => {
			frame();
			raf = window.requestAnimationFrame(loop);
		};
		if (!reduced) raf = window.requestAnimationFrame(loop);
		return () => {
			window.cancelAnimationFrame(raf);
			window.removeEventListener("resize", resize);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "splash-root",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "splash-stage",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vhs-fog" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "vhs-road",
					children: LANES.map((lane) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "vhs-lane",
						style: {
							["--a"]: `${lane.angle}deg`,
							["--h"]: String(lane.hue),
							["--d"]: `${lane.delay}s`,
							width: `${lane.width}px`
						}
					}, `${lane.angle}-${lane.hue}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "pointer-events-none absolute inset-0 z-[2]",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex w-full max-w-xl flex-col items-center px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DarkRentLogo, { stack: true }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "splash-pulse-line",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "splash-bar mt-7 w-full max-w-sm",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "splash-bar-track",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "splash-bar-fill" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-7 h-8 w-80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `splash-copy absolute inset-0 text-center text-sm tracking-[0.32em] text-fg ${phase === "load" ? "splash-in" : "splash-out"}`,
							children: "Загрузка"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `splash-copy absolute inset-0 text-center text-sm tracking-[0.22em] text-muted ${phase === "venom" ? "splash-in" : "splash-out"}`,
							children: "Powered by Venom"
						})]
					})
				]
			})
		]
	});
}
function StackGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 8.5 12 5l8 3.5L12 12 4 8.5Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 12.2 12 15.7 20 12.2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 15.6 12 19.1 20 15.6" })
		]
	});
}
function SunGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3.2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" })]
	});
}
function SumGlyph() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.6",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M7 6.5h10l-4.2 5.5L17 17.5H7" })
	});
}
function FleetStat({ glyph, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fleet-stat",
		children: [
			glyph,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "fleet-k",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "fleet-v",
				children: value
			})
		]
	});
}
function GarageShell() {
	const cars = useGarage((s) => s.cars);
	const search = useGarage((s) => s.search);
	const openApi = useGarage((s) => s.openApi);
	const openWizard = useGarage((s) => s.openWizard);
	const bootCheck = useGarage((s) => s.bootCheck);
	const visible = filterCars(cars, search);
	(0, import_react.useEffect)(() => {
		const finish = () => bootCheck();
		const unsub = useGarage.persist.onFinishHydration(finish);
		if (useGarage.persist.hasHydrated()) finish();
		return unsub;
	}, [bootCheck]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AmbientDust, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative z-10 flex min-h-0 flex-1 flex-col px-3 pt-4 pb-36 md:px-5 md:pt-4",
				children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col items-center justify-center px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, {
							className: "mb-4 size-10 text-subtle",
							strokeWidth: 1.5
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-sm text-center text-sm leading-relaxed text-muted",
							children: search.trim() ? "Ничего не найдено." : "Пока нет автомобилей. Нажмите «Новое авто», чтобы добавить."
						}),
						search.trim() ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-fill btn-green mt-6 h-11 min-w-48 px-6 text-sm",
							onClick: () => {
								playClick();
								openWizard();
							},
							children: "Новое авто"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex w-full max-w-[74rem] flex-wrap justify-center gap-x-4 gap-y-5",
					children: visible.map((car) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarCard, { car }, car.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fleet-dock",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "api-btn",
						onClick: () => {
							playClick();
							openApi();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiGlyph, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "API" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetStat, {
						glyph: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StackGlyph, {}),
						label: "Цена автопарка",
						value: money(cars.reduce((sum, car) => sum + (car.officialPrice ?? 0), 0))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetStat, {
						glyph: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunGlyph, {}),
						label: "Заработали сегодня",
						value: money(cars.reduce((sum, car) => sum + car.earnedToday, 0))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FleetStat, {
						glyph: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SumGlyph, {}),
						label: "Заработано всего",
						value: money(cars.reduce((sum, car) => sum + car.earnedTotal, 0))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageOverlays, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageToasts, {})
		]
	});
}
function GarageApp() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const onDone = (0, import_react.useCallback)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, { onDone });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageShell, {});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GarageApp, {});
}
//#endregion
export { Home as component };
