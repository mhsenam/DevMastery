import { GoogleGenAI, Type } from "@google/genai";
import { DailyPlanResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSmartPlan = async (objective: string): Promise<DailyPlanResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a actionable checklist of 3-4 specific, high-impact tasks to achieve this primary objective: "${objective}". 
      The tasks should be geared towards a senior software engineer. 
      Assign realistic XP (Experience Points) between 10 and 50 based on difficulty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  xp: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return { tasks: [] };
    
    return JSON.parse(text) as DailyPlanResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      tasks: [
        { title: "Plan Generation Failed", description: "Could not connect to AI. Try again later.", xp: 0 }
      ]
    };
  }
};