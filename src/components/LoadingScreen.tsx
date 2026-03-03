import { Loader } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#010A13] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader className="animate-spin text-[#C8AA6E]" size={64} />
        <p className="text-xl text-[#C8AA6E]">Carregando League of Legends Build Creator...</p>
        <p className="text-sm text-[#A09B8C]">Obtendo dados da API Data Dragon</p>
      </div>
    </div>
  );
}
