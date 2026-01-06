import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { useAuth } from '../../services/authStore';
import { FlaskApiService } from '../../services/flaskApiService';

export default function ProfileScreen() {
    const { user, setUser, logout } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await FlaskApiService.getUserProfile();
                if (profileData) {
                    setUser({ ...user, ...profileData });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Refresh on focus for dynamic updates
    useEffect(() => {
        const interval = setInterval(async () => {
            const profileData = await FlaskApiService.getUserProfile();
            if (profileData) setUser({ ...user, ...profileData });
        }, 5000); // Polling for demo, or better use useFocusEffect from navigation
        return () => clearInterval(interval);
    }, []);

    const luxurySpring = (delay: number) => FadeInDown.mass(0.5).damping(18).stiffness(120).delay(delay);

    const InfoCard = ({ title, value, icon, color, delay }: any) => (
        <Animated.View entering={luxurySpring(delay)} className="w-[48%] mb-5">
            <View className="bg-white/5 border border-white/10 p-5 h-32 rounded-[32px] justify-center">
                <View className="flex-row justify-between items-start mb-4">
                    <View style={{ backgroundColor: `${color}20`, padding: 12, borderRadius: 16 }}>
                        <Ionicons name={icon} size={22} color={color} />
                    </View>
                </View>
                <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-[2px] mb-1">{title}</Text>
                <Text className="text-aura-text font-bold text-lg tracking-tight">{value}</Text>
            </View>
        </Animated.View>
    );

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-5 pt-2" showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-10">
                        <Text className="text-aura-text text-xl font-bold tracking-tight uppercase">Maison d'Aura</Text>
                        <TouchableOpacity onPress={logout} className="w-10 h-10 rounded-full items-center justify-center bg-white/5 border border-white/10">
                            <Ionicons name="log-out-outline" size={20} color="#CB7896" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile Header */}
                    <Animated.View entering={luxurySpring(100)} className="items-center mb-12">
                        <View className="relative">
                            <View className="p-1 rounded-full border-2 border-aura-accent/30">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' }}
                                    className="w-28 h-28 rounded-full border-4 border-aura-bg"
                                />
                            </View>
                            <View className="absolute bottom-1 right-1 bg-aura-accent p-3 rounded-full border-4 border-aura-bg">
                                <Ionicons name="camera" size={16} color="#140E17" />
                            </View>
                        </View>
                        <Text className="text-aura-text text-3xl font-bold mt-8 tracking-tight">{user?.displayName || 'Olivia Wilson'}</Text>
                        <Text className="text-aura-accent text-xs font-bold tracking-[4px] uppercase mt-2">Haute Couture Member</Text>

                        <View className="flex-row mt-6 items-center bg-aura-primary/10 px-6 py-2 rounded-full border border-aura-primary/30">
                            <Ionicons name="sparkles" size={14} color="#CB7896" className="mr-3" />
                            <Text className="text-aura-text text-xs font-bold tracking-widest uppercase">Style Level: 8.5</Text>
                        </View>
                    </Animated.View>

                    {/* Analysis Summary */}
                    <View className="mb-10">
                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-aura-text text-lg font-bold tracking-widest uppercase">Style DNA</Text>
                            <View className="h-[1px] flex-1 bg-white/10 ml-4" />
                        </View>
                        <View className="flex-row flex-wrap justify-between">
                            <InfoCard
                                title="Silhouette"
                                value={(user as any)?.body_shape || "Analysis Pending"}
                                icon="body"
                                color="#CB7896"
                                delay={200}
                            />
                            <InfoCard
                                title="Palette"
                                value={(user as any)?.color_palette?.split(',')[0] || "Analysis Pending"}
                                icon="color-palette"
                                color="#705367"
                                delay={300}
                            />
                            <InfoCard
                                title="Essence"
                                value="Tailored Chic"
                                icon="shirt"
                                color="#CB7896"
                                delay={400}
                            />
                            <InfoCard
                                title="Aura Vibe"
                                value={(user as any)?.style_vibe || "Confident"}
                                icon="flash"
                                color="#705367"
                                delay={500}
                            />
                        </View>
                    </View>

                    {/* Settings / Actions */}
                    <Animated.View entering={luxurySpring(600)} className="mb-24">
                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-aura-text text-lg font-bold tracking-widest uppercase">Atelier Settings</Text>
                            <View className="h-[1px] flex-1 bg-white/10 ml-4" />
                        </View>

                        <View className="gap-6">
                            {/* Personal & App Settings */}
                            <View className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                                {[
                                    { title: 'Identity and Preferences', icon: 'person-outline' as any, route: '/settings/identity' },
                                    { title: 'Digital Wardrobe', icon: 'list-outline' as any, route: '/settings/wardrobe' },
                                    { title: 'Atmosphere (Dark Mode)', icon: 'moon-outline' as any, isToggle: true },
                                    { title: 'Intelligent Alerts', icon: 'notifications-outline' as any, route: '/settings/alerts' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={async () => {
                                            if (item.isToggle) {
                                                const newVal = !user?.dark_mode;
                                                await FlaskApiService.updateSettings({ dark_mode: newVal });
                                                setUser({ ...user, dark_mode: newVal });
                                            } else if (item.route) {
                                                router.push(item.route as any);
                                            }
                                        }}
                                        className={`flex-row items-center p-6 ${index !== 3 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <View className="bg-white/5 p-3 rounded-full mr-5 border border-white/10">
                                            <Ionicons name={item.icon} size={20} color="#CB7896" />
                                        </View>
                                        <Text className="text-aura-text font-bold flex-1 text-sm tracking-tight">{item.title}</Text>
                                        {item.isToggle ? (
                                            <View className={`w-12 h-6 rounded-full justify-center px-1 ${user?.dark_mode ? 'bg-aura-accent items-end' : 'bg-white/10 items-start'}`}>
                                                <View className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </View>
                                        ) : (
                                            <Ionicons name="chevron-forward" size={18} color="#705367" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-[40px] overflow-hidden">
                                {[
                                    { title: 'Legal and Privacy', icon: 'shield-checkmark-outline' as any, route: '/settings/legal' },
                                    { title: 'Curator Support', icon: 'help-circle-outline' as any, route: '/settings/support' },
                                ].map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => item.route && router.push(item.route as any)}
                                        className={`flex-row items-center p-6 ${index === 0 ? 'border-b border-white/5' : ''}`}
                                    >
                                        <View className="bg-white/5 p-3 rounded-full mr-5 border border-white/10">
                                            <Ionicons name={item.icon} size={20} color="#705367" />
                                        </View>
                                        <Text className="text-aura-text font-bold flex-1 text-sm tracking-tight">{item.title}</Text>
                                        <Ionicons name="chevron-forward" size={18} color="#705367" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </CosmicBackground>
    );
}
