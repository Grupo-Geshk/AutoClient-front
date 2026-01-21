// DateRangeControls.jsx
// Granularity-aware range selector con dropdown + calendario popover (dual-month)
// Tailwind only. Semanas Lun–Dom. Emite { granularity, start, end, label }.

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarIcon } from "@/components/icons/DashboardIcons";

/* ===========================
 * Utilidades de fechas
 * =========================== */
const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function startOfWeek(d) {
  const x = new Date(d);
  const w = (x.getDay() + 6) % 7; // Lunes=0
  x.setDate(x.getDate() - w);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfWeek(d) {
  const a = startOfWeek(d);
  const b = new Date(a);
  b.setDate(b.getDate() + 6);
  b.setHours(23, 59, 59, 999);
  return b;
}
function startOfMonth(y, m) {
  const d = new Date(y, m, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfMonth(y, m) {
  const d = new Date(y, m + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}
function startOfYear(y) {
  const d = new Date(y, 0, 1);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfYear(y) {
  const d = new Date(y, 11, 31);
  d.setHours(23, 59, 59, 999);
  return d;
}
function monthMatrix(year, monthIndex) {
  // 6 filas x 7 columnas (Lun–Dom), con Date por celda
  const first = startOfMonth(year, monthIndex);
  const firstWeekMonday = startOfWeek(first);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(firstWeekMonday);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return Array.from({ length: 6 }, (_, r) => days.slice(r * 7, r * 7 + 7));
}
function useOutsideClose(ref, onClose) {
  useEffect(() => {
    function handler(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose?.();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

/* ===========================
 * Componente principal
 * =========================== */
const GRANULARITIES = [
  { key: "day", label: "Diario" },
  { key: "week", label: "Semanal" },
  { key: "month", label: "Mensual" },
  { key: "year", label: "Anual" },
];

export default function DateRangeControls({ defaultGranularity = "week", onChange }) {
  const now = new Date();
  const [granularity, setGranularity] = useState(defaultGranularity);
  const [anchor, setAnchor] = useState(fmt(now)); // fecha ancla dentro del rango

  // Popover calendario
  const [open, setOpen] = useState(false);
  const popRef = useRef(null);
  useOutsideClose(popRef, () => setOpen(false));

  // Dropdown granularidad
  const [gOpen, setGOpen] = useState(false);
  const gRef = useRef(null);
  useOutsideClose(gRef, () => setGOpen(false));

  // Estado del pager (meses visibles en el popover)
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-11

  // Rango derivado
  const range = useMemo(() => {
    const a = new Date(anchor + "T00:00:00");
    if (granularity === "day") {
      const s = new Date(a); s.setHours(0, 0, 0, 0);
      const e = new Date(a); e.setHours(23, 59, 59, 999);
      return { start: s, end: e, label: fmt(a) };
    }
    if (granularity === "week") {
      const s = startOfWeek(a), e = endOfWeek(a);
      return { start: s, end: e, label: `Semana ${fmt(s)} – ${fmt(e)}` };
    }
    if (granularity === "month") {
      const s = startOfMonth(a.getFullYear(), a.getMonth());
      const e = endOfMonth(a.getFullYear(), a.getMonth());
      return {
        start: s,
        end: e,
        label: `${s.toLocaleString(undefined, { month: "long" })} ${s.getFullYear()}`,
      };
    }
    const s = startOfYear(a.getFullYear());
    const e = endOfYear(a.getFullYear());
    return { start: s, end: e, label: `${s.getFullYear()}` };
  }, [anchor, granularity]);

  useEffect(() => {
    onChange?.({ granularity, ...range });
  }, [granularity, range?.start?.getTime(), range?.end?.getTime()]);

  const goToday = () => setAnchor(fmt(new Date()));

  // Mes izquierdo/derecho del dual-month
  const leftYear = viewYear, leftMonth = viewMonth;
  const rightDate = new Date(leftYear, leftMonth + 1, 1);
  const rightYear = rightDate.getFullYear(), rightMonth = rightDate.getMonth();

  function handleCalendarPick(d) {
    if (granularity === "day" || granularity === "week") {
      setAnchor(fmt(d));
    } else if (granularity === "month") {
      const mm = new Date(d);
      setAnchor(fmt(new Date(mm.getFullYear(), mm.getMonth(), 1)));
    } else {
      setAnchor(fmt(new Date(d.getFullYear(), 0, 1)));
    }
    setOpen(false);
  }

  return (
    <div className="w-full relative" role="region" aria-label="Selector de rango de fechas">
      {/* ====== Barra superior: Hoy + Dropdown + Disparador calendario ====== */}
      <div className="flex flex-wrap items-center gap-2 justify-end">
        {/* Botón Hoy */}
        <button
          onClick={goToday}
          className="px-3 py-2 rounded-lg text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          Hoy
        </button>

        {/* Dropdown de granularidad */}
        <div className="relative" ref={gRef}>
          <button
            onClick={() => setGOpen(v => !v)}
            className="px-3 py-2 rounded-lg text-sm border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2"
            aria-haspopup="menu"
            aria-expanded={gOpen}
          >
            {GRANULARITIES.find(g => g.key === granularity)?.label}
            <span className="text-zinc-500">▾</span>
          </button>
          {gOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-40 z-50 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
            >
              {GRANULARITIES.map(g => (
                <button
                  key={g.key}
                  onClick={() => { setGranularity(g.key); setGOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    g.key === granularity ? "bg-violet-500/10 text-violet-500" : ""
                  }`}
                  role="menuitem"
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Disparador Calendario + etiqueta de rango */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-violet-500/5"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Abrir calendario"
        >
          <CalendarIcon className="w-4 h-4" />
          <span className="truncate max-w-[58vw] md:max-w-none">{range?.label}</span>
        </button>
      </div>

      {/* ====== Popover calendario (absoluto / bottom-sheet en móvil) ====== */}
      {open && (
        <div className="relative z-50">
          <div
            ref={popRef}
            role="dialog"
            aria-label="Calendario"
            className="
              fixed inset-x-0 bottom-0
              md:absolute md:right-0 md:inset-auto md:mt-2
              md:w-[680px] w-[min(100vw,680px)] max-w-[100vw]
              rounded-none md:rounded-2xl
              border border-zinc-200 dark:border-zinc-800
              bg-white dark:bg-zinc-900 shadow-2xl
            "
          >
            {/* Header del calendario */}
            <div className="flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  const d = new Date(viewYear, viewMonth - 1, 1);
                  setViewYear(d.getFullYear());
                  setViewMonth(d.getMonth());
                }}
                className="px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Mes anterior"
              >
                ‹
              </button>
              <div className="text-sm font-medium">
                {new Date(leftYear, leftMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
                {"  •  "}
                {new Date(rightYear, rightMonth, 1).toLocaleString(undefined, { month: "long", year: "numeric" })}
              </div>
              <button
                onClick={() => {
                  const d = new Date(viewYear, viewMonth + 1, 1);
                  setViewYear(d.getFullYear());
                  setViewMonth(d.getMonth());
                }}
                className="px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Mes siguiente"
              >
                ›
              </button>
            </div>

            {/* Cuerpo: dos meses (stack en móvil) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {[
                { y: leftYear, m: leftMonth },
                { y: rightYear, m: rightMonth },
              ].map(({ y, m }, idx) => (
                <MonthGrid
                  key={idx}
                  year={y}
                  monthIndex={m}
                  onPick={handleCalendarPick}
                  granularity={granularity}
                  activeRange={{ start: range.start, end: range.end }}
                />
              ))}
            </div>

            {/* Footer del calendario */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-md text-sm border border-zinc-300 dark:border-zinc-700"
              >
                Cerrar
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-violet-500 text-white"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===========================
 * MonthGrid (estilo coloreado)
 * =========================== */
function MonthGrid({ year, monthIndex, onPick, activeRange, granularity }) {
  const weeks = monthMatrix(year, monthIndex);

  function inActive(d) {
    return d >= activeRange.start && d <= activeRange.end;
  }
  function isStart(d) {
    return d.toDateString() === activeRange.start.toDateString();
  }
  function isEnd(d) {
    return d.toDateString() === activeRange.end.toDateString();
  }
  const dayNames = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  return (
    <div>
      <div className="grid grid-cols-7 text-[11px] tracking-wide text-zinc-500 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-rows-6 gap-1">
        {weeks.map((row, i) => (
          <div key={i} className="grid grid-cols-7 gap-1">
            {row.map((d, j) => {
              const inMonth = d.getMonth() === monthIndex;
              const active = inActive(d);
              const start = active && isStart(d);
              const end = active && isEnd(d);

              return (
                <button
                  key={j}
                  onClick={() => onPick(d)}
                  title={fmt(d)}
                  className={[
                    "h-9 relative text-sm rounded-md transition group",
                    inMonth ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400",
                    active
                      ? "bg-violet-200 ring-1 ring-violet-900/20 dark:ring-violet-300/20"
                      : "hover:bg-violet-200 ",
                  ].join(" ")}
                >
                  {/* pista de rango tipo “pill” */}
                  {active && (
                    <span
                      className={[
                        "absolute inset-0 -z-0 rounded-md",
                        "bg-gradient-to-r from-violet-200/10 via-violet-200/15 to-violet-200/10",
                        start ? "rounded-l-full" : "",
                        end ? "rounded-r-full" : "",
                      ].join(" ")}
                    />
                  )}
                  {/* bullet start/end */}
                  {(start || end) && (
                    <span className="absolute inset-0 flex items-center justify-center -z-0">
                      <span className="w-7 h-7 rounded-full bg-violet-600 text-white grid place-items-center shadow">
                        {d.getDate()}
                      </span>
                    </span>
                  )}
                  <span className={start || end ? "opacity-0" : ""}>{d.getDate()}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Ayuda por granularidad */}
      <div className="mt-2 text-xs text-zinc-500">
        {granularity === "week" && "Toca cualquier día para seleccionar su semana (Lun–Dom)."}
        {granularity === "month" && "Toca cualquier día para anclar ese mes."}
        {granularity === "year" && "Toca cualquier día para anclar ese año."}
      </div>
    </div>
  );
}
