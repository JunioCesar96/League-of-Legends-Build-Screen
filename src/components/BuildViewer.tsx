import { X, Edit, FileJson, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getItemById, getItemImageUrl, fetchItems } from '../data/items';
import { KEYWORDS } from '../constants/keywords';
import { ItemDataView } from './ui/ItemDataView'
import ChampionsImgProfileView from './ui/ChampionsImgProfileView';
import { MapsList } from './ui/MapsList';
import { ChampionsList } from './ui/ChampionsList';


interface Build {
  title: string;
  associatedMaps: number[];
  associatedChampions: number[];
  blocks: Block[];
}

interface Block {
  type: string;
  items: BuildItem[];
}

interface BuildItem {
  id: string;
  count: number;
}

interface BuildViewerProps {
  build: Build;
  onClose: () => void;
  onEdit: () => void;
  onExport: () => void;
}









// Manipular string para adicionar tags




function applyStatIcons(statsText: string): string {
  let processed = statsText;

  // Ordena keywords por comprimento decrescente para casar as maiores primeiro
  const keywords = Object.keys(KEYWORDS).sort((a, b) => b.length - a.length);

  for (const word of keywords) {
    const tag = KEYWORDS[word];

    // Regex que casa a keyword completa, incluindo "de" no meio
    const regex = new RegExp(word, "g");

    processed = processed.replace(regex, `<${tag}>${word}</${tag}>`);
  }

  return processed;
}




export function BuildViewer({ build, onClose, onEdit, onExport }: BuildViewerProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<number[]>(
    build.blocks.map((_, index) => index)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      await fetchItems();
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = (index: number) => {
    if (expandedBlocks.includes(index)) {
      setExpandedBlocks(expandedBlocks.filter((i) => i !== index));
    } else {
      setExpandedBlocks([...expandedBlocks, index]);
    }
  };

  const getTotalCost = () => {
    return build.blocks.reduce((total, block) => {
      return (
        total +
        block.items.reduce((blockTotal, item) => {
          const itemData = getItemById(item.id);
          return blockTotal + (itemData?.gold.total || 0) * item.count;
        }, 0)
      );
    }, 0);
  };

  const copyJSON = () => {
    const json = JSON.stringify(build, null, 2);
    navigator.clipboard.writeText(json);
    alert('JSON copiado para a área de transferência!');
  };

  const processDescription = (
    description: string,
    stats: any,
    magicDamageMod?: number
  ) => {
    let processedDesc = description;

    // 1 — aplica mod de magicDamage
    if (magicDamageMod) {
      processedDesc = processedDesc.replace(
        /<magicDamage>(.*?)<\/magicDamage>/g,
        `<magicDamage>${magicDamageMod} de $1</magicDamage>`
      );
    } else {
      processedDesc = processedDesc.replace(
        /<magicDamage>(.*?)<\/magicDamage>/g,
        `<magicDamage>X de $1</magicDamage>`
      );
    }

    // 2 — extrai conteúdo de <stats>
    const statsRegex = /<stats>([\s\S]*?)<\/stats>/;

    const match = processedDesc.match(statsRegex);
    if (match) {
      const originalStats = match[1];
      const newStats = applyStatIcons(originalStats);

      processedDesc = processedDesc.replace(originalStats, newStats);
    }

    return processedDesc;
  };

  const processTags = (tags: string[]) => {
    if (!tags) return '';
    return tags.sort().map(tag => `<tag>${tag}</tag>`).join(' ');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#010A13] flex items-center justify-center">
        <div className="text-[#C8AA6E]">Carregando build...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010A13]">
      {/* Header */}
      <div className="border-b border-[#1E2328] bg-[#0A1428]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl text-[#C8AA6E]">{build.title}</h1>
            <div className="flex gap-4">
              <button
                onClick={copyJSON}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors text-[#C8AA6E]"
              >
                <FileJson size={20} />
                Copiar JSON
              </button>
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors text-[#C8AA6E]"
              >
                <FileJson size={20} />
                Exportar
              </button>
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
              >
                <Edit size={20} />
                Editar
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors text-[#C8AA6E]"
              >
                <X size={20} />
                Fechar
              </button>
            </div>
          </div>

          <MapsList maps={build.associatedMaps} />

          <ChampionsList champions={build.associatedChampions} ui="viewer" />

          <div className="flex gap-8 text-sm text-[#A09B8C]">
            <div>
              <span className="text-[#C8AA6E]">Blocos:</span> {build.blocks.length}
            </div>
            <div>
              <span className="text-[#C8AA6E]">Total de Itens:</span>{' '}
              {build.blocks.reduce((acc, block) => acc + block.items.length, 0)}
            </div>
            <div>
              <span className="text-[#C8AA6E]">Custo Total:</span> {getTotalCost()} gold
            </div>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {build.blocks.map((block, blockIndex) => {
            const isExpanded = expandedBlocks.includes(blockIndex);
            const blockCost = block.items.reduce((total, item) => {
              const itemData = getItemById(item.id);
              return total + (itemData?.gold.total || 0) * item.count;
            }, 0);

            return (
              <div key={blockIndex} className="bg-[#0A1428] border border-[#1E2328]">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#0F1923] transition-colors"
                  onClick={() => toggleBlock(blockIndex)}
                >
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl text-[#C8AA6E]">{block.type}</h3>
                    <span className="text-sm text-[#A09B8C]">
                      {block.items.length} itens • {blockCost} gold
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="text-[#C8AA6E]" size={24} />
                  ) : (
                    <ChevronDown className="text-[#C8AA6E]" size={24} />
                  )}
                </div>

                {isExpanded && (
                  <div className="p-6 border-t border-[#1E2328] ">
                    {block.items.length === 0 ? (
                      <p className="text-center text-[#A09B8C] py-8">Nenhum item neste bloco</p>
                    ) : (
                      <div
                        id="group-items-builder-view"
                        className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 group-items group-items-builder-view">
                        {
                          block.items.map((item, itemIndex) => {
                            const itemData = getItemById(item.id);

                            if (!itemData) {
                              return (
                                <div
                                  key={itemIndex}
                                  className="relative bg-[#0F1923] border-2 border-red-500 aspect-square flex items-center justify-center"
                                  title={`Item não encontrado: ${item.id}`}
                                >
                                  <span className="text-xs text-red-500">{item.id}</span>
                                </div>
                              );
                            }
                            // primeiro item (VP)
                            return (
                              <div
                                key={itemIndex}
                                id="item"
                                className="relative bg-[#0F1923] border-2 border-[#1E2328] hover:border-[#C8AA6E] transition-colors group aspect-square"
                                data-title={itemData.name}
                              >
                                <img
                                  id="img_item"
                                  src={getItemImageUrl(item.id)}
                                  alt={itemData.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                                <div className="absolute bottom-0 right-0 bg-[#010A13] px-2 py-1 text-xs text-[#C8AA6E]">
                                  {itemData.gold.total}
                                </div>
                                {item.count > 1 && (
                                  <div className="absolute top-0 left-0 bg-[#C8AA6E] text-[#010A13] px-2 py-1 text-xs">
                                    x{item.count}
                                  </div>
                                )}


                                {/* mouse-follower */}
                                <ItemDataView
                                  data={itemData}
                                  videoId="jfgKdOlO_E4"
                                  img_id={item.id}
                                />

                              </div>
                            );
                          })
                        }
                      </div>
                    )}
                  </div>
                )
                }
              </div>
            );
          })}
        </div>

        {/* JSON Preview */}
        <div className="mt-8 bg-[#0A1428] border border-[#1E2328] p-6">
          <h3 className="text-xl text-[#C8AA6E] mb-4">JSON da Build</h3>
          <pre className="bg-[#010A13] p-4 text-[#A09B8C] text-sm overflow-x-auto border border-[#1E2328] max-h-[400px] overflow-y-auto">
            {JSON.stringify(build, null, 2)}
          </pre>
        </div>
      </div>
    </div >
  );
}