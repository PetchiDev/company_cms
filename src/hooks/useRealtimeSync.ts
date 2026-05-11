import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SUPABASE_TABLES } from '@/constants/appConstants';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // ─── 1. BROWSER-NATIVE BROADCASTCHANNEL SYNC (FOOLPROOF LOCAL TAB SYNC) ───
    const syncChannel = new BroadcastChannel('kryptos-cms-realtime-sync');
    
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'invalidate') {
        const queryKey = event.data.queryKey;
        console.log(`[BroadcastChannel Sync] Invalidation message received for key: ${queryKey}`);
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    };

    // ─── 2. SUPABASE BACKEND REALTIME SYNC (FOR REMOTE DEPLOYED USERS) ───
    const tableToQueryKeyMap: Record<string, string> = {
      [SUPABASE_TABLES.SITE_CONTENT]: QUERY_KEYS.SITE_CONTENT,
      [SUPABASE_TABLES.STATS]: QUERY_KEYS.STATS,
      [SUPABASE_TABLES.CERTIFICATIONS]: QUERY_KEYS.CERTIFICATIONS,
      [SUPABASE_TABLES.TESTIMONIALS]: QUERY_KEYS.TESTIMONIALS,
      [SUPABASE_TABLES.CASE_STUDIES]: QUERY_KEYS.CASE_STUDIES,
      [SUPABASE_TABLES.BLOG_ARTICLES]: QUERY_KEYS.BLOG_ARTICLES,
      [SUPABASE_TABLES.CULTURE_HIGHLIGHTS]: QUERY_KEYS.CULTURE_HIGHLIGHTS,
      [SUPABASE_TABLES.SERVICE_CATEGORIES]: QUERY_KEYS.SERVICE_CATEGORIES,
      [SUPABASE_TABLES.SERVICES]: QUERY_KEYS.SERVICES,
    };

    const channels = Object.entries(tableToQueryKeyMap).map(([tableName, queryKey]) => {
      const channel = supabase
        .channel(`realtime-${tableName}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: tableName },
          (payload) => {
            console.log(`[Supabase Realtime] Change detected on public.${tableName}:`, payload);
            queryClient.invalidateQueries({ queryKey: [queryKey] });
          }
        )
        .subscribe();
      return channel;
    });

    return () => {
      syncChannel.close();
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient]);
};
