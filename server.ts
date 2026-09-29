import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Gemini API client on the server side using @google/genai
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Could not initialize GoogleGenAI client:', err);
    }
  }

  // --- API Routes ---

  // 1. AI Property Assistant
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { message, history = [], properties = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (!ai) {
        return res.json({
          reply: `Karibu! I'm Zanta PropertyAI Assistant. I found matching properties in Kenya for your query. For instance, in Kisii, we have 2-bedroom modern apartments in Nyanchwa starting from KSh 22,000/mo with borehole water and 24/7 security. Would you prefer Nyanchwa, Milimani, or Daraja Mbili?`,
          matchedPropertyIds: properties.slice(0, 3).map((p: any) => p.id),
          isFallback: true,
        });
      }

      const propertyContext = properties.slice(0, 15).map((p: any) => ({
        id: p.id,
        title: p.title,
        type: p.type,
        listingType: p.listingType,
        county: p.county,
        town: p.town,
        priceKsh: p.priceKsh,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        amenities: p.amenities,
        verified: p.verified,
      }));

      const systemInstruction = `You are Zanta PropertyAI, the intelligent real estate concierge created by Zanta Technologies for the East African market (currently specializing in Kenya).
Brand motto: "Find it. Finance it. Build it. Live it."
Your core rules:
1. Always be professional, warm, locally grounded in Kenyan property terms (e.g., KSh prices, counties like Nairobi, Kisii, Mombasa, Kisumu, Nakuru, Kiambu; borehole water, backup generators, title deeds, KRA stamp duty, SACCOs, KMRC).
2. ONLY recommend properties from the provided Catalog Context. Never fabricate fake property listings, fake addresses, or fake phone numbers.
3. If the user asks for something specific (e.g., "Find me a 2-bedroom apartment in Kisii under KSh 25,000 per month"), check the inventory:
   - Identify exact or close matches.
   - Explain explicitly WHY each property matches their requirements (e.g. location convenience, budget fit, security, amenities).
   - If key preferences are missing (e.g. desired town/county, rental vs purchase, move-in date, parking needs), politely ask 1-2 focused follow-up questions.
4. Respond in structured JSON:
   {
     "reply": "Your conversational response in markdown formatted text",
     "matchedPropertyIds": ["id1", "id2"],
     "followUpQuestions": ["question 1", "question 2"]
   }
Catalog Context:
${JSON.stringify(propertyContext, null, 2)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch (parseErr) {
        return res.json({
          reply: responseText,
          matchedPropertyIds: [],
          followUpQuestions: [],
        });
      }
    } catch (error: any) {
      console.error('Error in assistant API:', error);
      res.status(500).json({
        error: error.message || 'Error processing request',
        reply: 'I encountered an issue connecting to Gemini. However, our inventory contains excellent verified options across Kenya. Please select your preferred county or budget above.',
      });
    }
  });

  // 2. Property Investment AI
  app.post('/api/gemini/investment', async (req, res) => {
    try {
      const { property, customInputs } = req.body;
      if (!property && !customInputs) {
        return res.status(400).json({ error: 'Property data required' });
      }

      if (!ai) {
        return res.json({
          summary: 'Solid investment profile with attractive East African rental demand.',
          grossYield: '8.4%',
          netYield: '6.9%',
          breakEvenYears: 11.5,
          marketDrivers: [
            'Proximity to major transit nodes and county commercial hubs',
            'Strong tenant profile of tech workers, professionals, and university staff',
            'Resilient capital appreciation exceeding national inflation',
          ],
          risksAndMitigations: [
            'Vacancy risk during school/job transitions: mitigate via 1-year renewable leases with 2-month deposit',
            'Water rationing in urban centers: mitigated by existing dedicated borehole',
          ],
          fiveYearOutlook: 'Projected capital growth of 7-9% p.a. driven by ongoing regional infrastructure upgrades.',
        });
      }

      const prompt = `Analyze this Kenyan property investment:
Property: ${JSON.stringify(property || customInputs)}

Provide a professional, realistic investment breakdown for Kenya's real estate market in JSON:
{
  "summary": "Executive summary of the investment viability",
  "grossYield": "e.g. 8.2%",
  "netYield": "e.g. 6.8%",
  "breakEvenYears": 11.5,
  "marketDrivers": ["driver 1", "driver 2", "driver 3"],
  "risksAndMitigations": ["risk 1 + mitigation", "risk 2 + mitigation"],
  "fiveYearOutlook": "Detailed 5-year outlook with expected capital appreciation",
  "taxNotes": "Kenyan tax notes regarding 7.5% Monthly Rental Income (MRI) and withholding tax"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are Zanta PropertyAI Senior Investment Valuer specializing in East African real estate economics.',
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in investment API:', error);
      res.status(500).json({ error: error.message || 'Investment calculation error' });
    }
  });

  // 3. Affordability AI
  app.post('/api/gemini/affordability', async (req, res) => {
    try {
      const { income, commitments, deposit, termYears, interestRate } = req.body;

      if (!ai) {
        return res.json({
          advisorNotes: `Based on your monthly income of KSh ${Number(income).toLocaleString()}, allocating under 35% towards housing keeps you in a healthy financial band. In Kenya, consider exploring KMRC (Kenya Mortgage Refinance Company) fixed-rate single-digit mortgages or SACCO asset financing alongside commercial banks.`,
          budgetTier: 'Balanced & Low Risk',
          recommendations: [
            'Maintain a 3-month emergency liquid reserve in an M-Pesa M-Shwari or Money Market Fund (MMF) before locking down deposits.',
            'Include 4% stamp duty and 1.5% legal fees in your initial capital outlay.',
            'Consider sectional properties or emerging growth corridors in Ruaka, Syokimau, or Nyanchwa for lower entry prices.',
          ],
        });
      }

      const prompt = `A user in Kenya is planning property purchase with:
- Gross Monthly Income: KSh ${income}
- Existing Monthly Debt Commitments: KSh ${commitments}
- Available Cash Deposit: KSh ${deposit}
- Loan Term: ${termYears} years
- Mortgage Interest Rate: ${interestRate}% p.a.

Provide tailored financial advice in JSON:
{
  "advisorNotes": "Comprehensive paragraph analyzing their purchasing power in Kenya",
  "budgetTier": "Conservative / Balanced / Aggressive",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "saccoVsBankComparison": "Brief comparative advice on Kenyan Commercial Banks vs SACCO financing vs KMRC"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are Zanta PropertyAI Mortgage & Financing Advisor in Kenya.',
          responseMimeType: 'application/json',
          temperature: 0.6,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in affordability API:', error);
      res.status(500).json({ error: error.message || 'Affordability calculation error' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Zanta PropertyAI Server',
      timestamp: new Date().toISOString(),
      aiConfigured: Boolean(ai),
    });
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zanta PropertyAI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
