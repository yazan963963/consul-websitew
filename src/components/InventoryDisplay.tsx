"use client";

import { useMemo, useState } from "react";
import { Check, MapPin, PackageCheck, PackageX } from "lucide-react";
import type { CatalogInventoryItem, Warehouse } from "@/lib/types";
import type { Locale } from "@/i18n/config";

export default function InventoryDisplay({ inventory, warehouses, locale }: { inventory: CatalogInventoryItem[]; warehouses: Warehouse[]; locale: Locale }) {
  const visible = useMemo(()=>inventory.filter((item)=>item.color),[inventory]);
  const [selected,setSelected] = useState(0);
  const ar=locale==="ar";
  const hasInventory=visible.length>0;
  const current=visible[Math.min(selected,visible.length-1)] ?? {color:"",sku:"",barcode:"",quantities:{}};
  const formatQuantity=(quantity:number)=>new Intl.NumberFormat(ar?"ar-SA":"en-US").format(quantity);
  return <section className="mb-8 overflow-hidden rounded-[1.75rem] border border-(--color-gold)/20 bg-[linear-gradient(135deg,rgba(198,154,62,.08),transparent_55%)] shadow-[0_24px_80px_rgba(0,0,0,.16)]">
    <div className="border-b border-(--color-line) p-5 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-(--color-gold)"><PackageCheck size={15}/>{ar?"الألوان والتوفر":"Colors & availability"}</p><p className="mt-2 text-xs text-(--color-smoke)">{hasInventory?(ar?"اختر اللون لمعرفة توفره في المستودعات":"Select a color to check warehouse availability"):(ar?"سيتم عرض الألوان هنا بعد إضافتها من لوحة الإدارة":"Colors will appear here after they are added in the dashboard")}</p></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1">{hasInventory?visible.map((item,index)=><button key={`${item.color}-${index}`} onClick={()=>setSelected(index)} className={`relative shrink-0 rounded-full border px-4 py-2 text-xs transition ${selected===index?"border-(--color-gold) bg-(--color-gold) text-(--color-ink) shadow-[0_8px_30px_rgba(198,154,62,.2)]":"border-(--color-line) bg-(--color-surface)/70 text-(--color-bone) hover:border-(--color-gold)/50"}`}>{selected===index&&<Check size={12} className="me-1 inline"/>}{item.color}</button>):<span className="rounded-full border border-dashed border-(--color-gold)/30 px-4 py-2 text-xs text-(--color-smoke)">{ar?"بانتظار إضافة الألوان":"Awaiting colors"}</span>}</div></div></div>
    <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">{warehouses.map((warehouse)=>{const quantity=current.quantities[warehouse.id]??0;const available=quantity>0;const limited=quantity>0&&quantity<=5;return <div key={warehouse.id} className="flex items-center justify-between rounded-2xl border border-(--color-line) bg-(--color-surface)/65 p-4 backdrop-blur-md"><div><p className="flex items-center gap-1.5 text-sm text-(--color-ivory)"><MapPin size={14} className="text-(--color-gold)"/>{ar?warehouse.cityAr:warehouse.cityEn}</p>{hasInventory?<div className="mt-3"><p className={`text-2xl font-semibold tabular-nums ${available?(limited?"text-amber-400":"text-emerald-400"):"text-red-400"}`}>{formatQuantity(quantity)}</p><p className={`mt-1 text-xs ${available?(limited?"text-amber-400":"text-emerald-400"):"text-red-400"}`}>{available?(limited?(ar?"قطعة — كمية محدودة":"items — limited stock"):(ar?"قطعة متوفرة":"items available")):(ar?"قطعة — نفدت الكمية":"items — out of stock")}</p></div>:<p className="mt-2 text-xs text-(--color-smoke)">{ar?"لم تُدخل البيانات":"No data yet"}</p>}</div>{available?<PackageCheck size={21} className={limited?"text-amber-400":"text-emerald-400"}/>:<PackageX size={21} className={hasInventory?"text-red-400":"text-(--color-smoke)"}/>}</div>})}</div>
  </section>;
}
