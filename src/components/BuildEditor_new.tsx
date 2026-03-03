import { useState } from 'react';
import { Plus, Trash2, Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { ItemSelector } from './ItemSelector_new';

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
  const [title, setTitle] = useState(initialBuild?.title || '');
  const [blocks, setBlocks] = useState<Block[]>(
    initialBuild?.blocks || [{ type: 'Inicial', items: [] }]
  );
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);

  const handleAddBlock = () => {
    setBlocks([...blocks, { type: 'Novo Bloco', items: [] }]);
  };

  const handleDeleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
    if (selectedBlockIndex === index) {
      setSelectedBlockIndex(null);
    }
  };

  const handleUpdateBlockName = (index: number, name: string) => {
    const newBlocks = [...blocks];
    newBlocks[index].type = name;
    setBlocks(newBlocks);
  };

  const handleAddItemToBlock = (blockIndex: number, itemId: string) => {
    const newBlocks = [...blocks];
    // Check if item already exists in the block
    const existingItem = newBlocks[blockIndex].items.find(item => item.id === itemId);
    alert(blockIndex)
    if (!existingItem) {
      newBlocks[blockIndex].items.push({ id: itemId, count: 1 });
      setBlocks(newBlocks);
    }
  };

  const handleRemoveItemFromBlock = (blockIndex: number, itemId: string) => {
    const newBlocks = [...blocks];
    newBlocks[blockIndex].items = newBlocks[blockIndex].items.filter(item => item.id !== itemId);
    setBlocks(newBlocks);
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
    setSelectedBlockIndex(targetIndex);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para a build');
      return;
    }

    const build: Build = {
      title,
      associatedMaps: [11, 12],
      associatedChampions: [],
      blocks,
    };

    onSave(build);
  };

  return (
    <div className="min-h-screen bg-[#010A13]">
      <div className="border-b border-[#1E2328] bg-[#0A1428]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nome da Build"
            className="text-2xl bg-transparent border-none outline-none text-[#C8AA6E] placeholder:text-[#5B5A56]"
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
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
            >
              <Save size={20} />
              Salvar Build
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blocks List */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A1428] border border-[#1E2328] p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-[#C8AA6E]">Blocos de Itens</h2>
                <button
                  onClick={handleAddBlock}
                  className="p-2 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>

              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <div
                    key={index}
                    className={`bg-[#1E2328] border ${
                      selectedBlockIndex === index ? 'border-[#C8AA6E]' : 'border-[#3C3C41]'
                    } p-4 cursor-pointer hover:border-[#C8AA6E] transition-colors`}
                    onClick={() => setSelectedBlockIndex(index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={block.type}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleUpdateBlockName(index, e.target.value);
                        }}
                        className="bg-transparent border-none outline-none text-[#C8AA6E] flex-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(index, 'up');
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-[#2A2E33] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveBlock(index, 'down');
                          }}
                          disabled={index === blocks.length - 1}
                          className="p-1 hover:bg-[#2A2E33] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(index);
                          }}
                          className="p-1 hover:bg-[#2A2E33] text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-[#A09B8C]">{block.items.length} itens</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items in Selected Block */}
          <div className="lg:col-span-2">
            {selectedBlockIndex !== null ? (
              <div className="space-y-6">
                <div className="bg-[#0A1428] border border-[#1E2328] p-6">
                  <h2 className="text-xl text-[#C8AA6E] mb-4">
                    {blocks[selectedBlockIndex].type}
                  </h2>
                  
                  {blocks[selectedBlockIndex].items.length === 0 ? (
                    <div className="text-center py-8 text-[#A09B8C]">
                      Adicione itens selecionando-os abaixo
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                      {blocks[selectedBlockIndex].items.map((item) => (
                        <div
                          key={item.id}
                          className="relative group"
                        >
                          <ItemSelector
                            itemId={item.id}
                            onItemClick={() => handleRemoveItemFromBlock(selectedBlockIndex, item.id)}
                            showAsSelected
                          />
                          <button
                            onClick={() => handleRemoveItemFromBlock(selectedBlockIndex, item.id)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ItemSelector
                  onItemClick={(itemId) => handleAddItemToBlock(selectedBlockIndex, itemId)}
                  selectedItems={blocks[selectedBlockIndex].items.map(item => item.id)}
                />
              </div>
            ) : (
              <div className="bg-[#0A1428] border border-[#1E2328] p-12 text-center">
                <p className="text-xl text-[#A09B8C]">
                  Selecione um bloco para adicionar itens
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
