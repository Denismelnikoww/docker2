export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

export interface ProductPatch {
    name?: string;
    price?: number;
    description?: string;
}