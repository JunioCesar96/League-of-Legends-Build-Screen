// ChampionDataView.tsx
import { processDescription, processTags, getChampionImageUrl } from "../utils/utils";

export interface ChampionDataViewProps {
    data: any;
}

export function ChampionDataView({ data }: ChampionDataViewProps) {
    if (!data) return null;
    const name = data.name || "?";
    const title = data.title || "";
    const imageUrl = getChampionImageUrl(name);

    return (
        <div
            id="mouse-follower"
            className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:up mouse-follower border-2 border-[#C8AA6E] championDataView"
        >
            {/* IMAGE */}
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover div_img"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />

            {/* NAME + TITLE */}
            <p className="text-sm text-[#C8AA6E] mb-1 div_title">{name} {title && `- ${title}`}</p>

            {/* BLURB */}
            {data.blurb && (
                <p className="text-xs text-[#A09B8C] div_plaintext">{data.blurb}</p>
            )}

            {/* LORE/DESCRIPTION */}
            {data.lore && (
                <p
                    className="text-xs text-[#A09B8C] div_description"
                    dangerouslySetInnerHTML={{ __html: processDescription(data.lore, data.stats) }}
                />
            )}

            {/* TAGS */}
            <div
                className="text-xs text-[#A09B8C] div_tag"
                dangerouslySetInnerHTML={{ __html: processTags(data.tags) }}
            />
        </div>
    );
}
