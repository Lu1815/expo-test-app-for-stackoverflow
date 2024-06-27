import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

const ProfilePostsSkeletonLoader = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e0e0e0", "#c0c0c0"],
  });

  return <Animated.View style={[styles.skeletonItem, { backgroundColor }]} />;
};

const styles = StyleSheet.create({
  skeletonItem: {
    width: "32.5%",
    height: 100,
    margin: 1,
  },
});

export default ProfilePostsSkeletonLoader;
