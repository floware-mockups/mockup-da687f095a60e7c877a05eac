// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("GanttTriennale");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("GanttTriennale");
import { useState } from "react";
import { Button, Card, Badge, Select, useTable, usePrototype } from "../floware";

function meseScadenza(testo) {__mk();
  const parti = testo.includes("/") ? testo.split("/") : testo.split("-");
  if (parti.length !== 3) return -1;
  const anno = Number(testo.includes("/") ? parti[2] : parti[0]);
  const mese = Number(parti[1]);
  if (!Number.isInteger(anno) || !Number.isInteger(mese) || mese < 1 || mese > 12) return -1;
  return (anno - 2026) * 12 + mese - 1;
}

export default function GanttTriennale({ pageId }) {__mk();
  const table = useTable(pageId);
  const { openDetail } = usePrototype();
  const [progetto, setProgetto] = useState("");
  const [stato, setStato] = useState("");
  const [durata, setDurata] = useState("6");
  if (!table) return null;
  const nomi = ["Progetto", "Attività", "Scadenza", "Stato", "Referente di ufficio"];
  if (nomi.some((nome) => (__mk(), table.column(nome) < 0))) return <p>Per il Gantt servono Progetto, Attività, Scadenza, Stato e Referente di ufficio.</p>;
  const progetti = Array.from(new Set(table.rows.map((r) => (__mk(), table.value(r, "Progetto")))));
  const stati = Array.from(new Set(table.rows.map((r) => (__mk(), table.value(r, "Stato")))));
  const righe = table.rows.map((r, indice) => ((__mk(), { indice, progetto: table.value(r, "Progetto"), attivita: table.value(r, "Attività"), scadenza: table.value(r, "Scadenza"), stato: table.value(r, "Stato"), ufficio: table.value(r, "Referente di ufficio"), mese: meseScadenza(table.value(r, "Scadenza")) }))).filter((r) => (__mk(), (!progetto || r.progetto === progetto) && (!stato || r.stato === stato))).sort((a, b) => (__mk(), a.progetto.localeCompare(b.progetto) || a.mese - b.mese));
  const visibili = righe.filter((r) => (__mk(), r.mese >= 0 && r.mese < 36));
  return <Card title="Gantt ipotetico · 2026–2028">
    <div className="space-y-4 text-(--mk-text)">
      <p className="text-sm text-(--mk-muted)">Simulazione: ogni barra termina nel mese della scadenza registrata. L'inizio è stimato in base alla durata scelta, non deriva da un piano approvato. Nessuna data della tabella viene modificata.</p>
      <div className="flex flex-wrap gap-3">
        <Select label="Progetto" value={progetto} options={[{ value: "", label: "Tutti i progetti" }, ...progetti.map((p) => ((__mk(), { value: p, label: p })))]} onChange={setProgetto} />
        <Select label="Stato" value={stato} options={[{ value: "", label: "Tutti gli stati" }, ...stati.map((s) => ((__mk(), { value: s, label: s })))]} onChange={setStato} />
        <Select label="Durata indicativa per attività" value={durata} options={[{ value: "3", label: "3 mesi" }, { value: "6", label: "6 mesi" }, { value: "12", label: "12 mesi" }]} onChange={setDurata} />
        <Button variant="secondary" onClick={() => {__mk(); setProgetto(""); setStato(""); setDurata("6"); }}>Ripristina vista</Button>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <Badge tone="danger">In ritardo · tratteggio</Badge><Badge tone="primary">In corso · pieno</Badge><Badge tone="neutral">Altri stati · contorno</Badge>
      </div>
      <p className="text-sm">{visibili.length} attività nel triennio. Apri un'attività per consultarne i dettagli.</p>
      <div className="overflow-x-auto rounded border border-(--mk-border)">
        <div style={{ minWidth: "940px" }}>
          <div className="grid bg-(--mk-subtle)" style={{ gridTemplateColumns: "280px 1fr" }}>
            <div className="p-3 font-semibold">Progetto e attività</div>
            <div className="grid grid-cols-3">{[2026, 2027, 2028].map((anno) => (__mk(), <div key={anno} className="border-l border-(--mk-border) text-center"><div className="py-2 font-semibold">{anno}</div><div className="grid grid-cols-4 text-xs">{[1, 2, 3, 4].map((t) => (__mk(), <div key={t} className="border-t border-l border-(--mk-divider) py-1">T{t}</div>))}</div></div>))}</div>
          </div>
          {visibili.map((r) => {__mk();
            const inizio = Math.max(0, r.mese - Number(durata) + 1);
            const attivo = r.stato === "In corso";
            const ritardo = r.stato === "In ritardo";
            return <div key={r.indice} className="grid border-t border-(--mk-divider)" style={{ gridTemplateColumns: "280px 1fr" }}>
              <div className="space-y-1 p-3"><div className="text-xs font-semibold">{r.progetto}</div><Button variant="link" onClick={() => (__mk(), openDetail(pageId, r.indice))}>{r.attivita}</Button><div className="text-xs text-(--mk-muted)">{r.ufficio} · {r.scadenza}</div><Badge tone={ritardo ? "danger" : attivo ? "primary" : "neutral"}>{r.stato}</Badge></div>
              <div className="relative border-l border-(--mk-border)">
                <div className="absolute grid h-full w-full grid-cols-12" aria-hidden="true">{[0,1,2,3,4,5,6,7,8,9,10,11].map((t) => (__mk(), <div key={t} className="border-r border-(--mk-divider)" />))}</div>
                <div className={attivo ? "relative mt-6 rounded border bg-(--mk-primary) text-(--mk-on-primary)" : ritardo ? "relative mt-6 rounded border-2 border-dashed text-(--mk-danger) bg-(--mk-subtle)" : "relative mt-6 rounded border bg-(--mk-subtle) text-(--mk-text)"} style={{ marginLeft: (inizio / 36 * 100) + "%", width: ((r.mese - inizio + 1) / 36 * 100) + "%" }} title={r.attivita + " · scadenza " + r.scadenza}><div className="overflow-hidden px-1 py-2 text-xs">{r.scadenza}</div></div>
              </div>
            </div>;
          })}
        </div>
      </div>
      {!visibili.length && <p>Nessuna attività nel triennio per i filtri selezionati.</p>}
      {righe.length > visibili.length && <p className="text-sm text-(--mk-muted)">{righe.length - visibili.length} attività con data non valida o esterna al triennio: restano consultabili nella tabella.</p>}
    </div>
  </Card>;
}
