import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';

import * as ImagePicker from 'expo-image-picker';
import { AIService } from '../../services/aiService';
import { useAuth } from '../../services/authStore';

export default function ColorAnalysisScreen() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [analyzing, setAnalyzing] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (!image) {
            alert('Please select an image first');
            return;
        }

        setAnalyzing(true);
        try {
            const res = await AIService.analyzeSkinTone(image);
            setResultData(res);
            // Update local user state
            if (res.skinTone || res.season) {
                setUser({
                    ...user,
                    skin_tone: res.skinTone || user?.skin_tone,
                    style_vibe: res.season || user?.style_vibe,
                    color_palette: Array.isArray(res.palette) ? res.palette.join(',') : res.palette
                });
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const ColorCircle = ({ color, name, isBad = false }: any) => (
        <View className="items-center m-3">
            <View
                style={{ backgroundColor: color, width: 68, height: 68, borderRadius: 34 }}
                className={`mb-3 items-center justify-center ${isBad ? 'opacity-60' : 'shadow-xl'}`}
            >
                {isBad && <Ionicons name="close" size={26} color="white" />}
            </View>
            <Text className="text-aura-textDim text-[10px] font-bold uppercase tracking-widest">{name}</Text>
        </View>
    );

    const ResultView = () => (
        <Animated.View entering={FadeInUp.springify()} className="flex-1">
            <View className="mb-10">
                <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-2">Aura Spectrum</Text>
                <Text className="text-aura-text text-3xl font-bold tracking-tight">Your Seasonal Identity</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="flex-row items-center mb-10 bg-white/5 p-6 rounded-[40px] border border-white/10">
                    <Image
                        source={{ uri: image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80' }}
                        className="w-32 h-32 rounded-full border-4 border-aura-accent mr-6"
                    />
                    <View className="flex-1">
                        <Text className="text-aura-accent font-bold text-xs tracking-[3px] uppercase mb-1">PROFILING: {resultData?.season || resultData?.skinTone || 'DEEP WINTER'}</Text>
                        <Text className="text-aura-text text-4xl font-bold tracking-tight">The Muse</Text>
                        <Text className="text-aura-textDim tracking-widest uppercase text-[10px] mt-2">Personalized Recommendation</Text>
                    </View>
                </View>

                {/* Suited Colors */}
                <View className="p-8 mb-8 rounded-[48px] bg-white/5 border border-white/10">
                    <View className="flex-row items-center mb-6">
                        <View className="w-10 h-10 rounded-full bg-aura-accent/20 items-center justify-center mr-4">
                            <Ionicons name="sparkles" size={20} color="#CB7896" />
                        </View>
                        <Text className="text-aura-text font-bold text-xl tracking-tight">Signature Palette</Text>
                    </View>
                    <View className="flex-row flex-wrap justify-center">
                        {(resultData?.palette || ['#CB7896', '#705367', '#EFF5F3', '#1E3A8A']).map((c: string, i: number) => (
                            <ColorCircle key={i} color={c} name={`Color ${i + 1}`} />
                        ))}
                    </View>
                </View>

                {/* Not Suited Colors */}
                {resultData?.avoid && resultData.avoid.length > 0 && (
                    <View className="p-8 mb-10 rounded-[48px] bg-white/5 border border-white/10 opacity-70">
                        <View className="flex-row items-center mb-6">
                            <View className="w-10 h-10 rounded-full bg-red-900/20 items-center justify-center mr-4">
                                <Ionicons name="remove-circle" size={20} color="#CB7896" />
                            </View>
                            <Text className="text-aura-text font-bold text-xl tracking-tight">Avoidance Tones</Text>
                        </View>
                        <View className="flex-row flex-wrap justify-center">
                            {resultData.avoid.map((c: string, i: number) => (
                                <ColorCircle key={i} color={c} name={`Avoid ${i + 1}`} isBad />
                            ))}
                        </View>
                    </View>
                )}

                <NeoButton
                    title="Adopt Palette"
                    onPress={() => router.back()}
                />
            </ScrollView>
        </Animated.View>
    );

    return (
        <CosmicBackground>
            <SafeAreaView className="flex-1 px-5 pt-4">
                <TouchableOpacity onPress={() => router.back()} className="mb-8 w-12 h-12 items-center justify-center bg-white/5 rounded-full border border-white/10">
                    <Ionicons name="arrow-back" size={22} color="#EFF5F3" />
                </TouchableOpacity>

                {!resultData ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-10">
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">Color Analytics</Text>
                            <Text className="text-aura-text text-4xl font-bold tracking-tight">Chromatic Profile</Text>
                        </View>

                        <Animated.View entering={FadeInUp} className="overflow-hidden border-2 border-dashed border-white/10 rounded-[48px] bg-white/5 h-[400px] mb-10">
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={pickImage}
                                className="w-full h-full items-center justify-center"
                            >
                                {image ? (
                                    <Image source={{ uri: image }} className="w-full h-full" />
                                ) : (
                                    <>
                                        <View className="bg-aura-accent/10 p-8 rounded-full mb-6">
                                            <Ionicons name="camera-outline" size={54} color="#CB7896" />
                                        </View>
                                        <Text className="text-aura-text font-bold text-2xl mb-3 tracking-tight">Upload Portrait</Text>
                                        <Text className="text-aura-textDim text-center px-8 text-sm leading-6">
                                            For optimal precision, ensure natural lighting and a neutral background.
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </Animated.View>

                        <NeoButton
                            title={analyzing ? "Analyzing Pigments..." : "Begin Analysis"}
                            onPress={handleAnalyze}
                            icon={!analyzing && <Ionicons name="analytics" size={20} color="#EFF5F3" />}
                        />

                        {analyzing && (
                            <View className="mt-12 items-center">
                                <ActivityIndicator size="large" color="#CB7896" />
                                <Text className="text-aura-textDim mt-6 font-bold tracking-[3px] uppercase text-[10px]">Processing skin undertones...</Text>
                            </View>
                        )}
                    </ScrollView>
                ) : (
                    <ResultView />
                )}
            </SafeAreaView>
        </CosmicBackground>
    );
}
