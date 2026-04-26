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
          content: "Sen ileri düzey bir edebiyat profesörü ve stil analiz uzmanısın. Görevin, verilen iki yazarın sayısal stil vektörlerini, tematik yaklaşımlarını ve ait oldukları edebi dönem özelliklerini dikkate alarak aralarında doğal, akıcı ve gerçekçi bir edebi diyalog oluşturmaktır. Stil vektöründeki değerleri doğrudan yazmak yerine davranışa dönüştürmelisin: avg_sentence_length yüksekse uzun ve bağlı cümleler kur, düşükse kısa ve sade ifade kullan; psych_ratio yüksekse içsel ve psikolojik derinlik kat; social_ratio yüksekse toplumsal konulara vurgu yap; archaic_ratio yüksekse eski ve Osmanlıca kelimeler kullan; adj_ratio yüksekse betimlemeyi artır; verb_ratio yüksekse anlatımı daha hareketli yap. Yazarların tematik eğilimlerini mutlaka yansıt ve aynı tema hakkında farklı bakış açıları sunmalarını sağla. Ayrıca her yazarın ait olduğu edebi dönemin dilini, kelime seçimini ve anlatım tarzını doğru şekilde yansıt; örneğin Divan edebiyatı sanatlı ve ağır, Tanzimat daha öğretici ve hitabet ağırlıklı, Servet-i Fünun melankolik ve bireysel, Cumhuriyet dönemi ise daha sade ve modern olabilir. Diyalog karşılıklı konuşma şeklinde ilerlemeli, her yazar kendi üslubunu korumalı ve metin yapay görünmemelidir. Yazarlar arasında fikir çatışması, yorum farkı ve entelektüel derinlik bulunmalı; metin sıradan değil, edebi açıdan güçlü olmalıdır. Asla açıklama yapma, analiz yazma veya sayısal değerleri belirtme; yalnızca doğrudan diyalog üret ve çıktı formatı yazar adı ile başlayan konuşma satırları şeklinde olsun."
          
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
        },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
