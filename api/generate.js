export default async function handler(req, res) {
  try {
    // Sadece POST kabul et
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Sadece POST isteği kabul edilir" });
    }

    const { prompt, y1_analiz, y2_analiz, donem_verisi } = req.body;

     //Eksik veri kontrolü
    if (!prompt || !y1_analiz || !y2_analiz || !donem_verisi) {
      return res.status(400).json({ error: "Eksik veri gönderildi" });
    }

    // 🔥 DETAYLI SYSTEM PROMPT (TEK PARAGRAF)
    const systemPrompt =
      "Sen ileri düzey bir edebiyat profesörü ve stil analiz uzmanısın. Görevin, verilen iki yazarın sayısal stil vektörlerini, tematik yaklaşımlarını ve ait oldukları edebi dönem özelliklerini dikkate alarak aralarında doğal, akıcı ve gerçekçi bir edebi diyalog oluşturmaktır. Stil vektöründeki değerleri doğrudan yazmak yerine davranışa dönüştürmelisin: avg_sentence_length yüksekse uzun ve bağlı cümleler kur, düşükse kısa ve sade ifade kullan; long_sentence_ratio yüksekse karmaşık ve iç içe cümleler kur; verb_ratio yüksekse anlatımı hareketli yap; adj_ratio yüksekse betimlemeyi artır; pron_ratio yüksekse daha kişisel anlatım kullan; psych_ratio yüksekse içsel ve psikolojik derinlik kat; social_ratio yüksekse toplumsal konulara vurgu yap; archaic_ratio yüksekse eski ve Osmanlıca kelimeler kullan; nature_ratio yüksekse doğa betimlemeleri ekle; religious_ratio yüksekse manevi ifadeler kullan; rhetoric_score yüksekse ünlem ve soru cümleleri kullan; action_index yüksekse dinamik anlatım kur. Yazarların tematik eğilimlerini mutlaka yansıt ve aynı tema hakkında farklı bakış açıları sunmalarını sağla. Ayrıca her yazarın ait olduğu edebi dönemin dilini, kelime seçimini ve anlatım tarzını doğru şekilde yansıt; örneğin Divan edebiyatı sanatlı ve ağır, Tanzimat öğretici ve hitabet ağırlıklı, Servet-i Fünun melankolik ve bireysel, Milli Edebiyat sade ve realist, Cumhuriyet dönemi modern ve çeşitlidir. Diyalog karşılıklı konuşma şeklinde ilerlemeli, her yazar kendi üslubunu korumalı ve metin yapay görünmemelidir. Yazarlar arasında fikir çatışması, yorum farkı ve entelektüel derinlik bulunmalı; metin sıradan değil edebi açıdan güçlü olmalıdır. Asla açıklama yapma, analiz yazma veya sayısal değerleri belirtme; yalnızca doğrudan diyalog üret ve çıktı formatı yazar adı ile başlayan konuşma satırları şeklinde olsun.";

    // 🔥 API İSTEĞİ
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              systemPrompt +
              "\n\nYazar 1 Verileri: " +
              JSON.stringify(y1_analiz) +
              "\n\nYazar 2 Verileri: " +
              JSON.stringify(y2_analiz) +
              "\n\nDönem Bilgisi: " +
              donem_verisi
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9
      })
    });

    const data = await res.json();

console.log("API CEVAP:", data);

if (!data.choices || !data.choices[0]) {
  box.innerText = "Cevap oluşturulamadı";
  return;
}

const content = data.choices[0].message?.content;

if (!content) {
  box.innerText = "Boş cevap geldi";
  return;
}

box.innerHTML = content
  .split("\n")
  .map(line => {
    if (line.includes(":")) {
      const [name, text] = line.split(":");
      return `<div><b>${name}:</b> ${text}</div>`;
    }
    return `<div>${line}</div>`;
  })
  .join("");

    // 🔥 API HATA KONTROLÜ
    if (data.error) {
      console.error("OpenAI Hatası:", data.error);
      return res.status(500).json({ error: data.error });
    }

    // 🔥 BAŞARILI CEVAP
    return res.status(200).json(data);

  } catch (err) {
    console.error("SUNUCU HATASI:", err);
    return res.status(500).json({ error: "Sunucu hatası oluştu" });
  }
}
