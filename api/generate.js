document.addEventListener("DOMContentLoaded", () => {

  const authors = {
    divan: ["Rastgele"],
    tanzimat: ["Rastgele","Namık Kemal"],
    fecri: ["Rastgele","Ahmet Haşim"],
    servet: ["Rastgele","Halit Ziya Uşaklıgil"],
    cumhuriyet: ["Rastgele","Ahmet Hamdi Tanpınar","Peyami Safa","Sabahattin Ali"],
    gecis: ["Rastgele"],
    islamiyet: ["Rastgele"],
    halk: ["Rastgele"],
    milli: ["Rastgele","Ömer Seyfettin"]
  };

  function updateAuthors(num) {
    const donem = document.getElementById("donem" + num).value;
    const yazarSelect = document.getElementById("yazar" + num);

    yazarSelect.innerHTML = "";

    authors[donem].forEach(y => {
      const option = document.createElement("option");
      option.textContent = y;
      yazarSelect.appendChild(option);
    });
  }

  window.updateAuthors = updateAuthors;

  updateAuthors(1);
  updateAuthors(2);

  window.openSection = function(id) {
    document.getElementById('home').style.display = 'none';
    document.getElementById('donem').style.display = 'none';
    document.getElementById('yazar').style.display = 'none';
    document.getElementById('tema').style.display = 'none';
    document.getElementById(id).style.display = 'block';
  };

  window.goHome = function() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('donem').style.display = 'none';
    document.getElementById('yazar').style.display = 'none';
    document.getElementById('tema').style.display = 'none';
  };

  // 🔥 METİN OLUŞTUR BUTONU
  const btn = document.getElementById("generateBtn");

  if (btn) {
    btn.addEventListener("click", async () => {

      console.log("butona basıldı");

      const yazar1 = document.getElementById("yazar1").value;
      const yazar2 = document.getElementById("yazar2").value;
      const tema = document.getElementById("temaSec")?.value || "genel";

      const resultBox = document.querySelector("#donem .result p");
      resultBox.innerText = "Metin oluşturuluyor... ⏳";

      const prompt = `
      ${yazar1} ve ${yazar2} arasında "${tema}" temalı edebi bir diyalog oluştur.
      400-600 kelime olsun.
      Sonunda kısa bir karşılaştırma analizi ekle.
      `;

      try {

        const res = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        console.log("API cevabı:", data);

        if (data.error) {
          resultBox.innerText = "API Hatası: " + data.error;
          return;
        }

        resultBox.innerText =
          data.choices?.[0]?.message?.content || "Boş cevap geldi";

      } catch (err) {
        resultBox.innerText = "Bağlantı hatası: " + err.message;
      }

    });
  }

});
