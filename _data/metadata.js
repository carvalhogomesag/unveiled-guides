export default {
    title: "Unveiled Guides",
    url: "https://unveiled-guides.netlify.app", // URL base, sem a barra no final
    language: "en",
    description: "Expert historical and practical guides to the world's most iconic landmarks. Discover the stories behind the sights, avoid the traps, and make your trip unforgettable.",
    author: {
        name: "Allan Dennis Carvalho Gomes",
        url: "/about/"
    },
    navigation: [
        { text: "About", url: "/about/" },
        { text: "Architecture", url: "/tags/architecture/" },
        { text: "Barcelona", url: "/tags/barcelona/" },
        { text: "Boat Trips", url: "/tags/boat-trips/" },
        { text: "Dubai", url: "/tags/dubai/" },
        { text: "Family", url: "/tags/family/" },
        { text: "History", url: "/tags/history/" },
        { text: "Lisbon", url: "/tags/lisbon/" },
        { text: "News", url: "/news/" },
        { text: "Palaces", url: "/tags/palaces/" },
        { text: "Paris", url: "/tags/paris/" },
        { text: "Rome", url: "/tags/rome/" },
        { text: "Sintra", url: "/tags/sintra/" },
        { text: "Travel Tips", url: "/tags/travel-tips/" },
        { text: "UNESCO", url: "/tags/unesco/" },
        { text: "Vatican", url: "/tags/vatican/" }
    ].sort((a, b) => a.text.localeCompare(b.text))
}