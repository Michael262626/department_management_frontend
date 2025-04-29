// app/providers.tsx
'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "@/store"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </ThemeProvider>
  )
}
