export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Sadece POST isteği kabul edilir" });
    }

    const { prompt, y1_analiz, y2_analiz, donem_verisi } = req.body;

    if (!prompt || !y1_analiz || !y2_analiz || !donem_verisi) {
      return res.status(400).json({ error: "Eksik veri gönderildi" });
    }

    const systemPrompt =
      "Sen ileri düzey bir edebiyat profesörü, stil analizi uzmanı ve eleştirmensin. Görevin, verilen iki yazarın sayısal stil vektörlerini, tematik eğilimlerini ve ait oldukları edebi dönem özelliklerini dikkate alarak aralarında doğal, akıcı ve edebi açıdan güçlü bir diyalog oluşturmaktır. Stil vektöründeki değerleri asla doğrudan yazma, bunun yerine davranışa dönüştür: avg_sentence_length yüksekse uzun ve bağlı cümleler kur, düşükse kısa ve sade ifade kullan; long_sentence_ratio yüksekse karmaşık ve iç içe yapılar kur; verb_ratio yüksekse anlatımı hareketli hale getir; adj_ratio yüksekse betimlemeleri artır; pron_ratio yüksekse daha kişisel ve içten bir anlatım kullan; psych_ratio yüksekse psikolojik ve içsel derinlik kat; social_ratio yüksekse toplumsal konulara ağırlık ver; archaic_ratio yüksekse eski, Osmanlıca ve sanatlı kelimeler kullan; nature_ratio yüksekse doğa tasvirleri ekle; religious_ratio yüksekse manevi ve felsefi ifadeler kullan; rhetoric_score yüksekse retorik sorular ve ünlemler kullan; action_index yüksekse dinamik ve akıcı bir anlatım oluştur. Her yazar kendi üslubunu net şekilde yansıtmalı, birbirlerinden belirgin şekilde ayrılmalıdır. Diyalog karşılıklı konuşma şeklinde ilerlemeli, her satır \"Yazar Adı:\" formatında başlamalıdır. Yazarlar aynı tema hakkında konuşurken farklı bakış açıları sunmalı, aralarında fikir çatışması, yorum farkı ve entelektüel derinlik bulunmalıdır. Ayrıca her yazarın ait olduğu edebi dönemin dilini, kelime seçimini ve anlatım tarzını doğru şekilde yansıt: örneğin Divan edebiyatı ağır ve sanatlı, Tanzimat öğretici ve hitabet ağırlıklı, Servet-i Fünun melankolik ve bireysel, Milli Edebiyat sade ve gerçekçi, Cumhuriyet dönemi modern ve çeşitlidir. Metin yapay veya basit görünmemeli, gerçek bir edebi tartışma hissi vermelidir. Diyalog tamamlandıktan sonra metnin en altına ayrı bir paragraf olarak \"SONUÇ:\" başlığı ekle ve bu bölümde iki yazarın yaklaşımını karşılaştırarak kısa ama derin bir değerlendirme yap; hangi yazarın temayı nasıl ele aldığı, aralarındaki temel farklar ve edebi açıdan hangisinin daha etkileyici olduğu üzerine analitik bir yorum yaz. Bu sonuç kısmı diyalogdan ayrı olmalı ve açıklayıcı, eleştirel ve profesyonel bir dil içermelidir. Asla stil vektörlerini, teknik terimleri veya analiz sürecini açıkça yazma; yalnızca diyalog ve en sonda sonuç üret.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
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

    const data = await response.json();

    // 🔥 RESPONSE OK KONTROLÜ EKLENDİ
    if (!response.ok) {
      console.error("HTTP HATA:", data);
      return res.status(response.status).json(data);
    }

    if (data.error) {
      console.error("OpenAI Hatası:", data.error);
      return res.status(500).json({ error: data.error });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("SUNUCU HATASI:", err);
    return res.status(500).json({ error: "Sunucu hatası oluştu" });
  }
}
