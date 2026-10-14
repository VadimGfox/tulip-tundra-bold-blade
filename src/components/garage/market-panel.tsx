import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { fetchMarketplace, marketSlotsLeft, markMarketCall, matchVehicle, type MarketVehicle } from "@/lib/garage/market";
import { API_SERVERS } from "@/lib/garage/types";
import { useGarage } from "@/lib/garage/store";
import { money, playClick, recommendSellPrice } from "@/lib/garage/utils";

export function MarketPanel() {
  const apiKey = useGarage((s) => s.apiKey);
  const apiServer = useGarage((s) => s.apiServer);
  const detailsId = useGarage((s) => s.detailsId);
  const car = useGarage((s) => s.cars.find((row) => row.id === detailsId) ?? null);
  const closeOverlay = useGarage((s) => s.closeOverlay);
  const pushToast = useGarage((s) => s.pushToast);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [row, setRow] = useState<MarketVehicle | null>(null);
  const [period, setPeriod] = useState<number | null>(null);
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
      const result = await fetchMarketplace({ data: { apiKey: apiKey.trim(), serverId: apiServer } });
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

  return (
    <div className="backdrop-enter backdrop-blurred fixed inset-0 z-40 overflow-hidden">
      <div className="modal-enter mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="modal-cap shrink-0">
          <div className="modal-cap-row">
            <h2 className="modal-cap-title">Рынок авто</h2>
            <button
              type="button"
              className="modal-x"
              aria-label="Закрыть"
              onClick={() => {
                playClick();
                closeOverlay();
              }}
            >
              ×
            </button>
          </div>
          <div className="header-pulse-line" aria-hidden="true" />
        </header>
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 md:px-7">
          <div className="min-w-0">
            <p className="text-3xl font-extrabold tracking-[0.08em] text-fg">{serverName}</p>
            <p className="mt-1 truncate text-sm text-muted">
              {car?.name ?? "Машина не выбрана"}
              {car?.model ? <span className="text-subtle"> · {car.model}</span> : null}
            </p>
          </div>
          <button
            type="button"
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 text-sm text-muted hover:text-fg"
            onClick={() => {
              playClick();
              void refresh();
            }}
          >
            <RotateCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </button>
        </div>
        <div className="market-stage mx-4 mb-5 min-h-0 flex-1 overflow-y-auto p-5 md:mx-6 md:p-6">
          {!car ? <p className="text-sm text-muted">Откройте рынок из карточки машины.</p> : null}
          {car && !row && !error ? (
            <div>
              <p className="text-sm leading-relaxed text-muted">
                Нажмите «Обновить» — запрос уйдёт только тогда. Рынок ищется по модели
                {car.model ? ` «${car.model}»` : ""}.
              </p>
              {!car.model ? (
                <p className="mt-3 text-sm text-subtle">Сначала задайте модель в карточке, иначе сервер не поймёт машину.</p>
              ) : null}
            </div>
          ) : null}
          {error ? <p className="text-sm leading-relaxed text-muted">{error}</p> : null}
          {row && car ? (
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.22em] text-subtle uppercase">Название</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-wide">{row.modelName}</h3>
              <p className="mt-1 text-xs text-subtle">
                Модель {row.model || car.model}
                {period ? ` · статистика за ${period} дн.` : ""}
              </p>
              {advised != null ? (
                <div className="market-hero mt-5 px-5 py-5">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#e4bc4a] uppercase">Рекомендуемая цена</p>
                  <p className="mt-2 text-4xl font-extrabold tracking-wide text-fg tabular-nums">{money(advised)}</p>
                </div>
              ) : null}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Tile label="Сейчас на продаже" value={`${row.totalCount} шт.`} accent="#8ed4ff" />
                <Tile label="Продано" value={`${row.soldCount} шт.`} accent="#e4bc4a" />
                <Tile label="Минимальная" value={money(row.minPrice)} accent="#9a9aa4" />
                <Tile label="Максимальная" value={money(row.maxPrice)} accent="#e23b3b" />
                <Tile label="Средняя по рынку" value={money(row.averagePrice)} accent="#3cb85c" wide />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  accent,
  wide,
}: {
  label: string;
  value: string;
  accent: string;
  wide?: boolean;
}) {
  return (
    <div className={`market-tile px-4 py-3.5 ${wide ? "sm:col-span-2" : ""}`} style={{ ["--accent" as string]: accent }}>
      <p className="text-xs tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}