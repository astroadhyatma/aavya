import "./globals.css";

export const metadata = {
  title: "AAVYA — Wellbeing, built around people",
  description: "AAVYA interactive wellbeing platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
