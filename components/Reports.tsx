

import React, { useState, useMemo } from 'react';
import { Product, ActivityLog, Category } from '../types';
import { exportToPdf, exportToExcel } from '../services/exportService';
import { getInventoryAnalysis } from '../services/inventoryAnalysisService';
import { FileTextIcon } from './icons/FileTextIcon';
import { FileSpreadsheetIcon } from './icons/FileSpreadsheetIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';

interface ReportsProps {
  products: Product[];
  logs: ActivityLog[];
  categories: Category[];
}

const Reports: React.FC<ReportsProps> = ({ products, logs, categories }) => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(p => selectedCategory === 'all' || p.category === selectedCategory);
  }, [products, selectedCategory]);

  const categoryCount = filteredProducts.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handlePdfExport = () => {
    exportToPdf(filteredProducts);
  };

  const handleExcelExport = () => {
    exportToExcel(filteredProducts);
  };

  const handleAnalysisRequest = async () => {
    setIsAnalyzing(true);
    setAnalysis('');
    try {
      const result = await getInventoryAnalysis(filteredProducts, { start: startDate, end: endDate }, selectedCategory);
      setAnalysis(result);
    } catch (error) {
      setAnalysis('Ocorreu um erro ao gerar a análise.');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const movementData = useMemo(() => {
    let entradas = 0;
    let saidas = 0;
    let detailedMovements: any[] = [];

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if(start) start.setHours(0,0,0,0);
    if(end) end.setHours(23,59,59,999);

    const relevantLogs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        const isAfterStart = start ? logDate >= start : true;
        const isBeforeEnd = end ? logDate <= end : true;
        
        const isMovementAction = ['UPDATE_PRODUCT_QUANTITY', 'DELETE_PRODUCT'].includes(log.action);

        return isAfterStart && isBeforeEnd && isMovementAction;
    });

    for (const log of relevantLogs) {
        const productName = log.details;
        let movement = 0;
        
        const product = products.find(p => p.name === productName);
        const productCategory = product?.category || 'N/A';
        
        if (selectedCategory !== 'all' && productCategory !== selectedCategory) {
            continue;
        }
        
        if (log.action === 'UPDATE_PRODUCT_QUANTITY') {
            const oldQty = Number(log.oldValue) || 0;
            const newQty = Number(log.newValue) || 0;
            movement = newQty - oldQty;
        } else if (log.action === 'DELETE_PRODUCT') {
            const oldQty = Number(log.oldValue) || 0;
            movement = -oldQty;
        }

        if (movement > 0) entradas += movement;
        else if (movement < 0) saidas += Math.abs(movement);

        if (movement !== 0) {
            detailedMovements.push({ ...log, productName, movement });
        }
    }
    
    // FIX: Use .getTime() for correct date comparison in sort, resolving arithmetic operation type error.
    return { entradas, saidas, balanco: entradas - saidas, movements: detailedMovements.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) };
  }, [logs, products, startDate, endDate, selectedCategory]);
  

  const tabs = [
    { id: 'general', label: 'Relatório Geral' },
    { id: 'movements', label: 'Relatório de Movimentações' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
        <style>{`
            .report-filters input[type="date"], 
            .report-filters select {
                color: #1A1D21; /* text-primary from theme */
            }
            /* Fix for Webkit browsers showing gray text in date inputs */
            .report-filters input[type="date"]::-webkit-datetime-edit {
                color: #1A1D21;
            }
        `}</style>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-text-primary">Relatórios</h2>
            <div className="flex border-b border-border">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 px-5 font-semibold transition-colors duration-200 focus:outline-none ${
                            activeTab === tab.id 
                            ? 'border-b-2 border-primary text-primary' 
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-card p-4 rounded-xl shadow-sm border border-border report-filters">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-sm font-medium text-text-secondary">Data Início</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 p-2 border border-border rounded-lg" />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary">Data Fim</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full mt-1 p-2 border border-border rounded-lg" />
                </div>
                <div>
                    <label className="text-sm font-medium text-text-secondary">Categoria</label>
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full mt-1 p-2 border border-border rounded-lg bg-white">
                        <option value="all">Todas as Categorias</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {activeTab === 'general' && (
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-xl font-bold text-text-primary">Análise Geral</h3>
                    <div className="flex space-x-3">
                        <button onClick={handlePdfExport} className="bg-red-50 text-red-700 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-all duration-300 flex items-center"><FileTextIcon className="w-5 h-5 mr-2" />PDF</button>
                        <button onClick={handleExcelExport} className="bg-green-50 text-green-700 font-semibold py-2 px-4 rounded-lg hover:bg-green-100 transition-all duration-300 flex items-center"><FileSpreadsheetIcon className="w-5 h-5 mr-2" />Excel</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-text-primary mb-3">Produtos por Categoria (Filtro)</h3>
                    <ul className="max-h-80 overflow-y-auto pr-2">
                        {Object.entries(categoryCount).sort(([, a], [, b]) => b - a).map(([category, count]) => (
                        <li key={category} className="flex justify-between py-1 text-sm text-text-secondary">
                            <span>{category}</span>
                            <span className="font-bold">{count}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-border">
                        <h3 className="font-semibold text-text-primary mb-3">Análise de Inventário com IA</h3>
                        <button onClick={handleAnalysisRequest} disabled={isAnalyzing} className="bg-primary/10 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary/20 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-wait"><TrendingUpIcon className="w-5 h-5 mr-2"/>{isAnalyzing ? 'Analisando...' : 'Gerar Análise'}</button>
                        {isAnalyzing && <p className="mt-4 text-sm text-text-secondary">Aguarde, a IA está processando os dados...</p>}
                        {analysis && <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-text-secondary whitespace-pre-wrap font-sans">{analysis}</div>}
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'movements' && (
            <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                <h3 className="text-xl font-bold text-text-primary mb-5">Relatório de Movimentação no Período</h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="p-4 bg-green-50 rounded-lg"><p className="text-sm text-green-700">Entradas</p><p className="text-2xl font-bold text-green-800">{movementData.entradas}</p></div>
                    <div className="p-4 bg-red-50 rounded-lg"><p className="text-sm text-red-700">Saídas</p><p className="text-2xl font-bold text-red-800">{movementData.saidas}</p></div>
                    <div className="p-4 bg-blue-50 rounded-lg"><p className="text-sm text-blue-700">Balanço</p><p className={`text-2xl font-bold ${movementData.balanco >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{movementData.balanco}</p></div>
                </div>
                <h4 className="font-semibold text-text-primary mb-3">Detalhes das Movimentações</h4>
                <div className="max-h-96 overflow-y-auto border border-border rounded-lg">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-slate-50 sticky top-0"><tr><th className="px-4 py-2 text-left text-xs font-bold text-text-secondary uppercase">Data</th><th className="px-4 py-2 text-left text-xs font-bold text-text-secondary uppercase">Produto</th><th className="px-4 py-2 text-left text-xs font-bold text-text-secondary uppercase">Usuário</th><th className="px-4 py-2 text-left text-xs font-bold text-text-secondary uppercase">Movimentação</th></tr></thead>
                        <tbody className="bg-white divide-y divide-border">
                            {movementData.movements.map(log => (
                                <tr key={log.id}>
                                    <td className="px-4 py-2 text-sm text-text-secondary">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                                    <td className="px-4 py-2 text-sm font-medium text-text-primary">{log.productName}</td>
                                    <td className="px-4 py-2 text-sm text-text-secondary">{log.user}</td>
                                    <td className={`px-4 py-2 text-sm font-bold ${log.movement > 0 ? 'text-success' : 'text-danger'}`}>{log.movement > 0 ? `+${log.movement}` : log.movement}</td>
                                </tr>
                            ))}
                            {movementData.movements.length === 0 && (<tr><td colSpan={4} className="text-center py-8 text-text-secondary">Nenhuma movimentação encontrada para os filtros selecionados.</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
  );
};

export default Reports;