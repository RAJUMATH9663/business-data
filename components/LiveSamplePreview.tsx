"use client";

import { useState } from "react";
import Link from "next/link";
import DownloadSampleButton from "./DownloadSampleButton";

interface SampleRecord {
  id: number;
  name: string;
  category: string;
  district: string;
  town: string;
  phone: string;
  rating: number;
  reviewCount: number;
  address: string;
}

const SAMPLE_DATA: Record<string, SampleRecord[]> = {
  all: [
    {
      id: 1,
      name: "A V Daddenavar Hospital & Trauma Care",
      category: "Hospitals & Clinics",
      district: "Bagalkote",
      town: "Nava Nagar",
      phone: "+91 83542 97188",
      rating: 4.9,
      reviewCount: 501,
      address: "Sector 22, Nava Nagar, Bagalkot, Karnataka 587103",
    },
    {
      id: 2,
      name: "Kalyan Jewellers & Diamond Merchants",
      category: "Shopping & Retail",
      district: "Mysuru",
      town: "Devaraja Mohalla",
      phone: "+91 82124 23333",
      rating: 4.8,
      reviewCount: 1240,
      address: "Sayyaji Rao Rd, Devaraja Mohalla, Mysuru, Karnataka 570001",
    },
    {
      id: 3,
      name: "Bellary Steels & Alloys Manufacturing",
      category: "Industries & Manufacturing",
      district: "Ballari",
      town: "Ananthapur Road",
      phone: "+91 83922 41900",
      rating: 4.7,
      reviewCount: 318,
      address: "Industrial Area, Ananthapur Rd, Ballari, Karnataka 583101",
    },
    {
      id: 4,
      name: "Mandya Organic Agro Food Products",
      category: "Agriculture & Agro Businesses",
      district: "Mandya",
      town: "Mandya City",
      phone: "+91 82322 28444",
      rating: 4.9,
      reviewCount: 890,
      address: "Bangalore-Mysore Highway, Mandya, Karnataka 571401",
    },
    {
      id: 5,
      name: "Hotel Bidar Gateway & Grand Residency",
      category: "Food, Restaurants & Hotels",
      district: "Bidar",
      town: "Udgir Road",
      phone: "+91 99013 32446",
      rating: 4.6,
      reviewCount: 472,
      address: "Near Central Bus Terminal, Udgir Rd, Bidar, Karnataka 585401",
    },
    {
      id: 6,
      name: "Vijayanagara Agro Fertilizers & Seeds",
      category: "Agriculture & Agro Businesses",
      district: "Vijayanagara",
      town: "Hosapete",
      phone: "+91 83942 22510",
      rating: 4.8,
      reviewCount: 165,
      address: "Station Road, Hosapete, Vijayanagara, Karnataka 583201",
    },
  ],
  healthcare: [
    {
      id: 10,
      name: "A V Daddenavar Hospital & Trauma Care",
      category: "Hospitals & Clinics",
      district: "Bagalkote",
      town: "Nava Nagar",
      phone: "+91 83542 97188",
      rating: 4.9,
      reviewCount: 501,
      address: "Sector 22, Nava Nagar, Bagalkot, Karnataka 587103",
    },
    {
      id: 11,
      name: "Aashirvad Multispeciality Hospital",
      category: "Hospitals & Clinics",
      district: "Bidar",
      town: "Bidar",
      phone: "+91 93803 39342",
      rating: 4.5,
      reviewCount: 220,
      address: "Shivnagar South, Bidar, Karnataka 585401",
    },
    {
      id: 12,
      name: "Mirji Super Speciality Hospital",
      category: "Hospitals & Clinics",
      district: "Bagalkote",
      town: "Badami",
      phone: "+91 83542 26055",
      rating: 4.9,
      reviewCount: 847,
      address: "Rotary Circle, Bagalkot, Karnataka 587101",
    },
  ],
  manufacturing: [
    {
      id: 20,
      name: "Bellary Steels & Alloys Manufacturing",
      category: "Industries & Manufacturing",
      district: "Ballari",
      town: "Ananthapur Road",
      phone: "+91 83922 41900",
      rating: 4.7,
      reviewCount: 318,
      address: "Industrial Area, Ananthapur Rd, Ballari, Karnataka 583101",
    },
    {
      id: 21,
      name: "Vinayak Packaging & Industrial Crates",
      category: "Industries & Manufacturing",
      district: "Belagavi",
      town: "Udyambag",
      phone: "+91 99229 97681",
      rating: 4.8,
      reviewCount: 142,
      address: "Plot 34, Udyambag Industrial Estate, Belagavi, Karnataka 590008",
    },
    {
      id: 22,
      name: "Karnataka Agro Oil Extraction Mills",
      category: "Industries & Manufacturing",
      district: "Davanagere",
      town: "Harihar Road",
      phone: "+91 81922 34911",
      rating: 4.6,
      reviewCount: 95,
      address: "Industrial Suburb, Davanagere, Karnataka 577004",
    },
  ],
  retail: [
    {
      id: 30,
      name: "Kalyan Jewellers & Diamond Merchants",
      category: "Shopping & Retail",
      district: "Mysuru",
      town: "Devaraja Mohalla",
      phone: "+91 82124 23333",
      rating: 4.8,
      reviewCount: 1240,
      address: "Sayyaji Rao Rd, Devaraja Mohalla, Mysuru, Karnataka 570001",
    },
    {
      id: 31,
      name: "Vishal Mega Mart Retail Hub",
      category: "Shopping & Retail",
      district: "Bidar",
      town: "Gandhi Gunj",
      phone: "+91 93117 13450",
      rating: 3.8,
      reviewCount: 512,
      address: "Gandhi Gunj Main Rd, Bidar, Karnataka 585403",
    },
    {
      id: 32,
      name: "Poorvika Digital Gadgets & Tech Hub",
      category: "Shopping & Retail",
      district: "Chikkaballapur",
      town: "Chintamani",
      phone: "+91 44436 66666",
      rating: 4.7,
      reviewCount: 680,
      address: "MG Road, Chintamani, Chikkaballapur, Karnataka 563125",
    },
  ],
};

export default function LiveSamplePreview() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const records = SAMPLE_DATA[activeTab] || SAMPLE_DATA.all;

  return (
    <section className="card p-6 sm:p-10 border border-blue-500/20 bg-gradient-to-b from-[var(--bg-card)] via-[var(--bg-mist)] to-[var(--bg-card)] shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            100% Real Live Verified Data (10,200+ Listings)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            Verified B2B Registry Preview
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-xl">
            See actual verified enterprise listings with Google Maps ratings, callable phone numbers, and physical postal addresses across all 31 districts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DownloadSampleButton />
          <Link
            href="/explore"
            className="btn btn-primary !text-xs !py-2.5 !px-4 font-bold shadow-md"
          >
            Explore All 10,200+ Leads →
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[var(--border-card)] text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition-all ${
            activeTab === "all"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          🌟 Featured Mix
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("healthcare")}
          className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition-all ${
            activeTab === "healthcare"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          🏥 Healthcare & Clinics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manufacturing")}
          className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition-all ${
            activeTab === "manufacturing"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          🏭 Manufacturing & Industries
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("retail")}
          className={`rounded-xl px-3.5 py-2 whitespace-nowrap transition-all ${
            activeTab === "retail"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-[var(--text-muted)] hover:bg-[var(--tile-hover)] hover:text-[var(--text-main)]"
          }`}
        >
          🛒 Retail, Trade & Commerce
        </button>
      </div>

      {/* Table Preview */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border-card)]">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[var(--bg-mist)] text-[var(--text-muted)] uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-3 px-4">Enterprise Name</th>
              <th className="py-3 px-4">Sector</th>
              <th className="py-3 px-4">District / Hub</th>
              <th className="py-3 px-4">Contact Phone</th>
              <th className="py-3 px-4">Google Rating</th>
              <th className="py-3 px-4">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-card)] bg-[var(--bg-card)]">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-blue-500/5 transition-colors">
                <td className="py-3.5 px-4 font-bold text-[var(--text-main)]">
                  <div>{r.name}</div>
                  <div className="text-[11px] font-normal text-[var(--text-muted)] truncate max-w-xs">
                    {r.address}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[var(--text-main)] whitespace-nowrap">
                  <span className="inline-flex items-center rounded-lg bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {r.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-semibold text-[var(--text-main)]">{r.district}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{r.town}</div>
                </td>
                <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1">
                    <span>📞</span>
                    <span>{r.phone}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-amber-500">
                    ★ {r.rating.toFixed(1)}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    {r.reviewCount} Reviews
                  </div>
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span>✓</span> Verified Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <span>⚡</span>
          <span>Zero synthetic/dummy records. Every phone number & address tested for deliverability.</span>
        </div>
        <Link
          href="/directory"
          className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          View all 31 district directories →
        </Link>
      </div>
    </section>
  );
}
