

// @ts-nocheck
// Note: This file uses jsPDF, jspdf-autotable, and xlsx.
// These libraries would need to be installed:
// npm install jspdf jspdf-autotable xlsx

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Product } from '../types';

export const exportToPdf = (products: Product[]) => {
  const doc = new jsPDF();
  
  doc.text("Relatório de Estoque", 14, 16);
  
  const tableColumn = ["ID", "Nome", "Categoria", "Quantidade", "Preço de Custo", "Última Atualização"];
  const tableRows: any[][] = [];

  products.forEach(product => {
    const productData = [
      product.id,
      product.name,
      product.category,
      product.quantity,
      product.costPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      new Date(product.lastUpdated).toLocaleString('pt-BR'),
    ];
    tableRows.push(productData);
  });

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save('relatorio_estoque.pdf');
};

export const exportToExcel = (products: Product[]) => {
  const worksheet = XLSX.utils.json_to_sheet(products.map(p => ({
      ID: p.id,
      Nome: p.name,
      Categoria: p.category,
      Quantidade: p.quantity,
      'Preço de Custo': p.costPrice,
      Descrição: p.description,
      'Última Atualização': new Date(p.lastUpdated).toLocaleString('pt-BR')
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Produtos');
  
  XLSX.writeFile(workbook, 'relatorio_estoque.xlsx');
};