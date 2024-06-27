import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const ShimmerPlaceholder = ({ style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.inOut(Easing.linear),
        useNativeDriver: false,
      })
    ).start();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#e1e1e1', '#c7c7c7', '#e1e1e1'],
  });

  return (
    <Animated.View style={[style, { backgroundColor }]} />
  );
};

const SkeletonLoader = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <ShimmerPlaceholder style={[styles.profilePic]} />
        <View style={styles.titleBar}>
          <ShimmerPlaceholder style={[styles.username]} />
          <ShimmerPlaceholder style={[styles.location]} />
        </View>
      </View>
      <ShimmerPlaceholder style={[styles.image]} />
      <View style={styles.content}>
        <ShimmerPlaceholder style={[styles.description]} />
        <ShimmerPlaceholder style={[styles.tag]} />
        <ShimmerPlaceholder style={[styles.stats]} />
      </View>
      <View style={styles.actions}>
        <ShimmerPlaceholder style={[styles.actionIcon]} />
        <ShimmerPlaceholder style={[styles.actionIcon]} />
        <ShimmerPlaceholder style={[styles.actionIcon]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { height: 0, width: 0 },
    marginVertical: 10,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e1e1',
  },
  titleBar: {
    marginLeft: 10,
    justifyContent: 'space-around',
    flex: 1,
  },
  username: {
    width: '80%',
    height: 10,
    backgroundColor: '#e1e1e1',
    marginBottom: 6,
  },
  location: {
    width: '60%',
    height: 10,
    backgroundColor: '#e1e1e1',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#e1e1e1',
    marginVertical: 10,
    borderRadius: 4,
  },
  content: {
    marginVertical: 10,
  },
  description: {
    width: '90%',
    height: 10,
    backgroundColor: '#e1e1e1',
    marginBottom: 6,
  },
  tag: {
    width: '50%',
    height: 10,
    backgroundColor: '#e1e1e1',
    marginBottom: 6,
  },
  stats: {
    width: '30%',
    height: 10,
    backgroundColor: '#e1e1e1',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionIcon: {
    width: 25,
    height: 25,
    backgroundColor: '#e1e1e1',
    borderRadius: 12.5,
  },
  shimmer: {
    backgroundColor: '#e1e1e1',
  },
});

export default SkeletonLoader;
