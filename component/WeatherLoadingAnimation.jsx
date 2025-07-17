import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

const WeatherLoadingAnimation = () => {
  const cloudAnimation = useRef(new Animated.Value(0)).current;
  const rainAnimation = useRef(new Animated.Value(0)).current;
  const sunAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Cloud floating animation with easing
    const cloudLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnimation, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnimation, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Rain falling animation with smoother easing
    const rainLoop = Animated.loop(
      Animated.timing(rainAnimation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Sun rotation animation with smooth rotation
    const sunLoop = Animated.loop(
      Animated.timing(sunAnimation, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Text pulsing animation with smooth breathing effect
    const textLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(textAnimation, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(textAnimation, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Start all animations
    cloudLoop.start();
    rainLoop.start();
    sunLoop.start();
    textLoop.start();

    // Cleanup
    return () => {
      cloudLoop.stop();
      rainLoop.stop();
      sunLoop.stop();
      textLoop.stop();
    };
  }, []);

  // Animation transforms
  const cloudTransform = {
    transform: [
      {
        translateY: cloudAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const rainTransform = {
    transform: [
      {
        translateY: rainAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, 60],
        }),
      },
    ],
    opacity: rainAnimation.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 1, 1, 0],
    }),
  };

  const sunTransform = {
    transform: [
      {
        rotate: sunAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const textTransform = {
    opacity: textAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  return (
    <View 
      style={styles.container}
      accessibilityLabel="Loading weather data"
      accessibilityHint="Please wait while we fetch the latest weather information"
    >
      <View style={styles.weatherContainer}>
        {/* Sun */}
        <Animated.View style={[styles.sun, sunTransform]}>
          <View style={styles.sunCenter} />
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.sunRay,
                {
                  transform: [{ rotate: `${i * 45}deg` }],
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* Cloud */}
        <Animated.View style={[styles.cloud, cloudTransform]}>
          <View style={styles.cloudPart1} />
          <View style={styles.cloudPart2} />
          <View style={styles.cloudPart3} />
          <View style={styles.cloudPart4} />
        </Animated.View>

        {/* Rain drops */}
        <Animated.View style={[styles.rainContainer, rainTransform]}>
          {[...Array(15)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.rainDrop,
                {
                  left: 15 + i * 10,
                  height: 12 + (i % 3) * 3, // Varying rain drop sizes
                  opacity: 0.6 + (i % 3) * 0.2, // Varying opacity
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>

      {/* Loading text */}
      <Animated.View style={textTransform}>
        <Text style={styles.loadingText}>Getting Weather Data...</Text>
        <Text style={styles.subText}>Please wait while we fetch the latest weather information</Text>
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
  weatherContainer: {
    width: 200,
    height: 150,
    marginBottom: 40,
    position: 'relative',
  },
  
  // Sun styles
  sun: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunCenter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    position: 'absolute',
  },
  sunRay: {
    position: 'absolute',
    width: 3,
    height: 12,
    backgroundColor: '#FFD700',
    borderRadius: 2,
    top: -6,
  },

  // Cloud styles
  cloud: {
    position: 'absolute',
    top: 40,
    left: 30,
    width: 120,
    height: 60,
  },
  cloudPart1: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    left: 0,
    top: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cloudPart2: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    left: 25,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cloudPart3: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFFFFF',
    left: 55,
    top: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cloudPart4: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FFFFFF',
    left: 85,
    top: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Rain styles
  rainContainer: {
    position: 'absolute',
    top: 90,
    left: 40,
    width: 100,
    height: 60,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 15,
    backgroundColor: '#00C1F6',
    borderRadius: 1,
    opacity: 0.7,
  },

  // Text styles
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
    paddingHorizontal: 20,
  },
};

export default WeatherLoadingAnimation;