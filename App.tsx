
import React, { useState, useEffect } from 'react';
import { Product, User, Category, ActivityLog, ActivityLogAction, Supplier, Notification } from './types';
import { INITIAL_PRODUCTS, USERS, INITIAL_CATEGORIES, INITIAL_ACTIVITY_LOGS, INITIAL_SUPPLIERS } from './constants';

import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductModal from './components/ProductModal';
import ConfirmationModal from './components/ConfirmationModal';
import Reports from './components/Reports';
import Settings from './components/Settings';
import ActivityLogPage from './components/ActivityLogPage';

// Helper function to get initial state from localStorage, falling back to a default value
const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const savedItem = localStorage.getItem(key);
        return savedItem ? JSON.parse(savedItem) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

function App() {
  const [products, setProducts] = useState<Product[]>(() => getInitialState('inventory_products', INITIAL_PRODUCTS));
  const [users, setUsers] = useState<User[]>(() => getInitialState('inventory_users', USERS));
  const [categories, setCategories] = useState<Category[]>(() => getInitialState('inventory_categories', INITIAL_CATEGORIES));
  const [locations, setLocations] = useState<string[]>(() => getInitialState('inventory_locations', ['Estoque Principal', 'Matriz', 'Unidade', 'Cozinha', 'Garagem']));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => getInitialState('inventory_suppliers', INITIAL_SUPPLIERS));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getInitialState('inventory_activityLogs', INITIAL_ACTIVITY_LOGS));
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activePage, setActivePage] = useState('dashboard');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [lowStockThreshold, setLowStockThreshold] = useState<number>(() => getInitialState('inventory_lowStockThreshold', 10));
  const [defaultReorderQuantity, setDefaultReorderQuantity] = useState<number>(() => getInitialState('inventory_defaultReorderQuantity', 10));
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState('inventory_notifications', []));

  // UseEffect hooks to save state to localStorage whenever it changes
  useEffect(() => { try { localStorage.setItem('inventory_products', JSON.stringify(products)); } catch (e) { console.error(e) } }, [products]);
  useEffect(() => { try { localStorage.setItem('inventory_users', JSON.stringify(users)); } catch (e) { console.error(e) } }, [users]);
  useEffect(() => { try { localStorage.setItem('inventory_categories', JSON.stringify(categories)); } catch (e) { console.error(e) } }, [categories]);
  useEffect(() => { try { localStorage.setItem('inventory_locations', JSON.stringify(locations)); } catch (e) { console.error(e) } }, [locations]);
  useEffect(() => { try { localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers)); } catch (e) { console.error(e) } }, [suppliers]);
  useEffect(() => { try { localStorage.setItem('inventory_activityLogs', JSON.stringify(activityLogs)); } catch (e) { console.error(e) } }, [activityLogs]);
  useEffect(() => { try { localStorage.setItem('inventory_lowStockThreshold', JSON.stringify(lowStockThreshold)); } catch (e) { console.error(e) } }, [lowStockThreshold]);
  useEffect(() => { try { localStorage.setItem('inventory_defaultReorderQuantity', JSON.stringify(defaultReorderQuantity)); } catch (e) { console.error(e) } }, [defaultReorderQuantity]);
  useEffect(() => { try { localStorage.setItem('inventory_notifications', JSON.stringify(notifications)); } catch (e) { console.error(e) } }, [notifications]);

  const logActivity = (action: ActivityLogAction, details: string, oldValue?: string | number, newValue?: string | number) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: currentUser.username,
      action,
      details,
      timestamp: new Date().toISOString(),
      oldValue,
      newValue,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (productId: string, message: string) => {
    // Prevent duplicate unread low-stock notifications for the same product
    const existingNotification = notifications.find(n => n.productId === productId && n.type === 'low_stock' && !n.read);
    if (existingNotification) {
      return;
    }

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      type: 'low_stock',
      message,
      productId,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => n.read ? n : { ...n, read: true }));
  };

  const handleLogin = (username: string, password: string) => {
    const user = users.find(u => u.username.trim().toLowerCase() === username.trim().toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      setLoginError(null);
      // Manually create log entry as logActivity relies on `currentUser` state, which is not updated yet in this render.
      const newLog: ActivityLog = {
        id: `log-${Date.now()}`,
        user: user.username,
        action: 'LOGIN',
        details: `User ${user.username} logged in.`,
        timestamp: new Date().toISOString(),
      };
      setActivityLogs(prev => [newLog, ...prev]);
    } else {
      setLoginError('Usuário ou senha inválidos.');
    }
  };

  const handleLogout = () => {
    logActivity('LOGOUT', `User ${currentUser?.username} logged out.`);
    setCurrentUser(null);
  };

  const handleAddProductClick = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      logActivity('DELETE_PRODUCT', productToDelete.name, productToDelete.quantity);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveProduct = (product: Product) => {
    const isEditing = products.some(p => p.id === product.id);
    const oldProduct = isEditing ? products.find(p => p.id === product.id) : undefined;
    
    let logDetails = product.name;
    const changes = [];
    if (isEditing && oldProduct) {
        if(oldProduct.costPrice !== product.costPrice) changes.push(`Preço de Custo: R$ ${oldProduct.costPrice.toFixed(2)} -> R$ ${product.costPrice.toFixed(2)}`);
        if(oldProduct.location !== product.location) changes.push(`Localização: ${oldProduct.location} -> ${product.location}`);
        if(oldProduct.quantity !== product.quantity) logActivity('UPDATE_PRODUCT_QUANTITY', product.name, oldProduct.quantity, product.quantity);

        if (changes.length > 0) {
            logDetails += ` (${changes.join(', ')})`;
        }
    }
     
    const productWithHistory = { ...product };
    if (isEditing && oldProduct && oldProduct.costPrice !== product.costPrice) {
        productWithHistory.priceHistory = [...(oldProduct.priceHistory || []), { costPrice: product.costPrice, date: new Date().toISOString() }];
    }
    
    if (oldProduct && product.quantity <= lowStockThreshold && oldProduct.quantity > lowStockThreshold) {
        addNotification(product.id, `Estoque baixo para "${product.name}". Quantidade: ${product.quantity}.`);
    }

    if (isEditing) {
      setProducts(products.map(p => p.id === product.id ? productWithHistory : p));
      logActivity('UPDATE_PRODUCT', logDetails);
    } else {
      setProducts([productWithHistory, ...products]);
      logActivity('CREATE_PRODUCT', product.name);
    }
    setIsProductModalOpen(false);
    setProductToEdit(null);
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number, oldQuantity: number) => {
      const product = products.find(p => p.id === productId);
      if (product) {
          if (newQuantity >= 0) {
              setProducts(products.map(p => p.id === productId ? {...p, quantity: newQuantity, lastUpdated: new Date().toISOString()} : p));
              logActivity('UPDATE_PRODUCT_QUANTITY', product.name, oldQuantity, newQuantity);

              if (newQuantity <= lowStockThreshold && oldQuantity > lowStockThreshold) {
                addNotification(product.id, `Estoque baixo para "${product.name}". Quantidade atual: ${newQuantity}.`);
              }
          }
      }
  };
  
  const handleAddCategory = (category: string) => {
      if (!categories.some(c => c.toLowerCase() === category.toLowerCase())) {
          setCategories(prev => [...prev, category].sort());
          logActivity('ADD_CATEGORY', category);
      }
  };
  
  const handleUpdateCategory = (oldCategory: string, newCategory: string) => {
      if (oldCategory !== newCategory && !categories.some(c => c.toLowerCase() === newCategory.toLowerCase())) {
          setCategories(categories.map(c => c === oldCategory ? newCategory : c).sort());
          setProducts(products.map(p => p.category === oldCategory ? { ...p, category: newCategory } : p));
          logActivity('UPDATE_CATEGORY', `de "${oldCategory}" para "${newCategory}"`);
      }
  };
  
  const handleDeleteCategory = (category: string) => {
      if (products.some(p => p.category === category)) {
          alert('Não é possível deletar uma categoria que está em uso por produtos.');
          return;
      }
      setCategories(categories.filter(c => c !== category));
      logActivity('DELETE_CATEGORY', category);
  };

  const handleAddLocation = (location: string) => {
      if (!locations.some(l => l.toLowerCase() === location.toLowerCase())) {
          setLocations(prev => [...prev, location].sort());
          logActivity('ADD_LOCATION', location);
      }
  };

  const handleUpdateLocation = (oldLocation: string, newLocation: string) => {
      if (oldLocation !== newLocation && !locations.some(l => l.toLowerCase() === newLocation.toLowerCase())) {
          setLocations(locations.map(l => l === oldLocation ? newLocation : l).sort());
          setProducts(products.map(p => p.location === oldLocation ? { ...p, location: newLocation } : p));
          logActivity('UPDATE_LOCATION', `de "${oldLocation}" para "${newLocation}"`);
      }
  };

  const handleDeleteLocation = (location: string) => {
      if (products.some(p => p.location === location)) {
          alert('Não é possível deletar uma localização que está em uso por produtos.');
          return;
      }
      setLocations(locations.filter(l => l !== location));
      logActivity('DELETE_LOCATION', location);
  };

  const handleAddSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplier, id: `sup-${Date.now()}` };
    setSuppliers(prev => [...prev, newSupplier]);
    logActivity('ADD_SUPPLIER', newSupplier.name);
  };

  const handleUpdateSupplier = (supplier: Supplier) => {
    setSuppliers(suppliers.map(s => s.id === supplier.id ? supplier : s));
    logActivity('UPDATE_SUPPLIER', supplier.name);
  };

  const handleDeleteSupplier = (supplierId: string) => {
    if (products.some(p => p.supplierIds.includes(supplierId))) {
      alert('Não é possível deletar um fornecedor que está associado a produtos.');
      return;
    }
    const supplier = suppliers.find(s => s.id === supplierId);
    if (supplier) {
        setSuppliers(suppliers.filter(s => s.id !== supplierId));
        logActivity('DELETE_SUPPLIER', supplier.name);
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} error={loginError} />;
  }

  const pageTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    products: 'Gerenciamento de Produtos',
    reports: 'Relatórios e Análises',
    activity: 'Log de Atividades',
    settings: 'Configurações',
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard products={products} lowStockThreshold={lowStockThreshold} />;
      case 'products':
        return <ProductList products={products} onEdit={handleEditProduct} onDelete={handleDeleteProduct} onUpdateQuantity={handleUpdateQuantity} />;
      case 'reports':
        return <Reports products={products} logs={activityLogs} categories={categories} />;
      case 'activity':
        return <ActivityLogPage logs={activityLogs} currentUser={currentUser} />;
      case 'settings':
        return <Settings 
                    users={users} 
                    setUsers={setUsers}
                    currentUser={currentUser}
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    locations={locations}
                    onAddLocation={handleAddLocation}
                    onUpdateLocation={handleUpdateLocation}
                    onDeleteLocation={handleDeleteLocation}
                    suppliers={suppliers}
                    onAddSupplier={handleAddSupplier}
                    onUpdateSupplier={handleUpdateSupplier}
                    onDeleteSupplier={handleDeleteSupplier}
                    lowStockThreshold={lowStockThreshold}
                    onLowStockThresholdChange={setLowStockThreshold}
                    defaultReorderQuantity={defaultReorderQuantity}
                    onDefaultReorderQuantityChange={setDefaultReorderQuantity}
                    logActivity={logActivity}
                />;
      default:
        return <div>Página não encontrada</div>;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary font-sans overflow-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onAddProductClick={handleAddProductClick}
          title={pageTitles[activePage] || 'Estoque'}
          showAddProductButton={activePage === 'products'}
          currentUser={currentUser}
          onLogout={handleLogout}
          onMenuClick={() => setIsSidebarOpen(true)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 md:p-10">
          {renderContent()}
        </main>
      </div>

      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
        locations={locations}
        suppliers={suppliers}
        defaultReorderQuantity={defaultReorderQuantity}
      />

      {productToDelete && (
        <ConfirmationModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteProduct}
          title="Confirmar Exclusão de Produto"
          itemName={productToDelete.name}
        />
      )}
    </div>
  );
}

export default App;