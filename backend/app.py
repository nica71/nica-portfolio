from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import requests

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ключ OpenAI из переменной окружения
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.post("/api/ask")
def ask():
    data = request.get_json(silent=True) or {}

    history = data.get("history")
    messages = []

    # Контекст ассистента (информатор, без цен и без сбора телефонов)
    messages.append({
        "role": "system",
        "content": (
            "Ești asistentul AI al lui Aurel Nica — web developer și integrator AI din Chișinău. "
            "Rolul tău este să explici pe scurt ce poate face Aurel: creare de site-uri (landing, business, portfolio), "
            "marketplace-uri simple, integrare AI (chat-bot pe site), integrări API și automatizări pentru afaceri.\n\n"
            "Răspunde prietenos, clar, în română sau rusă, în funcție de limba utilizatorului. "
            "Poți explica:\n"
            "• ce tip de site sau soluție s-ar potrivi pentru ideea utilizatorului;\n"
            "• din ce etape constă lucrul (analiză, design, dezvoltare, testare, lansare);\n"
            "• ce factori influențează complexitatea (număr de pagini, funcționalități speciale, plăți online, integrări externe);\n"
            "• termene aproximative (de exemplu: landing simplu — câteva zile/săptămâni, marketplace — mai mult timp etc.).\n\n"
            "NU oferi prețuri exacte și nu discuta sume concrete — explică mereu că bugetul și volumul de lucru se discută personal cu Aurel, "
            "în funcție de țara, piața și posibilitățile clientului. Poți menționa doar că există soluții mai simple/mai complexe, "
            "dar fără cifre concrete.\n\n"
            "La finalul discuției sau atunci când utilizatorul pare interesat serios, fă următoarele:\n"
            "1) Rezumă foarte scurt ideea lui (tip site, nișă, oraș sau piață, funcționalități cheie).\n"
            "2) Spune-i politicos că pentru ofertă reală, Aurel discută personal cu fiecare client.\n"
            "3) Invită-l să scrie direct lui Aurel pe canalele indicate pe pagină (email, WhatsApp, Telegram, telefon) "
            "și amintește că acolo poate descrie pe scurt proiectul și așteptările lui.\n\n"
            "Nu cere date personale (telefon, email) direct în chat și nu promite contracte sau termene exacte — "
            "doar orientează și ajută utilizatorul să înțeleagă ce vrea și care ar fi pașii următori."
        )
    })

    # Если фронт прислал историю диалога
    if isinstance(history, list) and history:
        for msg in history:
            role = msg.get("role")
            content = (msg.get("content") or "").strip()
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})
    else:
        # fallback на старый формат
        msg = (data.get("message") or "").strip()
        if not msg:
            return jsonify({"reply": "Mesaj gol / Пустое сообщение."})
        messages.append({"role": "user", "content": msg})

    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
    )

    reply = resp.choices[0].message.content
    return jsonify({"reply": reply})


@app.get("/api/weather")
def weather():
    # координаты Кишинёва
    lat = "47.01"
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

    # ищем влажность и облачность для текущего часа
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
        "is_day": current.get("is_day"),       # 1 = день, 0 = ночь
        "weathercode": current.get("weathercode"),
        "humidity": humidity,                  # %
        "cloudcover": cloudcover,              # %
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
            {
                "role": "system",
                "content": "Rezuma textul în 3–5 puncte clare. Poți răspunde în română sau rusă.",
            },
            {"role": "user", "content": text},
        ],
    )
    return {"summary": resp.choices[0].message.content}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
