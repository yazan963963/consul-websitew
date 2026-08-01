"use client";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/getDictionary";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { SiteSettings } from "@/lib/types";

export default function SiteFrame({children,locale,dict,siteSettings}:{children:React.ReactNode;locale:Locale;dict:Dictionary;siteSettings:SiteSettings}){
  const admin=usePathname().startsWith(`/${locale}/admin`);
  if(admin) return children;
  return <><Navbar locale={locale} dict={dict} whatsapp={siteSettings.whatsapp}/><main className="pt-16">{children}</main><Footer locale={locale} dict={dict} settings={siteSettings}/></>;
}
