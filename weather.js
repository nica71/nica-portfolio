function describeWeather(code, cloudcover) {
  // очень упрощённое описание по Open-Meteo weather codes
  if (code === 0) return "cer senin";
  if (code === 1 || code === 2 || code === 3) {
    if (cloudcover >= 70) return "cer noros";
    if (cloudcover >= 30) return "parțial noros";
    return "mai mult senin";
  }
  if (code >= 45 && code <= 48) return "ceață";
  if (code >= 51 && code <= 67) return "ploaie ușoară";
  if (code >= 71 && code <= 77) return "ninsoare";
  if (code >= 80 && code <= 82) return "averse";
  if (code >= 95) return "furtună";
  if (cloudcover !== null && cloudcover >= 80) return "cer complet noros";
  return "condiții variabile";
}

function pickIcon(is_day, code, cloudcover) {
  const day = is_day === 1 || is_day === true;

  if (code === 0 && cloudcover < 30) return day ? "☀️" : "🌙";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 95) return "⛈️";
  if (cloudcover >= 70) return "☁️";
  if (cloudcover >= 30) return day ? "⛅" : "☁️";
  return day ? "☀️" : "🌙";
}

async function loadWeather() {
  try {
    const backend = window.BACKEND_URL;
    if (!backend) return;

    const res = await fetch(`${backend}/api/weather`);
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    const tempEl  = document.getElementById("weather-temp");
    const extraEl = document.getElementById("weather-extra");
    if (!tempEl || !extraEl) return;

    const temp  = data.temperature;
    const wind  = data.windspeed;
    const hum   = data.humidity;
    const cloud = data.cloudcover ?? 0;
    const code  = data.weathercode ?? 0;
    const isDay = data.is_day;

    if (temp === undefined || temp === null) {
      extraEl.textContent = "Nu pot încărca meteo acum.";
      return;
    }

    const desc = describeWeather(code, cloud);
    const icon = pickIcon(isDay, code, cloud);

    // В верхней строке показываем иконку + температуру
    tempEl.textContent = `${icon} ${temp}°C`;

    // В нижней строке — влажность, ветер и описание
    let parts = [];
    if (typeof hum === "number")  parts.push(`umiditate ${hum}%`);
    if (typeof wind === "number") parts.push(`vânt ${wind} m/s`);
    parts.push(desc);

    extraEl.textContent = parts.join(" · ");
  } catch (e) {
    const extraEl = document.getElementById("weather-extra");
    if (extraEl) extraEl.textContent = "Nu pot încărca meteo acum.";
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);
