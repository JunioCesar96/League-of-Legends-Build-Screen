import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface ItemImageProps {
  itemId: string;
  itemName?: string;
  gold?: number;
  className?: string;
  showGold?: boolean;
}

export function ItemImage({ itemId, itemName, gold, className = '', showGold = true }: ItemImageProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = `https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/${itemId}.png`;

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-[#0F1923] border-2 border-red-500 ${className}`}>
        <div className="flex flex-col items-center gap-1 p-2 text-center">
          <AlertCircle size={16} className="text-red-500" />
          <span className="text-[10px] text-red-500">{itemId}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <img
        src={imageUrl}
        alt={itemName || `Item ${itemId}`}
        className="w-16 h-16"
        loading="lazy"
        onError={() => setImageError(true)}
      />
      {showGold && gold !== undefined && (
        <div className="absolute bottom-0 right-0 bg-[#010A13] px-1 text-[10px] text-[#C8AA6E]">
          {gold}
        </div>
      )}
    </div>
  );
}
