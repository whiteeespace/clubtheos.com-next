import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Club Theos Inc.",
    short_name: "Theos",
    start_url: "/",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    description: "A Montreal curated vintage/streetwear store located at Plateau Mont-Royal.",
    display: "standalone",
    icons: [
      {
        sizes: "64x64 32x32 24x24 16x16",
        src: "favicon.ico",
        type: "image/x-icon",
      },
    ],
  };
}
