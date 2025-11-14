import React, { useState, useEffect } from 'react';
import { Product, Supplier } from './types';
import { generateDescription } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
  categories: string[];
  locations: string[];
  suppliers: Supplier[];
  defaultReorderQuantity: number;
}

const ProductModal: React.FC<ProductModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    productToEdit, 
    categories, 
    locations, 
    suppliers,
    defaultReorderQuantity 
}) => {
  const [product, setProduct] = useState<Omit<Product, 'id' | 'lastUpdated'>>({
    name: '',
    category: categories[0] || '',
    quantity: 0,
    costPrice: 0,
    description: '',
    location: locations[0] || 'Estoque Principal',
    supplierIds: [],
    reorderQuantity: defaultReorderQuantity,
    priceHistory: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({
        name: '',
        category: categories[0] || '',
        quantity: 0,
        costPrice: 0,
        description: '',
        location: locations[0] || 'Estoque Principal',
        supplierIds: [],
        reorderQuantity: defaultReorderQuantity,
        priceHistory: [],
      });
    }
  }, [productToEdit, isOpen, categories, locations, defaultReorderQuantity]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'supplierIds') {
        const selectedOptions = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value);
        setProduct(prev => ({ ...prev, supplierIds: selectedOptions }));
    } else {
        setProduct(prev => ({ ...prev, [name]: name === 'quantity' || name === 'costPrice' || name === 'reorderQuantity' ? parseFloat(value) || 0 : value }));
    }
  };

  const handleGenerateDescription = async () => {
    if (!product.name || !product.category) {
        setError("Por favor, preencha o nome e a categoria do produto para gerar uma descrição.");
        return;
    }
    setError('');
    setIsGenerating(true);
    try {
        const description = await generateDescription(product.name, product.category);
        setProduct(prev => ({ ...prev, description }));
    } catch (e) {
        setError("Falha ao gerar descrição.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name.trim() || !product.category.trim()) {
        setError("Nome e categoria são obrigatórios.");
        return;
    }
    if (product.quantity < 0 || product.costPrice < 0 || product.reorderQuantity < 0) {
        setError("Valores numéricos não podem ser negativos.");
        return;
    }
    setError('');
    const finalProduct: Product = {
        ...product,
        id: productToEdit?.id || `prod-${Date.now()}`,
        lastUpdated: new Date().toISOString()
    };
    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-card rounded-2xl p-8 shadow-2xl w-full max-w-2xl animate-fade-in-up border border-border">
        <h2 className="text-2xl font-bold text-text-primary mb-6">{productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">Nome do Produto</label>
                <input type="text" id="name" name="name" value={product.name} onChange={handleChange} required className="w-full input-style" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Categoria</label>
                    <select id="category" name="category" value={product.category} onChange={handleChange} required className="w-full input-style">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-text-secondary mb-1">Localização</label>
                    <select id="location" name="location" value={product.location} onChange={handleChange} required className="w-full input-style">
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-text-secondary mb-1">Quantidade</label>
                    <input type="number" id="quantity" name="quantity" value={product.quantity} onChange={handleChange} required min="0" className="w-full input-style" />
                </div>
                 <div>
                    <label htmlFor="costPrice" className="block text-sm font-medium text-text-secondary mb-1">Preço Custo (R$)</label>
                    <input type="number" id="costPrice" name="costPrice" value={product.costPrice} onChange={handleChange} required min="0" step="0.01" className="w-full input-style" />
                </div>
                <div>
                    <label htmlFor="reorderQuantity" className="block text-sm font-medium text-text-secondary mb-1">Qtde. Reposição</label>
                    <input type="number" id="reorderQuantity" name="reorderQuantity" value={product.reorderQuantity} onChange={handleChange} required min="0" className="w-full input-style" />
                </div>
            </div>
             <div>
                <label htmlFor="supplierIds" className="block text-sm font-medium text-text-secondary mb-1">Fornecedores</label>
                <select id="supplierIds" name="supplierIds" value={product.supplierIds} onChange={handleChange} multiple className="w-full input-style h-24">
                    {suppliers.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                </select>
                <p className="text-xs text-text-secondary mt-1">Segure Ctrl (ou Cmd) para selecionar múltiplos.</p>
            </div>
            <div>
                 <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Descrição</label>
                 <textarea id="description" name="description" value={product.description} onChange={handleChange} rows={2} className="w-full input-style"></textarea>
                 <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="mt-2 flex items-center text-sm text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-wait">
                     <SparklesIcon className="w-4 h-4 mr-1"/>
                     {isGenerating ? 'Gerando...' : 'Gerar descrição com IA'}
                 </button>
            </div>
            
            {error && <p className="text-sm text-center text-danger font-semibold">{error}</p>}
            
            <div className="flex justify-end space-x-4 pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-lg hover:bg-slate-200 font-semibold transition-colors">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">Salvar</button>
            </div>
        </form>
      </div>
       <style>{`
        .input-style {
            padding: 0.5rem 0.75rem;
            background-color: white;
            border: 1px solid #D1D9E6;
            border-radius: 0.5rem;
            width: 100%;
            color: #1A1D21;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-style:focus {
            border-color: #4A90E2;
            box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
            outline: none;
        }
      `}</style>
    </div>
  );
};

export default ProductModal;
