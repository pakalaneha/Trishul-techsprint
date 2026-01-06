import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface NeoButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: any;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    style,
    textStyle,
    icon,
    disabled = false
}) => {
    const scale = useSharedValue(1);
    const shimmer = useSharedValue(-1);

    useEffect(() => {
        if (variant === 'primary') {
            shimmer.value = withRepeat(
                withTiming(1, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
                -1,
                false
            );
        }
    }, [variant]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const shimmerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(shimmer.value, [-1, 1], [-200, 200]) },
            { skewX: '-20deg' }
        ],
    }));

    const handlePressIn = () => {
        if (disabled) return;
        scale.value = withSpring(0.96, { damping: 10, stiffness: 100 });
    };

    const handlePressOut = () => {
        if (disabled) return;
        scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    };

    const getGradientColors = (): [string, string, ...string[]] => {
        switch (variant) {
            case 'primary':
                return ['#CB7896', '#705367']; // Pink to Muted Purple
            case 'secondary':
                return ['#251A2A', '#452B40']; // Cards / Panels
            case 'outline':
                return ['transparent', 'transparent'];
            default:
                return ['#CB7896', '#705367'];
        }
    };

    return (
        <Animated.View style={[styles.container, style, animatedStyle]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={disabled}
                style={[styles.touchable, disabled && { opacity: 0.5 }]}
            >
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        variant === 'outline' && styles.outline
                    ]}
                >
                    {variant === 'primary' && (
                        <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
                            <LinearGradient
                                colors={['transparent', 'rgba(239, 245, 243, 0.15)', 'transparent']} // Soft Green Shimmer
                                style={{ width: 100, height: '100%' }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>
                    )}

                    {icon}
                    <Text style={[
                        styles.text,
                        variant === 'outline' && styles.outlineText,
                        variant === 'secondary' && styles.secondaryText,
                        textStyle
                    ]}>
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#CB7896',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
        borderRadius: 24,
    },
    touchable: {
        borderRadius: 24,
        overflow: 'hidden',
    },
    gradient: {
        paddingVertical: 18,
        paddingHorizontal: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 12,
    },
    outline: {
        borderWidth: 1.5,
        borderColor: '#CB7896',
    },
    text: {
        color: '#EFF5F3', // Soft Green/White
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    outlineText: {
        color: '#CB7896',
    },
    secondaryText: {
        color: '#EFF5F3',
    }
});
