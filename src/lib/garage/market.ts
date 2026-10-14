import { createServerFn } from "@tanstack/react-start";
import type { ApiServerId } from "./types";

export type MarketVehicle = {
  model: string;
  modelName: string;
  totalCount: number;
  soldCount: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
};

export type MarketSnapshot = {
  serverId: string;
  periodDays: number | null;
  lastUpdated: string | null;
  vehicles: MarketVehicle[];
};

export type MarketResult =
  | { ok: true; data: MarketSnapshot }
  | { ok: false; status: number; message: string };

const WINDOW_MS = 60_000;
const MAX_CALLS = 5;
const recent: number[] = [];
const HOSTS = ["https://api.majestic-files.net", "https://api.majestic-files.com"];

const SERVER_SLUGS: Record<ApiServerId, string[]> = {
  RU1: ["ro1", "ru1", "RU1"],
  RU2: ["ro2", "ru2", "RU2"],
  RU3: ["ro3", "ru3", "RU3"],
};

export function marketSlotsLeft(now = Date.now()) {
  const fresh = recent.filter((at) => now - at < WINDOW_MS);
  recent.splice(0, recent.length, ...fresh);
  return MAX_CALLS - fresh.length;
}

export function markMarketCall(now = Date.now()) {
  recent.push(now);
}

function num(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value.replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function pick(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (row[key] != null && row[key] !== "") return row[key];
  }
  return undefined;
}

function asVehicle(raw: unknown): MarketVehicle | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const modelName = String(pick(row, ["modelName", "model_name", "name", "title", "model"]) ?? "").trim();
  if (!modelName) return null;
  return {
    model: String(pick(row, ["model", "modelId", "model_id", "id"]) ?? ""),
    modelName,
    totalCount: num(pick(row, ["totalCount", "total_count", "count", "inStock", "in_stock", "listed"])),
    soldCount: num(pick(row, ["soldCount", "sold_count", "sold", "sales"])),
    averagePrice: num(
      pick(row, ["averagePrice", "average_price", "avgPrice", "avg_price", "recommendedPrice", "recommended_price"]),
    ),
    minPrice: num(pick(row, ["minPrice", "min_price", "minimumPrice"])),
    maxPrice: num(pick(row, ["maxPrice", "max_price", "maximumPrice"])),
  };
}

function payloadRoot(payload: unknown) {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const nested = [body.result, body.data, body.payload].find((item) => item && typeof item === "object" && !Array.isArray(item));
  return (nested as Record<string, unknown> | undefined) ?? body;
}

function vehicleList(root: Record<string, unknown>, body: Record<string, unknown>) {
  const candidates = [root.vehicleStatistics, root.vehicles, root.items, root.list, body.vehicleStatistics, body.vehicles];
  return candidates.find(Array.isArray) ?? [];
}

export function normalizeMarket(payload: unknown, serverId: string): MarketSnapshot {
  const body = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
  const root = payloadRoot(payload);
  const list = vehicleList(root, body);
  return {
    serverId: String(root.serverId ?? body.serverId ?? serverId),
    periodDays: typeof root.periodDays === "number" ? root.periodDays : typeof body.periodDays === "number" ? body.periodDays : null,
    lastUpdated:
      typeof root.lastUpdated === "string" ? root.lastUpdated : typeof body.lastUpdated === "string" ? body.lastUpdated : null,
    vehicles: list.flatMap((row) => {
      const vehicle = asVehicle(row);
      return vehicle ? [vehicle] : [];
    }),
  };
}

export function foldName(value: string) {
  return value.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "");
}

export function matchVehicle(vehicles: MarketVehicle[], carName: string, modelCode = "") {
  const code = foldName(modelCode);
  if (code) {
    const exactCode = vehicles.find(
      (row) => foldName(row.model) === code || foldName(row.modelName) === code,
    );
    if (exactCode) return exactCode;
    const fuzzyCode = vehicles.find((row) => {
      const model = foldName(row.model);
      const name = foldName(row.modelName);
      return (
        (model && (model.includes(code) || code.includes(model))) ||
        (name && (name.includes(code) || code.includes(name)))
      );
    });
    if (fuzzyCode) return fuzzyCode;
  }
  const needle = foldName(carName);
  if (!needle) return null;
  const exact = vehicles.find(
    (row) => foldName(row.modelName) === needle || foldName(row.model) === needle,
  );
  if (exact) return exact;
  return (
    vehicles.find((row) => {
      const name = foldName(row.modelName);
      const model = foldName(row.model);
      return name.includes(needle) || needle.includes(name) || (model && (model.includes(needle) || needle.includes(model)));
    }) ?? null
  );
}

function errorMessage(status: number, detail: string) {
  if (status === 401 || status === 403) return "Ключ не принят. Проверьте API ключ и выбранный сервер.";
  if (status === 429) return "Слишком много запросов. Подождите минуту.";
  if (status >= 500) return "Сервер рынка сейчас недоступен.";
  if (detail && detail !== "Forbidden") return detail;
  return "Не удалось получить рынок.";
}

function authSets(apiKey: string): HeadersInit[] {
  return [
    { Accept: "application/json", Authorization: `Bearer ${apiKey}`, "x-auth-token": apiKey },
    { Accept: "application/json", "x-auth-token": apiKey },
    { Accept: "application/json", Authorization: `Bearer ${apiKey}` },
  ];
}

async function readBody(response: Response) {
  const text = await response.text();
  if (!text) return { json: null as unknown, detail: "" };
  try {
    const json: unknown = JSON.parse(text);
    const row = json && typeof json === "object" ? (json as Record<string, unknown>) : null;
    const detail = String(row?.errorDescription ?? row?.message ?? row?.error ?? "");
    return { json, detail };
  } catch {
    return { json: null as unknown, detail: text.slice(0, 180) };
  }
}

export const fetchMarketplace = createServerFn({ method: "POST" })
  .validator((input: { apiKey: string; serverId: ApiServerId }) => {
    const apiKey = input.apiKey.trim();
    const serverId = input.serverId;
    if (!apiKey) throw new Error("Введите API ключ");
    if (serverId !== "RU1" && serverId !== "RU2" && serverId !== "RU3") {
      throw new Error("Выберите сервер");
    }
    return { apiKey, serverId };
  })
  .handler(async ({ data }): Promise<MarketResult> => {
    const slugs = SERVER_SLUGS[data.serverId];
    let networkError = true;
    let lastStatus = 0;
    let lastDetail = "";
    let empty: MarketSnapshot | null = null;

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
              return { ok: false, status: response.status, message: errorMessage(response.status, parsed.detail) };
            }
            const snapshot = normalizeMarket(parsed.json, slug);
            if (snapshot.vehicles.length > 0) return { ok: true, data: snapshot };
            empty = snapshot;
            break;
          } catch {
            lastStatus = 0;
          }
        }
        if (lastStatus === 401 || lastStatus === 403) {
          return { ok: false, status: lastStatus, message: errorMessage(lastStatus, lastDetail) };
        }
      }
      if (!networkError) break;
    }

    if (empty) return { ok: true, data: empty };
    if (networkError) {
      return { ok: false, status: 0, message: "Нет связи с рынком. Проверьте ключ и сеть." };
    }
    return { ok: false, status: lastStatus, message: errorMessage(lastStatus, lastDetail) };
  });
