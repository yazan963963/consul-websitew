"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { CatalogInventoryItem, Warehouse } from "@/lib/types";
import type { Locale } from "@/i18n/config";

export default function InventoryEditor({ initial, warehouses, locale }: { initial: CatalogInventoryItem[]; warehouses: Warehouse[]; locale: Locale }) {
  const [rows, setRows] = useState<CatalogInventoryItem[]>(initial);
  const ar = locale === "ar";
  const input = "w-full rounded-lg border border-(--color-line) bg-(--color-ink) px-3 py-2.5 text-sm text-(--color-ivory) outline-none focus:border-(--color-gold)";
  const updateField = (index:number,field:"color"|"sku"|"barcode",value:string) => setRows((current)=>current.map((row,i)=>i===index?{...row,[field]:value}:row));
  const updateQuantity = (index:number,warehouseId:string,value:string) => setRows((current)=>current.map((row,i)=>i===index?{...row,quantities:{...row.quantities,[warehouseId]:Math.max(0,Number(value)||0)}}:row));
  return <fieldset className="rounded-2xl border border-(--color-gold)/20 bg-(--color-gold)/[.03] p-4 sm:p-5">
    <input type="hidden" name="inventory" value={JSON.stringify(rows)}/>
    <div className="mb-4 flex items-center justify-between gap-4"><div><legend className="text-sm font-medium text-(--color-ivory)">{ar?"متغيرات المنتج والمخزون":"Product variants & inventory"}</legend><p className="mt-1 text-xs text-(--color-smoke)">{ar?"كل لون يحتاج SKU فريداً وباركوداً وكميته في كل مستودع.":"Every color needs a unique SKU, barcode, and warehouse quantities."}</p></div><button type="button" onClick={()=>setRows((current)=>[...current,{color:"",sku:"",barcode:"",quantities:{}}])} className="flex shrink-0 items-center gap-2 rounded-lg bg-(--color-gold) px-3 py-2 text-xs font-medium text-(--color-ink)"><Plus size={14}/>{ar?"إضافة لون":"Add color"}</button></div>
    <div className="space-y-3">{rows.length===0&&<p className="rounded-xl border border-dashed border-(--color-line) py-7 text-center text-xs text-(--color-smoke)">{ar?"لم تُضف ألوان بعد":"No colors added yet"}</p>}{rows.map((row,index)=><div key={index} className="rounded-xl border border-(--color-line) bg-(--color-surface)/60 p-3"><div className="grid items-end gap-2 sm:grid-cols-3">
      <label className="text-[11px] text-(--color-bone)"><span className="mb-1 block">{ar?"اللون":"Color"}</span><input value={row.color} onChange={(e)=>updateField(index,"color",e.target.value)} placeholder={ar?"مثال: أسود":"e.g. Black"} className={input}/></label>
      <label className="text-[11px] text-(--color-bone)"><span className="mb-1 block">SKU</span><input dir="ltr" value={row.sku} onChange={(e)=>updateField(index,"sku",e.target.value.toUpperCase())} placeholder="D1-16-BLACK" className={input}/></label>
      <label className="text-[11px] text-(--color-bone)"><span className="mb-1 block">{ar?"الباركود":"Barcode"}</span><input dir="ltr" inputMode="numeric" value={row.barcode} onChange={(e)=>updateField(index,"barcode",e.target.value)} placeholder="6902516280010" className={input}/></label>
      </div><div className="mt-3 grid items-end gap-2 sm:grid-cols-[repeat(3,1fr)_auto]">{warehouses.map((warehouse)=><label key={warehouse.id} className="text-[11px] text-(--color-bone)"><span className="mb-1 block">{ar?warehouse.cityAr:warehouse.cityEn}</span><input type="number" min="0" value={row.quantities[warehouse.id]??0} onChange={(e)=>updateQuantity(index,warehouse.id,e.target.value)} className={input}/></label>)}
      <button type="button" onClick={()=>setRows((current)=>current.filter((_,i)=>i!==index))} aria-label={ar?"حذف اللون":"Delete color"} className="flex h-10 w-10 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-500/10"><Trash2 size={16}/></button>
    </div></div>)}</div>
  </fieldset>;
}
