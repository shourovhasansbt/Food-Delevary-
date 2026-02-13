
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const TRANSACTION_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: 'Date and time of transaction' },
      type: { type: Type.STRING, description: 'Collection, Delivery Charge, or Payment' },
      id: { type: Type.STRING, description: 'Transaction ID or Reference' },
      amount: { type: Type.NUMBER, description: 'Amount in BDT' }
    },
    required: ['date', 'type', 'id', 'amount'],
    propertyOrdering: ["date", "type", "id", "amount"]
  }
};

export const extractTransactions = async (
  input: string | { data: string; mimeType: string }
): Promise<Transaction[]> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze this delivery rider's statement (it could be an image of an app or a text log). 
  Extract every transaction: Date/Time, Transaction Type, Amount (in BDT), and the Transaction ID.
  
  Map the types strictly to:
  - 'Collection' (Money collected from customer)
  - 'Delivery Charge' (Earnings for the rider)
  - 'Payment' (Rider making a payment to company)
  
  Return the results as a valid JSON array matching the requested schema.`;

  try {
    let contents: any;
    if (typeof input === 'string') {
      contents = { parts: [{ text: prompt }, { text: input }] };
    } else {
      contents = {
        parts: [
          { text: prompt },
          { inlineData: { data: input.data, mimeType: input.mimeType } }
        ]
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: TRANSACTION_SCHEMA,
      },
    });

    const jsonStr = response.text || '[]';
    const parsed = JSON.parse(jsonStr);
    
    // Normalize types to enum
    return parsed.map((item: any) => ({
      ...item,
      type: normalizeType(item.type)
    }));
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to process transaction data. Please ensure the screenshot or text is clear.");
  }
};

const normalizeType = (type: string): TransactionType => {
  const t = type.toLowerCase();
  if (t.includes('collect')) return TransactionType.COLLECTION;
  if (t.includes('charge') || t.includes('earn')) return TransactionType.DELIVERY_CHARGE;
  if (t.includes('pay')) return TransactionType.PAYMENT;
  return TransactionType.OTHER;
};
