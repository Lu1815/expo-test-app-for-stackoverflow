import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const SearchItemSkeleton = () => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current; // Inicializar la opacidad a 0.5

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.image} />
      <View style={styles.text} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  text: {
    height: 20,
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
});

export default SearchItemSkeleton;
