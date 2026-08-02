"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, BarChart3, BookOpen, Boxes, ChevronLeft, Circle, FolderTree, LogOut, Menu, PlugZap, Settings, Share2, UserRound, Users, Warehouse, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/i18n/config";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import type { AdminAccess } from "@/lib/auth";
import type { Permission } from "@/lib/permissions";
import { logoutAction } from "@/lib/actions";

export default function AdminShell({children,locale,access}:{children:React.ReactNode;locale:Locale;access:AdminAccess|null}) {
  const pathname=usePathname(); const [open,setOpen]=useState(false);
  if(pathname.endsWith("/admin/login")) return children;
  const ar=locale==="ar";
  const allowed=(permission:Permission)=>Boolean(access?.permissions.includes(permission));
  const allItems:Array<[string,string,LucideIcon,Permission]>=[
    ["",ar?"نظرة عامة":"Overview",BarChart3,"dashboard.view"],
    ["/catalogs",ar?"الكتالوجات":"Catalogs",BookOpen,"catalogs.view"],
    ["/inventory",ar?"المخزون والتنبيهات":"Inventory & alerts",Boxes,"catalogs.inventory"],
    ["/share",ar?"مركز المشاركة":"Sharing center",Share2,"catalogs.view"],
    ["/warehouses",ar?"المستودعات":"Warehouses",Warehouse,"warehouses.view"],
    ["/categories",ar?"التصنيفات":"Categories",FolderTree,"categories.view"],
    ["/users",ar?"المستخدمون":"Users",Users,"users.view"],
    ["/activity",ar?"سجل النشاط":"Activity log",Activity,"dashboard.view"],
    ["/integrations",ar?"تكامل دفترة":"Daftra integration",PlugZap,"settings.view"],
    ["/settings",ar?"الإعدادات":"Settings",Settings,"settings.view"],
  ];
  const items=allItems.filter((item)=>allowed(item[3]));
  const sidebar=<div className="flex h-full flex-col bg-(--color-surface)/90 p-4 backdrop-blur-2xl">
    <div className="mb-3 flex items-center justify-between px-2"><Link href={`/${locale}`} aria-label="CONSUL" className="relative h-14 w-24"><Image src="/brand/consul-logo-transparent.png" alt="CONSUL" fill sizes="96px" className="object-contain"/></Link><button onClick={()=>setOpen(false)} className="lg:hidden"><X size={18}/></button></div>
    <div className="mb-8 flex items-center gap-2 px-2 text-[10px] uppercase tracking-[.18em] text-(--color-smoke)"><Circle size={7} className="fill-emerald-400 text-emerald-400"/>{ar?"مساحة عمل المبيعات":"Sales workspace"}</div>
    <nav className="flex-1 space-y-1 overflow-y-auto pe-1">{items.map(([suffix,label,Icon])=>{const href=`/${locale}/admin${suffix}`;const active=suffix?pathname.startsWith(href):pathname===href;return <Link key={href} href={href} onClick={()=>setOpen(false)} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",active?"bg-(--color-gold) text-(--color-ink)":"text-(--color-bone) hover:bg-(--color-surface-2) hover:text-(--color-ivory)")}><Icon size={17}/>{label}</Link>})}</nav>
    <div className="mt-auto rounded-2xl border border-(--color-gold)/15 bg-(--color-gold)/5 p-3"><p className="text-[10px] uppercase tracking-[.18em] text-(--color-gold)">{ar?"وضع العرض":"Presentation mode"}</p><p className="mt-1 text-xs leading-5 text-(--color-smoke)">{ar?"المكتبة جاهزة لفريق المبيعات.":"Your library is sales-ready."}</p><Link href={`/${locale}`} className="mt-3 flex items-center gap-2 text-xs text-(--color-ivory)"><ChevronLeft size={14}/>{ar?"فتح الموقع":"Open website"}</Link></div>
  </div>;
  return <div className="admin-noise min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,.1),transparent_32%)]">
    <aside className="fixed inset-y-0 start-0 z-50 hidden w-64 border-e border-(--color-line) lg:block">{sidebar}</aside>
    <AnimatePresence>{open&&<><motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={()=>setOpen(false)}/><motion.aside initial={{x:ar?280:-280}} animate={{x:0}} exit={{x:ar?280:-280}} className="fixed inset-y-0 start-0 z-50 w-72 border-e border-(--color-line) lg:hidden">{sidebar}</motion.aside></>}</AnimatePresence>
    <div className="lg:ps-64"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-(--color-line) bg-(--color-ink)/70 px-4 py-2 backdrop-blur-xl sm:px-5"><button onClick={()=>setOpen(true)} className="lg:hidden"><Menu size={20}/></button><div className="hidden sm:block"><p className="text-[10px] uppercase tracking-[.24em] text-(--color-smoke)">{ar?"لوحة الإدارة":"Admin workspace"}</p><p className="mt-0.5 text-xs text-(--color-bone)">{ar?"مكتبة CONSUL الرقمية":"CONSUL digital library"}</p></div><div className="flex items-center gap-2 sm:gap-3"><span className="hidden items-center gap-2 rounded-full border border-(--color-line) px-3 py-1.5 text-[10px] text-(--color-smoke) xl:flex"><Circle size={6} className="fill-emerald-400 text-emerald-400"/>LIVE</span>{access&&<div className="flex items-center gap-2 rounded-xl border border-(--color-line) bg-(--color-surface)/70 px-2.5 py-1.5"><span className="grid size-8 place-items-center rounded-full bg-(--color-gold)/10 text-(--color-gold)"><UserRound size={15}/></span><div className="hidden max-w-40 sm:block"><p className="truncate text-xs text-(--color-ivory)">{access.fullName}</p><p className="truncate text-[10px] text-(--color-smoke)">{access.role === "owner" ? (ar?"المالك الرئيسي":"Owner") : access.role}</p></div></div>}<ThemeToggle/>{access&&<form action={logoutAction.bind(null,locale)}><button type="submit" aria-label={ar?"تسجيل الخروج":"Sign out"} title={ar?"تسجيل الخروج":"Sign out"} className="grid size-9 place-items-center rounded-full border border-(--color-line) text-(--color-smoke) transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"><LogOut size={16}/></button></form>}</div></header><main className="p-4 sm:p-6 lg:p-8">{children}</main></div>
  </div>;
}
