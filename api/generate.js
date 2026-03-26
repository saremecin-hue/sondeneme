document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("generateBtn").addEventListener("click", async () => {

    console.log("butona basıldı"); // TEST

    const yazar1 = document.getElementById("yazar1").value;
    const yazar2 = document.getElementById("yazar2").value;
    const tema = document.getElementById("temaSec")?.value || "genel";

    const prompt = `
    ${yazar1} ve ${yazar2} arasında "${tema}" temalı edebi diyalog oluştur.
    400-600 kelime olsun.
    Sonunda analiz ekle.
    `;

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    console.log(data); // TEST

    document.querySelector("#donem .result p").innerText =
      data.choices?.[0]?.message?.content || "Hata oluştu";

  });

});
