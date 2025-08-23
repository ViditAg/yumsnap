
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const identifyIngredients = async (base64Image: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: 'Identify all edible food items in this image. Respond ONLY with a JSON object in the format: {"ingredients": ["item1", "item2", ...]}. Do not include any other text or explanations.',
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                  description: "The name of an edible food item.",
                },
              },
            },
          },
        }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.ingredients)) {
        return result.ingredients;
    }
    
    return [];

  } catch (error) {
    console.error("Error identifying ingredients:", error);
    throw new Error("Could not identify ingredients from the image.");
  }
};

export const getRecipesForIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const prompt = `You are a recipe assistant for busy professionals. Given these ingredients: ${ingredients.join(', ')}, suggest 3 quick and easy recipes that take less than 45 minutes to prepare. Respond ONLY with a JSON object in the format: {"recipes": [{"title": "...", "description": "...", "cookingTime": ..., "ingredients": ["...", ...], "instructions": ["...", ...]}]}. Do not include any other text or explanations.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    recipes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                description: { type: Type.STRING },
                                cookingTime: { type: Type.INTEGER },
                                ingredients: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                },
                                instructions: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                },
                            },
                            required: ["title", "description", "cookingTime", "ingredients", "instructions"]
                        },
                    },
                },
            },
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.recipes)) {
      return result.recipes;
    }
    
    return [];

  } catch (error) {
    console.error("Error getting recipes:", error);
    throw new Error("Could not generate recipes.");
  }
};