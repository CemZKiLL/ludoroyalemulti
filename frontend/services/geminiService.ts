import { GoogleGenAI, Type } from '@google/genai';
import { AI_PLAYERS, CURRENT_USER } from '../constants';

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
  }

  public async getAIResponses(userMessage: string, context: string): Promise<{ senderId: string, text: string }[]> {
    const prompt = `
      You are simulating a lively chat in a multiplayer Ludo game lobby.
      The players are:
      - ${CURRENT_USER.name} (The real user, playing Red)
      - ${AI_PLAYERS[0].name} (VIP player, playing Green, confident and friendly)
      - ${AI_PLAYERS[1].name} (Admin, playing Blue, authoritative but fun)
      - ${AI_PLAYERS[2].name} (Bot, playing Yellow, talks like a robot)

      Context of the game/chat right now: ${context}
      The user just sent this message/action: "${userMessage}"

      Generate 1 to 2 short, realistic chat responses from the OTHER players reacting to the user or the game state.
      Keep responses under 15 words. Use emojis.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                senderId: {
                  type: Type.STRING,
                  description: `Must be one of: '${AI_PLAYERS[0].id}', '${AI_PLAYERS[1].id}', or '${AI_PLAYERS[2].id}'`
                },
                text: {
                  type: Type.STRING,
                  description: 'The chat message text'
                }
              },
              required: ['senderId', 'text']
            }
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Gemini API Error:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
