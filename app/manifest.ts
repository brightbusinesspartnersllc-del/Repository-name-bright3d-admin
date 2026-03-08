import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bright3D Admin",
    short_name: "Bright3D",
    description: "Bright3D internal pricing and product management app",
    start_url: "/admin",
    display: "standalone",
    background_color: "#eef4ff",
    theme_color: "#14213d",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}