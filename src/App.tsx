import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from '@/routes/AppRouter';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

import { ToastProvider } from '@/components/ui/Toast/ToastProvider';
import { ConfirmProvider } from '@/components/ui/Modal/ConfirmProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, /* 2 minutes — data is fresh for 2 mins */
      gcTime: 30 * 60 * 1000, /* 30 minutes */
      retry: 2,
      refetchOnWindowFocus: true, /* Refetch when coming back to the tab IF data is stale */
      refetchOnMount: true,
    },
  },
});

const AppContent = () => {
  useRealtimeSync();
  return <AppRouter />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <ConfirmProvider>
        <AppContent />
      </ConfirmProvider>
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
