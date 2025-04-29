import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Import Devtools
import type { AppProps } from "next/app";
import { useState, ReactNode } from "react";
import "../app/globals.css"; // Import global styles
import { AppWrapper } from "@/context/AppContext";

// Extend the AppProps type to include a custom getLayout function
type CustomAppProps = AppProps & {
    Component: AppProps["Component"] & {
        getLayout?: (page: ReactNode) => ReactNode;
    };
};

export default function App({ Component, pageProps }: CustomAppProps) {
    const [queryClient] = useState<QueryClient>(() => new QueryClient());

    const getLayout =
        Component.getLayout || ((page: ReactNode) => page);

    return (
        <AppWrapper>
        <QueryClientProvider client={queryClient}>
        <div className="mt-16">
            {getLayout(<Component {...pageProps} />)}
            </div>
            <ReactQueryDevtools initialIsOpen={false} /> {/* Add Devtools */}
        </QueryClientProvider>
        </AppWrapper>
    );
}
