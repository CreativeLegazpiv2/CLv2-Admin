import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

const Stat: React.FC<StatProps> = ({ title, value, icon }) => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
        <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
      </div>
    </CardContent>
  </Card>
);

export function GraphUsers() {
  const [userCount, setUserCount] = useState<number>(0);
  const [eventCount, setEventCount] = useState<number>(0);
  const [creativeUserCount, setCreativeUserCount] = useState<number>(0);
  const [nullCreativeUserCount, setNullCreativeUserCount] = useState<number>(0);
  const [monthlyUserData, setMonthlyUserData] = useState<{ month: string; users: number }[]>([]);

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

    // Fetch monthly user registration data
    const fetchMonthlyUserData = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('created_at')
        .order('created_at', { ascending: true });

      if (data) {
        const monthlyCounts: { [key: string]: number } = {};

        data.forEach((user) => {
          const date = new Date(user.created_at);
          const month = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2023"
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        const formattedData = Object.keys(monthlyCounts).map((month) => ({
          month,
          users: monthlyCounts[month],
        }));

        setMonthlyUserData(formattedData);
      }
    };

    fetchInitialCounts();
    fetchMonthlyUserData();

    // Set up real-time subscriptions (omitted for brevity)
  }, []);

  return (
    <div className="w-full">
      {/* Stats Cards */}
      <div className="flex space-x-4 mb-8">
        <Stat title="Total Users" value={userCount} icon={<Users className="h-4 w-4 text-primary" />} />
        <Stat title="Total Events" value={eventCount} icon={<Calendar className="h-4 w-4 text-primary" />} />
        <Stat title="Artists" value={creativeUserCount} icon={<Users className="h-4 w-4 text-primary" />} />
        <Stat title="Buyers" value={nullCreativeUserCount} icon={<Users className="h-4 w-4 text-primary" />} />
      </div>

      {/* Bar Chart for Monthly User Registrations */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly User Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyUserData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="Users Registered" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}