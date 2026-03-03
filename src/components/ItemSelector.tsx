import { useState, useEffect } from 'react';
import { Search, Loader, AlertCircle } from 'lucide-react';
import {
  fetchItems,
  getItemImageUrl,
  getAllPurchasableItems,
  categorizeItem,
  searchItems,
  filterItemsByCategory,
  getItemById,
  type ItemData,
} from '../data/items';
import { KEYWORDS } from '../constants/keywords';
import { ItemDataView } from './ui/ItemDataView'
import { VideoViewer } from './ui/VideoViewer';

interface ItemSelectorProps {
  onItemClick?: (itemId: string) => void;
  selectedItems?: string[];
  itemId?: string;
  showAsSelected?: boolean;
}

export function ItemSelector({
  onItemClick,
  selectedItems = [],
  itemId,
  showAsSelected,
}: ItemSelectorProps) {
  const [allItems, setAllItems] = useState<Array<{ id: string; data: ItemData }>>([]);
  const [displayItems, setDisplayItems] = useState<Array<{ id: string; data: ItemData }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    // Apply filters when search term or filter changes
    let filtered = allItems;

    // Apply category filter
    filtered = filterItemsByCategory(filter, filtered);

    // Apply search
    filtered = searchItems(searchTerm, filtered);

    setDisplayItems(filtered);
  }, [searchTerm, filter, allItems]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);

      await fetchItems();
      const items = getAllPurchasableItems();

      console.log('Loaded purchasable items:', items.length);

      setAllItems(items);
      setDisplayItems(items);
    } catch (err) {
      console.error('Failed to load items:', err);
      setError('Erro ao carregar itens. Verifique sua conexão com a internet.');
    } finally {
      setLoading(false);
    }
  };

  // Manipular string para adicionar tags








  // If itemId is provided, just render that single item (for display in blocks)
  if (itemId) {
    const item = getItemById(itemId);

    if (loading) {
      return (
        <div className="bg-[#0F1923] border-2 border-[#1E2328] aspect-square flex items-center justify-center">
          <Loader className="animate-spin text-[#C8AA6E]" size={16} />
        </div>
      );
    }

    if (!item) {
      return (
        <div className="bg-[#0F1923] border-2 border-red-500 aspect-square flex items-center justify-center">
          <span className="text-xs text-red-500">{itemId}</span>
        </div>
      );
    }

    return (
      // items dentro dos blocos





      <div
        id='item'
        className={` relative bg-[#0F1923] border-2 ${showAsSelected ? 'border-[#C8AA6E]' : 'border-[#1E2328]'
          } hover:border-[#C8AA6E] transition-colors cursor-pointer group aspect-square overflow-hidden`}
        onClick={() => onItemClick?.(itemId)}
        data-title={item.name}
      >
        <img
          id="img_item"
          src={getItemImageUrl(itemId)}
          alt={item.name}
          className="w-16 h-16 object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute bottom-0 right-0 bg-[#010A13] px-1 text-[10px] text-[#C8AA6E] leading-tight">
          {item.gold.total}
        </div>
        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
          {/* <p className="text-[10px] text-center text-[#C8AA6E] leading-tight">{item.name}</p> */}
        </div>

        <div>
          {/* mouse-follower */}
          <ItemDataView
            data={item}
            videoId="jfgKdOlO_E4"
            img_id={itemId}
          />
        </div>

      </div>

    );
  }

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'Inicial', name: 'Inicial' },
    { id: 'Consumível', name: 'Consumível' },
    { id: 'Dano AD', name: 'Dano AD' },
    { id: 'Dano AP', name: 'Dano AP' },
    { id: 'Defesa', name: 'Defesa' },
    { id: 'Botas', name: 'Botas' },
    { id: 'Utilidade', name: 'Utilidade' },
  ];

  if (loading) {
    return (
      <div className="bg-[#0A1428] border border-[#1E2328] p-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="animate-spin text-[#C8AA6E]" size={48} />
          <p className="text-[#C8AA6E]">Carregando itens do League of Legends...</p>
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
            onClick={loadItems}
            className="px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="item-selector"
    className="bg-[#0A1428] border border-[#1E2328] p-6">
      <h3 className="text-xl text-[#C8AA6E] mb-4">Selecionar Itens</h3>

      {/* Search and Filter */}
      <div className="mb-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5B5A56]" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar itens..."
            className="w-full bg-[#1E2328] border border-[#3C3C41] text-[#C8AA6E] pl-10 pr-4 py-2 outline-none focus:border-[#C8AA6E] transition-colors placeholder:text-[#5B5A56]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setFilter(category.id)}
              className={`px-4 py-2 border transition-colors text-sm ${filter === category.id
                ? 'bg-[#C8AA6E] text-[#010A13] border-[#C8AA6E]'
                : 'bg-[#1E2328] text-[#C8AA6E] border-[#3C3C41] hover:border-[#C8AA6E]'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Count */}
      <div className="mb-3 text-sm text-[#A09B8C]">
        {displayItems.length} {displayItems.length === 1 ? 'item encontrado' : 'itens encontrados'}
      </div>

      {/* Items Grid */}
      {displayItems.length === 0 ? (
        <div className="text-center py-12 text-[#A09B8C]">
          <p>Nenhum item encontrado</p>
        </div>
      ) : (

        // bandeija de selecior os items
        <div
          id="group-items-selector"
          className="grid grid-cols-8 md:grid-cols-8 lg:grid-cols-4 xl:grid-cols-10 gap-8 group-items group-items-selector">
          {displayItems.map(({ id, data }) => {
            const isSelected = selectedItems.includes(id);
            return (
              <div
                draggable="true"
                key={id}
                id="item"
                className={`relative bg-[#0F1923] border-2 ${isSelected ? 'border-[#C8AA6E] opacity-50' : 'border-[#1E2328]'
                  } hover:border-[#C8AA6E] transition-colors cursor-pointer group aspect-square overflow-hidden ${isSelected ? 'cursor-not-allowed' : ''
                  }`}
                data-title={data.name}
                onDragEnd={() => !isSelected && onItemClick?.(id)}
              >


                <img
                  id="img_item"
                  src={getItemImageUrl(id)}
                  alt={data.name}
                  className="w-16 h-16 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-0 right-0 bg-[#010A13] px-1 text-[10px] text-[#C8AA6E] leading-tight">
                  {data.gold.total}
                </div>
                {isSelected && (
                  <div className="absolute top-0 left-0 bg-[#C8AA6E] text-[#010A13] px-1 text-[10px] leading-tight">
                    ✓
                  </div>
                )}
                <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                </div>


                {/* mouse-follower */}
                <ItemDataView
                  data={data}
                  videoId="jfgKdOlO_E4"
                  img_id={id}
                />




              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
