const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export async function getVideoDetails(videoId: string) {
  const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao carregar dados do vídeo");

  const data = await response.json();
  return data.items[0];
}

export async function searchVideos(query: string, maxResults = 10) {
  const url = `${BASE_URL}/search?part=snippet&type=video&q=${encodeURIComponent(
    query
  )}&maxResults=${maxResults}&key=${API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Erro ao buscar vídeos");

  const data = await response.json();
  return data.items;
}
