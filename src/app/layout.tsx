import { Outfit } from "next/font/google";
import "./globals.css";
import AppProviders from "./providers";  // <-- server imports client component as child

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
