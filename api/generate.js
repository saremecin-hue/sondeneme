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
      "Sen ileri düzey bir edebiyat profesörü ve stil analiz uzmanısın...";

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

    const data = await response.json();

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
