import * as React from "react";
import { cn } from "@/lib/utils";
export function Badge({className,...props}:React.HTMLAttributes<HTMLSpanElement>){return <span className={cn("inline-flex rounded-full border border-(--color-gold)/25 bg-(--color-gold)/10 px-2.5 py-1 text-[11px] text-(--color-gold)",className)} {...props}/>}
