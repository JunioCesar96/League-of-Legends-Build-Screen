import { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { DATA_CHAMPION_URL } from './utils/utils';
import { ChampionDataView } from './ui/ChampionDataView';
import ChampionsImgProfileView from './ui/ChampionsImgProfileView';

interface ChampionSelectorProps {
  onChampionClick?: (championId: string) => void;
  selectedChampions?: string[];
  championId?: string;
  showAsSelected?: boolean;
}

export function ChampionSelector({
  onChampionClick,
  selectedChampions = [],
  championId,
  showAsSelected,
}: ChampionSelectorProps) {
  const [allChampions, setAllChampions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChampions();
  }, []);

  const loadChampions = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(DATA_CHAMPION_URL);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      setAllChampions(Object.values(json.data));
    } catch (err: any) {
      console.error('Failed to load champions:', err);
      setError('Erro ao carregar campeões. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // if specific champion provided, show only that one
  if (championId) {
    const champion = allChampions.find((c) => c.key === String(championId));
    if (loading) {
      return <Loader className="animate-spin text-[#C8AA6E]" />;
    }
    if (!champion) {
      return <span className="text-xs text-red-500">{championId}</span>;
    }
    return (
      <div className={`relative group`} onClick={() => onChampionClick?.(championId)}>
        <ChampionsImgProfileView championId={championId} />
        <ChampionDataView data={champion} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-[#0A1428] border border-[#1E2328] p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-[#C8AA6E]" size={48} />
          <p className="text-[#C8AA6E]">Carregando campeões do League of Legends...</p>
          <p className="text-sm text-[#A09B8C]">Data Dragon API v15.23.1</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0A1428] border border-red-500 p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="text-red-500" size={48} />
          <p className="text-red-500 text-center">{error}</p>
          <button
            onClick={loadChampions}
            className="px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-30 gap-2">
      {allChampions.map((champ: any) => (
        <div
          key={champ.key}
          id="champion"
          className={`relative bg-[#0F1923] border-2 ${
            showAsSelected && selectedChampions.includes(champ.key) ? 'border-[#C8AA6E]' : 'border-[#1E2328]'
          } hover:border-[#C8AA6E] transition-colors cursor-pointer group aspect-square overflow-hidden`}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', String(champ.key));
          }}
          onClick={() => onChampionClick?.(champ.key)}
          data-title={champ.name}
        >
            
          <ChampionsImgProfileView championId={champ.key} />
          {/* <ChampionDataView data={champ} /> */}
        </div>
      ))}
    </div>
  );
}
