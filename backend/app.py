from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import requests


@app.get("/api/weather")
def weather():
    lat = "47.01"   # Chișinău
    lon = "28.86"

    r = requests.get(
        "https://api.open-meteo.com/v1/forecast",
        params={
            "latitude": lat,
            "longitude": lon,
            "current_weather": True,
            "hourly": "relativehumidity_2m,cloudcover",
        },
        timeout=10,
    )

    data = r.json()

    current = data.get("current_weather", {}) or {}
    hourly = data.get("hourly", {}) or {}

    times = hourly.get("time", []) or []
    hums = hourly.get("relativehumidity_2m", []) or []
    clouds = hourly.get("cloudcover", []) or []

    humidity = None
    cloudcover = None

    # Пытаемся найти влажность и облачность по текущему часу
    if times and hums:
        current_time = current.get("time")
        idx = 0
        if current_time and current_time in times:
            idx = times.index(current_time)

        if idx < len(hums):
            humidity = hums[idx]
        if idx < len(clouds):
            cloudcover = clouds[idx]

    return {
        "temperature": current.get("temperature"),
        "windspeed": current.get("windspeed"),
        "is_day": current.get("is_day"),         # 1 = день, 0 = ночь
        "weathercode": current.get("weathercode"),
        "humidity": humidity,                    # %
        "cloudcover": cloudcover,                # %
    }




app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/ask")
def ask():
  data = request.get_json(silent=True) or {}
  msg = (data.get("message") or "").strip()
  if not msg:
    return jsonify({"reply": "Mesaj gol / Пустое сообщение."})

  resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
      {"role": "system",
       "content": "Ești asistentul AI al site-ului NICA Academy. "
                  "Răspunde pe scurt, prietenos, în română sau rusă."},
      {"role": "user", "content": msg}
    ],
  )
  return jsonify({"reply": resp.choices[0].message.content})

@app.get("/api/weather")
def weather():
  lat = request.args.get("lat", "47.01")
  lon = request.args.get("lon", "28.86")
  r = requests.get("https://api.open-meteo.com/v1/forecast",
                   params={"latitude": lat, "longitude": lon, "current_weather": True},
                   timeout=10)
  d = r.json().get("current_weather", {})
  return {
    "temperature": d.get("temperature"),
    "windspeed": d.get("windspeed")
  }

@app.post("/api/summarize")
def summarize():
  data = request.get_json(silent=True) or {}
  text = (data.get("text") or "").strip()
  if not text:
    return {"error": "text is required"}, 400

  resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
      {"role": "system",
       "content": "Rezuma textul în 3–5 puncte clare. Poți răspunde în română sau rusă."},
      {"role": "user", "content": text}
    ],
  )
  return {"summary": resp.choices[0].message.content}

@app.get("/health")
def health():
  return {"status": "ok"}

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
