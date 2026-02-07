import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { VenueCard } from "@/components/VenueCard";
import { getTranslations } from "next-intl/server";

export default async function VenuesPage(props: {
    params: Promise<{ locale: string }>;
}) {
    const params = await props.params;
    const { locale } = params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const t = await getTranslations('VenuesList');

    const { data: venues, error } = await supabase
        .from("venues")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching venues:", error);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                <p className="text-muted-foreground mt-2">
                    {t('subtitle')}
                </p>
            </div>

            {!venues || venues.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-xl text-muted-foreground">{t('empty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {venues.map((venue) => (
                        <VenueCard key={venue.id} venue={venue} />
                    ))}
                </div>
            )}
        </div>
    );
}
