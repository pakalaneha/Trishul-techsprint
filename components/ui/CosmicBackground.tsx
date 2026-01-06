import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface CosmicBackgroundProps {
    children?: React.ReactNode;
}

const Orb = ({ size, color, duration, delay, startPos }: { size: number, color: string, duration: number, delay: number, startPos: { x: number, y: number } }) => {
    const moveX = useSharedValue(0);
    const moveY = useSharedValue(0);
    const opacity = useSharedValue(0.1);

    useEffect(() => {
        moveX.value = withRepeat(
            withTiming(width * 0.2, { duration, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
        moveY.value = withRepeat(
            withTiming(height * 0.15, { duration: duration * 1.2, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );
        opacity.value = withRepeat(
            withTiming(0.25, { duration: duration * 0.8, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: moveX.value },
            { translateY: moveY.value }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    top: startPos.y,
                    left: startPos.x,
                },
                animatedStyle
            ]}
        />
    );
};

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            <View style={StyleSheet.absoluteFill}>
                {/* Deeper, more luxurious base gradient */}
                <LinearGradient
                    colors={['#140E17', '#251A2A', '#140E17']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Multi-layered luxury orbs */}
                <Orb
                    size={width * 1.5}
                    color="#CB7896" // Pink/Rose
                    duration={20000}
                    delay={0}
                    startPos={{ x: -width * 0.5, y: -height * 0.2 }}
                />
                <Orb
                    size={width * 1.2}
                    color="#705367" // Muted Purple
                    duration={15000}
                    delay={1000}
                    startPos={{ x: width * 0.4, y: height * 0.5 }}
                />
                <Orb
                    size={width * 0.8}
                    color="#CB7896" // Highlight
                    duration={25000}
                    delay={2000}
                    startPos={{ x: -width * 0.2, y: height * 0.1 }}
                />
            </View>
            <View style={{ flex: 1 }}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#140E17',
    },
});
