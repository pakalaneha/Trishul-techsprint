import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CosmicBackground } from '../../components/ui/CosmicBackground';
import { NeoButton } from '../../components/ui/NeoButton';
import { NeoInput } from '../../components/ui/NeoInput';

import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../services/authStore';
import { FlaskApiService } from '../../services/flaskApiService';

export default function BodyShapeScreen() {
    const router = useRouter();
    const { user, setUser } = useAuth();
    const [analyzing, setAnalyzing] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [method, setMethod] = useState<'upload' | 'measure'>('upload');
    const [image, setImage] = useState<string | null>(null);

    const luxurySpring = (delay: number) => FadeInUp.mass(0.5).damping(18).stiffness(120).delay(delay);

    // Measurements state
    const [bust, setBust] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (method === 'upload' && !image) {
            alert('Please select an image first');
            return;
        }

        setAnalyzing(true);
        try {
            const res = await FlaskApiService.analyzeBodyShape({
                imageUri: image || undefined,
                measurements: method === 'measure' ? { bust, waist, hips } : undefined
            });
            setResultData(res);
            // Update local user state
            if (res.body_shape) {
                setUser({ ...user, body_shape: res.body_shape });
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Analysis failed. Please try again.');
        } finally {
            setAnalyzing(false);
        }
    };

    const ResultView = () => (
        <Animated.View entering={luxurySpring(100)} className="flex-1">
            <View className="mb-10">
                <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-2">Morphology Result</Text>
                <Text className="text-aura-text text-3xl font-bold tracking-tight">Your Silhouette Profile</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
                <View className="items-center mb-12">
                    <View className="relative">
                        <View className="absolute inset-0 bg-aura-primary blur-[80px] opacity-10 rounded-full scale-125" />
                        <View className="p-1 rounded-[48px] border-2 border-aura-accent/30">
                            <Image
                                source={{ uri: image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80' }}
                                className="w-56 h-80 rounded-[44px]"
                            />
                        </View>
                    </View>
                    <Text className="text-aura-text text-4xl font-bold mt-10 tracking-tight">{resultData?.body_shape || 'Hourglass'}</Text>
                    <View className="h-[1px] w-20 bg-aura-accent/40 my-4" />
                    <Text className="text-aura-textDim text-center px-8 leading-7 italic">
                        "{resultData?.description || 'A unique frame with distinct proportions.'}"
                    </Text>
                </View>

                {/* Styling Tips */}
                <View className="p-8 mb-10 bg-white/5 border border-white/10 rounded-[40px]">
                    <Text className="text-aura-accent font-bold mb-4 uppercase text-[10px] tracking-[4px]">Atelier Tips</Text>
                    <View className="gap-4">
                        {(resultData?.styling_tips || [
                            "Emphasize your favorite features.",
                            "Focus on balanced proportions.",
                            "Choose fabrics that drape well."
                        ]).map((tip: string, i: number) => (
                            <View key={i} className="flex-row items-center">
                                <View className="w-2 h-2 rounded-full bg-aura-accent mr-4" />
                                <Text className="text-aura-text leading-6 flex-1">{tip}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <NeoButton
                    title="Return to Atelier"
                    onPress={() => router.back()}
                    variant="outline"
                    style={{ marginBottom: 40 }}
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
                        <Animated.View entering={luxurySpring(100)} className="mb-10">
                            <Text className="text-aura-accent text-xs font-bold uppercase tracking-[4px] mb-3">Symmetry Mapping</Text>
                            <Text className="text-aura-text text-4xl font-bold tracking-tight">Define Your Fit</Text>
                        </Animated.View>

                        <View className="flex-row gap-4 mb-10">
                            <TouchableOpacity
                                className={`flex-1 p-6 rounded-[36px] border ${method === 'upload' ? 'bg-aura-primary/20 border-aura-secondary' : 'bg-white/5 border-white/10'}`}
                                onPress={() => setMethod('upload')}
                            >
                                <View className="items-center">
                                    <View className="bg-aura-accent/10 p-4 rounded-full mb-4">
                                        <Ionicons name="camera-outline" size={32} color={method === 'upload' ? '#CB7896' : '#705367'} />
                                    </View>
                                    <Text className={`font-bold tracking-tight uppercase text-xs ${method === 'upload' ? 'text-aura-text' : 'text-aura-textDim'}`}>Vision</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className={`flex-1 p-6 rounded-[36px] border ${method === 'measure' ? 'bg-aura-primary/20 border-aura-secondary' : 'bg-white/5 border-white/10'}`}
                                onPress={() => setMethod('measure')}
                            >
                                <View className="items-center">
                                    <View className="bg-aura-accent/10 p-4 rounded-full mb-4">
                                        <Ionicons name="analytics-outline" size={32} color={method === 'measure' ? '#CB7896' : '#705367'} />
                                    </View>
                                    <Text className={`font-bold tracking-tight uppercase text-xs ${method === 'measure' ? 'text-aura-text' : 'text-aura-textDim'}`}>Metrics</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className="min-h-[350px]">
                            {method === 'upload' ? (
                                <Animated.View entering={luxurySpring(300)} className="overflow-hidden border-2 border-dashed border-white/10 rounded-[48px] bg-white/5 h-[450px]">
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={pickImage}
                                        className="w-full h-full items-center justify-center"
                                    >
                                        {image ? (
                                            <Image source={{ uri: image }} className="w-full h-full" />
                                        ) : (
                                            <>
                                                <View className="bg-aura-accent/10 p-10 rounded-full mb-8">
                                                    <Ionicons name="body-outline" size={64} color="#CB7896" />
                                                </View>
                                                <Text className="text-aura-text font-bold text-2xl mb-4 tracking-tight">Full-Length Capture</Text>
                                                <Text className="text-aura-textDim text-center text-sm leading-7 px-8">
                                                    Utilize high-contrast lighting and neutral attire for a precise architectural assessment.
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </Animated.View>
                            ) : (
                                <Animated.View entering={luxurySpring(300)} className="bg-white/5 p-8 border border-white/10 rounded-[48px]">
                                    <Text className="text-aura-textDim mb-10 text-sm leading-7 italic uppercase tracking-widest text-center px-4">Enter your architectural measurements for instant profiling.</Text>
                                    <View className="gap-6">
                                        <NeoInput
                                            placeholder="Bust (inches)"
                                            value={bust}
                                            onChangeText={setBust}
                                            keyboardType="numeric"
                                        />
                                        <NeoInput
                                            placeholder="Waist (inches)"
                                            value={waist}
                                            onChangeText={setWaist}
                                            keyboardType="numeric"
                                        />
                                        <NeoInput
                                            placeholder="Hips (inches)"
                                            value={hips}
                                            onChangeText={setHips}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </Animated.View>
                            )}
                        </View>

                        <View className="mt-10">
                            <NeoButton
                                title={analyzing ? "Synthesizing Data..." : "Calculate Silhouette"}
                                onPress={handleAnalyze}
                                icon={!analyzing && <Ionicons name="scan" size={20} color="#EFF5F3" />}
                            />
                        </View>

                        {analyzing && (
                            <View className="mt-12 items-center">
                                <ActivityIndicator size="large" color="#CB7896" />
                                <Text className="text-aura-textDim mt-6 font-bold tracking-[3px] uppercase text-[10px]">Architecting silhouette model...</Text>
                            </View>
                        )}

                        <View className="h-20" />
                    </ScrollView>
                ) : (
                    <ResultView />
                )}
            </SafeAreaView>
        </CosmicBackground>
    );
}
