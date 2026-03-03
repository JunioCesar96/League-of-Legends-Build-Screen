import { useEffect, useState } from "react";
import { getChampionData, getChampionImageUrl } from "../utils/utils";

interface ChampionsImgProfileViewProps {
    championId: string | number;
}

const ChampionsImgProfileView = ({ championId }: ChampionsImgProfileViewProps) => {
    const [championData, setChampionData] = useState<any | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            const data = await getChampionData(championId);
            if (isMounted) setChampionData(data);
        };
        fetchData();
        return () => { isMounted = false; };
    }, [championId]);

    const name = championData?.name || "Desconhecido";
    const imageUrl = name ? getChampionImageUrl(name) : "";

    // Dentro do seu componente ChampionsImgProfileView
    return (
        <div className="w-8 h-8 shrink-0">
            {imageUrl ? (
               <img src={imageUrl} alt={name} title={name} className="champ-img" />
            ) : (
                <div className="w-8 h-8 rounded-full border-2 border-[#C8AA6E] bg-gray-700 flex items-center justify-center">
                    <span className="text-[10px]">?</span>
                </div>
            )}
        </div>
    );

};

export default ChampionsImgProfileView;