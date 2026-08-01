"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CatalogQrButton({url,title}:{url:string;title:string}){return <Dialog.Root><Dialog.Trigger asChild><Button variant="ghost" size="icon" className="size-8" aria-label="QR code"><QrCode size={15}/></Button></Dialog.Trigger><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"/><Dialog.Content className="fixed start-1/2 top-1/2 z-[100] w-[min(90vw,360px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-(--color-line) bg-(--color-surface) p-6 shadow-2xl"><div className="mb-5 flex items-center justify-between"><Dialog.Title className="font-medium">{title}</Dialog.Title><Dialog.Close asChild><Button variant="ghost" size="icon"><X size={16}/></Button></Dialog.Close></div><div className="rounded-xl bg-white p-5"><QRCodeSVG value={url} size={260} className="h-auto w-full" fgColor="#0a0a09" bgColor="#ffffff"/></div><p className="mt-3 break-all text-center text-xs text-(--color-smoke)">{url}</p></Dialog.Content></Dialog.Portal></Dialog.Root>}
