"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Users, Coins } from "lucide-react";

interface Venue {
    id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    capacity: number;
    images: string[];
}

interface VenueCardProps {
    venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
    const locale = useLocale();
    const t = useTranslations('VenuesList');

    // Helper to force number type if DB returns string
    const price = Number(venue.price);
    const capacity = Number(venue.capacity);

    return (
        <div className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden hover:-translate-y-1">
            <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                {venue.images && venue.images.length > 0 ? (
                    <Image
                        src={venue.images[0]}
                        alt={venue.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <span className="text-sm">No Image</span>
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm">
                    {price} DZD
                </div>
            </div>

            <div className="flex flex-col flex-1 p-5">
                <div className="mb-2">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {venue.title}
                    </h3>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                        <MapPin className="mr-1 h-3.5 w-3.5 text-slate-400" />
                        {venue.location}
                    </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {venue.description}
                </p>

                <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <Users className="h-4 w-4 text-primary-500" />
                        <span>{capacity}</span>
                    </div>
                    <Link
                        href={`/salles/${venue.id}`}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm inline-flex items-center gap-1"
                    >
                        {t('view_details')} &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
