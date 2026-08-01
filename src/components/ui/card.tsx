import * as React from "react";
import { cn } from "@/lib/utils";
export function Card({className,...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-2xl border border-(--color-line) bg-(--color-surface)/80 shadow-xl shadow-black/5 backdrop-blur-xl",className)} {...props}/>}
export function CardHeader({className,...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn("p-5 pb-2",className)} {...props}/>}
export function CardTitle({className,...props}:React.HTMLAttributes<HTMLHeadingElement>){return <h3 className={cn("font-medium text-(--color-ivory)",className)} {...props}/>}
export function CardContent({className,...props}:React.HTMLAttributes<HTMLDivElement>){return <div className={cn("p-5 pt-3",className)} {...props}/>}
