// app/(tabs)/profile.tsx
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import GuestProfile from "../profiles/guestProfile";
import UserProfile from "../profiles/userProfile";

export default function ProfileTab() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Step 1: 初始化讀取 session
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    init();

    // Step 2: 監聽登入/登出
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Step 3: 清理監聽
    return () => listener.subscription.unsubscribe();
  }, []);

  // Step 4: 渲染
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return user ? <UserProfile /> : <GuestProfile />;
}
