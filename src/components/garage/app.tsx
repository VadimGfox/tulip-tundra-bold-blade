import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Car } from "lucide-react";
import { CarCard } from "@/components/garage/car-card";
import { GarageHeader } from "@/components/garage/header";
import { ApiGlyph } from "@/components/garage/icons";
import { GarageOverlays, GarageToasts } from "@/components/garage/overlays";
import { AmbientDust } from "@/components/garage/particles";
import { SplashScreen } from "@/components/garage/splash";
import { useGarage } from "@/lib/garage/store";
import { filterCars, money, playClick } from "@/lib/garage/utils";

function StackGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M4 8.5 12 5l8 3.5L12 12 4 8.5Z" />
      <path d="M4 12.2 12 15.7 20 12.2" />
      <path d="M4 15.6 12 19.1 20 15.6" />
    </svg>
  );
}

function SunGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
    </svg>
  );
}

function SumGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M7 6.5h10l-4.2 5.5L17 17.5H7" />
    </svg>
  );
}

function FleetStat({
  glyph,
  label,
  value,
}: {
  glyph: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="fleet-stat">
      {glyph}
      <span className="fleet-k">{label}</span>
      <span className="fleet-v">{value}</span>
    </div>
  );
}

function GarageShell() {
  const cars = useGarage((s) => s.cars);
  const search = useGarage((s) => s.search);
  const openApi = useGarage((s) => s.openApi);
  const openWizard = useGarage((s) => s.openWizard);
  const bootCheck = useGarage((s) => s.bootCheck);
  const visible = filterCars(cars, search);

  useEffect(() => {
    const finish = () => bootCheck();
    const unsub = useGarage.persist.onFinishHydration(finish);
    if (useGarage.persist.hasHydrated()) finish();
    return unsub;
  }, [bootCheck]);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <AmbientDust />
      <GarageHeader />
      <main className="garage-stage relative z-10 flex min-h-0 flex-1 flex-col px-3 pt-4 pb-36 md:px-5 md:pt-4">
        {visible.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            <Car className="mb-4 size-10 text-subtle" strokeWidth={1.5} />
            <p className="max-w-sm text-center text-sm leading-relaxed text-muted">
              {search.trim()
                ? "Ничего не найдено."
                : "Пока нет автомобилей. Нажмите «Новое авто», чтобы добавить."}
            </p>
            {search.trim() ? null : (
              <button
                type="button"
                className="btn-fill btn-green mt-6 h-11 min-w-48 px-6 text-sm"
                onClick={() => {
                  playClick();
                  openWizard();
                }}
              >
                Новое авто
              </button>
            )}
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-[74rem] flex-wrap justify-center gap-x-4 gap-y-5">
            {visible.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </main>
      <div className="fleet-dock">
        <button
          type="button"
          className="api-btn"
          onClick={() => {
            playClick();
            openApi();
          }}
        >
          <ApiGlyph className="size-4" />
          <span>API</span>
        </button>
        <FleetStat
          glyph={<StackGlyph />}
          label="Цена автопарка"
          value={money(cars.reduce((sum, car) => sum + (car.officialPrice ?? 0), 0))}
        />
        <FleetStat
          glyph={<SunGlyph />}
          label="Заработали сегодня"
          value={money(cars.reduce((sum, car) => sum + car.earnedToday, 0))}
        />
        <FleetStat
          glyph={<SumGlyph />}
          label="Заработано всего"
          value={money(cars.reduce((sum, car) => sum + car.earnedTotal, 0))}
        />
      </div>
      <GarageOverlays />
      <GarageToasts />
    </div>
  );
}

export function GarageApp() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);
  if (!ready) return <SplashScreen onDone={onDone} />;
  return <GarageShell />;
}
