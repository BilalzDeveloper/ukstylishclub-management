import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ukstylishclub Management",
  description:
    "Operations console for UK Stylish Club — onboarding, catalog, orders, fulfillment, and analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
