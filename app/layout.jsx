import "./globals.css";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const serif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-serif" });

export const metadata = {
  title: "Paper Trail — ask your documents",
  description: "Ask questions about a document and see exactly where each answer comes from.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
