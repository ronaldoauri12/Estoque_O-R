

import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { SortIcon } from './icons/SortIcon';
import { PlusIcon } from './icons/PlusIcon';
import { MinusIcon } from './icons/MinusIcon';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onUpdateQuantity: (productId: string, newQuantity: number, oldQuantity: number) => void;
}

type SortKey = 'name' | 'category' | 'quantity' | 'costPrice' | 'location' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete, onUpdateQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProducts, sortKey, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <SortIcon />;
    return sortOrder === 'asc' ? <SortIcon className="transform rotate-180" /> : <SortIcon />;
  };

  const headers: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'location', label: 'Localização' },
    { key: 'quantity', label: 'Quantidade' },
    { key: 'costPrice', label: 'Preço Custo' },
    { key: 'lastUpdated', label: 'Última Atualização' },
  ];
  
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border animate-fade-in">
        <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-text-primary">Lista de Produtos</h2>
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-slate-50">
                    <tr>
                        {headers.map(header => (
                            <th key={header.key} onClick={() => handleSort(header.key)} className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider cursor-pointer group">
                                <span className="flex items-center">
                                    {header.label}
                                    <span className="ml-2">{renderSortIcon(header.key)}</span>
                                </span>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                    {paginatedProducts.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{product.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{product.category}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{product.location}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => onUpdateQuantity(product.id, product.quantity - 1, product.quantity)} className="p-1 rounded-full hover:bg-slate-200 disabled:opacity-50" disabled={product.quantity <= 0}>
                                        <MinusIcon className="w-4 h-4" />
                                    </button>
                                    <span className="font-semibold w-8 text-center">{product.quantity}</span>
                                    <button onClick={() => onUpdateQuantity(product.id, product.quantity + 1, product.quantity)} className="p-1 rounded-full hover:bg-slate-200">
                                        <PlusIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{product.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">{new Date(product.lastUpdated).toLocaleString('pt-BR')}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => onEdit(product)} className="text-primary hover:text-primary-hover p-1.5 rounded-md hover:bg-primary/10 mr-2 transition-colors" title="Editar">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDelete(product)} className="text-danger hover:text-danger-hover p-1.5 rounded-md hover:bg-danger/10 transition-colors" title="Deletar">
                                    <DeleteIcon className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        <div className="flex justify-between items-center mt-4 text-sm text-text-secondary">
            <p>Mostrando {paginatedProducts.length} de {filteredProducts.length} produtos</p>
            <div className="flex items-center">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="w-5 h-5"/>
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRightIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductList;