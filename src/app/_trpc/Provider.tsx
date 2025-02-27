"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, loggerLink, splitLink, unstable_httpSubscriptionLink } from '@trpc/client';
import React, { ReactNode, useState } from 'react';
import { trpc } from './client';
export default function Provider({children}: {children: ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink(),
        splitLink({
          // uses the httpSubscriptionLink for subscriptions
          condition: (op) => op.type === 'subscription',
          true: unstable_httpSubscriptionLink({
            url: `https://marka-sell.vercel.app/api/trpc`,
          }),
          false: httpBatchLink({
            url: `https://marka-sell.vercel.app/api/trpc`,
          }),
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}