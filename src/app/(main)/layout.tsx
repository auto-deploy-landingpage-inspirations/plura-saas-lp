import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      {children}
    </ClerkProvider>
  )
}
