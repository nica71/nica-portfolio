// weather.js

let lastWeatherData = null; // кэш последних данных, чтобы не дергать API при каждом переключении языка

async function loadWeather(forceRefetch = false) {
  const tempEl  = document.getElementById("weather-temp");
  const extraEl = document.getElementById("weather-extra");

  if (!tempEl || !extraEl) {
    console.warn("weather.js: элементы #weather-temp или #weather-extra не найдены");
    return;
  }

  // Если у нас уже есть данные и не просили форсировать запрос — просто перерисуем текст под текущий язык
  if (lastWeatherData && !forceRefetch) {
    renderWeather(lastWeatherData, tempEl, extraEl);
    return;
  }

  // Текст по умолчанию (на случай, если ничего не придёт)
  tempEl.textContent  = "--°C";
  extraEl.textContent = getWeatherLoadingText();

  try {
    // Прямой запрос к Open-Meteo, без backend  47.044624%2C28.862221
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=47.045&longitude=28.862" +
      "&current_weather=true" +
      "&hourly=relativehumidity_2m,cloudcover";

    const res = await fetch(url, { method: "GET" });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    lastWeatherData = data; // запоминаем для последующей перерисовки при смене языка

    renderWeather(data, tempEl, extraEl);
  } catch (err) {
    console.error("weather.js: eroare la încărcarea meteo", err);
    tempEl.textContent  = "--°C";
    extraEl.textContent = getWeatherErrorText();
  }
}

function renderWeather(data, tempEl, extraEl) {
  const current = data.current_weather || {};
  const hourly  = data.hourly || {};

  const times   = hourly.time || [];
  const hums    = hourly.relativehumidity_2m || [];
  const clouds  = hourly.cloudcover || [];

  const rawTemp = current.temperature;
  let tempVal = Number.isFinite(rawTemp) ? Math.round(rawTemp) : null;
  if (tempVal === null) {
    tempEl.textContent = "--°C";
  } else {
    tempEl.textContent = `${tempVal}°C`;
  }

  // Ищем влажность/облачность по текущему часу
  let humidity = null;
  let cloudcover = null;

  if (Array.isArray(times) && times.length && Array.isArray(hums) && hums.length) {
    const currentTime = current.time;
    let idx = 0;
    if (currentTime && times.includes(currentTime)) {
      idx = times.indexOf(currentTime);
    }
    if (idx >= hums.length) idx = 0;

    humidity   = Number.isFinite(hums[idx])   ? hums[idx]   : null;
    cloudcover = Number.isFinite(clouds[idx]) ? clouds[idx] : null;
  }

  // Описание по коду погоды + облачности
  const descKey = mapWeatherCodeToDesc(current.weathercode, cloudcover);
  const emoji   = pickWeatherEmoji(descKey || "");

  const parts = [];

  if (descKey) {
    parts.push(formatDescription(descKey));
  }

  if (Number.isFinite(humidity)) {
    parts.push(formatHumidity(humidity));
  }

  if (Number.isFinite(current.windspeed)) {
    parts.push(formatWind(current.windspeed));
  }

  if (!parts.length) {
    parts.push(getLimitedWeatherText());
  }

  extraEl.textContent = `${emoji ? emoji + " " : ""}${parts.join(" · ")}`;
}

/* ===== Разбор кода погоды Open-Meteo ===== */

function mapWeatherCodeToDesc(code, cloudcover) {
  // Коды Open-Meteo: https://open-meteo.com/en/docs
  if (code === 0) return "clear";
  if (code === 1 || code === 2 || code === 3) return "clouds";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 95) return "storm";

  if (typeof cloudcover === "number") {
    if (cloudcover < 20) return "clear";
    if (cloudcover < 60) return "partly cloudy";
    return "clouds";
  }

  return "";
}

/* ===== Вспомогательные функции под мультиязычность ===== */

function getCurrentLang() {
  try {
    const htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.toLowerCase();

    const bodyLang = document.body.getAttribute("data-lang");
    if (bodyLang) return bodyLang.toLowerCase();

    return "ro";
  } catch (e) {
    return "ro";
  }
}

function getWeatherLoadingText() {
  const lang = getCurrentLang();
  if (lang === "ru") return "Загрузка погоды…";
  if (lang === "en") return "Loading weather…";
  return "Încărcare meteo…";
}

function getWeatherErrorText() {
  const lang = getCurrentLang();
  if (lang === "ru") return "Ошибка загрузки погоды.";
  if (lang === "en") return "Weather loading error.";
  return "Eroare la încărcarea vremii.";
}

function getLimitedWeatherText() {
  const lang = getCurrentLang();
  if (lang === "ru") return "Доступны только базовые данные.";
  if (lang === "en") return "Only basic weather data available.";
  return "Date meteo limitate.";
}

function formatDescription(desc) {
  const lang = getCurrentLang();

  if (/clear|senin|soare/.test(desc)) {
    if (lang === "ru") return "Ясно";
    if (lang === "en") return "Clear sky";
    return "Cer senin";
  }

  if (/cloud|nor/.test(desc)) {
    if (lang === "ru") return "Облачно";
    if (lang === "en") return "Cloudy";
    return "Înnorat";
  }

  if (/rain|ploaie/.test(desc)) {
    if (lang === "ru") return "Дождь";
    if (lang === "en") return "Rain";
    return "Ploaie";
  }

  if (/snow|ninsoare/.test(desc)) {
    if (lang === "ru") return "Снег";
    if (lang === "en") return "Snow";
    return "Ninsoare";
  }

  if (/fog|ceață|mist/.test(desc)) {
    if (lang === "ru") return "Туман";
    if (lang === "en") return "Fog";
    return "Ceață";
  }

  if (lang === "ru") return desc;
  if (lang === "en") return desc;
  return desc;
}

function formatHumidity(h) {
  const lang = getCurrentLang();
  if (lang === "ru") return `Влажность ${h}%`;
  if (lang === "en") return `Humidity ${h}%`;
  return `Umiditate ${h}%`;
}

function formatWind(w) {
  const lang = getCurrentLang();
  const speed = Math.round(w * 10) / 10;
  if (lang === "ru") return `Ветер ${speed} m/s`;
  if (lang === "en") return `Wind ${speed} m/s`;
  return `Vânt ${speed} m/s`;
}

function pickWeatherEmoji(desc) {
  const isDay = isDaytime();

  if (/clear|senin|soare/.test(desc)) {
    return isDay ? "☀️" : "🌙";
  }
  if (/partly cloudy/.test(desc)) {
    return isDay ? "⛅" : "☁️";
  }
  if (/cloud|nor/.test(desc)) {
    return "☁️";
  }
  if (/rain|ploaie/.test(desc)) {
    return "🌧️";
  }
  if (/storm|thunder|furtună/.test(desc)) {
    return "⛈️";
  }
  if (/snow|ninsoare/.test(desc)) {
    return "❄️";
  }
  if (/fog|ceață|mist/.test(desc)) {
    return "🌫️";
  }

  return isDay ? "🌤️" : "🌙";
}

function isDaytime() {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 7 && hour < 21;
}

/* ===== Инициализация и реакция на смену языка ===== */


// Авто-загрузка погоды после загрузки DOM
document.addEventListener("DOMContentLoaded", () => {
  loadWeather(true);
});

// Следим за изменением атрибута lang у <html>
// (i18n.js при смене языка скорее всего меняет document.documentElement.lang)
const langObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "attributes" && m.attributeName === "lang") {
      // Перерисовываем текст погоды под новый язык
      if (lastWeatherData) {
        const tempEl  = document.getElementById("weather-temp");
        const extraEl = document.getElementById("weather-extra");
        if (tempEl && extraEl) {
          renderWeather(lastWeatherData, tempEl, extraEl);
        }
      } else {
        // если по какой-то причине данных ещё нет — попробуем загрузить
        loadWeather(true);
      }
    }
  }
});

langObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});
