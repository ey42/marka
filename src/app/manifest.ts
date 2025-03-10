import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "marka.com",
        short_name: "marka",
        description: "suitable and easy eccomerce site",
        start_url: "/",
        background_color: "#393535",
        theme_color: "#f8fafc",
        icons: [
            {
                src: '/green-city.png',
                sizes: "192x192",
                type: "image/png"
            }
        ]
    }
}