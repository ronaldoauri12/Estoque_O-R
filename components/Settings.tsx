
import React, { useState } from 'react';
import { User, ActivityLogAction, Supplier } from '../types';
import UserManagement from './UserManagement';
import { EditIcon } from './icons/EditIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface SettingsProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  categories: string[];
  onAddCategory: (category: string) => void;
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
  locations: string[];
  onAddLocation: (location: string) => void;
  onUpdateLocation: (oldLocation: string, newLocation: string) => void;
  onDeleteLocation: (location: string) => void;
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onUpdateSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (supplierId: string) => void;
  lowStockThreshold: number;
  onLowStockThresholdChange: (threshold: number) => void;
  defaultReorderQuantity: number;
  onDefaultReorderQuantityChange: (quantity: number) => void;
  // FIX: Update logActivity prop signature to match definition in App.tsx.
  logActivity: (action: ActivityLogAction, details: string, oldValue?: string | number, newValue?: string | number) => void;
}

const emptySupplier: Omit<Supplier, 'id'> = { name: '', contactPerson: '', email: '', phone: '' };

const Settings: React.FC<SettingsProps> = ({ 
    users, 
    setUsers, 
    currentUser,
    categories,
    onAddCategory,
    onUpdateCategory,
    onDeleteCategory,
    locations,
    onAddLocation,
    onUpdateLocation,
    onDeleteLocation,
    suppliers,
    onAddSupplier,
    onUpdateSupplier,
    onDeleteSupplier,
    lowStockThreshold,
    onLowStockThresholdChange,
    defaultReorderQuantity,
    onDefaultReorderQuantityChange,
    // FIX: Receive logActivity prop.
    logActivity,
}) => {
  const [activeTab, setActiveTab] = useState('products');
  
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');

  const [newLocation, setNewLocation] = useState('');
  const [editingLocation, setEditingLocation] = useState<string | null>(null);
  const [editingLocationValue, setEditingLocationValue] = useState('');

  const [newSupplier, setNewSupplier] = useState(emptySupplier);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingSupplierValue, setEditingSupplierValue] = useState<Supplier | null>(null);

  const handleAddCategoryClick = () => {
      if (newCategory.trim()) {
          onAddCategory(newCategory.trim());
          setNewCategory('');
      }
  };

  const handleStartEditCategory = (category: string) => {
      setEditingCategory(category);
      setEditingCategoryValue(category);
  };
  
  const handleCancelEditCategory = () => {
      setEditingCategory(null);
      setEditingCategoryValue('');
  };

  const handleSaveEditCategory = () => {
      if (editingCategory && editingCategoryValue.trim()) {
          onUpdateCategory(editingCategory, editingCategoryValue.trim());
          handleCancelEditCategory();
      }
  };

  const handleAddLocationClick = () => {
      if (newLocation.trim()) {
          onAddLocation(newLocation.trim());
          setNewLocation('');
      }
  };

  const handleStartEditLocation = (location: string) => {
      setEditingLocation(location);
      setEditingLocationValue(location);
  };
  
  const handleCancelEditLocation = () => {
      setEditingLocation(null);
      setEditingLocationValue('');
  };

  const handleSaveEditLocation = () => {
      if (editingLocation && editingLocationValue.trim()) {
          onUpdateLocation(editingLocation, editingLocationValue.trim());
          handleCancelEditLocation();
      }
  };

  const handleAddSupplierClick = () => {
    if (newSupplier.name.trim()) {
        onAddSupplier(newSupplier);
        setNewSupplier(emptySupplier);
    }
  };

  const handleStartEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditingSupplierValue(supplier);
  };

  const handleCancelEditSupplier = () => {
    setEditingSupplier(null);
    setEditingSupplierValue(null);
  };

  const handleSaveEditSupplier = () => {
    if (editingSupplierValue) {
        onUpdateSupplier(editingSupplierValue);
        handleCancelEditSupplier();
    }
  };

  const tabs = [
    { id: 'products', label: 'Produtos' },
    { id: 'users', label: 'Usuários' },
  ];

  if (currentUser?.role !== 'admin') {
      return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-xl font-bold text-text-primary mb-4">Acesso Restrito</h3>
            <p className="text-text-secondary">Você não tem permissão para acessar esta página.</p>
        </div>
      );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Configurações</h2>
            <p className="text-text-secondary">Gerencie as configurações de produtos e usuários do sistema.</p>
        </div>

        <div className="flex border-b border-border">
            {tabs.map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-6 font-semibold transition-colors duration-200 focus:outline-none ${
                        activeTab === tab.id 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
        
        <div className="mt-6">
            {activeTab === 'products' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <h3 className="text-xl font-bold text-text-primary mb-4">Gerenciar Categorias</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <input 
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Nome da nova categoria"
                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                />
                                <button onClick={handleAddCategoryClick} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors whitespace-nowrap">Adicionar</button>
                            </div>
                            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                               {categories.map(category => (
                                   <li key={category} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                       {editingCategory === category ? (
                                           <input 
                                               type="text"
                                               value={editingCategoryValue}
                                               onChange={(e) => setEditingCategoryValue(e.target.value)}
                                               className="w-full px-2 py-1 border border-primary rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                               autoFocus
                                           />
                                       ) : (
                                           <span className="text-text-secondary">{category}</span>
                                       )}
                                       <div className="flex items-center gap-2 pl-2">
                                           {editingCategory === category ? (
                                               <>
                                                    <button onClick={handleSaveEditCategory} className="p-1.5 text-success hover:bg-success/10 rounded-md"><CheckIcon className="w-5 h-5"/></button>
                                                    <button onClick={handleCancelEditCategory} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><XIcon className="w-5 h-5"/></button>
                                               </>
                                           ) : (
                                               <>
                                                   <button onClick={() => handleStartEditCategory(category)} className="p-1.5 text-primary hover:bg-primary/10 rounded-md"><EditIcon className="w-5 h-5"/></button>
                                                   <button onClick={() => onDeleteCategory(category)} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><DeleteIcon className="w-5 h-5"/></button>
                                               </>
                                           )}
                                       </div>
                                   </li>
                               ))}
                            </ul>
                        </div>
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <h3 className="text-xl font-bold text-text-primary mb-4">Gerenciar Localizações</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <input 
                                    type="text"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="Nome da nova localização"
                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                />
                                <button onClick={handleAddLocationClick} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors whitespace-nowrap">Adicionar</button>
                            </div>
                            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                               {locations.map(location => (
                                   <li key={location} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50">
                                       {editingLocation === location ? (
                                           <input 
                                               type="text"
                                               value={editingLocationValue}
                                               onChange={(e) => setEditingLocationValue(e.target.value)}
                                               className="w-full px-2 py-1 border border-primary rounded-md focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                               autoFocus
                                           />
                                       ) : (
                                           <span className="text-text-secondary">{location}</span>
                                       )}
                                       <div className="flex items-center gap-2 pl-2">
                                           {editingLocation === location ? (
                                               <>
                                                    <button onClick={handleSaveEditLocation} className="p-1.5 text-success hover:bg-success/10 rounded-md"><CheckIcon className="w-5 h-5"/></button>
                                                    <button onClick={handleCancelEditLocation} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><XIcon className="w-5 h-5"/></button>
                                               </>
                                           ) : (
                                               <>
                                                   <button onClick={() => handleStartEditLocation(location)} className="p-1.5 text-primary hover:bg-primary/10 rounded-md"><EditIcon className="w-5 h-5"/></button>
                                                   <button onClick={() => onDeleteLocation(location)} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><DeleteIcon className="w-5 h-5"/></button>
                                               </>
                                           )}
                                       </div>
                                   </li>
                               ))}
                            </ul>
                        </div>
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <h3 className="text-xl font-bold text-text-primary mb-4">Alertas de Estoque</h3>
                            <div>
                               <label htmlFor="lowStock" className="block text-sm font-medium text-text-secondary mb-1">Limite para Baixo Estoque</label>
                               <input
                                    type="number"
                                    id="lowStock"
                                    value={lowStockThreshold}
                                    onChange={(e) => onLowStockThresholdChange(parseInt(e.target.value, 10) || 0)}
                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                               />
                               <p className="text-xs text-text-secondary mt-2">O dashboard alertará quando a quantidade de um produto for igual ou inferior a este valor.</p>
                            </div>
                        </div>
                        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                            <h3 className="text-xl font-bold text-text-primary mb-4">Valores Padrão</h3>
                            <div>
                               <label htmlFor="reorderQty" className="block text-sm font-medium text-text-secondary mb-1">Quantidade Padrão para Reposição</label>
                               <input
                                    type="number"
                                    id="reorderQty"
                                    value={defaultReorderQuantity}
                                    onChange={(e) => onDefaultReorderQuantityChange(parseInt(e.target.value, 10) || 0)}
                                    className="w-full px-3 py-2 bg-white border border-border rounded-lg text-text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                               />
                               <p className="text-xs text-text-secondary mt-2">Este valor será usado ao criar novos produtos.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                        <h3 className="text-xl font-bold text-text-primary mb-4">Gerenciar Fornecedores</h3>
                        <div className="space-y-3 mb-4 border-b border-border pb-4">
                            <input value={newSupplier.name} onChange={e => setNewSupplier(p => ({...p, name: e.target.value}))} placeholder="Nome do Fornecedor" className="w-full px-3 py-2 bg-white border border-border rounded-lg"/>
                            <input value={newSupplier.contactPerson} onChange={e => setNewSupplier(p => ({...p, contactPerson: e.target.value}))} placeholder="Pessoa de Contato" className="w-full px-3 py-2 bg-white border border-border rounded-lg"/>
                            <input value={newSupplier.email} onChange={e => setNewSupplier(p => ({...p, email: e.target.value}))} type="email" placeholder="E-mail" className="w-full px-3 py-2 bg-white border border-border rounded-lg"/>
                            <input value={newSupplier.phone} onChange={e => setNewSupplier(p => ({...p, phone: e.target.value}))} placeholder="Telefone" className="w-full px-3 py-2 bg-white border border-border rounded-lg"/>
                            <button onClick={handleAddSupplierClick} className="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover font-semibold transition-colors">Adicionar Fornecedor</button>
                        </div>
                        <ul className="space-y-2 max-h-[42rem] overflow-y-auto pr-2">
                            {suppliers.map(supplier => (
                                <li key={supplier.id} className="p-2 rounded-md hover:bg-slate-50">
                                    {editingSupplier?.id === supplier.id ? (
                                        <div className="space-y-2">
                                            <input value={editingSupplierValue?.name || ''} onChange={e => setEditingSupplierValue(p => p ? {...p, name: e.target.value} : null)} placeholder="Nome" className="w-full px-2 py-1 border border-primary rounded-md"/>
                                            <input value={editingSupplierValue?.contactPerson || ''} onChange={e => setEditingSupplierValue(p => p ? {...p, contactPerson: e.target.value} : null)} placeholder="Contato" className="w-full px-2 py-1 border border-primary rounded-md"/>
                                            <input value={editingSupplierValue?.email || ''} onChange={e => setEditingSupplierValue(p => p ? {...p, email: e.target.value} : null)} placeholder="E-mail" className="w-full px-2 py-1 border border-primary rounded-md"/>
                                            <input value={editingSupplierValue?.phone || ''} onChange={e => setEditingSupplierValue(p => p ? {...p, phone: e.target.value} : null)} placeholder="Telefone" className="w-full px-2 py-1 border border-primary rounded-md"/>
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={handleSaveEditSupplier} className="p-1.5 text-success hover:bg-success/10 rounded-md"><CheckIcon className="w-5 h-5"/></button>
                                                <button onClick={handleCancelEditSupplier} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><XIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-text-primary">{supplier.name}</p>
                                                <p className="text-sm text-text-secondary">{supplier.contactPerson}</p>
                                                <p className="text-xs text-text-secondary">{supplier.email} | {supplier.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-2 pl-2 flex-shrink-0">
                                                <button onClick={() => handleStartEditSupplier(supplier)} className="p-1.5 text-primary hover:bg-primary/10 rounded-md"><EditIcon className="w-5 h-5"/></button>
                                                <button onClick={() => onDeleteSupplier(supplier.id)} className="p-1.5 text-danger hover:bg-danger/10 rounded-md"><DeleteIcon className="w-5 h-5"/></button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                 </div>
            )}
            
            {activeTab === 'users' && (
                // FIX: Pass logActivity to UserManagement.
                <UserManagement users={users} setUsers={setUsers} logActivity={logActivity} />
            )}
        </div>
    </div>
  );
};

export default Settings;
