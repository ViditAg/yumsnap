
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
              text: 'Analyze this image of a fridge or pantry. Identify all the edible food items. Return the response as a JSON array of strings. Only include the names of the food items.',
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
    const prompt = `I am a young professional who needs quick and easy dinner recipes for after work, ideally under 45 minutes. Based on the following ingredients: ${ingredients.join(', ')}, suggest 3 recipes. For each recipe, provide the title, a short, enticing description (one sentence), the total cooking time in minutes, a list of required ingredients (prioritizing from the provided list), and step-by-step instructions.`;
    
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
