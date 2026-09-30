"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type District = { id: number; name: string; slug: string };
type Cat = { id: number; name: string; slug: string; icon: string; count: number; purchased?: number; available?: number };
type Tier = { id: number; minQty: number; maxQty: number | null; discountPercent: number };
type Quote = {
  available: number;
  quantity: number;
  exceeds: boolean;
  ratePaise: number;
  basePaise: number;
  discountPercent: number;
  discountPaise: number;
  finalPaise: number;
  alreadyPurchased?: number;
  totalInCategory?: number;
  nextStartNumber?: number;
};
type Order = {
  mode: "mock" | "razorpay";
  purchaseId: number;
  code: string;
  orderId: string;
  quantity: number;
  amountPaise: number;
  keyId: string;
  prefill: { name: string; email: string; contact: string };
};
type RzpResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

const money = (paise: number) =>
  "₹" + (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: Number.isInteger(paise / 100) ? 0 : 2, maximumFractionDigits: 2 });
const num = (n: number) => n.toLocaleString("en-IN");
const netErr = (e: unknown) =>
  e instanceof TypeError ? "Network error. Please check your internet connection and try again." : e instanceof Error ? e.message : "Something went wrong.";

export default function ExploreFlow({
  districts,
  tiers,
  loggedIn,
  initial,
}: {
  districts: District[];
  tiers: Tier[];
  loggedIn: boolean;
  initial: { d: string | null; c: string | null; q: number | null };
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState<District | null>(() => districts.find((d) => d.slug === initial.d) ?? null);
  const [cats, setCats] = useState<Cat[] | null>(null);
  const [catError, setCatError] = useState("");
  const [category, setCategory] = useState<Cat | null>(null);
  const [available, setAvailable] = useState<number | null>(null);
  const [qty, setQty] = useState<number>(initial.q ?? 250);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const wantedCat = useRef<string | null>(initial.c);
  const wantedQty = useRef<number | null>(initial.q);
  const reqId = useRef(0);
  const catRef = useRef<HTMLDivElement>(null);
  const qtyRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? districts.filter((d) => d.name.toLowerCase().includes(q)) : districts;
  }, [districts, search]);

  const chips = useMemo(() => {
    if (!available || available <= 0) return [100, 250, 500, 1000];
    if (available <= 50) {
      return [10, 25, available].filter((v, i, a) => v <= available && a.indexOf(v) === i);
    }
    if (available < 100) {
      return [10, 25, 50, available].filter((v, i, a) => v <= available && a.indexOf(v) === i);
    }
    return [100, 250, 500, 1000].filter((v) => v <= available || v === 100);
  }, [available]);

  // Load categories whenever a district is chosen
  useEffect(() => {
    if (!district) return;
    let cancelled = false;
    setCats(null);
    setCatError("");
    fetch(`/api/catalog/categories?district=${encodeURIComponent(district.slug)}`)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error);
        return j.categories as Cat[];
      })
      .then((list) => {
        if (cancelled) return;
        setCats(list);
        if (wantedCat.current) {
          const c = list.find((x) => x.slug === wantedCat.current && x.count > 0);
          wantedCat.current = null;
          if (c) void pickCategory(c, district);
        }
      })
      .catch((e) => !cancelled && setCatError(netErr(e)));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [district]);

  // Keep URL shareable / restorable after login
  useEffect(() => {
    const p = new URLSearchParams();
    if (district) p.set("d", district.slug);
    if (district && category) {
      p.set("c", category.slug);
      p.set("q", String(qty));
    }
    const s = p.toString();
    window.history.replaceState(null, "", "/explore" + (s ? `?${s}` : ""));
  }, [district, category, qty]);

  // Backend-authoritative price, refreshed as quantity changes
  useEffect(() => {
    if (!district || !category || !available) return;
    const q = Math.max(1, Math.floor(qty) || 1);
    const id = ++reqId.current;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/quote?district=${district.slug}&category=${category.slug}&qty=${q}`);
        const j = await r.json();
        if (id !== reqId.current) return;
        if (!r.ok) throw new Error(j.error);
        setQuote(j);
        setQuoteError("");
      } catch (e) {
        if (id === reqId.current) setQuoteError(netErr(e));
      }
    }, 200);
    return () => clearTimeout(t);
  }, [district, category, available, qty]);

  async function pickCategory(c: Cat, d: District | null = district) {
    if (!d) return;
    setCategory(c);
    setQuote(null);
    setQuoteError("");
    setNotice("");
    setAvailable(null);
    try {
      const r = await fetch(`/api/quote?district=${d.slug}&category=${c.slug}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setAvailable(j.available);
      const want = wantedQty.current ?? Math.min(250, j.available);
      wantedQty.current = null;
      setQty(Math.max(1, Math.min(want, j.available || 1)));
    } catch (e) {
      setQuoteError(netErr(e));
    }
    setTimeout(() => qtyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function pickDistrict(d: District) {
    setDistrict(d);
    setCategory(null);
    setAvailable(null);
    setQuote(null);
    setNotice("");
    setTimeout(() => catRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function setQuantity(v: number) {
    const max = available ?? 1;
    setQty(Math.max(1, Math.min(max, Math.floor(v) || 1)));
  }

  function currentUrl() {
    return window.location.pathname + window.location.search;
  }

  async function verify(o: Order, payload: RzpResponse) {
    try {
      const r = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      router.push(`/purchases/${o.purchaseId}?paid=1`);
    } catch (e) {
      setNotice(
        (e instanceof TypeError ? "We could not confirm your payment because of a network problem. " : "") +
          (e instanceof Error && !(e instanceof TypeError) ? e.message : "If money was deducted, check My Purchases in a few minutes."),
      );
      setBusy(false);
    }
  }

  async function markFailed(o: Order, reason: "failed" | "cancelled") {
    fetch("/api/orders/fail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ razorpay_order_id: o.orderId, reason }),
    }).catch(() => {});
    setNotice(reason === "cancelled" ? "Payment cancelled. You have not been charged." : "Payment failed. You have not been charged. Please try again.");
    if (reason === "cancelled") setBusy(false);
  }

  function loadRazorpay(): Promise<boolean> {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });
  }

  async function openCheckout(o: Order) {
    if (!(await loadRazorpay())) {
      setNotice("Could not load the payment window. Check your connection and try again.");
      setBusy(false);
      return;
    }
    let paid = false;
    const rzp = new window.Razorpay({
      key: o.keyId,
      amount: o.amountPaise,
      currency: "INR",
      name: "NivoLeads",
      image: "/logo.png",
      description: `${o.quantity} contacts · ${district?.name} · ${category?.name}`,
      order_id: o.orderId,
      prefill: o.prefill,
      theme: { color: "#2563EB" },
      handler: (resp: RzpResponse) => {
        paid = true;
        void verify(o, resp);
      },
      modal: {
        ondismiss: () => {
          if (!paid) void markFailed(o, "cancelled");
        },
      },
    });
    rzp.on("payment.failed", () => {
      if (!paid) void markFailed(o, "failed");
    });
    rzp.open();
  }

  async function pay() {
    if (!district || !category || !quote || quote.exceeds) return;
    if (!loggedIn) {
      router.push("/login?next=" + encodeURIComponent(currentUrl()));
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ district: district.slug, category: category.slug, quantity: quote.quantity }),
      });
      const o = (await r.json()) as Order & { error?: string };
      if (r.status === 401) {
        router.push("/login?next=" + encodeURIComponent(currentUrl()));
        return;
      }
      if (!r.ok) throw new Error(o.error || "Could not start the payment.");
      if (o.mode === "mock") {
        await verify(o, { razorpay_order_id: o.orderId, razorpay_payment_id: "pay_mock_" + Date.now(), razorpay_signature: "mock_signature" });
        return;
      }
      await openCheckout(o);
    } catch (e) {
      setNotice(netErr(e));
      setBusy(false);
    }
  }

  const tierText = tiers
    .filter((t) => t.discountPercent > 0)
    .map((t) => `${num(t.minQty)}${t.maxQty ? `–${num(t.maxQty)}` : "+"}: ${t.discountPercent}% off`);

  return (
    <div className="space-y-6">
      {/* Progress chips */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="badge">1 District</span>
        <span className="badge">2 Category</span>
        <span className="badge">3 Contacts</span>
        <span className="badge">4 Pay</span>
        <span className="badge">5 Data</span>
      </div>

      {notice && (
        <div role="alert" className="fade-in rounded-2xl border border-brand/50 bg-paper p-4 text-sm font-medium">
          ⚠️ {notice}
        </div>
      )}

      {/* STEP 1 — district */}
      <section aria-labelledby="s1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="s1" className="text-xl">
            {district ? (
              <>📍 {district.name}</>
            ) : (
              "Select a district"
            )}
          </h2>
          {district && (
            <button
              className="btn btn-ghost !min-h-[38px] !py-1.5"
              onClick={() => {
                setDistrict(null);
                setCategory(null);
                setCats(null);
                setQuote(null);
              }}
            >
              Change district
            </button>
          )}
        </div>
        {!district && (
          <div className="fade-in mt-3">
            <input
              className="input"
              type="search"
              placeholder="Search district…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search district"
            />
            {filtered.length === 0 ? (
              <p className="mt-4 text-sm">No district matches "{search}".</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {filtered.map((d) => (
                  <button key={d.id} className="tile" onClick={() => pickDistrict(d)}>
                    <span className="text-xl">📍</span>
                    <span className="text-sm font-semibold leading-tight">{d.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* STEP 2 — category */}
      {district && (
        <section ref={catRef} aria-labelledby="s2" className="fade-in scroll-mt-20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="s2" className="text-xl">{category ? `${category.icon} ${category.name}` : "Select a business category"}</h2>
            {category && (
              <button className="btn btn-ghost !min-h-[38px] !py-1.5" onClick={() => { setCategory(null); setQuote(null); }}>
                Change category
              </button>
            )}
          </div>
          {!category && (
            <div className="mt-3">
              {catError ? (
                <div className="card p-5 text-sm">
                  ⚠️ {catError} <button className="font-semibold text-brand underline" onClick={() => setDistrict({ ...district })}>Retry</button>
                </div>
              ) : !cats ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-16 animate-pulse rounded-2xl bg-mist/60" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cats.map((c) => (
                    <button
                      key={c.id}
                      className={`tile ${c.count === 0 ? "cursor-not-allowed opacity-50 hover:translate-y-0 hover:shadow-none" : ""}`}
                      disabled={c.count === 0}
                      onClick={() => pickCategory(c)}
                    >
                      <span className="text-2xl">{c.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold leading-tight">{c.name}</span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {c.count === 0 ? (
                            "Coming soon"
                          ) : c.purchased && c.purchased > 0 ? (
                            <span className="text-blue-500 font-semibold">
                              {num(c.available ?? c.count)} new available · ({num(c.purchased)} owned)
                            </span>
                          ) : (
                            `${num(c.count)} contacts`
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* STEP 3 — quantity + price + pay */}
      {district && category && (
        <section ref={qtyRef} aria-labelledby="s3" className="fade-in scroll-mt-20">
          <div className="card p-5 sm:p-7">
            <h2 id="s3" className="text-2xl">
              {district.name} — {category.name}
            </h2>

            {available === null && !quoteError && <p className="mt-3 text-sm text-[var(--text-muted)]">Checking availability…</p>}
            {quoteError && available === null && <p className="mt-3 text-sm font-medium text-rose-500">⚠️ {quoteError}</p>}

            {available === 0 && (
              <p className="card mt-3 p-4 text-sm text-[var(--text-muted)]">
                No contacts are available for you in this category right now. You may already own all of them.
              </p>
            )}

            {available !== null && available > 0 && (
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Available Fresh Contacts</p>
                      <p className="text-3xl font-extrabold text-blue-500">{num(available)}</p>
                    </div>
                    {quote?.alreadyPurchased !== undefined && quote.alreadyPurchased > 0 && (
                      <div className="text-right">
                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Already Owned</p>
                        <p className="text-lg font-bold text-[var(--text-main)]">{num(quote.alreadyPurchased)}</p>
                      </div>
                    )}
                  </div>

                  {quote?.alreadyPurchased !== undefined && quote.alreadyPurchased > 0 && quote.nextStartNumber && (
                    <div className="mt-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-xs text-[var(--text-main)] shadow-sm">
                      <div className="flex items-center gap-1.5 font-bold text-blue-500">
                        <span>✨</span>
                        <span>Starts from Contact #{quote.nextStartNumber}</span>
                      </div>
                      <p className="mt-1 text-[var(--text-muted)] leading-relaxed">
                        You will receive brand-new contacts from <b>#{quote.nextStartNumber} to #{quote.nextStartNumber + qty - 1}</b>.
                        Zero duplicates guaranteed with your previous purchases!
                      </p>
                    </div>
                  )}

                  <p className="mt-5 text-sm font-semibold">How many contacts do you need?</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button aria-label="Decrease" className="btn btn-ghost !min-h-[52px] !w-14 text-xl" onClick={() => setQuantity(qty - 10)}>−</button>
                    <input
                      aria-label="Number of contacts"
                      className="input !min-h-[52px] text-center text-2xl font-bold"
                      inputMode="numeric"
                      value={qty}
                      onChange={(e) => setQuantity(parseInt(e.target.value.replace(/\D/g, ""), 10) || 1)}
                    />
                    <button aria-label="Increase" className="btn btn-ghost !min-h-[52px] !w-14 text-xl" onClick={() => setQuantity(qty + 10)}>+</button>
                  </div>
                  <div className={`mt-3 grid gap-2 ${chips.length === 3 ? "grid-cols-3" : chips.length === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
                    {chips.map((c) => (
                      <button
                        key={c}
                        disabled={c > available}
                        onClick={() => setQuantity(c)}
                        className={`btn !px-0 ${qty === c ? "btn-primary" : "btn-ghost"}`}
                      >
                        {num(c)}
                      </button>
                    ))}
                  </div>
                  <button className="mt-3 text-sm font-semibold text-brand underline" onClick={() => setQuantity(available)}>
                    Buy all {num(available)}
                  </button>
                  {tierText.length > 0 && <p className="mt-4 text-xs text-[var(--text-muted)]">Volume discounts — {tierText.join(" · ")}</p>}
                </div>

                <div className="rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-5">
                  <h3 className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Your price</h3>
                  {quoteError ? (
                    <p className="mt-3 text-sm font-medium text-rose-500">⚠️ {quoteError}</p>
                  ) : !quote ? (
                    <div className="mt-3 h-24 animate-pulse rounded-xl bg-[var(--bg-card)]" />
                  ) : (
                    <dl className="mt-3 space-y-2 text-sm">
                      <div className="flex justify-between"><dt>{num(quote.quantity)} × {money(quote.ratePaise)}</dt><dd>{money(quote.basePaise)}</dd></div>
                      <div className="flex justify-between">
                        <dt>Discount ({quote.discountPercent}%)</dt>
                        <dd>− {money(quote.discountPaise)}</dd>
                      </div>
                      <div className="flex items-end justify-between border-t border-[var(--border-card)] pt-3">
                        <dt className="font-semibold text-[var(--text-main)]">Total</dt>
                        <dd className="text-3xl font-bold text-brand">{money(quote.finalPaise)}</dd>
                      </div>
                    </dl>
                  )}
                  {quote?.exceeds && <p className="mt-3 text-sm font-medium text-amber-500">Only {num(available)} contacts are available.</p>}
                  <button className="btn btn-primary mt-5 w-full !py-3.5 !text-base" disabled={!quote || quote.exceeds || busy} onClick={pay}>
                    {busy ? "Processing…" : quote ? `Pay ${money(quote.finalPaise)} →` : "Pay"}
                  </button>
                  <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
                    {loggedIn ? "Secure payment via Razorpay. Data appears right after payment." : "You will be asked to log in or register before paying."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
