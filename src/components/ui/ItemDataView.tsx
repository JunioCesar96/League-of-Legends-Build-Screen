// ItemDataView.tsx
import { YouTubeVideoInfo } from '../YouTubeVideoInfo';
import { ItemDataViewProps } from "./types.ts";
import { processDescription, processTags, getItemImageUrl } from "../utils/utils";
import { DefaultVideoView } from '../DefaultVideoView.tsx';

export function ItemDataView({ data, videoId, img_id }: ItemDataViewProps) {
    return (
        <div
            id="mouse-follower"
            className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:up mouse-follower border-2 border-[#C8AA6E] itemDataView"

        >
            {/* VIDEO */}
            <div
                className="div_video_hide"
                data-text="VIDEO"
                //video-id={videoId}
            >
                {/* <YouTubeVideoInfo videoId={videoId} /> */}
            </div>


            {/* IMAGEM */}
            <img
                src={getItemImageUrl(img_id)}
                alt={data.name}
                className="w-full h-full object-cover div_img"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                }}
            />

            {/* TÍTULO */}
            <p className="text-sm text-[#C8AA6E] mb-1 div_title"
                video-id={videoId}
                onClick={(e) => {
                    console.log("Clicou no título do item, carregando vídeo:", videoId);
                    console.log(e.currentTarget);
                    DefaultVideoView(videoId, e.currentTarget);
                }}
            >{data.name}</p>

            {/* GOLD */}
            <div className="div_gold">
                <div className="text-xs text-[#C8AA6E] div_gold_flex">
                    <object data="/img/Coins_Icon_color.svg" type="image/svg+xml"></object>
                    {data.gold.total}
                </div>
            </div>

            {/* PLAINTEXT */}
            <p className="text-xs text-[#A09B8C] div_plaintext">{data.plaintext || ''}</p>

            <br />

            {/* DESCRIPTION */}
            {data.description && (
                <p
                    className="text-xs text-[#A09B8C] div_description"
                    dangerouslySetInnerHTML={{
                        __html: processDescription(data.description, data.stats)
                    }}
                />
            )}

            {/* TAGS */}
            <div
                className="text-xs text-[#A09B8C] div_tag"
                dangerouslySetInnerHTML={{
                    __html: processTags(data.tags)
                }}
            />
        </div>
    );
}
