import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;
const USE_KEYLESS = process.env.USE_KEYLESS === 'on'; 

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({
    app: 'InfoHub API',
    endpoints: ['/api/health', '/api/quote', '/api/weather', '/api/currency']
  });
});


app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const localQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "Believe you can and you're halfway there.",
  "The only way to do great work is to love what you do.",
  "What we know is a drop, what we don't know is an ocean.",
  "Dream big. Start small. Act now."
];

app.get('/api/quote', async (req, res) => {
  try {
    if (process.env.QUOTES_API === 'on') {
      try {
        const resp = await axios.get('https://api.quotable.io/random', { timeout: 5000 });
        const content = resp?.data?.content;
        if (content) return res.json({ quote: content, source: 'quotable' });
      } catch (err) {
        console.warn("External quotes API failed, falling back to local.");
      }
    }
    const idx = Math.floor(Math.random() * localQuotes.length);
    res.json({ quote: localQuotes[idx], source: 'local' });
  } catch {
    res.status(500).json({ error: 'Could not fetch quote.' });
  }
});

app.get('/api/weather', async (req, res) => {
  try {
    const rawCity = (req.query.city || 'Mumbai,IN').toString();
    const cityNameOnly = rawCity.split(',')[0];
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (apiKey && !USE_KEYLESS) {
      const { data } = await axios.get(
        'https://api.openweathermap.org/data/2.5/weather',
        { params: { q: rawCity, appid: apiKey, units: 'metric' }, timeout: 8000 }
      );
      return res.json({
        city: data?.name,
        temperature: data?.main?.temp,
        feelsLike: data?.main?.feels_like,
        condition: data?.weather?.[0]?.description,
        humidity: data?.main?.humidity,
        source: 'openweather'
      });
    }

    
    const gw = await axios.get(
      `https://goweather.herokuapp.com/weather/${encodeURIComponent(cityNameOnly)}`
    );
    const tempStr = gw?.data?.temperature || '';
    const match = tempStr.match(/-?\d+(\.\d+)?/);
    const tempC = match ? Number(match[0]) : null;

    res.json({
      city: cityNameOnly,
      temperature: tempC,
      feelsLike: null,
      condition: gw?.data?.description || 'N/A',
      humidity: null,
      source: 'keyless'
    });
  } catch (err) {
    console.error("Weather API Error:", err?.message);
    res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});


app.get('/api/currency', async (req, res) => {
  try {
    const amount = Number(req.query.amount || 100);
    if (isNaN(amount) || amount < 0) {
      return res.status(400).json({ error: 'Invalid amount provided.' });
    }

    const tryProviders = async () => {
      const providers = [
        async () => {
          const { data } = await axios.get(
            'https://api.exchangerate.host/latest',
            { params: { base: 'INR', symbols: 'USD,EUR' }, timeout: 8000 }
          );
          return data?.rates;
        },
        async () => {
          const { data } = await axios.get(
            'https://api.frankfurter.app/latest',
            { params: { from: 'INR', to: 'USD,EUR' }, timeout: 8000 }
          );
          return data?.rates;
        },
        async () => {
          const { data } = await axios.get(
            'https://open.er-api.com/v6/latest/INR',
            { timeout: 8000 }
          );
          return data?.rates;
        }
      ];

      for (const provider of providers) {
        try {
          const rates = await provider();
          if (rates?.USD && rates?.EUR) {
            return rates;
          }
        } catch {}
      }
      return null;
    };

    const rates = await tryProviders();
    if (!rates) return res.status(502).json({ error: 'Currency service unavailable' });

    res.json({
      amountInINR: amount,
      usd: +(amount * rates.USD).toFixed(2),
      eur: +(amount * rates.EUR).toFixed(2),
      source: 'multi-provider'
    });
  } catch (err) {
    console.error("Currency error:", err.message);
    res.status(500).json({ error: 'Could not fetch currency rates.' });
  }
});


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
