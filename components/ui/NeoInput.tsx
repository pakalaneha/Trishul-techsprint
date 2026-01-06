import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface NeoInputProps extends TextInputProps {
    icon?: React.ReactNode;
}

export const NeoInput: React.FC<NeoInputProps> = ({ icon, style, onFocus, onBlur, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const borderColor = useSharedValue('rgba(255, 255, 255, 0.1)');
    const borderWidth = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            borderColor: borderColor.value,
            borderWidth: borderWidth.value,
        };
    });

    const handleFocus = (e: any) => {
        setIsFocused(true);
        borderColor.value = withTiming('#CB7896', { duration: 200 });
        borderWidth.value = withTiming(2, { duration: 200 });
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        borderColor.value = withTiming('rgba(255, 255, 255, 0.1)', { duration: 200 });
        borderWidth.value = withTiming(1, { duration: 200 });
        if (onBlur) onBlur(e);
    };

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <TextInput
                {...props}
                style={[styles.input, style]}
                placeholderTextColor="#705367"
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(37, 26, 42, 0.6)',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 16,
        // border width and color handled by animated style
    },
    iconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: '#EFF5F3',
        fontSize: 16,
    },
});
