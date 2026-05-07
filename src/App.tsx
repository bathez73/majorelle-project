import { useState, type FormEvent } from "react";

type Locale = "fr" | "en";
type Localized = Record<Locale, string>;
type SubmitStatus = "idle" | "sending" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  phone: string;
  arrival: string;
  departure: string;
  guests: string;
  message: string;
};

const contactEmail = "majorellecotonou@gmail.com";
const contactPhone = "+229 94646900";
const address = "673, rue 6074, quartier Jericho, Cotonou, Bénin";
const airbnbUrl = "http://www.airbnb.fr/rooms/1334344";
const formSubmitEndpoint = `https://formsubmit.co/ajax/${contactEmail}`;

const images = {
  hero: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398595.jpg",
  living: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398597.jpg",
  kitchen: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398598.jpg",
  bedroom: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398601.jpg",
  terrace: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398603.jpg",
  art: "https://www.majorelle-cotonou.com/s/cc_images/cache_63398602.jpg",
};

const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address + " Majorelle Cotonou")}&output=embed`;
const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  address + " Majorelle Cotonou"
)}`;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  guests: "2",
  message: "",
};

const copy = {
  fr: {
    nav: {
      welcome: "Welcome",
      stay: "Séjour",
      photos: "Photos et réservations",
      map: "Carte",
      links: "Visit Benin",
    },
    hero: {
      eyebrow: "Welcome to Cotonou",
      headline: "Majorelle Cotonou",
      subline:
        "Maison d'Hôtes de charme et Guest House au coeur de Cotonou, Bénin.",
      description:
        "Mieux qu'un hôtel pour moins cher à Cotonou : une adresse indépendante, décorée avec goût, abordable,   friendly et pensée pour se sentir chez soi.",
      cta: "Vérifier la disponibilité",
      secondary: "Voir les photos",
    },
    intro: {
      eyebrow: "Bienvenue",
      title: "Un refuge tropical au centre de Cotonou.",
      text1:
        "Nous sommes ravis de votre visite sur notre site et espérons vous accueillir bientôt à Cotonou. Majorelle Cotonou est situé en plein centre, non loin du fameux marché Dantokpa.",
      text2:
        "Nichée dans un charmant jardin tropical, l'adresse se trouve dans un quartier calme et typique de l'Afrique de l'Ouest. Le propriétaire habite la maison voisine, vous aurez donc toujours un interlocuteur sur place si besoin.",
    },
    stay: {
      eyebrow: "Majorelle Cotonou",
      title: "Entièrement équipé pour 1 à 4 personnes.",
      text:
        "Le logement est entièrement rénové, meublé avec goût et très propre. Il convient aux séjours courts, aux longues durées, au repos comme au travail.",
      includes: "Le logement comporte",
      comfort: "Confort inclus",
    },
    services: {
      eyebrow: "Sur demande",
      title: "Des services simples pour voyager sans friction.",
      text:
        "Activez uniquement ce dont vous avez besoin : repas, transport, ménage, courses ou circuits de découverte du Bénin.",
    },
    photos: {
      eyebrow: "Photos et réservations",
      title: "Une atmosphère intime, artisanale et solaire.",
      text:
        "Majorelle Cotonou conserve son lien avec les artistes et les rencontres locales. Sur demande, nos guides peuvent vous aider à comprendre le Bénin profond et à découvrir ses lieux culturels.",
    },
    reservation: {
      eyebrow: "Disponibilités",
      title: "Envoyez votre demande directement à Majorelle Cotonou.",
      airbnb: "Voir les disponibilités Airbnb",
      submit: "Envoyer la demande",
      sending: "Envoi en cours...",
      success: "Demande envoyée. Majorelle Cotonou vous répondra par email.",
      modalTitle: "Demande reçue!",
      modalClose: "Fermer",
      error:
        "L'envoi direct n'a pas abouti. Vérifiez la connexion ou utilisez le lien email mentionné au bas de page.",
    },
    form: {
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      arrival: "Arrivée",
      departure: "Départ",
      guests: "Voyageurs",
      message: "Message",
      placeholder: "Dates flexibles, arrivée aéroport, petit déjeuner, longue durée...",
    },
    map: {
      eyebrow: "Majorelle Cotonou on Google Map",
      title: "Arriver facilement à Jericho.",
      text:
        "Utilisez la carte pour préparer votre trajet depuis l'aéroport, le centre-ville ou le marché Dantokpa.",
      cta: "Ouvrir Google Maps",
    },
    links: {
      eyebrow: "Visit Benin / useful links",
      title: "Quelques repères utiles pour votre séjour au Bénin.",
      text:
        "Institutions, culture, assurances et bonnes adresses : une sélection pratique pour préparer votre voyage.",
    },
    footer: {
      print: "Version imprimable",
      sitemap: "Plan du site",
      copyright: "© www.majorelle-cotonou.com",
      artist: "Majorelle, place for artists...",
      emergency: "En cas d'accident au Bénin : police 117, pompiers 118 s'il y a des blessés.",
    },
  },
  en: {
    nav: {
      welcome: "Welcome",
      stay: "Stay",
      photos: "Photos & bookings",
      map: "Map",
      links: "Visit Benin",
    },
    hero: {
      eyebrow: "Welcome to Cotonou",
      headline: "Majorelle Cotonou",
      subline: "Charming guest house and furnished stay in Cotonou, Benin.",
      description:
        "Better than a hotel for less in Cotonou: an independent, tastefully decorated, affordable and gay friendly guest house where you can feel at home.",
      cta: "Check availability",
      secondary: "See photos",
    },
    intro: {
      eyebrow: "Welcome",
      title: "A tropical hideaway in central Cotonou.",
      text1:
        "We are glad to welcome you on our site and hope to see you soon in Cotonou. Majorelle Cotonou is located in the heart of the city, not far from the famous Dantokpa market.",
      text2:
        "The house benefits from a lovely tropical garden and is located in a typical, quiet West African neighbourhood. The landlord stays next door, so you will always find help if needed.",
    },
    stay: {
      eyebrow: "Majorelle Cotonou",
      title: "Fully furnished for 1 to 4 guests.",
      text:
        "The accommodation is fully renovated, tastefully furnished and very clean. It works perfectly for short stays, long stays, rest or remote work.",
      includes: "The accommodation includes",
      comfort: "Comfort included",
    },
    services: {
      eyebrow: "On request",
      title: "Simple services for a frictionless stay.",
      text:
        "Activate only what you need: meals, transport, cleaning, private shopping or guided discovery tours around Benin.",
    },
    photos: {
      eyebrow: "Photos & bookings",
      title: "An intimate, handcrafted and sunny atmosphere.",
      text:
        "Majorelle Cotonou keeps a strong connection with artists and local encounters. Victor and Chadrac can help you understand deep Benin and discover its cultural places.",
    },
    reservation: {
      eyebrow: "Availability",
      title: "Send your request directly to Majorelle Cotonou.",
      text:
        "The form sends the request to Majorelle Cotonou's inbox through FormSubmit, with no backend to manage on the website.",
      airbnb: "Check Airbnb availability",
      submit: "Send request",
      sending: "Sending...",
      success: "Request sent. Majorelle Cotonou will reply by email.",
      modalTitle: "Request received!",
      modalClose: "Close",
      error: "Direct sending failed. Check the connection or use the email link in the footer.",
      note: "First submission: FormSubmit may ask for a one-time validation from the recipient inbox.",
    },
    form: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Guests",
      message: "Message",
      placeholder: "Flexible dates, airport pickup, breakfast, long stay...",
    },
    map: {
      eyebrow: "Majorelle Cotonou on Google Map",
      title: "Find your way to Jericho easily.",
      text: "Use the map to plan your route from the airport, downtown Cotonou or Dantokpa market.",
      cta: "Open Google Maps",
    },
    links: {
      eyebrow: "Visit Benin / useful links",
      title: "Useful references for your stay in Benin.",
      text:
        "Institutions, culture, insurance and local recommendations: a practical selection to prepare your trip.",
    },
    footer: {
      print: "Printable version",
      sitemap: "Site map",
      copyright: "© www.majorelle-cotonou.com",
      artist: "Majorelle, place for artists...",
      emergency: "In case of accident in Benin: police 117, firefighters 118 if someone is injured.",
    },
  },
} satisfies Record<Locale, unknown>;

const accommodationItems: Array<{ title: Localized; text: Localized }> = [
  {
    title: { fr: "Cuisine américaine équipée", en: "Fully equipped open kitchen" },
    text: { fr: "Préparez vos repas en toute autonomie.", en: "Prepare your meals independently." },
  },
  {
    title: { fr: "Salon et salle à manger", en: "Living and dining room" },
    text: {
      fr: "Avec un lit d'appoint une place pour plus de flexibilité.",
      en: "With a one-person extra bed for added flexibility.",
    },
  },
  {
    title: { fr: "Deux chambres", en: "Two bedrooms" },
    text: {
      fr: "Une chambre avec grand lit double et une chambre avec lit simple.",
      en: "One room with a large double bed and one room with a single bed.",
    },
  },
  {
    title: { fr: "Salle de bain et terrasse", en: "Bathroom and terrace" },
    text: {
      fr: "Eau chaude et froide, plus une terrasse ouverte sur le jardin.",
      en: "Hot and cold water, plus a terrace overlooking the garden.",
    },
  },
];

const comfortItems: Array<Localized> = [
  { fr: "Climatisation incluse dans toutes les pièces", en: "AC included in all rooms" },
  { fr: "TV Canal+", en: "Canal+ TV" },
  { fr: "Wifi illimité gratuit", en: "Free unlimited Wi-Fi" },
  { fr: "Eau chaude et froide 24/24, générateur solaire", en: "24/7 hot and cold water, solar generator" },
  { fr: "Linge de lit et de toilette inclus", en: "Bed sheets and towels included" },
  { fr: "Parking privé", en: "Private parking" },
  { fr: "Gardien de nuit", en: "Night guard" },
];

const serviceItems: Array<Localized> = [
  { fr: "Petit déjeuner", en: "Breakfast" },
  { fr: "Déjeuner et dîner", en: "Lunch and dinner" },
  { fr: "Blanchisserie", en: "Laundry" },
  {
    fr: "Location de voiture ou moto avec chauffeur et visite du Bénin",
    en: "Car or motorbike rental with driver and Benin tour",
  },
  { fr: "Transport aéroport : 5000 FCFA", en: "Airport pickup: 5000 FCFA" },
  { fr: "Coffre-fort", en: "Safe box" },
  { fr: "Service de courses", en: "Private shopping" },
  { fr: "Une idée ? Demandez-nous, nous essaierons de vous aider.", en: "Any idea? Just ask, we will try to help." },
];

const gallery = [
  { src: images.living, label: { fr: "Salon", en: "Living room" } },
  { src: images.kitchen, label: { fr: "Cuisine", en: "Kitchen" } },
  { src: images.bedroom, label: { fr: "Chambre", en: "Bedroom" } },
  { src: images.terrace, label: { fr: "Terrasse", en: "Terrace" } },
];

const usefulLinks = [
  {
    title: "www.gouv.bj/vivre-au-benin",
    href: "https://www.gouv.bj/vivre-au-benin",
    description: {
      fr: "Le site officiel du gouvernement béninois.",
      en: "The official website of the Beninese government.",
    },
  },
  {
    title: "www.cotonou-benin.com",
    href: "http://www.cotonou-benin.com",
    description: { fr: "Site de la ville de Cotonou.", en: "Website of the city of Cotonou." },
  },
  {
    title: "www.fondationzinsou.org",
    href: "http://www.fondationzinsou.org",
    description: {
      fr: "A visiter absolument. Le musée de Ouidah est également une priorité lors de votre visite au Bénin.",
      en: "A must-see. The Ouidah museum is also a priority during your visit to Benin.",
    },
  },
  {
    title: "www.if-benin.com",
    href: "http://www.if-benin.com",
    description: {
      fr: "L'Institut Français à Cotonou : pour les meilleurs spectacles en ville.",
      en: "The French Institute in Cotonou: for the best shows in town.",
    },
  },
  {
    title: "www.tchif.com",
    href: "http://www.tchif.com",
    description: { fr: "Un autre lieu pour les artistes à Cotonou.", en: "Another place for artists in Cotonou." },
  },
  {
    title: "www.visiterlebenin.com",
    href: "http://www.visiterlebenin.com",
    description: { fr: "Un site sans prétention mais avec des infos utiles.", en: "A simple website with useful information." },
  },
  {
    title: "www.routard.com/guide/code_dest/benin.htm",
    href: "http://www.routard.com/guide/code_dest/benin.htm",
    description: { fr: "Un classique incontournable quand on voyage.", en: "A travel classic worth checking." },
  },
  {
    title: "www.ambafrance-bj.org",
    href: "http://www.ambafrance-bj.org",
    description: {
      fr: "Le site officiel de l'Ambassade de France au Bénin.",
      en: "The official website of the French Embassy in Benin.",
    },
  },
  {
    title: "www.diplomatie.gouv.fr",
    href: "http://www.diplomatie.gouv.fr",
    description: {
      fr: "Le site du Ministère des Affaires Etrangères : alertes pays, etc.",
      en: "The French Ministry of Foreign Affairs website: country alerts and travel advice.",
    },
  },
  {
    title: "www.ufe.org et www.francais-du-monde.org",
    href: "http://www.ufe.org",
    description: {
      fr: "Les associations de Français à l'étranger.",
      en: "Associations for French citizens abroad.",
    },
  },
  {
    title: "www.bilansanteinternational.com",
    href: "http://www.bilansanteinternational.com",
    description: {
      fr: "Pour vos assurances voyage ou expatriation partout dans le monde.",
      en: "For travel or expatriation insurance before visiting Benin.",
    },
  },
  {
    title: "le-palmier-royal.com",
    href: "http://www.le-palmier-royal.com/",
    description: { fr: "Une autre adresse conseillée à Cotonou.", en: "Another recommended address in Cotonou." },
  },
  {
    title: "Galerie Guelede",
    href: "https://www.facebook.com/galerieguelede/inbox/",
    description: {
      fr: "Pour les personnes intéressées par le masque et le culte Guelede.",
      en: "For guests interested in masks and the Guelede cult.",
    },
  },
];

const keywords =
  "Hotel Cotonou; room in Benin; BnB Cotonou; Guest-house Cotonou; where to stay in Cotonou ? furnished house Cotonou; Maison d'Hotes Bénin, bed y casa Cotonou; casa in Cotonou; maison meublée à Cotonou, short or long term apartment rental.";

export default function App() {
  const [language, setLanguage] = useState<Locale>("fr");
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [modalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSubmitStatus("idle");
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("sending");

    const payload = new FormData();
    payload.append("_subject", "Reservation request - Majorelle Cotonou");
    payload.append("_template", "table");
    payload.append("_captcha", "false");
    payload.append("_replyto", form.email);
    payload.append("property", "Majorelle Cotonou");
    payload.append("language", language === "fr" ? "French" : "English");
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone || "Not provided");
    payload.append("arrival", form.arrival || "Flexible");
    payload.append("departure", form.departure || "Flexible");
    payload.append("guests", form.guests || "Not provided");
    payload.append("message", form.message || "I would like to check availability at Majorelle Cotonou.");

    try {
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("FormSubmit request failed");
      }

      setForm(initialForm);
      setSubmitStatus("success");
      setModalOpen(true);
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#f5efe3] text-[#14251f] selection:bg-[#1b6b59] selection:text-white">
      <Hero language={language} onLanguageChange={setLanguage} />
      <Intro language={language} />
      <Stay language={language} />
      <Services language={language} />
      <PhotosAndReservation
        form={form}
        language={language}
        submitStatus={submitStatus}
        onChange={updateField}
        onSubmit={handleSubmit}
        onCloseModal={handleCloseModal}
        modalOpen={modalOpen}
      />
      <Location language={language} />
      <UsefulLinks language={language} />
      <SiteFooter language={language} />
    </main>
  );
}

function Hero({ language, onLanguageChange }: { language: Locale; onLanguageChange: (locale: Locale) => void }) {
  const t = copy[language];

  return (
    <section id="welcome" className="relative min-h-screen overflow-hidden bg-[#10231c] text-white">
      <div
        className="hero-visual absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(4, 22, 52, 0.92), rgba(6, 42, 84, 0.58) 44%, rgba(29, 112, 216, 0.16)), url(${images.hero})`,
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(124,196,255,0.28),transparent_32%)]" />

      <header className="animate-soft-in relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <a href="#welcome" className="text-sm font-semibold uppercase tracking-[0.28em] text-[#f7e7c2]">
          Majorelle Cotonou
        </a>
        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-8 text-sm text-white/78 md:flex">
            <a className="transition hover:text-[#f7e7c2]" href="#welcome">
              {t.nav.welcome}
            </a>
            <a className="transition hover:text-[#f7e7c2]" href="#stay">
              {t.nav.stay}
            </a>
            <a className="transition hover:text-[#f7e7c2]" href="#photos">
              {t.nav.photos}
            </a>
            <a className="transition hover:text-[#f7e7c2]" href="#map">
              {t.nav.map}
            </a>
            <a className="transition hover:text-[#f7e7c2]" href="#links">
              {t.nav.links}
            </a>
          </nav>
          <div className="flex border border-white/30 text-xs font-semibold uppercase tracking-[0.18em]">
            <button
              className={`px-3 py-2 transition ${language === "fr" ? "bg-[#f4d28a] text-[#10231c]" : "text-white/75 hover:text-white"}`}
              type="button"
              onClick={() => onLanguageChange("fr")}
            >
              FR
            </button>
            <button
              className={`px-3 py-2 transition ${language === "en" ? "bg-[#f4d28a] text-[#10231c]" : "text-white/75 hover:text-white"}`}
              type="button"
              onClick={() => onLanguageChange("en")}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-84px)] items-center px-5 pb-16 pt-8 sm:px-8 lg:px-14">
        <div className="max-w-4xl">
          <p className="animate-soft-in motion-delay-1 mb-5 text-sm font-medium uppercase tracking-[0.46em] text-[#d8b56d]">
            {t.hero.eyebrow}
          </p>
          <h1 className="animate-rise motion-delay-2 max-w-3xl font-serif text-6xl leading-[0.88] tracking-[-0.06em] text-[#fff8e8] sm:text-7xl md:text-8xl lg:text-[8.7rem]">
            {t.hero.headline}
          </h1>
          <p className="animate-rise motion-delay-3 mt-7 max-w-2xl text-xl leading-8 text-[#f7e7c2]">
            {t.hero.subline}
          </p>
          <p className="animate-rise motion-delay-3 mt-5 max-w-2xl text-lg leading-8 text-white/78">
            {t.hero.description}
          </p>
          <div className="animate-rise motion-delay-4 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#reservation"
              className="group inline-flex items-center justify-center bg-[#f4d28a] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#10231c] transition duration-300 hover:bg-white"
            >
              {t.hero.cta}
              <span className="ml-3 transition duration-300 group-hover:translate-x-1">-&gt;</span>
            </a>
            <a
              href="#photos"
              className="inline-flex items-center justify-center border border-white/45 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-[#f4d28a] hover:text-[#f4d28a]"
            >
              {t.hero.secondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro({ language }: { language: Locale }) {
  const t = copy[language].intro;

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#1b6b59]">{t.eyebrow}</p>
          <h2 className="font-serif text-5xl leading-[1.02] tracking-[-0.04em] text-[#13271f] sm:text-6xl">
            {t.title}
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-8 text-[#3a4b43]">
          <p>{t.text1}</p>
          <p>{t.text2}</p>
        </div>
      </div>
    </section>
  );
}

function Stay({ language }: { language: Locale }) {
  const t = copy[language].stay;

  return (
    <section id="stay" className="bg-[#10231c] px-5 py-24 text-[#fff8e8] sm:px-8 lg:px-14 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="overflow-hidden">
            <img
              className="ambient-image h-[62vh] min-h-[420px] w-full object-cover"
              src={images.living}
              alt="Salon de Majorelle Cotonou"
            />
          </div>
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#d8b56d]">{t.eyebrow}</p>
            <h2 className="font-serif text-5xl leading-[1.03] tracking-[-0.04em] sm:text-6xl">{t.title}</h2>
            <p className="mt-7 text-lg leading-8 text-white/68">{t.text}</p>
            <div className="mt-12 divide-y divide-white/18 border-y border-white/18">
              {accommodationItems.map((item, index) => (
                <article key={item.title.fr} className="grid gap-4 py-7 sm:grid-cols-[80px_1fr]">
                  <span className="font-serif text-3xl text-[#d8b56d]">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{item.title[language]}</h3>
                    <p className="mt-2 leading-7 text-white/68">{item.text[language]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <h3 className="font-serif text-4xl leading-tight tracking-[-0.03em] text-[#fff8e8]">{t.comfort}</h3>
          <div className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {comfortItems.map((item) => (
              <p key={item.fr} className="border-t border-white/18 pt-5 text-lg leading-7 text-white/72">
                {item[language]}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ language }: { language: Locale }) {
  const t = copy[language].services;

  return (
    <section className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="lg:sticky lg:top-12">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#1b6b59]">{t.eyebrow}</p>
          <h2 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#13271f] sm:text-6xl">
            {t.title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#3a4b43]">{t.text}</p>
        </div>
        <div className="divide-y divide-[#172b22]/18 border-y border-[#172b22]/18">
          {serviceItems.map((service, index) => (
            <div key={service.fr} className="group flex gap-6 py-8">
              <span className="font-serif text-4xl text-[#1b6b59]/45 transition group-hover:text-[#1b6b59]">
                0{index + 1}
              </span>
              <p className="pt-2 text-2xl leading-9 tracking-[-0.02em] text-[#182a22]">{service[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ReservationProps = {
  form: FormState;
  language: Locale;
  submitStatus: SubmitStatus;
  onChange: (field: keyof FormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCloseModal: () => void;
};

function SuccessModal({ language, onClose }: { language: Locale; onClose: () => void }) {
  const t = copy[language].reservation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 bg-white p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1b6b59]">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="mb-3 font-serif text-2xl text-[#13271f]">{t.modalTitle || "Demande envoyée!"}</h3>
        <p className="mb-6 text-[#3a4b43]">{t.success}</p>
        <button
          onClick={onClose}
          className="w-full bg-[#1b6b59] px-6 py-3 font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#10231c]"
        >
          {t.modalClose || "Fermer"}
        </button>
      </div>
    </div>
  );
}

function PhotosAndReservation({ form, language, submitStatus, onChange, onSubmit, onCloseModal, modalOpen }: ReservationProps & { modalOpen: boolean }) {
  const t = copy[language];

  return (
    <section id="photos" className="bg-[#e7dcc8] py-24 lg:py-32">
      <div className="px-5 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#1b6b59]">{t.photos.eyebrow}</p>
            <h2 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#13271f] sm:text-6xl">
              {t.photos.title}
            </h2>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gallery.map((item) => (
          <figure key={item.label.fr} className="group relative h-[430px] overflow-hidden bg-[#10231c]">
            <img
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              src={item.src}
              alt={`${item.label[language]} de Majorelle Cotonou`}
            />
            <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-6 py-7 text-sm font-semibold uppercase tracking-[0.24em] text-white">
              {item.label[language]}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-14 grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
        <img className="h-[420px] w-full object-cover" src={images.art} alt="Détail artistique de Majorelle Cotonou" />
        <div className="flex flex-col justify-center">
          <p className="text-lg leading-8 text-[#3a4b43]">{t.photos.text}</p>
        </div>
      </div>

      <div id="reservation" className="mx-auto mt-24 grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#1b6b59]">
            {t.reservation.eyebrow}
          </p>
          <h2 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#13271f] sm:text-6xl">
            {t.reservation.title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#3a4b43]">{t.reservation.text}</p>
          <div className="mt-10 space-y-4 text-lg leading-8 text-[#3a4b43]">
            <p>{address}</p>
            <p>Tel: {contactPhone}</p>
            <p>Mail: {contactEmail}</p>
          </div>
          <a
            className="mt-10 inline-flex items-center border border-[#1b6b59] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#1b6b59] transition hover:bg-[#1b6b59] hover:text-white"
            href={airbnbUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t.reservation.airbnb}
          </a>
        </div>

        <form onSubmit={onSubmit} className="bg-[#fff8e8] p-6 text-[#13271f] shadow-2xl shadow-black/10 sm:p-8 lg:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.form.name} value={form.name} onChange={(value) => onChange("name", value)} required />
            <Field
              label={t.form.email}
              type="email"
              value={form.email}
              onChange={(value) => onChange("email", value)}
              required
            />
            <Field label={t.form.phone} type="tel" value={form.phone} onChange={(value) => onChange("phone", value)} />
            <Field
              label={t.form.guests}
              type="number"
              min="1"
              max="4"
              value={form.guests}
              onChange={(value) => onChange("guests", value)}
            />
            <Field label={t.form.arrival} type="date" value={form.arrival} onChange={(value) => onChange("arrival", value)} />
            <Field
              label={t.form.departure}
              type="date"
              value={form.departure}
              onChange={(value) => onChange("departure", value)}
            />
            <label className="sm:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1b6b59]">{t.form.message}</span>
              <textarea
                className="mt-3 min-h-36 w-full border border-[#13271f]/20 bg-transparent px-4 py-3 outline-none transition focus:border-[#1b6b59]"
                value={form.message}
                onChange={(event) => onChange("message", event.target.value)}
                placeholder={t.form.placeholder}
              />
            </label>
          </div>
          <button
            className="mt-7 w-full bg-[#1b6b59] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#10231c] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={submitStatus === "sending"}
          >
            {submitStatus === "sending" ? t.reservation.sending : t.reservation.submit}
          </button>
          <p className="mt-4 text-xs leading-5 text-[#3a4b43]">{t.reservation.note}</p>
          <div aria-live="polite">
            {submitStatus === "error" && <p className="mt-5 text-sm leading-6 text-[#8a341f]">{t.reservation.error}</p>}
          </div>
        </form>
        {modalOpen && <SuccessModal language={language} onClose={onCloseModal} />}
      </div>
    </section>
  );
}

function Location({ language }: { language: Locale }) {
  const t = copy[language].map;

  return (
    <section id="map" className="bg-[#10231c] px-5 py-24 text-white sm:px-8 lg:px-14 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#d8b56d]">{t.eyebrow}</p>
          <h2 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#fff8e8] sm:text-6xl">
            {t.title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-white/68">{t.text}</p>
          <p className="mt-7 text-lg leading-8 text-white/78">{address}</p>
          <a
            className="mt-10 inline-flex items-center border border-[#d8b56d] px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#f4d28a] transition hover:bg-[#f4d28a] hover:text-[#10231c]"
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {t.cta}
          </a>
        </div>
        <div className="h-[520px] overflow-hidden bg-[#0c1a15]">
          <iframe
            className="h-full w-full grayscale-[20%]"
            src={mapUrl}
            title="Majorelle Cotonou Google Map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function UsefulLinks({ language }: { language: Locale }) {
  const t = copy[language].links;

  return (
    <section id="links" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-12">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#1b6b59]">{t.eyebrow}</p>
          <h2 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] text-[#13271f] sm:text-6xl">
            {t.title}
          </h2>
          <p className="mt-7 text-lg leading-8 text-[#3a4b43]">{t.text}</p>
          <p className="mt-7 text-sm uppercase tracking-[0.2em] text-[#1b6b59]">
            Championnat du monde de pétanque à Cotonou - du 8 au 17 septembre 2023
          </p>
        </div>
        <div className="divide-y divide-[#172b22]/18 border-y border-[#172b22]/18">
          {usefulLinks.map((link) => (
            <a
              key={link.title}
              className="group block py-6 transition hover:pl-3"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="text-lg font-semibold text-[#13271f] transition group-hover:text-[#1b6b59]">{link.title}</span>
              <span className="mt-2 block leading-7 text-[#3a4b43]">{link.description[language]}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter({ language }: { language: Locale }) {
  const t = copy[language].footer;

  return (
    <footer className="bg-[#081511] px-5 py-14 text-white sm:px-8 lg:px-14">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
        <div>
          <a href="#welcome" className="font-serif text-4xl tracking-[-0.04em] text-[#fff8e8]">
            Majorelle Cotonou
          </a>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/58">{keywords}</p>
          <p className="mt-5 text-sm uppercase tracking-[0.22em] text-[#d8b56d]">{t.artist}</p>
        </div>
        <div className="space-y-4 text-sm leading-7 text-white/68">
          <p>{address}</p>
          <p>Tel: {contactPhone}</p>
          <a className="block text-[#f4d28a] transition hover:text-white" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <p>{t.emergency}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.18em] text-white/72">
          <button className="text-left transition hover:text-[#f4d28a]" type="button" onClick={() => window.print()}>
            {t.print}
          </button>
          <a className="transition hover:text-[#f4d28a]" href="#welcome">
            {t.sitemap}
          </a>
          <a className="transition hover:text-[#f4d28a]" href="#photos">
            Photos et réservations
          </a>
          <a className="transition hover:text-[#f4d28a]" href="#map">
            Majorelle Cotonou on Google Map
          </a>
          <span className="pt-5 text-white/45">{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  min?: string;
  max?: string;
  required?: boolean;
};

function Field({ label, value, onChange, type = "text", min, max, required }: FieldProps) {
  return (
    <label>
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1b6b59]">{label}</span>
      <input
        className="mt-3 w-full border border-[#13271f]/20 bg-transparent px-4 py-3 outline-none transition focus:border-[#1b6b59]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        min={min}
        max={max}
        required={required}
      />
    </label>
  );
}