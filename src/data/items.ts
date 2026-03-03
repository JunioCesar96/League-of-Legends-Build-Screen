// League of Legends Items Database - Official Data Dragon API
// Data fetched from: https://ddragon.leagueoflegends.com/cdn/15.23.1/data/pt_BR/item.json

export interface ItemGold {
  base: number;
  total: number;
  sell: number;
  purchasable: boolean;
}

export interface ItemData {
  name: string;
  description: string;
  plaintext?: string;
  gold: ItemGold;
  tags: string[];
  maps?: Record<string, boolean>;
  depth?: number;
  inStore?: boolean;
  from?: string[];
  into?: string[];
  requiredAlly?: string;
  requiredChampion?: string;
  stats?: Record<string, number>;
}

export interface ItemsResponse {
  type: string;
  version: string;
  data: Record<string, ItemData>;
}

// CDN Base URL for images
export const ITEM_IMAGE_URL = 'https://ddragon.leagueoflegends.com/cdn/15.23.1/img/item/';
export const DATA_DRAGON_VERSION = '15.23.1';

export function getItemImageUrl(itemId: string): string {
  return `${ITEM_IMAGE_URL}${itemId}.png`;
}

// Global cache
let itemsCache: Record<string, ItemData> | null = null;
let loadingPromise: Promise<Record<string, ItemData>> | null = null;

export async function fetchItems(): Promise<Record<string, ItemData>> {
  // Return cache if available
  if (itemsCache) {
    return itemsCache;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      console.log('Fetching items from Data Dragon API...');
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${DATA_DRAGON_VERSION}/data/pt_BR/item.json`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ItemsResponse = await response.json();
      console.log('Items loaded successfully:', Object.keys(data.data).length, 'items');
      
      itemsCache = data.data;
      return data.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      loadingPromise = null; // Reset on error
      throw error;
    }
  })();

  return loadingPromise;
}

export function getItemById(itemId: string): ItemData | null {
  if (!itemsCache) {
    return null;
  }
  return itemsCache[itemId] || null;
}

export function isItemPurchasable(itemId: string, item: ItemData): boolean {
  // Filter rules based on League of Legends item system
  
  // Must be purchasable
  if (!item.gold.purchasable) return false;
  
  // Must be in store
  if (item.inStore === false) return false;
  
  // Filter out special items (Ornn items, etc)
  if (item.requiredAlly || item.requiredChampion) return false;
  
  // Filter out items not available on Summoner's Rift (map 11) or ARAM (map 12)
  if (item.maps) {
    const hasSR = item.maps['11'] !== false;
    const hasARAM = item.maps['12'] !== false;
    if (!hasSR && !hasARAM) return false;
  }
  
  // Filter out some special item IDs
  const excludedIds = ['2065', '2138', '2139', '2140']; // Potions that are deprecated, etc
  if (excludedIds.includes(itemId)) return false;
  
  return true;
}

export function getAllPurchasableItems(): Array<{ id: string; data: ItemData }> {
  if (!itemsCache) {
    return [];
  }

  return Object.entries(itemsCache)
    .filter(([id, item]) => isItemPurchasable(id, item))
    .map(([id, data]) => ({ id, data }));
}

export function categorizeItem(item: ItemData): string {
  if (!item.tags || item.tags.length === 0) {
    return 'Outros';
  }

  // Priority order for categorization
  if (item.tags.includes('Boots')) return 'Botas';
  if (item.tags.includes('Consumable')) return 'Consumível';
  if (item.tags.includes('Trinket')) return 'Totem';
  if (item.tags.includes('Lane')) return 'Inicial';
  if (item.tags.includes('Jungle')) return 'Selva';

  // Damage categories (AD)
  if (
    item.tags.includes('Damage') ||
    item.tags.includes('CriticalStrike') ||
    item.tags.includes('AttackSpeed') ||
    item.tags.includes('OnHit') ||
    item.tags.includes('LifeSteal') ||
    item.tags.includes('ArmorPenetration')
  ) {
    return 'Dano AD';
  }

  // Magic damage (AP)
  if (
    item.tags.includes('SpellDamage') ||
    item.tags.includes('SpellVamp')
  ) {
    return 'Dano AP';
  }

  // Defense
  if (
    item.tags.includes('Health') ||
    item.tags.includes('Armor') ||
    item.tags.includes('SpellBlock') ||
    item.tags.includes('HealthRegen')
  ) {
    return 'Defesa';
  }

  // Utility
  if (
    item.tags.includes('Mana') ||
    item.tags.includes('ManaRegen') ||
    item.tags.includes('CooldownReduction') ||
    item.tags.includes('AbilityHaste') ||
    item.tags.includes('Active') ||
    item.tags.includes('Aura') ||
    item.tags.includes('NonbootsMovement') ||
    item.tags.includes('GoldPer')
  ) {
    return 'Utilidade';
  }

  return 'Outros';
}

export function searchItems(query: string, items: Array<{ id: string; data: ItemData }>): Array<{ id: string; data: ItemData }> {
  if (!query.trim()) {
    return items;
  }

  const lowerQuery = query.toLowerCase();

  return items.filter(({ data }) => {
    return (
      data.name.toLowerCase().includes(lowerQuery) ||
      data.plaintext?.toLowerCase().includes(lowerQuery) ||
      data.description?.toLowerCase().includes(lowerQuery)
    );
  });
}

export function filterItemsByCategory(
  category: string,
  items: Array<{ id: string; data: ItemData }>
): Array<{ id: string; data: ItemData }> {
  if (category === 'all') {
    return items;
  }

  return items.filter(({ data }) => {
    return categorizeItem(data) === category;
  });
}
