import React, { useRef, useEffect } from 'react';
import { ActivityIndicator, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navTypes';
import { useExplore } from '../hooks/useExplore';
import SwipeCard, { SwipeCardHandle, SwipeDirection } from '../components/SwipeCard';
import { colors } from '../theme/colors';

const ExploreScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // kaksi pysyvää card instanssia jotta estetään musta kortti / saadaan sujuvuutta
  const cardRef0 = useRef<SwipeCardHandle>(null);
  const cardRef1 = useRef<SwipeCardHandle>(null);

  const {
    currentPoi,
    nextPoi,
    currentIndex,
    finished,
    loading,
    error,
    startSwipe,
    completeSwipe,
  } = useExplore();

  const frontSlot = (currentIndex % 2) as 0 | 1;
  const slot0Poi = frontSlot === 0 ? currentPoi : nextPoi;
  const slot1Poi = frontSlot === 1 ? currentPoi : nextPoi;
  const frontRef = frontSlot === 0 ? cardRef0 : cardRef1;

  const dragX = useSharedValue(0);
  const frontSlotShared = useSharedValue(frontSlot);

  useEffect(() => {
    frontSlotShared.value = frontSlot;
  }, [frontSlot]);

  const slot0Style = useAnimatedStyle(() => {
    const isFront = frontSlotShared.value === 0;
    const progress = isFront ? 1 : dragX.value;
    const scale = interpolate(progress, [0, 1], [0.96, 1]);
    const transY = interpolate(progress, [0, 1], [14, 0]);
    const op = interpolate(progress, [0, 1], [0.72, 1]);

    return {
      zIndex: isFront ? 2 : 1,
      transform: [{ scale }, { translateY: transY }],
      opacity: op,
    };
  });

  const slot1Style = useAnimatedStyle(() => {
    const isFront = frontSlotShared.value === 1;
    const progress = isFront ? 1 : dragX.value;
    const scale = interpolate(progress, [0, 1], [0.96, 1]);
    const transY = interpolate(progress, [0, 1], [14, 0]);
    const op = interpolate(progress, [0, 1], [0.72, 1]);

    return {
      zIndex: isFront ? 2 : 1,
      transform: [{ scale }, { translateY: transY }],
      opacity: op,
    };
  });

  const handleActionPress = (direction: SwipeDirection) => {
    const approvedDirection = startSwipe(direction);
    if (!approvedDirection) return;
    frontRef.current?.swipe(approvedDirection);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/PuluTextLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cardStack}>
        {loading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color="#0F8226" />
            <Text style={styles.emptySubtitle}>Haetaan paikkoja...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={64} color="#CC0000" />
            <Text style={styles.emptyTitle}>Haku epäonnistui</Text>
            <Text style={styles.emptySubtitle}>{error}</Text>
          </View>
        ) : finished ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Paikkasuosituksemme loppuivat!</Text>
            <Text style={styles.emptySubtitle}>Tiedätkö hyvän paikan?</Text>
            <Pressable
              style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}
              onPress={() => navigation.navigate('AddPlace')}
            >
              <Text style={styles.addButtonText}>Lisää se nyt!</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.stackFrame}>
            <Animated.View
              style={[styles.cardSlot, slot0Style]}
              pointerEvents={frontSlot === 0 ? 'auto' : 'none'}
            >
              {slot0Poi && (
                <SwipeCard
                  ref={cardRef0}
                  poi={slot0Poi}
                  isTop={frontSlot === 0}
                  onSwipeRequest={frontSlot === 0 ? startSwipe : undefined}
                  onSwipe={frontSlot === 0 ? completeSwipe : undefined}
                  style={styles.cardFill}
                  dragX={frontSlot === 0 ? dragX : undefined}
                />
              )}
            </Animated.View>

            <Animated.View
              style={[styles.cardSlot, slot1Style]}
              pointerEvents={frontSlot === 1 ? 'auto' : 'none'}
            >
              {slot1Poi && (
                <SwipeCard
                  ref={cardRef1}
                  poi={slot1Poi}
                  isTop={frontSlot === 1}
                  onSwipeRequest={frontSlot === 1 ? startSwipe : undefined}
                  onSwipe={frontSlot === 1 ? completeSwipe : undefined}
                  style={styles.cardFill}
                  dragX={frontSlot === 1 ? dragX : undefined}
                />
              )}
            </Animated.View>
          </View>
        )}
      </View>

      {!loading && !error && !finished && (
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.actionButtonLeft, pressed && styles.actionButtonPressed]}
            onPress={() => handleActionPress('left')}
          >
            <Ionicons name="close" size={32} color="#CC0000" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.actionButton, styles.actionButtonRight, pressed && styles.actionButtonPressed]}
            onPress={() => handleActionPress('right')}
          >
            <Ionicons name="heart" size={32} color="#0F8226" />
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  logo: {
    width: 120,
    height: 48,
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  stackFrame: {
    width: '100%',
    maxWidth: 420,
    flex: 1,
  },
  cardSlot: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardFill: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    paddingBottom: 28,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionButtonLeft: {
    borderWidth: 2,
    borderColor: colors.danger,
  },
  actionButtonRight: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonPressed: {
    opacity: 0.75,
    ...Platform.select({ android: { elevation: 2 } }),
  },
  buttonPressed: {
    opacity: 0.8,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    marginTop: 8,
    paddingHorizontal: 32,
    height: 56,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
    letterSpacing: 0.1,
  },
});
