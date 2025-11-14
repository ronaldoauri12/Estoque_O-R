import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Per guidelines, API key must be from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string, category: string): Promise<string> => {
    try {
        const prompt = `Gere uma descrição concisa e atrativa para o produto "${productName}" da categoria "${category}". A descrição deve ter no máximo 2 frases e destacar seus principais benefícios ou usos.`;

        // FIX: Explicitly type the response for clarity and adherence to guidelines.
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Basic text task model
            contents: prompt,
        });

        const text = response.text;
        
        if (text) {
            return text.trim();
        }
        
        return "Descrição não gerada.";

    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        return "Erro ao gerar descrição. Tente novamente.";
    }
};