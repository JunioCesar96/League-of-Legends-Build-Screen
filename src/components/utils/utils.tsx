import { KEYWORDS } from '../../constants/keywords';

// CDN Base URL for images
export const ITEM_IMAGE_URL = 'https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/';
export const DATA_CHAMPION_URL = 'https://ddragon.leagueoflegends.com/cdn/15.23.1/data/pt_BR/champion.json';
export const CHAMPION_IMAGE_URL = 'https://ddragon.leagueoflegends.com/cdn/15.23.1/img/champion/';
export const DATA_MAP_URL = 'https://ddragon.leagueoflegends.com/cdn/15.23.1/data/pt_BR/map.json';
export const DATA_DRAGON_VERSION = '15.23.1';

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

    // 3 — adiciona o onclick nas passives
    processedDesc = processedDesc.replace(
        /<passive>(.*?)<\/passive>/g,
        (_m, name) => {
            const safeName = name.replace(/"/g, "&quot;");
            return `<passive onclick="passiveVideoView('${safeName}', this)">${name}</passive>`;
        }
    );
    return processedDesc;
};


const processTags = (tags: string[]) => {
    if (!tags) return '';
    return tags.sort().map(tag => `<tag>${tag}</tag>`).join(' ');
};


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

function getItemImageUrl(itemId: string | number): string {
    return `${ITEM_IMAGE_URL}${itemId}.png`;
}

async function getChampionData(championId: string | number): Promise<any | null> {
    try {
        const championKey = championId.toString();
        const data = await fetchData(DATA_CHAMPION_URL);
        const championData = Object.values(data.data).find((champion: any) => champion.key === championKey);
        return championData ? championData : null;
    } catch (error) {
        console.error('Error fetching champion data:', error);
        return null;
    }
}

function getChampionImageUrl(championName: string): string {
    if (!championName) return '';
    // Torna minúscula apenas a letra que segue um apóstrofo (inclui variantes curtas)
    let formattedName = championName.replace(/['‘’](\w)/g, (_m, next) => next.toLowerCase());
    // Remove espaços, pontos e quaisquer apóstrofos restantes
    formattedName = formattedName.replace(/[\s.'‘’]/g, '');
    return `${CHAMPION_IMAGE_URL}${formattedName}.png`;
}

async function getMapData(mapId: string | number): Promise<any | null> {
    try {
        const data = await fetchData(DATA_MAP_URL);
        // try direct lookup with string key
        const key = String(mapId);
        let mapData = data.data[key];
        if (!mapData) {
            // fallback: search through values for matching id/mapId property
            mapData = Object.values(data.data).find((m: any) => {
                return (
                    m.mapId === mapId ||
                    m.mapId === Number(mapId) ||
                    m.id === mapId ||
                    m.id === Number(mapId)
                );
            });
        }
        return mapData ? mapData : null;
    } catch (error) {
        console.error('Error fetching map data:', error);
        return null;
    }
}



async function fetchData(url: string): Promise<any> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

export { processDescription, processTags, applyStatIcons, getItemImageUrl, getChampionData, getChampionImageUrl, getMapData };