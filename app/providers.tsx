'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/providers/auth-provider'
import { store } from '@/stores/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { Provider } from 'react-redux'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Provider store={store}>
              {children}
            </Provider>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

