import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Product } from './types';

interface DashboardProps {
    products: Product[];
    lowStockThreshold: number;
}

const tailwindColors = {
    primary: '#4A90E2',
    secondary: '#6B7280',
    danger: '#E14A4A',
    success: '#34D399',
    warning: '#FBBF24',
    blue: '#3b82f6',
    indigo: '#6366f1',
    purple: '#8b5cf6',
    pink: '#ec4899',
    teal: '#14b8a6',
};

const chartColors = [
    tailwindColors.primary,
    tailwindColors.blue,
    tailwindColors.teal,
    tailwindColors.purple,
    tailwindColors.warning,
    tailwindColors.indigo,
    tailwindColors.pink,
];

// Helper to format currency
const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const Dashboard: React.FC<DashboardProps> = ({ products, lowStockThreshold }) => {
    const totalValueChartRef = useRef<HTMLCanvasElement>(null);
    const topProductsChartRef = useRef<HTMLCanvasElement>(null);
    const categoryRepresentationChartRef = useRef<HTMLCanvasElement>(null);
    // FIX: Use a more specific type for chart instances to avoid 'unknown' type errors.
    const chartInstances = useRef<{
        totalValue?: Chart;
        topProducts?: Chart;
        categoryRepresentation?: Chart;
    }>({});

    useEffect(() => {
        // Cleanup function to destroy all charts on component unmount
        return () => {
            Object.values(chartInstances.current).forEach(chart => chart?.destroy());
        };
    }, []);

    // Chart 1: Inventory Value by Category
    useEffect(() => {
        if (!products.length || !totalValueChartRef.current) return;
        
        const data = products.reduce((acc, p) => {
            // FIX: Use 'costPrice' instead of 'price' to match the Product type.
            const value = p.costPrice * p.quantity;
            acc[p.category] = (acc[p.category] || 0) + value;
            return acc;
        }, {} as Record<string, number>);

        const ctx = totalValueChartRef.current.getContext('2d');
        if (!ctx) return;
        
        if (chartInstances.current.totalValue) chartInstances.current.totalValue.destroy();

        chartInstances.current.totalValue = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: chartColors,
                    borderColor: '#FFFFFF',
                    borderWidth: 4,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.label}: ${formatCurrency(context.raw as number)}`
                        }
                    }
                }
            }
        });

    }, [products]);
    
    // Chart 2: Top 5 Products by Stock Value
    useEffect(() => {
        if (!products.length || !topProductsChartRef.current) return;

        const topProducts = [...products]
            // FIX: Use 'costPrice' instead of 'price' to match the Product type.
            .sort((a, b) => (b.costPrice * b.quantity) - (a.costPrice * a.quantity))
            .slice(0, 5);
        
        const ctx = topProductsChartRef.current.getContext('2d');
        if (!ctx) return;
        
        if (chartInstances.current.topProducts) chartInstances.current.topProducts.destroy();

        chartInstances.current.topProducts = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topProducts.map(p => p.name.substring(0, 20) + (p.name.length > 20 ? '...' : '')),
                datasets: [{
                    label: 'Valor em Estoque',
                    // FIX: Use 'costPrice' instead of 'price' to match the Product type.
                    data: topProducts.map(p => p.costPrice * p.quantity),
                    backgroundColor: chartColors,
                    borderRadius: 4,
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                     tooltip: {
                        callbacks: {
                            label: (context) => `Valor: ${formatCurrency(context.raw as number)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            callback: (value) => formatCurrency(Number(value))
                        }
                    },
                    y: {
                        grid: { display: false }
                    }
                }
            }
        });
    }, [products]);

    // Chart 3: Category Representation by Item Count
    useEffect(() => {
        if (!products.length || !categoryRepresentationChartRef.current) return;

        const data = products.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const ctx = categoryRepresentationChartRef.current.getContext('2d');
        if (!ctx) return;
        
        if (chartInstances.current.categoryRepresentation) chartInstances.current.categoryRepresentation.destroy();

        chartInstances.current.categoryRepresentation = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: chartColors,
                    borderColor: '#FFFFFF',
                    borderWidth: 4,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                         callbacks: {
                            label: (context) => `${context.label}: ${context.raw} produtos`
                        }
                    }
                }
            }
        });
    }, [products]);
    
    const lowStockProducts = products.filter(p => p.quantity <= lowStockThreshold);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-text-primary mb-4">Valor do Estoque por Categoria</h3>
                <canvas ref={totalValueChartRef}></canvas>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-text-primary mb-4">Top 5 Produtos por Valor</h3>
                <canvas ref={topProductsChartRef}></canvas>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-text-primary mb-4">Representatividade de Categorias</h3>
                <canvas ref={categoryRepresentationChartRef}></canvas>
            </div>
            <div className="bg-card p-6 rounded-xl shadow-lg">
                 <h3 className="text-lg font-bold text-text-primary mb-4">Produtos Abaixo do Mínimo ({lowStockThreshold} un.)</h3>
                 <div className="max-h-64 overflow-y-auto pr-2">
                    {lowStockProducts.length > 0 ? (
                        <ul className="space-y-2">
                            {lowStockProducts.map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm p-3 rounded-lg bg-warning/10">
                                    <span className="text-yellow-800 font-medium">{p.name}</span>
                                    <span className="font-bold text-danger bg-danger/10 px-2.5 py-1 rounded-full">{p.quantity} un.</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-text-secondary text-center mt-10">Nenhum produto com baixo estoque. Bom trabalho!</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
