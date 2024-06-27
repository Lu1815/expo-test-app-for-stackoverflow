// CommentsSectionSkeleton.js
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CommentsSectionSkeleton = () => {
  const animatedValue = new Animated.Value(0);

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  React.useEffect(() => {
    startAnimation();
  }, []);

  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e0e0e0', '#c0c0c0'],
  });

  return (
    <View style={styles.skeletonContainer}>
      <Animated.View
        style={[styles.skeletonBlock, { backgroundColor: interpolatedColor }]}
      />
      <Animated.View
        style={[styles.skeletonBlock, styles.skeletonText, { backgroundColor: interpolatedColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: {
    flex: 1,
    padding: 10,
  },
  skeletonBlock: {
    height: 20,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  skeletonText: {
    width: '80%',
    height: 10,
  },
});

export default CommentsSectionSkeleton;
