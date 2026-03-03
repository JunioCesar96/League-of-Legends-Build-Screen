import { useEffect, useState } from 'react';
import { fetchItems, getAllPurchasableItems, getItemImageUrl } from '../data/items';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

export function ItemsDebugPanel() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [itemCount, setItemCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sampleItems, setSampleItems] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    loadAndTest();
  }, []);

  const loadAndTest = async () => {
    try {
      setStatus('loading');
      console.log('🔄 Iniciando carregamento de itens...');
      
      const items = await fetchItems();
      console.log('✅ Items carregados:', items);
      
      const purchasable = getAllPurchasableItems();
      console.log('✅ Items compráveis:', purchasable.length);
      
      setItemCount(purchasable.length);
      
      // Get first 5 items as sample
      const samples = purchasable.slice(0, 5).map(({ id, data }) => ({
        id,
        name: data.name,
      }));
      setSampleItems(samples);
      
      setStatus('success');
    } catch (err) {
      console.error('❌ Erro ao carregar itens:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setStatus('error');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[#0A1428] border-2 border-[#C8AA6E] p-4 rounded-lg shadow-lg max-w-md z-50">
      <div className="flex items-center gap-2 mb-3">
        {status === 'loading' && <Loader className="animate-spin text-[#C8AA6E]" size={20} />}
        {status === 'success' && <CheckCircle className="text-green-500" size={20} />}
        {status === 'error' && <AlertCircle className="text-red-500" size={20} />}
        <h3 className="text-[#C8AA6E]">Status da API</h3>
      </div>

      {status === 'loading' && (
        <p className="text-sm text-[#A09B8C]">Carregando itens do Data Dragon...</p>
      )}

      {status === 'success' && (
        <div className="space-y-2">
          <p className="text-sm text-green-500">
            ✅ {itemCount} itens carregados com sucesso!
          </p>
          
          {sampleItems.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-[#A09B8C]">Exemplos:</p>
              <div className="flex gap-2">
                {sampleItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="relative w-12 h-12" title={item.name}>
                    <img
                      src={getItemImageUrl(item.id)}
                      alt={item.name}
                      className="w-16 h-16 object-cover border border-[#C8AA6E]"
                      onError={(e) => {
                        console.error(`Erro ao carregar imagem do item ${item.id}`);
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%230F1923" width="48" height="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23C8AA6E" font-size="10"%3E' + item.id + '%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-2">
          <p className="text-sm text-red-500">Erro ao carregar itens:</p>
          <p className="text-xs text-[#A09B8C]">{error}</p>
          <button
            onClick={loadAndTest}
            className="px-4 py-2 bg-[#C8AA6E] text-[#010A13] hover:bg-[#F0E6D2] transition-colors text-sm"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
}
