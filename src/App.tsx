import { useState, useEffect } from 'react';
//import { BuildEditor } from './components/BuildEditor';
import { BuildEditor } from './components/BuildEditor';
import { BuildViewer } from './components/BuildViewer';
import { ItemsDebugPanel } from './components/ItemsDebugPanel';
import { FileJson, Upload, Plus, Import } from 'lucide-react';
import MouseFollower from './components/MouseFollower';
import VideoViewer from './components/ui/VideoViewer';
import { processDescription, processTags, getItemImageUrl } from "../utils/utils";
import ChampionsImgProfileView from './components/ui/ChampionsImgProfileView';
import { MapsList } from './components/ui/MapsList';
import { ChampionsList } from './components/ui/ChampionsList';

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

export default function App() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [editingBuild, setEditingBuild] = useState<Build | null>(null);
  const [view, setView] = useState<'list' | 'editor' | 'viewer'>('list');

  // Load example build on first render
  useEffect(() => {
    loadExampleBuild();
  }, []);

  const loadExampleBuild = () => {
    const exampleBuild: Build = {
      title: "Yoda mid",
      associatedMaps: [11, 12],
      associatedChampions: [893, 103, 1, 34, 136, 268, 63, 69, 9, 74, 910, 30, 10, 85, 127, 99, 90, 800, 518, 61, 13, 517, 134, 163, 4, 45, 161, 711, 112, 8, 101, 115, 142, 143, 50, 43],
      blocks: [
        {
          items: [
            { id: "6655", count: 1 },
            { id: "2503", count: 1 },
            { id: "3118", count: 1 },
            { id: "6657", count: 1 },
            { id: "3003", count: 1 }
          ],
          type: "Inicial"
        },
        {
          items: [
            { id: "3089", count: 1 },
            { id: "3135", count: 1 },
            { id: "4645", count: 1 },
            { id: "4646", count: 1 },
            { id: "3100", count: 1 },
            { id: "4628", count: 1 },
            { id: "3152", count: 1 }
          ],
          type: "BURST (DANO)"
        },
        {
          items: [
            { id: "3157", count: 1 },
            { id: "3165", count: 1 },
            { id: "3102", count: 1 },
            { id: "3140", count: 1 }
          ],
          type: "SITUACIONAL"
        },
        {
          items: [
            { id: "3137", count: 1 },
            { id: "3116", count: 1 },
            { id: "8010", count: 1 },
            { id: "4629", count: 1 }
          ],
          type: "UTILIDADE"
        }
      ]
    };

    setBuilds([exampleBuild]);
  };

  const handleSaveBuild = (build: Build) => {
    if (editingBuild) {
      setBuilds(builds.map(b => b.title === editingBuild.title ? build : b));
    } else {
      setBuilds([...builds, build]);
    }
    setEditingBuild(null);
    setView('list');
  };

  const handleNewBuild = () => {
    setEditingBuild(null);
    setView('editor');
  };

  const handleEditBuild = (build: Build) => {
    setEditingBuild(build);
    setView('editor');
  };

  const handleViewBuild = (build: Build) => {
    setEditingBuild(build);
    setView('viewer');
  };

  const handleExportJSON = (build: Build) => {
    const json = JSON.stringify(build, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${build.title.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const build = JSON.parse(e.target.result);
            setBuilds([...builds, build]);
          } catch (error) {
            alert('Erro ao carregar o JSON');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-[#010A13] text-[#C8AA6E]">
      <MouseFollower />
      <VideoViewer />
      {view === 'list' && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl">League of Legends Build Creator</h1>
              <p className="text-sm text-[#A09B8C] mt-2">
                Versão 15.23.1 • Data Dragon API
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleImportJSON}
                className="flex items-center gap-2 px-6 py-3 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors"
              >
                <Upload size={20} />
                Importar JSON
              </button>
              <button
                onClick={handleNewBuild}
                className="flex items-center gap-2 px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
              >
                <Plus size={20} />
                Nova Build
              </button>
            </div>
          </div>

          {builds.length === 0 ? (
            <div className="text-center py-16 border border-[#1E2328] bg-[#0A1428]">
              <FileJson size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">Nenhuma build criada</p>
              <p className="text-[#A09B8C] mb-6">Crie uma nova build ou importe um JSON</p>
              <button
                onClick={handleNewBuild}
                className="px-6 py-3 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors"
              >
                Criar primeira build
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builds.map((build, index) => (
                <div
                  key={index}
                  className="bg-[#0A1428] border border-[#1E2328] p-6 hover:border-[#C8AA6E] transition-colors"
                >
                  <h3 className="text-xl mb-4">{build.title}</h3>
                  <div>

                    <MapsList maps={build.associatedMaps} />

                    <ChampionsList champions={build.associatedChampions} ui="home" />

                  </div>
                  <div className="text-sm text-[#A09B8C] mb-4">
                    <p>{build.blocks.length} blocos de itens</p>
                    <p>{build.blocks.reduce((acc, block) => acc + block.items.length, 0)} itens totais</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewBuild(build)}
                      className="flex-1 px-4 py-2 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditBuild(build)}
                      className="flex-1 px-4 py-2 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleExportJSON(build)}
                      className="px-4 py-2 bg-[#1E2328] border border-[#C8AA6E] hover:bg-[#2A2E33] transition-colors"
                    >
                      <FileJson size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'editor' && (
        <BuildEditor
          initialBuild={editingBuild}
          onSave={handleSaveBuild}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'viewer' && editingBuild && (
        <BuildViewer
          build={editingBuild}
          onClose={() => setView('list')}
          onEdit={() => setView('editor')}
          onExport={() => handleExportJSON(editingBuild)}
        />
      )}

      {/* Debug Panel - Remove this in production */}
      {/* <ItemsDebugPanel /> */}
    </div>
  );
}