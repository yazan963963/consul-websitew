"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Share2, Sparkles } from "lucide-react";
import { useRef } from "react";
import type { Dictionary } from "@/i18n/getDictionary";
import type { Locale } from "@/i18n/config";
import type { Catalog } from "@/lib/types";

export default function Hero({dict,locale,catalogs,totalProducts,description}:{dict:Dictionary;locale:Locale;catalogs:Catalog[];totalProducts:number;description?:string}) {
  const ref=useRef<HTMLDivElement>(null);const {scrollYProgress}=useScroll({target:ref,offset:["start start","end start"]});const visualY=useTransform(scrollYProgress,[0,1],[0,110]);const ar=locale==="ar";const Arrow=ar?ArrowLeft:ArrowRight;
  return <section ref={ref} className="relative min-h-[calc(100svh-4rem)] overflow-hidden border-b border-(--color-line)">
    <div className="hero-grid absolute inset-0 opacity-35"/><div className="absolute -start-40 top-10 size-[32rem] rounded-full bg-(--color-gold)/10 blur-[150px]"/><div className="absolute -end-48 bottom-0 size-[34rem] rounded-full bg-(--color-gold-deep)/10 blur-[160px]"/>
    <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
      <div className="relative z-10">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="mb-7 inline-flex items-center gap-2 rounded-full border border-(--color-gold)/25 bg-(--color-gold)/8 px-3 py-1.5 text-[11px] tracking-[.18em] text-(--color-gold)"><Sparkles size={13}/>{dict.hero.eyebrow}</motion.div>
        <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.75}} className="max-w-3xl font-(family-name:--font-display) text-[clamp(2.8rem,7vw,6.6rem)] leading-[.98] tracking-[-.045em] text-(--color-ivory)">{dict.hero.title}</motion.h1>
        {description && <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.22,duration:.65}} className="mt-7 max-w-xl text-base leading-8 text-(--color-bone) md:text-lg">{description}</motion.p>}
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.34,duration:.6}} className="mt-9 flex flex-wrap items-center gap-3"><Link href={`/${locale}/warehouses`} className="group inline-flex items-center gap-3 rounded-full bg-(--color-gold) px-6 py-3.5 text-sm font-semibold text-(--color-ink) shadow-[0_15px_50px_rgba(201,162,39,.22)] transition hover:-translate-y-1 hover:bg-(--color-gold-bright)">{ar?"اختر المستودع":"Choose warehouse"}<Arrow size={16} className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1"/></Link><span className="inline-flex items-center gap-2 rounded-full border border-(--color-line) px-5 py-3.5 text-xs text-(--color-bone)"><Share2 size={14} className="text-(--color-gold)"/>{ar?"جاهز للمشاركة فوراً":"Ready to share instantly"}</span></motion.div>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.55}} className="mt-12 flex items-center gap-8 border-t border-(--color-line) pt-6"><div><p className="text-2xl font-semibold text-(--color-ivory)">{catalogs.length.toString().padStart(2,"0")}</p><p className="mt-1 text-[10px] uppercase tracking-[.2em] text-(--color-smoke)">{ar?"كتالوجات مختارة":"Curated catalogs"}</p></div><div className="h-9 w-px bg-(--color-line)"/><div><p className="text-2xl font-semibold text-(--color-ivory)">{totalProducts}+</p><p className="mt-1 text-[10px] uppercase tracking-[.2em] text-(--color-smoke)">{ar?"منتج معروض":"Products showcased"}</p></div></motion.div>
      </div>
      <motion.div style={{y:visualY}} className="relative hidden min-h-[620px] lg:block">
        <div className="absolute inset-12 rounded-[3rem] border border-(--color-gold)/15 bg-(--color-surface)/35 backdrop-blur-2xl"/>
        {catalogs.slice(0,3).map((catalog,index)=>{const positions=["start-0 top-20 rotate-[-7deg]","end-2 top-0 rotate-[7deg]","start-[24%] bottom-3 rotate-[1deg]"];return <motion.div key={catalog.id} initial={{opacity:0,y:50,rotate:0}} animate={{opacity:1,y:0}} transition={{delay:.25+index*.16,duration:.8}} className={`absolute ${positions[index]} w-[270px] overflow-hidden rounded-[1.7rem] border border-white/10 bg-(--color-surface) p-2 shadow-[0_35px_100px_rgba(0,0,0,.5)]`}><div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]"><Image src={catalog.coverUrl} alt={ar?catalog.nameAr:catalog.nameEn} fill sizes="270px" className="object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/><div className="absolute inset-x-0 bottom-0 p-5"><p className="mb-1 text-[10px] uppercase tracking-[.2em] text-(--color-gold-bright)">{catalog.category}</p><p className="font-(family-name:--font-display) text-xl text-white">{ar?catalog.nameAr:catalog.nameEn}</p></div></div></motion.div>})}
        <div className="absolute end-10 bottom-24 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white backdrop-blur-xl"><BookOpen size={15} className="text-(--color-gold)"/>{ar?"عرض مخصص للمبيعات":"Built for sales presentations"}</div>
      </motion.div>
    </div>
  </section>;
}
