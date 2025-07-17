import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const SimpleWeatherLoader = () => {
  const pulseAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create pulsing animation for the weather icon
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Create fade animation for text
    const fadeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnimation, {
          toValue: 0.5,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    fadeLoop.start();

    return () => {
      pulseLoop.stop();
      fadeLoop.stop();
    };
  }, []);

  const pulseScale = pulseAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.weatherIcon,
          {
            transform: [{ scale: pulseScale }],
          },
        ]}
      >
        <Text style={styles.iconText}>🌤️</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnimation }}>
        <Text style={styles.loadingText}>Loading Weather...</Text>
        <Text style={styles.subText}>Fetching latest weather data</Text>
      </Animated.View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CAF4FF',
    paddingHorizontal: 20,
  },
  weatherIcon: {
    marginBottom: 30,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconText: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#5AB2FF',
    textAlign: 'center',
    lineHeight: 20,
  },
};

export default SimpleWeatherLoader;