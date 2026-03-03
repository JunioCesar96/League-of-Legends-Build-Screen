import { useEffect, useState } from "react";
import { getMapData } from "../utils/utils";

interface MapNameListProps {
    mapId: string | number;
}

const MapNameList = ({ mapId }: MapNameListProps) => {
    const [mapData, setmapData] = useState<any | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            console.log(`Fetching data for map ID: ${mapId}`);
            const data = await getMapData(mapId);
            console.log(`Fetched data for map ID: ${mapId}`);
            console.log(data);
            if (isMounted) setmapData(data);
        };
        fetchData();
        return () => { isMounted = false; };
    }, [mapId]);

    const name = mapData?.mapName || mapData?.MapName || mapData?.name || "Desconhecido";

    console.log(`Map ID: ${mapId}, Map Name: ${name}`, mapData);

    return (
        <div className="w-8 h-8 shrink-0">
            {name ? (
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                    <span title={mapId} className="text-[10px]" style={{ color: '#C8AA6E', padding: '2px' }}>{name}</span>
                </div>
            ) : (
                <div className="w-full h-full rounded-full border-2 border-[#C8AA6E] bg-gray-700 flex items-center justify-center">
                    <span className="text-[10px]">?</span>
                </div>
            )}
        </div>
    );
};

export default MapNameList;
