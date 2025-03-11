/**
 * Provides a welcome message with sample queries and information about multilingual support
 * @returns A welcome message with sample queries
 */
export default async function welcomeMessage() {
  return {
    message:
      "Welcome to the Caschys Blog Assistant! I can help you search for articles, get the latest news, and submit tips to the blog.",
    features: [
      "Search for articles on specific topics",
      "Advanced search for articles by author, date, or category",
      "Get the latest articles from the blog",
      "Submit tips to the blog",
    ],
    multilingual: "You can ask questions in any language, and I'll respond in the same language.",
    sampleQueries: [
      {
        language: "English",
        queries: [
          "Show me the latest articles from Caschys Blog",
          "Search for articles about iPhone",
          "Find news about Samsung Galaxy",
          "Show me articles by Carsten Knobloch from 2023",
          "Find articles about AI published after 2022-01-01",
          "I want to submit a tip about a new tech product",
          "What are the most recent articles about AI?",
        ],
      },
      {
        language: "German",
        queries: [
          "Zeige mir die neuesten Artikel",
          "Suche nach Artikeln über iPhone",
          "Finde Neuigkeiten über Samsung Galaxy",
          "Zeige mir Artikel von Carsten Knobloch aus dem Jahr 2023",
          "Finde Artikel über KI, die nach dem 01.01.2022 veröffentlicht wurden",
          "Ich möchte einen Tipp zu einem neuen Tech-Produkt einreichen",
          "Was sind die neuesten Artikel über KI?",
        ],
      },
      {
        language: "Spanish",
        queries: [
          "Muéstrame los artículos más recientes",
          "Buscar artículos sobre iPhone",
          "Encontrar noticias sobre Samsung Galaxy",
          "Muéstrame artículos de Carsten Knobloch de 2023",
          "Buscar artículos sobre IA publicados después del 01-01-2022",
          "Quiero enviar un consejo sobre un nuevo producto tecnológico",
          "¿Cuáles son los artículos más recientes sobre IA?",
        ],
      },
    ],
  };
}
