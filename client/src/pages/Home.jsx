import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  Leaf,
  PackageSearch,
  MessageSquare,
  CalendarCheck,
  Sparkles,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  Zap,
  ChevronRight,
} from "lucide-react";
import CategoryBar from "../components/CategoryBar";
import ItemList from "../components/ItemList";

// ── Static data ───────────────────────────────────────────────────────────────

const STATS = [
  { value: "2,400+", label: "Items shared",    icon: PackageSearch },
  { value: "850+",   label: "Active lenders",  icon: Users         },
  { value: "40 kg",  label: "CO₂ offset",      icon: Leaf          },
  { value: "4.9",    label: "Avg. rating",      icon: Star          },
];

const HOW_STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Find what you need",
    desc:  "Search by item name or browse categories. Filter by location to see what's available near you right now.",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Connect with the lender",
    desc:  "Review the listing details, check availability, and send a borrow request directly to the item owner.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Borrow and return",
    desc:  "Agree on pickup dates, collect the item, use it, and return it safely. Rate the experience after.",
  },
];

const TESTIMONIALS = [
  {
    name:   "Kasun Perera",
    role:   "Borrower · Colombo 05",
    avatar: "KP",
    color:  "from-emerald-400 to-teal-500",
    rating: 5,
    text:   "Borrowed a DSLR for my sister's wedding. Found it in 10 minutes, picked it up the same evening. Saved me Rs. 45,000.",
  },
  {
    name:   "Nimasha Fernando",
    role:   "Lender · Colombo 07",
    avatar: "NF",
    color:  "from-violet-400 to-purple-500",
    rating: 5,
    text:   "My power tools were sitting idle for months. Now they earn me Rs. 8,000 a month and help neighbors get things done.",
  },
  {
    name:   "Amal Jayasinghe",
    role:   "Borrower · Colombo 03",
    avatar: "AJ",
    color:  "from-amber-400 to-orange-500",
    rating: 5,
    text:   "Used EcoLend to borrow a pressure washer and a ladder for a home project. Total cost: Rs. 2,400. Would have cost Rs. 30K to buy.",
  },
];

const TRUST_POINTS = [
  "Verified community members",
  "Direct lender communication",
  "Transparent item condition info",
  "Community ratings & reviews",
];

// ── Skeleton cards ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white">
      <div className="h-44 bg-gray-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 rounded-full bg-gray-100" />
        <div className="h-4 w-2/3 rounded-full bg-gray-100" />
        <div className="h-3 w-full rounded-full bg-gray-100" />
        <div className="flex justify-between pt-1">
          <div className="h-4 w-1/4 rounded-full bg-gray-100" />
          <div className="h-4 w-1/4 rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation]       = useState("");
  const [itemsLoaded, setItemsLoaded] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (location.trim())    params.set("location", location.trim());
    const qs = params.toString();
    navigate(qs ? `/browse?${qs}` : "/browse");
  };

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams();
    if (cat && cat !== "All") params.set("category", cat);
    const qs = params.toString();
    navigate(qs ? `/browse?${qs}` : "/browse");
  };

  return (
    <div className="space-y-16 pb-20">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-[2rem] bg-[#005A36]">

        {/* Background texture */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-40 left-[10%] h-80 w-80 rounded-full bg-white/[0.03]" />
          <div className="absolute right-[20%] top-[30%] h-40 w-40 rounded-full bg-emerald-400/10" />
          {/* Leaf grid pattern */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leafgrid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M24 4 C12 4, 4 12, 4 24 C4 36, 12 44, 24 44 C24 44, 24 24, 24 4Z" fill="white"/>
                <path d="M24 4 C36 4, 44 12, 44 24 C44 36, 36 44, 24 44 C24 44, 24 24, 24 4Z" fill="white" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leafgrid)"/>
          </svg>
        </div>

        {/* Floating badges */}
        <div className="pointer-events-none absolute right-8 top-8 hidden flex-col gap-3 lg:flex">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            <span className="text-xs font-semibold text-white/90">142 items available nearby</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Star size={12} className="text-amber-300" fill="currentColor" />
            <span className="text-xs font-semibold text-white/90">4.9 avg. community rating</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <TrendingUp size={12} className="text-emerald-300" />
            <span className="text-xs font-semibold text-white/90">Rs. 2.4M saved this month</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <Sparkles size={11} />
              AI-powered hyper-local sharing
            </span>

            {/* Headline */}
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
              Borrow what you need
              <span className="mt-1 block text-emerald-200">
                from people nearby.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-emerald-50/75 sm:text-base">
              EcoLend connects Colombo neighbors to share tools, cameras, appliances, 
              and gear — at a fraction of the cost of buying new.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-emerald-950/30"
            >
              <div className="grid md:grid-cols-[1fr_0.6fr_auto]">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 md:border-b-0 md:border-r">
                  <Search size={16} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for?"
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 md:border-b-0 md:border-r">
                  <MapPin size={16} className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your location"
                    className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-[#005A36] px-7 py-4 text-sm font-black text-white transition-all hover:bg-[#004428] active:scale-[0.98]"
                >
                  Find nearby
                  <ArrowRight size={15} />
                </button>
              </div>
            </form>

            {/* CTA row */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/browse")}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#005A36] transition-all hover:bg-emerald-50"
              >
                Browse marketplace
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/lend")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <PackageSearch size={14} />
                List an item
              </button>
            </div>

            {/* Trust chips */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                { icon: ShieldCheck, text: "Verified members" },
                { icon: MapPin,      text: "Items near you"   },
                { icon: Leaf,        text: "Eco-friendly"     },
                { icon: Zap,         text: "AI-matched"       },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-50/70">
                  <Icon size={13} className="text-emerald-300" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-100 shadow-sm lg:grid-cols-4">
        {STATS.map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-2 bg-white px-6 py-7 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3EC]">
              <Icon size={18} className="text-[#005A36]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">{value}</span>
            <span className="text-xs font-semibold text-gray-500">{label}</span>
          </div>
        ))}
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#005A36]">
              Browse by category
            </span>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900">
              Find what you need faster
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="inline-flex items-center gap-1.5 text-sm font-black text-[#005A36] hover:text-[#003d25]"
          >
            All categories
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="overflow-x-auto pb-1 [scrollbar-width:none]">
          <CategoryBar
            selectedCategory="All"
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* ── FEATURED LISTINGS ─────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#005A36]">
              Recently shared
            </span>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900">
              Latest community listings
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Items available right now from lenders near you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="hidden items-center gap-1.5 text-sm font-black text-[#005A36] hover:text-[#003d25] sm:inline-flex"
          >
            View all
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Skeleton while loading */}
        {!itemsLoaded && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        <div className={itemsLoaded ? "block" : "hidden"}>
          <ItemList
            category="All"
            searchQuery=""
            limit={6}
            onLoaded={() => setItemsLoaded(true)}
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-black text-gray-800 transition-all hover:border-[#005A36] hover:bg-[#F4F9F6] hover:text-[#005A36]"
          >
            Browse complete marketplace
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#005A36]">
              Simple process
            </span>
            <h2 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900">
              Borrow in three steps
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              From search to handoff in under an hour.
            </p>
          </div>
        </div>

        {/* Steps with connector */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div className="absolute left-[calc(16.66%+1.375rem)] right-[calc(16.66%+1.375rem)] top-[1.375rem] hidden h-px bg-gradient-to-r from-[#005A36]/20 via-[#005A36]/40 to-[#005A36]/20 md:block" />

          <div className="grid gap-5 md:grid-cols-3">
            {HOW_STEPS.map(({ icon: Icon, step, title, desc }, idx) => (
              <article
                key={step}
                className="relative rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                {/* Step number watermark */}
                <span className="absolute right-5 top-4 text-5xl font-black text-gray-50 select-none">
                  {step}
                </span>

                {/* Icon circle */}
                <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8F3EC] ring-4 ring-white">
                  <Icon size={20} className="text-[#005A36]" />
                </div>

                <h3 className="mt-5 text-base font-black text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{desc}</p>

                {/* Arrow connector inside card on mobile */}
                {idx < HOW_STEPS.length - 1 && (
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#005A36]/50 md:hidden">
                    then
                    <ArrowRight size={12} />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section>
        <div className="mb-8">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#005A36]">
            Community voices
          </span>
          <h2 className="mt-1.5 text-2xl font-black tracking-tight text-gray-900">
            Real stories from real neighbors
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, avatar, color, rating, text }) => (
            <article
              key={name}
              className="flex flex-col justify-between rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {/* Stars */}
              <div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={13} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-gray-600">"{text}"</p>
              </div>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${color} text-xs font-black text-white`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── TRUST + LENDER CTA ────────────────────────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-2">

        {/* Trust */}
        <article className="flex flex-col justify-between rounded-[2rem] bg-[#E8F3EC] p-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
              <Leaf size={22} className="text-[#005A36]" />
            </div>

            <span className="mt-6 block text-[10px] font-black uppercase tracking-[0.18em] text-[#005A36]">
              Share responsibly
            </span>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">
              Built on community trust.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
              Every listing is backed by real community members. Ratings, reviews, and
              verified profiles keep EcoLend a safe, reliable space.
            </p>

            <ul className="mt-5 space-y-2.5">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={16} className="shrink-0 text-[#005A36]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate("/browse")}
            className="mt-8 inline-flex items-center gap-2 text-sm font-black text-[#005A36] hover:text-[#003d25]"
          >
            Explore available items
            <ArrowRight size={14} />
          </button>
        </article>

        {/* Lender CTA */}
        <article className="relative overflow-hidden rounded-[2rem] bg-[#005A36] p-8 text-white">
          {/* Decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 left-[30%] h-48 w-48 rounded-full bg-white/[0.04]" />
            <div className="absolute right-12 bottom-12 h-24 w-24 rounded-full bg-emerald-400/20" />
            <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="leafgrid2" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                  <path d="M24 4 C12 4, 4 12, 4 24 C4 36, 12 44, 24 44 C24 44, 24 24, 24 4Z" fill="white"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#leafgrid2)"/>
            </svg>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <PackageSearch size={22} className="text-white" />
              </div>

              <span className="mt-6 block text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Become a lender
              </span>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                Idle gear? Turn it into income.
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-emerald-50/75">
                List the tools, cameras, or equipment sitting unused at home.
                Help a neighbor and earn Rs. 2,000–8,000 per item each month.
              </p>

              {/* Mini stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { val: "Rs. 8K+", lbl: "Avg. monthly per lender" },
                  { val: "< 5 min", lbl: "Time to list an item" },
                ].map(({ val, lbl }) => (
                  <div key={lbl} className="rounded-xl border border-white/10 bg-white/10 p-3">
                    <p className="text-base font-black text-white">{val}</p>
                    <p className="mt-0.5 text-[11px] text-emerald-50/65">{lbl}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/lend")}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-[#005A36] transition-all hover:bg-emerald-50 active:scale-[0.98]"
            >
              List your first item
              <ArrowRight size={14} />
            </button>
          </div>
        </article>
      </section>

    </div>
  );
}