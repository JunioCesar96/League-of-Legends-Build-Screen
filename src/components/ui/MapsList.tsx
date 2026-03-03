import MapNameList from './MapNameList';

interface MapsListProps {
  maps: number[];
}

export const MapsList = ({ maps }: MapsListProps) => {
  return (
    <div className="text-sm text-[#A09B8C] mb-4">
      <div className="mb-2">Mapas:</div>
      <div className="champ-list">
        {maps.map((mapId) => (
          <div key={mapId} className="map-item">
            <MapNameList mapId={mapId} />
          </div>
        ))}
      </div>
    </div>
  );
};

