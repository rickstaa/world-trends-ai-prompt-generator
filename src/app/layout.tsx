/**
 * @file Main layout file for the application.
 */
import type { Metadata } from "next";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export const metadata: Metadata = {
  title: "World Trends AI Prompt Generator",
  description: "Generates AI animation prompts by analysing trends from the web.",
};

/**
 * Renders the root layout of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Theme
          accentColor="green"
          appearance="dark"
          grayColor="mauve"
          panelBackground="translucent"
          radius="large"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
