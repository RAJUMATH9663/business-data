"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "select" | "checkbox";
  options?: { value: string | number; label: string }[];
  value?: string | number | boolean | null;
  required?: boolean;
  nullable?: boolean; // empty -> null
  numeric?: boolean; // select whose value is a number
  step?: string;
  placeholder?: string;
  wide?: boolean;
};

const errText = (e: unknown) => (e instanceof TypeError ? "Network error. Please try again." : e instanceof Error ? e.message : "Failed");

export function JsonForm({
  endpoint,
  method = "POST",
  fields,
  submit,
  extra,
  reset = false,
}: {
  endpoint: string;
  method?: "POST" | "PATCH";
  fields: Field[];
  submit: string;
  extra?: Record<string, unknown>;
  reset?: boolean;
}) {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { ...extra };
    for (const f of fields) {
      if (f.type === "checkbox") {
        body[f.name] = fd.get(f.name) === "on";
        continue;
      }
      const raw = String(fd.get(f.name) ?? "").trim();
      if (f.type === "number" || f.numeric) {
        if (raw === "") {
          if (f.nullable) body[f.name] = null;
        } else body[f.name] = Number(raw);
      } else body[f.name] = raw;
    }
    try {
      const r = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Failed");
      setMsg({ ok: true, text: "Saved ✓" });
      if (reset) ref.current?.reset();
      router.refresh();
    } catch (err) {
      setMsg({ ok: false, text: errText(err) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={ref} onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <div key={f.name} className={f.wide ? "sm:col-span-2 lg:col-span-3" : ""}>
            {f.type === "checkbox" ? (
              <label className="flex min-h-[44px] items-center gap-2 text-sm font-semibold">
                <input type="checkbox" name={f.name} defaultChecked={!!f.value} className="h-5 w-5 accent-brand" /> {f.label}
              </label>
            ) : (
              <>
                <label className="label" htmlFor={`${endpoint}-${f.name}`}>{f.label}</label>
                {f.type === "select" ? (
                  <select id={`${endpoint}-${f.name}`} name={f.name} defaultValue={String(f.value ?? "")} className="input" required={f.required}>
                    {f.options?.map((o) => (
                      <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`${endpoint}-${f.name}`}
                    name={f.name}
                    type={f.type === "number" ? "number" : "text"}
                    step={f.step}
                    defaultValue={f.value === null || f.value === undefined ? "" : String(f.value)}
                    required={f.required}
                    placeholder={f.placeholder}
                    className="input"
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" disabled={busy}>{busy ? "Saving…" : submit}</button>
        {msg && <span role="status" className={`text-sm font-semibold ${msg.ok ? "text-emerald-500" : "text-rose-500"}`}>{msg.ok ? msg.text : `⚠️ ${msg.text}`}</span>}
      </div>
    </form>
  );
}

export function RowButton({
  endpoint,
  method,
  body,
  label,
  confirmText,
}: {
  endpoint: string;
  method: "PATCH" | "DELETE";
  body: Record<string, unknown>;
  label: string;
  confirmText?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      className="btn btn-ghost !min-h-[38px] !py-1.5"
      disabled={busy}
      onClick={async () => {
        if (confirmText && !window.confirm(confirmText)) return;
        setBusy(true);
        try {
          const r = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
          const j = await r.json();
          if (!r.ok) throw new Error(j.error || "Failed");
          router.refresh();
        } catch (e) {
          window.alert(errText(e));
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}
