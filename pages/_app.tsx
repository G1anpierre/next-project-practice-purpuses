import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {useState} from 'react'
import {Layout} from '../components/Layout'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {Hydrate, QueryClient, QueryClientProvider} from '@tanstack/react-query'

function MyApp({Component, pageProps}: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Layout>
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </Layout>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default MyApp
