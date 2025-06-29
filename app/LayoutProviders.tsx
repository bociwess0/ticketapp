// app/providers.tsx
"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import ToasterProvider from "./providers/ToasterProvider";
import { Provider } from "react-redux";
import { store } from "./redux/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ToasterProvider />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
