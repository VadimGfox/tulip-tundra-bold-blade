import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-r6OH67pJ.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var HOSTS = ["https://api.majestic-files.com", "https://api.majestic-files.net"];
var SERVER_SLUGS = {
	RU1: [
		"ro1",
		"ru1",
		"RU1"
	],
	RU2: [
		"ro2",
		"ru2",
		"RU2"
	],
	RU3: [
		"ro3",
		"ru3",
		"RU3"
	]
};
function num(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim()) {
		const n = Number(value.replace(/\s/g, "").replace(",", "."));
		return Number.isFinite(n) ? n : 0;
	}
	return 0;
}
function pick(row, keys) {
	for (const key of keys) if (row[key] != null && row[key] !== "") return row[key];
}
function asVehicle(raw) {
	if (!raw || typeof raw !== "object") return null;
	const row = raw;
	const modelName = String(pick(row, [
		"modelName",
		"model_name",
		"name",
		"title",
		"model"
	]) ?? "").trim();
	if (!modelName) return null;
	return {
		model: String(pick(row, [
			"model",
			"modelId",
			"model_id",
			"id"
		]) ?? ""),
		modelName,
		totalCount: num(pick(row, [
			"totalCount",
			"total_count",
			"count",
			"inStock",
			"in_stock",
			"listed"
		])),
		soldCount: num(pick(row, [
			"soldCount",
			"sold_count",
			"sold",
			"sales"
		])),
		averagePrice: num(pick(row, [
			"averagePrice",
			"average_price",
			"avgPrice",
			"avg_price",
			"recommendedPrice",
			"recommended_price"
		])),
		minPrice: num(pick(row, [
			"minPrice",
			"min_price",
			"minimumPrice"
		])),
		maxPrice: num(pick(row, [
			"maxPrice",
			"max_price",
			"maximumPrice"
		]))
	};
}
function payloadRoot(payload) {
	const body = payload && typeof payload === "object" ? payload : {};
	return [
		body.result,
		body.data,
		body.payload
	].find((item) => item && typeof item === "object" && !Array.isArray(item)) ?? body;
}
function vehicleList(root, body) {
	return [
		root.vehicleStatistics,
		root.vehicles,
		root.items,
		root.list,
		body.vehicleStatistics,
		body.vehicles
	].find(Array.isArray) ?? [];
}
function normalizeMarket(payload, serverId) {
	const body = payload && typeof payload === "object" ? payload : {};
	const root = payloadRoot(payload);
	const list = vehicleList(root, body);
	return {
		serverId: String(root.serverId ?? body.serverId ?? serverId),
		periodDays: typeof root.periodDays === "number" ? root.periodDays : typeof body.periodDays === "number" ? body.periodDays : null,
		lastUpdated: typeof root.lastUpdated === "string" ? root.lastUpdated : typeof body.lastUpdated === "string" ? body.lastUpdated : null,
		vehicles: list.flatMap((row) => {
			const vehicle = asVehicle(row);
			return vehicle ? [vehicle] : [];
		})
	};
}
function errorMessage(status, detail) {
	if (status === 401 || status === 403) return "Ключ не принят. Проверьте API ключ и выбранный сервер.";
	if (status === 429) return "Слишком много запросов. Подождите минуту.";
	if (status >= 500) return "Сервер рынка сейчас недоступен.";
	if (detail && detail !== "Forbidden") return detail;
	return "Не удалось получить рынок.";
}
function authSets(apiKey) {
	return [
		{
			Accept: "application/json",
			Authorization: `Bearer ${apiKey}`,
			"x-auth-token": apiKey
		},
		{
			Accept: "application/json",
			"x-auth-token": apiKey
		},
		{
			Accept: "application/json",
			Authorization: `Bearer ${apiKey}`
		}
	];
}
async function readBody(response) {
	const text = await response.text();
	if (!text) return {
		json: null,
		detail: ""
	};
	try {
		const json = JSON.parse(text);
		const row = json && typeof json === "object" ? json : null;
		return {
			json,
			detail: String(row?.errorDescription ?? row?.message ?? row?.error ?? "")
		};
	} catch {
		return {
			json: null,
			detail: text.slice(0, 180)
		};
	}
}
var fetchMarketplace_createServerFn_handler = createServerRpc({
	id: "5dcf996188cea6e81485fbaab4e99d5c4d3c01274181abd6c6625ca67f26a49c",
	name: "fetchMarketplace",
	filename: "src/lib/garage/market.ts"
}, (opts) => fetchMarketplace.__executeServer(opts));
var fetchMarketplace = createServerFn({ method: "POST" }).validator((input) => {
	const apiKey = input.apiKey.trim();
	const serverId = input.serverId;
	if (!apiKey) throw new Error("Введите API ключ");
	if (serverId !== "RU1" && serverId !== "RU2" && serverId !== "RU3") throw new Error("Выберите сервер");
	return {
		apiKey,
		serverId
	};
}).handler(fetchMarketplace_createServerFn_handler, async ({ data }) => {
	const slugs = SERVER_SLUGS[data.serverId];
	let networkError = true;
	let lastStatus = 0;
	let lastDetail = "";
	let empty = null;
	for (const host of HOSTS) {
		for (const slug of slugs) {
			for (const headers of authSets(data.apiKey)) {
				const url = `${host}/v1/ext/marketplace/vehicles/${slug}`;
				try {
					const response = await fetch(url, { headers });
					networkError = false;
					const parsed = await readBody(response);
					lastStatus = response.status;
					lastDetail = parsed.detail;
					if (response.status === 404) break;
					if (!response.ok) {
						if (response.status === 401 || response.status === 403) continue;
						return {
							ok: false,
							status: response.status,
							message: errorMessage(response.status, parsed.detail)
						};
					}
					const snapshot = normalizeMarket(parsed.json, slug);
					if (snapshot.vehicles.length > 0) return {
						ok: true,
						data: snapshot
					};
					empty = snapshot;
					break;
				} catch {
					lastStatus = 0;
				}
			}
			if (lastStatus === 401 || lastStatus === 403) return {
				ok: false,
				status: lastStatus,
				message: errorMessage(lastStatus, lastDetail)
			};
		}
		if (!networkError) break;
	}
	if (empty) return {
		ok: true,
		data: empty
	};
	if (networkError) return {
		ok: false,
		status: 0,
		message: "Нет связи с рынком. Проверьте ключ и сеть."
	};
	return {
		ok: false,
		status: lastStatus,
		message: errorMessage(lastStatus, lastDetail)
	};
});
//#endregion
export { fetchMarketplace_createServerFn_handler };
