// --- API ANAHTARINI BURAYA YAPIŞTIR ---
const apiKey = "BURAYA_API_KEY_YAPISTIR"; 

// Görüntülenecek Para Birimleri Listesi (12 Adet)
const currenciesToShow = [
    { code: "USD", name: "ABD Doları" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "İngiliz Sterlini" },
    { code: "CHF", name: "İsviçre Frangı" },
    { code: "CAD", name: "Kanada Doları" },
    { code: "AUD", name: "Avustralya Doları" },
    { code: "JPY", name: "Japon Yeni" },
    { code: "SAR", name: "Suudi Arabistan Riyali" },
    { code: "RUB", name: "Rus Rublesi" },
    { code: "AZN", name: "Azerbaycan Manatı" },
    { code: "SEK", name: "İsveç Kronu" },
    { code: "CNY", name: "Çin Yuanı" }
];

const grid = document.getElementById('currencyGrid');
const lastUpdate = document.getElementById('lastUpdate');

async function fetchRates() {
    // TRY tabanlı veri çekiyoruz (Base: TRY)
    // Bu sayede 1 TRY'nin diğer paralardaki karşılığını alacağız.
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/TRY`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.result === "success") {
            renderCards(data.conversion_rates);
            updateTime();
        } else {
            console.error("API Hatası:", data["error-type"]);
            lastUpdate.innerText = "Hata: API Key Kontrol Edin!";
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
        lastUpdate.innerText = "Bağlantı Hatası!";
    }
}

function renderCards(rates) {
    grid.innerHTML = ""; // Ekranı temizle

    currenciesToShow.forEach(currency => {
        // API bize '1 TRY = 0.034 USD' verir.
        // Bizim ekranda görmek istediğimiz: '1 USD = 29.xx TL'
        // Bu yüzden matematiksel olarak (1 / Gelen Değer) işlemini yapıyoruz.
        
        const rawRate = rates[currency.code];
        
        // Eğer kur verisi varsa hesapla
        if (rawRate) {
            const calculatedRate = (1 / rawRate).toFixed(3); // Virgülden sonra 3 hane (Örn: 28.154)
            
            // HTML Kartını oluştur
            const cardHTML = `
                <div class="card">
                    <div class="card-header">
                        <img src="https://flagsapi.com/${getCountryCode(currency.code)}/flat/64.png" alt="${currency.code}">
                        <div class="currency-info">
                            <h3>${currency.code}</h3>
                            <p>${currency.name}</p>
                        </div>
                    </div>
                    <div class="rate">${calculatedRate} ₺</div>
                    <div class="trend">
                        <i class="fa-solid fa-chart-line"></i>
                        <span>Anlık Veri</span>
                    </div>
                </div>
            `;
            
            grid.insertAdjacentHTML('beforeend', cardHTML);
        }
    });
}

// Para Birimi Kodu -> Ülke Kodu Eşleştirici (Bayraklar için)
function getCountryCode(currencyCode) {
    const codes = {
        "USD": "US", // Amerika
        "EUR": "EU", // Avrupa Birliği
        "GBP": "GB", // İngiltere
        "CHF": "CH", // İsviçre
        "CAD": "CA", // Kanada
        "AUD": "AU", // Avustralya
        "JPY": "JP", // Japonya
        "SAR": "SA", // Suudi Arabistan
        "RUB": "RU", // Rusya
        "AZN": "AZ", // Azerbaycan
        "SEK": "SE", // İsveç
        "CNY": "CN"  // Çin
    };
    // Eğer listede yoksa varsayılan olarak US bayrağı göster
    return codes[currencyCode] || "US"; 
}

function updateTime() {
    const now = new Date();
    // Saati Türkçe formatta yazdır
    lastUpdate.innerText = "Son Güncelleme: " + now.toLocaleTimeString('tr-TR');
}

// Sayfa açılınca verileri çek
fetchRates();

// Her 60 saniyede bir verileri otomatik yenile
setInterval(fetchRates, 60000);
