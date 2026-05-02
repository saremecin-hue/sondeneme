export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { prompt, y1_analiz, y2_analiz, donem_verisi } = req.body;

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
            content: "Sen ileri düzey bir edebiyat profesörü ve stil analiz uzmanısın. Görevin, verilen iki yazarın sayısal stil vektörlerini, tematik yaklaşımlarını ve ait oldukları edebi dönem özelliklerini dikkate alarak aralarında doğal, akıcı ve gerçekçi bir edebi diyalog oluşturmaktır. Stil vektöründeki değerleri doğrudan yazmak yerine davranışa dönüştürmelisin: avg_sentence_length yüksekse uzun ve bağlı cümleler kur, düşükse kısa ve sade ifade kullan; psych_ratio yüksekse içsel ve psikolojik derinlik kat; social_ratio yüksekse toplumsal konulara vurgu yap; archaic_ratio yüksekse eski kelimeler kullan. Diyalog karşılıklı, akıcı ve gerçekçi olsun."
          },
          {
            role: "user",
            content: `${prompt}

Yazar 1 Analiz: ${JSON.stringify(y1_analiz)}
Yazar 2 Analiz: ${JSON.stringify(y2_analiz)}
Dönem Bilgisi: ${donem_verisi}`
          }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    const data = await response.json();

    res.status(200).json({
      text: data.choices[0].message.content
    });

  } catch (error) {
    console.error("API HATA:", error);
    res.status(500).json({ error: error.message });
  }
}
