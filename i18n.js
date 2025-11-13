// i18n.js
const translations = {
  ro: {
    title: "NICA Academy — Viziță Aurel Nica",
    "nav.about": "Despre mine",
    "nav.services": "Servicii",
    "nav.contact": "Contacte",

    "hero.badge": "Carte de vizită",
    "hero.h1": "Aurel Nica — Web Developer · Integrator",
    "hero.lead": "Salut! Sunt Aurel Nica — dezvoltator web și integrator AI care ajută afacerile să devină moderne, automate și eficiente.Construiesc site-uri rapide, sisteme inteligente, chat-boți și integrări API pentru companii, freelanceri și echipe care au nevoie de soluții digitale reale.",
    "hero.cta": "Scrie-mi pe email",
    "hero.point1": "⚡ 4 direcții: landing, integrarea AI pentru afaceri, integrări API, automatizări pentru afaceri",
    "hero.point2": "🛠 Stack: HTML/CSS/JS · React · Python/Django · PostgreSQL",
    "hero.point3": "🌍 Remote · Chișinău · RO/RU/EN",

    "about.h2": "Despre mine",
    "about.sub": "Pe scurt despre focus și valoare pentru client.",
    "about.text": "Ajut afacerile să iasă rapid online: interfețe curate, plăți conectate și integrare cu contabilitatea. Îmi plac soluțiile clare și termenele transparente. Proiectez pentru rezultat — ca site-ul să aducă lead-uri și vânzări.",
    "weather.label": "Acum la Chișinău",
    "services.h2": "Servicii",
    "services.sub": "Cinci direcții cu efect rapid.",
    "services.s1.title": "1. Landing-uri și site-uri1. Crearea site-urilor moderne (Landing, Business, Portfolio",
    "services.s11.desc": "— Design curat",
    "services.s12.desc": "— Mobil perfect",
    "services.s13.desc": "— Viteză mare",
    "services.s14.desc": "— SEO de bază inclus",
    "services.s2.title": "2. Integrarea AI pentru afaceri",
    "services.s21.desc": "— Chat-bot pe site ",
    "services.s22.desc": "— Generare texte și răspunsuri automate",
    "services.s23.desc": "— AI pentru formulare, suport clienți și CRM",
    "services.s24.desc": "— Răspunsuri 24/7 automatizate", 
    "services.s3.title": "3. Integrări API",
    "services.s31.desc": "— Conectarea site-ului la baze de date",
    "services.s32.desc": "— Integrarea cu sisteme de plată (Stripe, PayPal, MAIB, MICB etc.)",
    "services.s33.desc": "— Integrarea OpenAI, Google, Telegram, WhatsApp",

    "services.s4.title": "4. Automatizări pentru afaceri",
    "services.s41.desc": "— Sisteme care lucrează în locul tău", 
    "services.s42.desc": "— Trimiteri automate", 
    "services.s43.desc": "— Generarea rapoartelor", 
    "services.s44.desc": "— Conexiuni între programe", 

    "services.s5.title": "5.Integrare AI & chat-boți",
    "services.s51.desc": "— Chat AI pe site, asistenți inteligenți pentru clienți și răspunsuri automate 24/7.",   

    "contact.h2": "Contacte",
    "contact.sub": "Scrie-mi pe canalul potrivit ție.",
    "contact.mail.h3": "Email",
    "contact.mail.note": "Răspuns de obicei în ziua lucrătoare.",
    "contact.mail.cta": "Trimite email",
    "contact.fromme.h3": "De la mine",
    "contact.fromme.l1": "Te ajut să formulezi cerințele și prioritățile.",
    "contact.fromme.l2": "Plan clar și preț fix la start.",
    "contact.fromme.l3": "Predau surse și instrucțiuni de lansare.",

    "footer": "© 2025 · NICA Academy · Creat cu ❤️ la Chișinău",
   

    // mailto (params)
    _mailto_subject: "Cerere site",
    _mailto_body: "Bună, Aurel! Am nevoie de un site...",
    _cta_subject: "Proiect pentru NICA Studio",
    _cta_body: "Bună, Aurel! Aș dori să discut un proiect..."
  },

  ru: {
    title: "NICA Academy — Визитка Aurel Nica",
    "nav.about": "Обо мне",
    "nav.services": "Услуги",
    "nav.contact": "Контакты",

    "hero.badge": "Неделя 1 · Визитка разработчика",
    "hero.h1": "Aurel Nica — Web Developer · Integrator",
    "hero.lead": "Делаю быстрые и понятные сайты, подключаю платежи и автоматизирую процессы (1C/Bank API). Проекты — от лендинга до мини-eCommerce.",
    "hero.cta": "Связаться по email",
    "hero.point1": "⚡ 3 направления: лендинги, платежи, автоматизация",
    "hero.point2": "🛠 Стек: HTML/CSS/JS · React · Python/Django · PostgreSQL",
    "hero.point3": "🌍 Удалённо · Кишинёв · RO/RU/EN",

    "about.h2": "Обо мне",
    "about.sub": "Коротко о фокусе и ценности для клиента.",
    "about.text": "Помогаю бизнесу быстро выходить в онлайн: аккуратные интерфейсы, подключение оплаты и интеграции с учётом. Люблю понятные решения и прозрачные сроки. Проектирую на результат — чтобы сайт приносил заявки и продажи.",

    "services.h2": "Услуги",
    "services.sub": "Три направления с быстрым эффектом.",
    "services.s1.title": "Лендинги и сайты",
    "services.s1.desc": "Шустрые страницы на HTML/CSS/JS или React. Мобильная адаптация, базовое SEO.",
    "services.s2.title": "Интеграция платежей",
    "services.s2.desc": "MAIB/MICB/eCommerce, формы оплаты, уведомления, квитанции.",
    "services.s3.title": "Автоматизация",
    "services.s3.desc": "Интеграции 1C 7.7/8.x, обмен с банком, экспорт/импорт, отчёты.",

    "contact.h2": "Контакты",
    "contact.sub": "Свяжитесь со мной удобным способом.",
    "contact.mail.h3": "Почта",
    "contact.mail.note": "Обычно отвечаю в течение рабочего дня.",
    "contact.mail.cta": "Написать письмо",
    "contact.fromme.h3": "От меня",
    "contact.fromme.l1": "Помогу сформулировать задачу и приоритеты.",
    "contact.fromme.l2": "План и фикс-цена на старт.",
    "contact.fromme.l3": "Передаю исходники и инструкцию по запуску.",

    "footer": "© 2025 · NICA Academy · Сделано с ❤️ в Кишинёве",

    _mailto_subject: "Запрос на сайт",
    _mailto_body: "Здравствуйте, Aurel! Мне нужен сайт...",
    _cta_subject: "Проект для NICA Studio",
    _cta_body: "Здравствуйте, Aurel! Хочу обсудить проект..."
  },

  en: {
    title: "NICA Academy — Aurel Nica Business Card",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.contact": "Contact",

    "hero.badge": "Week 1 · Business Card",
    "hero.h1": "Aurel Nica — Web Developer · Integrator",
    "hero.lead": "I build fast, clear sites, connect payments, and automate processes (1C/Bank API). From landing pages to mini eCommerce.",
    "hero.cta": "Email me",
    "hero.point1": "⚡ 3 pillars: landing, payments, automation",
    "hero.point2": "🛠 Stack: HTML/CSS/JS · React · Python/Django · PostgreSQL",
    "hero.point3": "🌍 Remote · Chișinău · RO/RU/EN",

    "about.h2": "About me",
    "about.sub": "Short focus & client value.",
    "about.text": "I help businesses get online fast: clean interfaces, payment integration, and accounting links. Clear solutions, transparent timelines, designed for results — leads and sales.",

    "services.h2": "Services",
    "services.sub": "Three quick-impact directions.",
    "services.s1.title": "Landings & websites",
    "services.s1.desc": "Fast pages on HTML/CSS/JS or React. Mobile, basic SEO.",
    "services.s2.title": "Payment integration",
    "services.s2.desc": "MAIB/MICB/eCommerce, payment forms, notifications, receipts.",
    "services.s3.title": "Automation",
    "services.s3.desc": "1C 7.7/8.x, bank sync, data import/export, reports.",

    "contact.h2": "Contact",
    "contact.sub": "Write via your preferred channel.",
    "contact.mail.h3": "Email",
    "contact.mail.note": "Usually replies within a business day.",
    "contact.mail.cta": "Send email",
    "contact.fromme.h3": "From me",
    "contact.fromme.l1": "I’ll help shape requirements and priorities.",
    "contact.fromme.l2": "Clear plan and fixed starting price.",
    "contact.fromme.l3": "Sources and launch instructions provided.",

    "footer": "© 2025 · NICA Academy · Made with ❤️ in Chișinău",

    _mailto_subject: "Website request",
    _mailto_body: "Hello, Aurel! I need a website...",
    _cta_subject: "Project for NICA Studio",
    _cta_body: "Hello, Aurel! I'd like to discuss a project..."
  }
};

function applyTranslations(lang) {
  const dict = translations[lang] || translations.ro;

  // Текстовые узлы с data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  // Title
  if (dict.title) document.title = dict.title;

  // mailto и CTA с корректными subject/body
  const mailto = document.getElementById("mailto");
  if (mailto && dict._mailto_subject && dict._mailto_body) {
    mailto.href =
      `mailto:studio.nica.md@gmail.com?subject=${encodeURIComponent(dict._mailto_subject)}&body=${encodeURIComponent(dict._mailto_body)}`;
  }
  const cta = document.getElementById("cta-email");
  if (cta && dict._cta_subject && dict._cta_body) {
    cta.href =
      `mailto:studio.nica.md@gmail.com?subject=${encodeURIComponent(dict._cta_subject)}&body=${encodeURIComponent(dict._cta_body)}`;
  }

  // Атрибут lang у <html>
  document.documentElement.setAttribute("lang", lang);
}

function setLang(lang) {
  localStorage.setItem("nica_lang", lang);
  applyTranslations(lang);
}

function initLang() {
  const saved = localStorage.getItem("nica_lang");
  const lang = saved || "ro"; // baza RO
  applyTranslations(lang);

  // Навесим обработчик на кнопки переключателя
  document.querySelectorAll(".lang-switch [data-lang]").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
}

document.addEventListener("DOMContentLoaded", initLang);

