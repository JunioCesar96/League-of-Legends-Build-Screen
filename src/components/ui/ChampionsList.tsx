import React, { useState, useEffect } from 'react';
import ChampionsImgProfileView from './ChampionsImgProfileView';
import { ChampionSelector } from '../ChampionSelector';

interface SelectorPosition {
    x: number;
    y: number;
}

interface ChampionsListProps {
    champions: number[];
    ui: 'home' | 'editor' | 'viewer';
    onRemove?: (championId: number) => void;
    onAdd?: (championId: number) => void;
} 

export const ChampionsList = ({ champions, ui, onRemove, onAdd }: ChampionsListProps) => {
    const [showSelector, setShowSelector] = useState(false);
    const [selectorPos, setSelectorPos] = useState<SelectorPosition>({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState<SelectorPosition>({ x: 0, y: 0 });
    let content = null;

    const onMouseDown = (e: React.MouseEvent) => {
      setDragging(true);
      setDragOffset({ x: e.clientX - selectorPos.x, y: e.clientY - selectorPos.y });
    };
    const onMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setSelectorPos({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      }
    };
    const onMouseUp = () => {
      setDragging(false);
    };

    // attach global listeners when dragging
    useEffect(() => {
      if (dragging) {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      } else {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
    }, [dragging, dragOffset]);

    switch (ui) {
        case 'home':
            content = (
                <div className="text-sm text-[#A09B8C] mb-4">
                    <div className="mb-2">Campeões:</div>
                    <div className="champ-list">
                        {champions.map((championId) => (
                            <div key={championId} className="champ-item">
                                <ChampionsImgProfileView championId={championId} />
                            </div>
                        ))}
                    </div>
                </div>
            );
            break;
        case 'editor':
            content = (
                <div className="text-sm text-[#A09B8C] mb-4">
                    <div className="mb-2 flex items-center justify-between">
                        <span>Campeões:</span>
                        <button
                            className="text-xs px-2 py-1 bg-[#1E2328] border border-[#C8AA6E] rounded hover:bg-[#2A2E33]"
                            onClick={() => setShowSelector(!showSelector)}
                        >
                            {showSelector ? 'Fechar' : 'Editar'}
                        </button>
                    </div>
                    {showSelector && onAdd && (
                        <div
                            style={{
                                position: 'absolute',
                                top: selectorPos.y,
                                left: selectorPos.x,
                                zIndex: 1000,
                                background: '#0A1428',
                                padding: '8px',
                                border: '1px solid #C8AA6E',
                                borderRadius: '4px',
                            }}
                        >
                            {/* header used as drag handle so clicks inside grid still work */}
                            <div
                                style={{ cursor: 'move', marginBottom: '4px', color: '#C8AA6E', fontSize: '12px' }}
                                onMouseDown={onMouseDown}
                            >
                                Arrastar
                            </div>
                            <ChampionSelector onChampionClick={(id) => onAdd(Number(id))} />
                        </div>
                    )}
                    <div
                        className="champ-list"
                        onDragOver={(e) => { e.preventDefault(); }}
                        onDrop={(e) => {
                            e.preventDefault();
                            const id = e.dataTransfer.getData('text/plain');
                            if (id && onAdd) onAdd(Number(id));
                        }}
                    >
                        {champions.map((championId) => (
                            <div
                                key={championId}
                                className="champ-item relative"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('text/plain', String(championId));
                                }}
                            >
                                <ChampionsImgProfileView championId={championId} />
                                {ui === 'editor' && showSelector && (
                                    <button
                                        className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-red text-xs rounded-full flex items-center justify-center"
                                        onClick={() => onRemove!(championId)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
            break;
        case 'viewer':
            content = (
                <div className="text-sm text-[#A09B8C] mb-4">
                    <div className="mb-2">Campeões:</div>
                    <div className="champ-list">
                        {champions.map((championId) => (
                            <div key={championId} className="champ-item">
                                <ChampionsImgProfileView championId={championId} /> {/* tooltip ou outras info */}
                            </div>
                        ))}
                    </div>
                </div>
            );
            break;
        default:
            content = null;
    }

    return <>{content}</>;
};
