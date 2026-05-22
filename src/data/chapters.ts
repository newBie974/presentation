import type { Chapter } from "@/types";

export const chapters: Chapter[] = [
  {
    yearsLabel: "2025 — now",
    startYear: 2025,
    endYear: "now",
    title: {
      fr: "Backend Engineer chez Decider.ai",
      en: "Backend Engineer at Decider.ai",
    },
    role: {
      fr: "Agents IA · RAG · anonymisation local-first",
      en: "AI agents · RAG · local-first anonymisation",
    },
    body: {
      fr: "Je rejoins Decider.ai pour construire la couche backend d'une plateforme d'aide à la décision. Trois axes parallèles : développement d'agents IA, outils d'anonymisation qui tournent en local pour traiter la donnée sensible sans transfert externe, et systèmes RAG branchés sur les bases de connaissances internes.",
      en: "I joined Decider.ai to build the backend layer of a decision-support platform. Three parallel tracks: developing AI agents, local-first anonymisation tools to process sensitive data without external transfer, and RAG systems plugged into internal knowledge bases.",
    },
    highlights: [
      {
        fr: "Développement d'agents IA orchestrant plusieurs modèles pour automatiser des workflows décisionnels.",
        en: "Building AI agents that orchestrate multiple models to automate decision workflows.",
      },
      {
        fr: "Conception d'outils d'anonymisation local-first : les données sensibles ne quittent jamais l'environnement client.",
        en: "Designing local-first anonymisation tooling: sensitive data never leaves the client environment.",
      },
      {
        fr: "Mise en place de pipelines RAG pour exploiter les bases de connaissances internes des clients.",
        en: "Setting up RAG pipelines to leverage clients' internal knowledge bases.",
      },
      {
        fr: "Plus de détails à venir dès que je peux en partager publiquement.",
        en: "More details to come as soon as I can share them publicly.",
      },
    ],
    technologies: [
      "NestJS",
      "PostgreSQL",
      "Claude",
      "Gemini",
      "RAG",
      "LLM agents",
    ],
  },
  {
    yearsLabel: "2024 — now",
    startYear: 2024,
    endYear: "now",
    title: {
      fr: "Indie builder & co-founder",
      en: "Indie builder & co-founder",
    },
    role: {
      fr: "Engineering Manager @ Tookta · mes propres apps",
      en: "Engineering Manager @ Tookta · my own apps",
    },
    body: {
      fr: "En parallèle de mes missions salariées, je code et lance mes propres produits. C'est l'année où j'ai commencé à équilibrer rôle salarié, consulting et création solo — sans sacrifier aucun des trois.",
      en: "Alongside my employed roles, I code and ship my own products. This is the year I finally found a balance between an employed role, consulting and solo creation — without sacrificing any of the three.",
    },
    highlights: [
      {
        fr: "Trois apps consumer shippées en solo : VoiceJournal (iOS), Caroubolt (web), Tookta (iOS + Android).",
        en: "Three consumer apps shipped solo: VoiceJournal (iOS), Caroubolt (web), Tookta (iOS + Android).",
      },
      {
        fr: "Engineering Manager hands-on chez Tookta (co-fondateur indépendant) : du MVP au scale national, équipe de 4 personnes.",
        en: "Hands-on Engineering Manager at Tookta (independent co-founder): from MVP to national rollout, team of four.",
      },
      {
        fr: "Cadre méthodologique solo : Spec-Driven Development avec Claude, exécution par sub-agents, CLAUDE.md par repo pour scaler la qualité sans équipe.",
        en: "Solo methodology: Spec-Driven Development with Claude, sub-agent execution, per-repo CLAUDE.md to scale quality without a team.",
      },
    ],
    technologies: [
      "React Native",
      "Expo",
      "Supabase",
      "Claude",
      "Flutter",
      "Nest",
      "Astro",
    ],
  },
  {
    yearsLabel: "2024 — 2025",
    startYear: 2024,
    endYear: 2025,
    title: {
      fr: "Lead Backend Engineer chez Bloom Social Analytics",
      en: "Lead Backend Engineer at Bloom Social Analytics",
    },
    role: {
      fr: "Pipelines de collecte multi-réseaux · classification · normalisation",
      en: "Multi-network ingestion pipelines · classification · normalisation",
    },
    body: {
      fr: "Bloom Social Analytics opère une plateforme d'IA d'anticipation stratégique pour l'analyse profonde des réseaux sociaux. J'y ai dirigé les fondations data : conception et opération des pipelines de collecte qui alimentent les modèles d'analyse en aval, à l'échelle de plusieurs réseaux et de gros volumes.",
      en: "Bloom Social Analytics runs a strategic anticipation AI platform for deep social network analysis. I led the data foundations: designing and operating the ingestion pipelines that feed the downstream analytical models, across multiple networks at high volume.",
    },
    highlights: [
      {
        fr: "Conception et maintenance d'une pipeline end-to-end de collecte de données sur Facebook, X (Twitter), LinkedIn et Instagram.",
        en: "Designed and maintained an end-to-end data ingestion pipeline across Facebook, X (Twitter), LinkedIn and Instagram.",
      },
      {
        fr: "Mise en place des étages critiques — extraction, classification et normalisation — pour rendre la donnée analysable à grande échelle.",
        en: "Built the critical stages — extraction, classification and normalisation — to make the data analyzable at scale.",
      },
      {
        fr: "Intégration des flux dans la plateforme d'analyse de Bloom, utilisée par des clients allant des grandes entreprises aux organisations internationales, ONG et agences nationales.",
        en: "Plugged the streams into Bloom's analytics platform, used by clients ranging from large enterprises to international organisations, NGOs and national agencies.",
      },
    ],
    technologies: ["Node.js", "Apache Kafka", "PostgreSQL", "Data pipelines"],
  },
  {
    yearsLabel: "2022 — 2024",
    startYear: 2022,
    endYear: 2024,
    title: {
      fr: "Engineering Lead — scale-ups",
      en: "Engineering Lead — scale-ups",
    },
    role: {
      fr: "Gorillas · Immortal Game · Clone",
      en: "Gorillas · Immortal Game · Clone",
    },
    body: {
      fr: "Trois passages successifs sur des produits différents — quick commerce, gaming, AI. À chaque fois la même mission : structurer une équipe technique, livrer vite, garder la qualité.",
      en: "Three successive roles across different products — quick commerce, gaming, AI. Same mission every time: structure a tech team, ship fast, keep quality up.",
    },
    highlights: [
      {
        fr: "Engineering Lead chez Gorillas (quick commerce 10-min delivery), pilotage agile multi-squads sur stack Kotlin.",
        en: "Engineering Lead at Gorillas (10-min quick commerce delivery), agile multi-squad lead on a Kotlin stack.",
      },
      {
        fr: "Engineering Manager chez Clone — équipe produit, cycles courts, livraisons hebdomadaires.",
        en: "Engineering Manager at Clone — product team, short cycles, weekly shipping.",
      },
      {
        fr: "Backend Engineer chez Immortal Game (chess + crypto) sur TypeScript + NestJS.",
        en: "Backend Engineer at Immortal Game (chess + crypto) on TypeScript + NestJS.",
      },
    ],
    technologies: [
      "Kotlin",
      "TypeScript",
      "NestJS",
      "Agile / Scrum",
      "Squad management",
    ],
  },
  {
    yearsLabel: "2019 — 2022",
    startYear: 2019,
    endYear: 2022,
    title: {
      fr: "Frichti — du backend au management",
      en: "Frichti — from backend to management",
    },
    role: {
      fr: "Backend Developer → Squad Leader → Engineering Manager",
      en: "Backend Developer → Squad Leader → Engineering Manager",
    },
    body: {
      fr: "Quatre années chez Frichti à grandir avec la boîte. J'arrive comme dev backend, je termine Engineering Manager. C'est là que j'ai appris à coder en équipe et à diriger une équipe sans cesser de coder.",
      en: "Four years at Frichti, growing with the company. I joined as a backend dev, left as Engineering Manager. That's where I learned to code as part of a team, and to lead one without stopping to code.",
    },
    highlights: [
      {
        fr: "Passage de Développeur Backend à Engineering Manager en trois ans (Squad Leader entre-temps).",
        en: "From Backend Developer to Engineering Manager in three years (Squad Leader in between).",
      },
      {
        fr: "Stack Kotlin pour les services backend, mise en place de pratiques agiles à l'échelle multi-équipes.",
        en: "Kotlin stack on backend services, rollout of agile practices across multiple teams.",
      },
      {
        fr: "Première expérience structurante de leadership technique — recrutement, mentoring, 1:1, vision produit.",
        en: "First structural experience in tech leadership — hiring, mentoring, 1:1s, product vision.",
      },
    ],
    technologies: [
      "Kotlin",
      "HTML / CSS",
      "Agile",
      "Team management",
      "Hiring",
    ],
  },
  {
    yearsLabel: "2015 — 2019",
    startYear: 2015,
    endYear: 2019,
    title: {
      fr: "Premiers pas — dev web fullstack",
      en: "First steps — fullstack web dev",
    },
    role: {
      fr: "The Agent · Docteur IT · GDB technology",
      en: "The Agent · Docteur IT · GDB technology",
    },
    body: {
      fr: "Toulouse puis Paris. Mes premiers sites en prod, mes premières équipes, mes premiers bugs corrigés en urgence. Le PHP m'a appris à débugger ; AngularJS et Node m'ont appris à structurer.",
      en: "Toulouse, then Paris. My first sites in production, my first teams, my first emergency bug fixes. PHP taught me to debug; AngularJS and Node taught me to structure.",
    },
    highlights: [
      {
        fr: "Dev fullstack chez The Agent (Paris) sur Node.js + AngularJS + PHP — agence de contenu sportif.",
        en: "Fullstack dev at The Agent (Paris) on Node.js + AngularJS + PHP — sports content agency.",
      },
      {
        fr: "Dev web chez Docteur IT (Toulouse) sur PHP/CodeIgniter/Prestashop — outils internes et sites e-commerce de réparation high-tech.",
        en: "Web dev at Docteur IT (Toulouse) on PHP/CodeIgniter/Prestashop — internal tools and e-commerce sites for high-tech repair.",
      },
      {
        fr: "Directeur technique à 21 ans chez GDB technology sur un site communautaire — court mais formateur sur la gestion produit.",
        en: "CTO at 21 at GDB technology on a community site — short but formative on product management.",
      },
    ],
    technologies: [
      "PHP",
      "Node.js",
      "AngularJS",
      "CodeIgniter",
      "Prestashop",
      "MySQL",
    ],
  },
];
