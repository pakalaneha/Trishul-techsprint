import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { Compass, Droplets, Home, Sparkles, User } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

function TabIcon({ icon: Icon, color, focused }: { icon: any, color: string, focused: boolean }) {
  return (
    <View className={`items-center justify-center p-2 rounded-full ${focused ? 'bg-aura-accent/10' : ''}`}>
      <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
      {focused && <View className="w-1 h-1 bg-aura-accent rounded-full absolute -bottom-1" />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'transparent',
          borderRadius: 30,
          height: 70,
          borderTopWidth: 0,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
        tabBarBackground: () => (
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#CB7896', // Aura Accent (Pink)
        tabBarInactiveTintColor: '#705367', // Aura Text Dim (Muted Purple)
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="styler"
        options={{
          title: 'Styler',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Sparkles} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Compass} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="care"
        options={{
          title: 'Self Care',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Droplets} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={User} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
