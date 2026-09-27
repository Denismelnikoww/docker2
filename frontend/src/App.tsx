import {useEffect, useState} from 'react';
import {fetchProducts, patchProduct, deleteProduct} from './api';
import type {Product} from './types';
import './App.css'

interface Draft {
    name: string;
    price: string;
    description: string;
}

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [draft, setDraft] = useState<Draft>({name: '', price: '', description: ''});

    async function load() {
        setLoading(true);
        setError(null);
        try {
            setProducts(await fetchProducts());
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function startEdit(p: Product) {
        setEditingId(p.id);
        setDraft({name: p.name, price: String(p.price), description: p.description});
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function saveEdit(id: number) {
        try {
            const updated = await patchProduct(id, {
                name: draft.name,
                price: parseFloat(draft.price),
                description: draft.description,
            });
            setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
            setEditingId(null);
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Error');
        }
    }

    async function remove(id: number) {
        if (!confirm('Удалить продукт?')) return;
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            alert(e instanceof Error ? e.message : 'Error');
        }
    }

    return (
        <div className="container">
            <h1>Список продуктов</h1>
            {loading && <p>Загрузка...</p>}
            {error && <p className="error">Ошибка: {error}</p>}

            {!loading && !error && (
                <table className="products">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Цена</th>
                        <th>Описание</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>
                                {editingId === p.id
                                    ? <input value={draft.name}
                                             onChange={e => setDraft({...draft, name: e.target.value})}/>
                                    : p.name}
                            </td>
                            <td>
                                {editingId === p.id
                                    ? <input type="number" step="0.01" value={draft.price}
                                             onChange={e => setDraft({...draft, price: e.target.value})}/>
                                    : p.price}
                            </td>
                            <td>
                                {editingId === p.id
                                    ? <input value={draft.description}
                                             onChange={e => setDraft({...draft, description: e.target.value})}/>
                                    : p.description}
                            </td>
                            <td className="actions">
                                {editingId === p.id ? (
                                    <>
                                        <button onClick={() => saveEdit(p.id)}>Сохранить</button>
                                        <button onClick={cancelEdit}>Отмена</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(p)}>Изменить</button>
                                        <button className="danger" onClick={() => remove(p.id)}>Удалить</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}