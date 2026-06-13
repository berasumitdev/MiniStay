"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "@/store";
import { hydrate } from "@/store/authSlice";
import type { AuthUser } from "@/types";

function AuthHydrator({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as AuthUser;
        store.dispatch(hydrate({ user, token }));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setReady(true);
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>{children}</AuthHydrator>
      </QueryClientProvider>
    </Provider>
  );
}
