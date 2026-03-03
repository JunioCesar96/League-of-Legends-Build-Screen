/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YOUTUBE_API_KEY: string;
  // coloque aqui todas as outras variáveis que você tiver
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
