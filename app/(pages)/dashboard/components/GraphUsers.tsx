import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from 'lucide-react';
import { supabase } from '@/services/supabaseClient'; // Ensure this is correctly configured

interface StatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const Stat: React.FC<StatProps> = ({ title, value, icon }) => (
  <div className="flex items-center space-x-2">
    <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
    </div>
  </div>
);

export function GraphUsers() {
  const [userCount, setUserCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);
  const [creativeUserCount, setCreativeUserCount] = useState<number>(0);
  const [nullCreativeUserCount, setNullCreativeUserCount] = useState<number>(0);

  // Fetch initial counts and set up real-time subscriptions
  useEffect(() => {
    // Fetch initial counts
    const fetchInitialCounts = async () => {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch total events
      const { count: eventCount } = await supabase
        .from('admin_events')
        .select('*', { count: 'exact', head: true });

      // Fetch users with a creative_field from the userDetails table
      const { count: creativeUserCount } = await supabase
        .from('userDetails')
        .select('*', { count: 'exact', head: true })
        .not('creative_field', 'is', null);

      // Fetch users where creative_field is null
      const { count: nullCreativeUserCount } = await supabase
        .from('userDetails')
        .select('*', { count: 'exact', head: true })
        .is('creative_field', null);

      setUserCount(userCount || 0);
      setEventCount(eventCount || 0);
      setCreativeUserCount(creativeUserCount || 0);
      setNullCreativeUserCount(nullCreativeUserCount || 0);
    };

    fetchInitialCounts();

    // Set up real-time subscriptions
    const usersSubscription = supabase
      .channel('users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        async () => {
          const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
          setUserCount(userCount || 0);
        }
      )
      .subscribe();

    const eventsSubscription = supabase
      .channel('admin_events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_events' },
        async () => {
          const { count: eventCount } = await supabase
            .from('admin_events')
            .select('*', { count: 'exact', head: true });
          setEventCount(eventCount || 0);
        }
      )
      .subscribe();

    const creativeUsersSubscription = supabase
      .channel('creative_users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'userDetails' },
        async () => {
          // Fetch users with a creative_field
          const { count: creativeUserCount } = await supabase
            .from('userDetails')
            .select('*', { count: 'exact', head: true })
            .not('creative_field', 'is', null);

          // Fetch users where creative_field is null
          const { count: nullCreativeUserCount } = await supabase
            .from('userDetails')
            .select('*', { count: 'exact', head: true })
            .is('creative_field', null);

          setCreativeUserCount(creativeUserCount || 0);
          setNullCreativeUserCount(nullCreativeUserCount || 0);
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      usersSubscription.unsubscribe();
      eventsSubscription.unsubscribe();
      creativeUsersSubscription.unsubscribe();
    };
  }, []);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>No. of users</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Stat title="Total Users" value={userCount} icon={<Users className="h-4 w-4 text-primary" />} />
        <Stat title="Total Events" value={eventCount} icon={<Calendar className="h-4 w-4 text-primary" />} />
        <Stat title="Artists" value={creativeUserCount} icon={<Users className="h-4 w-4 text-primary" />} />
        <Stat title="Buyers" value={nullCreativeUserCount} icon={<Users className="h-4 w-4 text-primary" />} />
      </CardContent>
    </Card>
  );
}