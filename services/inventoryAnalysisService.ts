

import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getInventoryAnalysis = async (
    products: Product[],
    dateRange?: { start?: string, end?: string },
    category?: string
): Promise<string> => {
    try {
        if (products.length === 0) {
            return "Nenhum produto encontrado para os filtros selecionados. Não é possível gerar a análise."
        }
        const productDataSummary = products.map(p => 
            `- ${p.name} (Categoria: ${p.category}, Quantidade: ${p.quantity}, Preço de Custo: R$${p.costPrice.toFixed(2)})`
        ).join('\n');

        const context: string[] = [];
        if (category && category !== 'all') {
            context.push(`A análise deve focar apenas na categoria: "${category}".`);
        }
        if (dateRange && dateRange.start && dateRange.end) {
            const start = new Date(dateRange.start).toLocaleDateString('pt-BR');
            const end = new Date(dateRange.end).toLocaleDateString('pt-BR');
            context.push(`A análise deve considerar o período de ${start} a ${end}.`);
        }

        const prompt = `
          Com base nos seguintes dados do inventário:
          ${productDataSummary}
          
          ${context.length > 0 ? `\nContexto da Análise (LEVE EM CONSIDERAÇÃO):\n${context.join('\n')}\n` : ''}

          Gere uma análise concisa do estoque em português. A análise deve incluir:
          1. Um resumo geral do estado do inventário DENTRO DO CONTEXTO FORNECIDO.
          2. Identificação de categorias com maior/menor número de produtos (se aplicável).
          3. Sugestões de produtos que podem precisar de reposição em breve (baixo estoque).
          4. Insights sobre possíveis produtos "encalhados" (alto estoque).
          5. Uma recomendação estratégica geral (ex: "focar em vender produtos da categoria X", "considerar uma promoção para itens Y").

          A resposta deve ser em texto corrido, formatado para fácil leitura, com no máximo 5 parágrafos.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        
        if (text) {
            return text.trim();
        }
        
        return "Análise não pôde ser gerada.";

    } catch (error) {
        console.error("Error generating inventory analysis with Gemini:", error);
        return "Erro ao gerar análise do inventário. Por favor, tente novamente mais tarde.";
    }
};