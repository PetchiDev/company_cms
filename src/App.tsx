import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from '@/routes/AppRouter';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, /* Instant sync */
      retry: 1,
      refetchOnWindowFocus: true, /* Auto refresh when coming back to the tab */
    },
  },
});

const AppContent = () => {
  useRealtimeSync();
  return <AppRouter />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
