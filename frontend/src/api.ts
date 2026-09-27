import type {Product, ProductPatch} from './types';

const BASE = '/api/products';

export async function fetchProducts(): Promise<Product[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to load products');
    return res.json();
}

export async function patchProduct(id: number, patch: ProductPatch): Promise<Product> {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error('Failed to patch product');
    return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, {method: 'DELETE'});
    if (!res.ok) throw new Error('Failed to delete product');
}
