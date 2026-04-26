export default async function handler(req, res) {
  const { prompt, y1_analiz, y2_analiz, donem_bilgisi } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `Sen bir edebiyat uzmanısın. Yazarların sayısal üslup verilerine ve tematik yaklaşımlarına göre diyalog üretirsin.
          
          VERİ KAYNAKLARI:
          Yazar 1 Bilgileri: ${JSON.stringify(y1_analiz)}
          Yazar 2 Bilgileri: ${JSON.stringify(y2_analiz)}
          Dönem Rehberi: ${donem_bilgisi}

          TALİMAT: 'avg_sentence_length' yüksekse uzun cümle kur. Tematik verilere göre yazarın karakterini yansıt.` 
        },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
