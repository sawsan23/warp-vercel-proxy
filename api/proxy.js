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

  // 💡 ပြင်ဆင်ထားသောအပိုင်း - Version များကို Array ဖြင့် စာရင်းလုပ်ထားခြင်း
  const warpVersions = [
    'a-6.30-3307',
    'a-6.29-3220',
    'a-6.28-3168',
    'a-6.31-3321',
    'a-6.32-3335'
  ];
  
  // 💡 စာရင်းထဲမှ Version တစ်ခုကို ကျပန်း (Random) ရွေးချယ်ခြင်း
  const randomVersion = warpVersions[Math.floor(Math.random() * warpVersions.length)];

  try {
    // Cloudflare သို့ WARP Android App အယောင်ဆောင်၍ လှမ်းတောင်းခြင်း
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'okhttp/3.12.1',
        'Accept': 'application/json',
        'CF-Client-Version': randomVersion // 💡 အသေမထားတော့ဘဲ ရွေးချယ်ထားသော Version ကို အစားထိုးခြင်း
      },
      body: JSON.stringify(req.body) 
    });

    const data = await response.json();
    
    // Cloudflare မှ ပြန်ပေးသော Data အား Webpage ဆီသို့ ပြန်ပို့ပေးခြင်း
    return res.status(response.status).json(data);
    
  } catch (error) {
    return res.status(500).json({ error: 'Failed to connect to Cloudflare API.', details: error.message });
  }
}
