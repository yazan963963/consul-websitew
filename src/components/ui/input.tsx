import * as React from "react";
import { cn } from "@/lib/utils";
export function Input({className,...props}:React.InputHTMLAttributes<HTMLInputElement>){return <input className={cn("h-10 w-full rounded-lg border border-(--color-line) bg-(--color-ink)/60 px-3 text-sm text-(--color-ivory) outline-none placeholder:text-(--color-smoke) focus:border-(--color-gold)",className)} {...props}/>}
