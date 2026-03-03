// types.ts
export interface ItemData {
    name: string;
    gold: {
        total: number;
    };
    plaintext?: string;
    description?: string;
    tags: string[];
    stats?: any;
}

export interface ItemDataViewProps {
    data: ItemData;
    videoId: string;
    img_id:string | number;
}
