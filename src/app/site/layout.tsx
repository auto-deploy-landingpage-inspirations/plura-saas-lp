import Navigation from "@/components/site/navigation/Navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }} >
      <main className="h-full">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  )
}
