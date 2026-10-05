"use client";

import { useState } from "react";
import Link from "next/link";

interface District {
  id: number;
  name: string;
  slug: string;
  code: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

interface SuccessResponse {
  message: string;
  alreadyExists?: boolean;
  business: {
    id: number;
    name: string;
    district: { name: string; slug: string } | string;
    category: { name: string; slug: string } | string;
  };
}

export default function ListBusinessForm({
  districts,
  categories,
}: {
  districts: District[];
  categories: Category[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    districtId: districts[0]?.id ? String(districts[0].id) : "",
    categoryId: categories[0]?.id ? String(categories[0].id) : "",
    area: "",
    email: "",
    address: "",
    pincode: "",
    website: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<SuccessResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your business or company name.");
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number (e.g. 9845012345).");
      return;
    }

    if (!formData.districtId) {
      setError("Please select a district.");
      return;
    }

    if (!formData.categoryId) {
      setError("Please select an industry category.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          districtId: parseInt(formData.districtId, 10),
          categoryId: parseInt(formData.categoryId, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to list business. Please try again.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const distSlug = typeof result.business.district === "object" ? result.business.district.slug : "";
    const catSlug = typeof result.business.category === "object" ? result.business.category.slug : "";
    const distName = typeof result.business.district === "object" ? result.business.district.name : result.business.district;
    const catName = typeof result.business.category === "object" ? result.business.category.name : result.business.category;

    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-[var(--bg-card)] p-6 sm:p-10 text-center space-y-6 shadow-md fade-in">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-3xl">
          🎉
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
            {result.alreadyExists ? "Already Listed!" : "Listing Successfully Added!"}
          </h2>
          <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto">
            {result.message}
          </p>
        </div>

        <div className="mx-auto max-w-md rounded-2xl border border-[var(--border-card)] bg-[var(--bg-mist)] p-5 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between border-b border-[var(--border-card)] pb-2">
            <span className="text-[var(--text-muted)]">Business Name:</span>
            <span className="font-semibold text-[var(--text-main)]">{result.business.name}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-card)] pb-2">
            <span className="text-[var(--text-muted)]">District:</span>
            <span className="font-semibold text-[var(--text-main)]">{distName}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--border-card)] pb-2">
            <span className="text-[var(--text-muted)]">Industry Category:</span>
            <span className="font-semibold text-[var(--text-main)]">{catName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ VERIFIED ACTIVE</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {distSlug && catSlug && (
            <Link
              href={`/directory/${distSlug}/${catSlug}`}
              className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 px-6 py-3 text-xs font-semibold rounded-xl"
            >
              View Category Directory →
            </Link>
          )}
          <button
            onClick={() => {
              setResult(null);
              setFormData({
                name: "",
                phone: "",
                altPhone: "",
                districtId: districts[0]?.id ? String(districts[0].id) : "",
                categoryId: categories[0]?.id ? String(categories[0].id) : "",
                area: "",
                email: "",
                address: "",
                pincode: "",
                website: "",
              });
            }}
            className="btn rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] px-5 py-3 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--tile-hover)]"
          >
            Add Another Business Listing +
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[var(--border-card)] bg-[var(--bg-card)] p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-[var(--border-card)] pb-4">
        <h2 className="text-xl font-bold text-[var(--text-main)]">Business Details</h2>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Fill in your verified contact details so prospective clients and business buyers can connect with you.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 fade-in">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Business Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Business / Firm / Enterprise Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Royal Karnataka Traders Pvt Ltd"
            value={formData.name}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm"
          />
        </div>

        {/* Verified Mobile */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            10-Digit Mobile / WhatsApp Number <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
              +91
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={10}
              placeholder="9845012345"
              value={formData.phone}
              onChange={handleChange}
              className="input w-full !pl-12 !py-3 !text-sm font-mono"
            />
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">10-digit calling/WhatsApp mobile number</span>
        </div>

        {/* Alternate Phone */}
        <div className="space-y-1.5">
          <label htmlFor="altPhone" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Alternate Contact / Landline <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
          </label>
          <input
            id="altPhone"
            name="altPhone"
            type="tel"
            placeholder="e.g. 08022345678"
            value={formData.altPhone}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm font-mono"
          />
        </div>

        {/* District Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="districtId" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Karnataka District <span className="text-rose-500">*</span>
          </label>
          <select
            id="districtId"
            name="districtId"
            required
            value={formData.districtId}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm font-semibold"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                📍 {d.name} ({d.code})
              </option>
            ))}
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Industry Category <span className="text-rose-500">*</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm font-semibold"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Area / City / Locality */}
        <div className="space-y-1.5">
          <label htmlFor="area" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Area / Locality / City Sector <span className="text-xs font-normal text-[var(--text-muted)]">(Recommended)</span>
          </label>
          <input
            id="area"
            name="area"
            type="text"
            placeholder="e.g. Indiranagar, MG Road, APMC Yard"
            value={formData.area}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-1.5">
          <label htmlFor="pincode" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Pincode <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
          </label>
          <input
            id="pincode"
            name="pincode"
            type="text"
            maxLength={6}
            placeholder="e.g. 560038"
            value={formData.pincode}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm font-mono"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Email Address <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. contact@business.com"
            value={formData.email}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm"
          />
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <label htmlFor="website" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Website URL <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            placeholder="e.g. https://mybusiness.com"
            value={formData.website}
            onChange={handleChange}
            className="input w-full !py-3 !text-sm"
          />
        </div>

        {/* Complete Address */}
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Complete Street Address <span className="text-xs font-normal text-[var(--text-muted)]">(Optional)</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            placeholder="e.g. #123, 1st Main, Industrial Area, Near Post Office"
            value={formData.address}
            onChange={handleChange}
            className="input w-full !py-2.5 !text-sm"
          />
        </div>
      </div>

      <div className="border-t border-[var(--border-card)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[var(--text-muted)]">
          🔒 By submitting, you agree to list your business profile on Karnataka Trade Directory.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 px-8 py-3.5 text-sm font-semibold rounded-xl w-full sm:w-auto transition-all active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Verifying & Listing...</span>
            </span>
          ) : (
            <span>List My Business Free 🎉</span>
          )}
        </button>
      </div>
    </form>
  );
}
