import { useState } from 'react';
import { Plus, Trash2, Save, X, ChevronUp, ChevronDown, MoveDown, MoveUp } from 'lucide-react';
import { ItemSelector } from './ItemSelector';

import { MapsList } from './ui/MapsList';
import { ChampionsList } from './ui/ChampionsList';

// Interfaces based on App.tsx and common usage
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

interface BuildEditorProps {
  initialBuild: Build | null;
  onSave: (build: Build) => void;
  onCancel: () => void;
}

export function BuildEditor({ initialBuild, onSave, onCancel }: BuildEditorProps) {
  const [build, setBuild] = useState<Build>(
    initialBuild
      ? JSON.parse(JSON.stringify(initialBuild))
      : {
        title: 'Nova Build',
        associatedMaps: [11, 12],
        associatedChampions: [],
        blocks: [
          { type: 'Itens Iniciais', items: [] },
          { type: 'Build Principal', items: [] },
          { type: 'Itens Situacionais', items: [] },
        ],
      }
  );

  // champion editing helpers
  const handleRemoveChampion = (championId: number) => {
    setBuild(prev => ({
      ...prev,
      associatedChampions: prev.associatedChampions.filter(id => id !== championId),
    }));
  };

  const handleAddChampion = (championId: number) => {
    setBuild(prev => ({
      ...prev,
      associatedChampions: prev.associatedChampions.includes(championId)
        ? prev.associatedChampions
        : [...prev.associatedChampions, championId],
    }));
  };

  // bloco ativo (para adicionar itens)
  const [activeBlock, setActiveBlock] = useState<number | null>(0);

  // blocos expandidos (NOVO → igual ao BuildViewer)
  const [expandedBlocks, setExpandedBlocks] = useState<number[]>(
    build.blocks.map((_, index) => index) // todos abertos por padrão
  );

  // toggleBlock — igual ao BuildViewer
  const toggleBlock = (index: number) => {
    if (expandedBlocks.includes(index)) {
      setExpandedBlocks(expandedBlocks.filter((i) => i !== index));
    } else {
      setExpandedBlocks([...expandedBlocks, index]);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBuild({ ...build, title: e.target.value });
  };

  const handleBlockNameChange = (index: number, name: string) => {
    const newBlocks = [...build.blocks];
    newBlocks[index].type = name;
    setBuild({ ...build, blocks: newBlocks });
  };

  const addBlock = () => {
    const newBlocks = [...build.blocks, { type: 'Novo Bloco', items: [] }];
    setBuild({ ...build, blocks: newBlocks });

    // abrir automaticamente o novo bloco
    setExpandedBlocks([...expandedBlocks, newBlocks.length - 1]);
  };

  const removeBlock = (index: number) => {
    const newBlocks = build.blocks.filter((_, i) => i !== index);
    setBuild({ ...build, blocks: newBlocks });

    setExpandedBlocks(expandedBlocks.filter((i) => i !== index));

    if (activeBlock === index) setActiveBlock(null);
  };

  const addItemToBlock = (itemId: string) => {
    if (activeBlock === null) return;

    const newBlocks = [...build.blocks];
    newBlocks[activeBlock].items.push({ id: itemId, count: 1 });
    setBuild({ ...build, blocks: newBlocks });
  };

  const removeItemFromBlock = (blockIndex: number, itemIndex: number) => {
    const newBlocks = [...build.blocks];
    newBlocks[blockIndex].items.splice(itemIndex, 1);
    setBuild({ ...build, blocks: newBlocks });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === build.blocks.length - 1)) return;

    const newBlocks = [...build.blocks];
    const to = direction === 'up' ? index - 1 : index + 1;

    [newBlocks[index], newBlocks[to]] = [newBlocks[to], newBlocks[index]];
    setBuild({ ...build, blocks: newBlocks });

    // ajustar expansão ao mover
    const exp = [...expandedBlocks];
    const isExpanded = exp.includes(index);

    const filtered = exp.filter((i) => i !== index && i !== to);
    if (isExpanded) filtered.push(to);
    else filtered.push(index);

    setExpandedBlocks(filtered);
  };

  return (
    <div className="min-h-screen bg-[#010A13]">
      {/* Header */}
      <div className="border-b border-[#1E2328] bg-[#0A1428] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={build.title}
              onChange={handleTitleChange}
              placeholder="Nome da sua build"
              className="bg-transparent text-3xl text-[#C8AA6E] border-none outline-none focus:ring-0"
            />
            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors text-[#C8AA6E]"
              >
                <X size={20} />
                Cancelar
              </button>
              <button
                onClick={() => onSave(build)}
                className="flex items-center gap-2 px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
              >
                <Save size={20} />
                Salvar Build
              </button>
            </div>
          </div>
          <MapsList maps={build.associatedMaps} />

          <ChampionsList
            champions={build.associatedChampions}
            ui="editor"
            onRemove={handleRemoveChampion}
            onAdd={handleAddChampion}
          />
        </div>
      </div>

      {/* Editor Layout */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Blocks */}
        <div className="lg:col-span-1">
          <div className="col-builder-editor space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl text-[#C8AA6E]">Blocos de Itens</h2>
              <button
                onClick={addBlock}
                className="flex items-center gap-2 px-4 py-2 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors"
              >
                <Plus size={18} /> Adicionar
              </button>
            </div>

            {build.blocks.map((block, index) => {
              const isExpanded = expandedBlocks.includes(index);

              return (
                <div
                  key={index}
                  className={`border-2 ${activeBlock === index ? 'border-[#C8AA6E]' : 'border-[#1E2328]'
                    } bg-[#0A1428]`}
                >
                  {/* Header do bloco com comportamento toggle (NOVO) */}
                  <div
                    className="flex justify-between items-center p-4 cursor-pointer hover:bg-[#0F1923] transition-colors"
                    onClick={() => toggleBlock(index)}
                  >
                    <input
                      onClick={(e) => {
                        e.stopPropagation(); // impedir fechar ao clicar
                        setActiveBlock(index);
                      }}
                      type="text"
                      value={block.type}
                      onChange={(e) => handleBlockNameChange(index, e.target.value)}
                      className="bg-transparent text-xl text-[#C8AA6E] border-none outline-none focus:ring-0"
                    />

                    <div className="flex items-center gap-6">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-[#C8AA6E]" />
                      ) : (
                        <ChevronDown size={20} className="text-[#C8AA6E]" />
                      )}


                      {isExpanded ? (
                        <></>

                      ) : (

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(index, 'up');
                          }}
                          disabled={index === 0}
                        >
                          <MoveUp
                            size={20}
                            className={index === 0 ? 'opacity-25' : 'text-[#C8AA6E]'}
                          />
                        </button>


                      )}


                      {isExpanded ? (
                        <></>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(index, 'down');
                          }}
                          disabled={index === build.blocks.length - 1}
                        >
                          <MoveDown
                            size={20}
                            className={
                              index === build.blocks.length - 1
                                ? 'opacity-25'
                                : 'text-[#C8AA6E]'
                            }
                          />
                        </button>

                      )}

                      {isExpanded ? (

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(index);
                          }}
                        >
                          <Trash2 size={20} className="text-red-500 hover:text-red-400" />
                        </button>
                      ) : (
                        <> </>
                      )}







                    </div>
                  </div>

                  {/* Conteúdo do bloco: só aparece se expandido */}
                  {isExpanded && (
                    <div className="p-4">
                      <div
                        id="group-items-builder-editor"
                        className={`group-items min-h-[80px] bg-[#010A13] p-2 grid grid-cols-6 gap-2 ${activeBlock === index ? 'ring-2 ring-[#C8AA6E]' : ''
                          }`}
                        onClick={() => setActiveBlock(index)}
                        onDragEnter={() => setActiveBlock(index)}
                      >
                        {block.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="relative group">
                            <div className="group-items grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[500px] pr-2">
                              <ItemSelector itemId={item.id} showAsSelected />
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItemFromBlock(index, itemIndex);
                              }}
                              className="absolute -top-2 -right-2 bg-red-600 rounded-full text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} strokeWidth={10} color={'#fb2c36'} />
                            </button>
                          </div>
                        ))}

                        {block.items.length === 0 && (
                          <div className="col-span-6 flex items-center justify-center text-sm text-[#5B5A56]">
                            <p>Clique aqui para ativar e adicionar itens a este bloco.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Item Selector */}
        <div className="lg:col-span-2">
          {activeBlock !== null ? (
            <ItemSelector
              onItemClick={addItemToBlock}
              selectedItems={build.blocks[activeBlock]?.items.map((i) => i.id)}
            />
          ) : (
            <div className="bg-[#0A1428] border border-[#1E2328] h-full flex flex-col items-center justify-center text-center p-8">
              <h3 className="text-2xl text-[#C8AA6E] mb-4">Selecione um Bloco</h3>
              <p className="text-[#A09B8C]">
                Clique em um dos blocos à esquerda para começar a adicionar itens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
