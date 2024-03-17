import Navigation from "@/components/site/navigation/Navigation";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <main className="h-full">
      <Navigation />
      {children}
    </main>
  )
}
