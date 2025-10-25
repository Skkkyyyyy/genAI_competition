// app/(tabs)/profile.tsx
import { supabase } from "@/lib/frontend_supa";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import GuestProfile from "../profiles/guestProfile";
import UserProfile from "../profiles/userProfile";

export default function ProfileTab() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return <UserProfile />;
}
