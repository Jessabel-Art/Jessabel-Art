import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StoreProvider } from "@/components/store-provider";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Santos FormWorks | Ideas. Printed. Possibilities.",
    template: "%s | Santos FormWorks",
  },
  description:
    "Creative, functional 3D prints and custom printing in Jacksonville, Florida. Bring your ideas to life with Santos FormWorks.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
