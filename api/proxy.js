export default async function handler(req, res) {
  // CORS Error မတက်စေရန် ခွင့်ပြုချက်များ သတ်မှတ်ခြင်း
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight (OPTIONS) များကို ချက်ချင်း အောင်မြင်ကြောင်း ပြန်ပို့ခြင်း
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // POST method မဟုတ်ပါက ပိတ်ပင်ခြင်း
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiUrl = 'https://api.cloudflareclient.com/v0a737/reg';

  try {
    // Cloudflare သို့ WARP Android App အယောင်ဆောင်၍ လှမ်းတောင်းခြင်း
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.12.1',
        'Accept': 'application/json',
        'CF-Client-Version': 'a-6.30-3307'
      },
      body: JSON.stringify(req.body) // Webpage မှ ရလာသော Payload အတိုင်း ပြန်ပို့ခြင်း
    });

    const data = await response.json();
    
    // Cloudflare မှ ပြန်ပေးသော Data အား Webpage ဆီသို့ ပြန်ပို့ပေးခြင်း
    return res.status(response.status).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Cloudflare API.', details: error.message });
  }
}
