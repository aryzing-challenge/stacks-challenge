import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FC, ReactNode } from "react";

const queryClient = new QueryClient();

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <QueryClientProvider client={queryClient}>
        {/* Rest of the app */}
        {children}
      </QueryClientProvider>
    </MantineProvider>
  );
};
