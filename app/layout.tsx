import "./globals.css";

export const metadata = {
  title: "AAVYA — Private wellbeing for students",
  description: "A student-first wellbeing platform for schools and colleges, with private reflection tools, guided exercises, programs and progress.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
