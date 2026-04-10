// täysin AI:lla koodattu, omasta ei tullut hevon vittuakaan 

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '../types/place';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const CARD_ROTATION_DEG = 15;

export type SwipeDirection = 'left' | 'right';

export type SwipeCardProps = {
  poi: Place;
  onSwipeRequest?: (direction: SwipeDirection) => SwipeDirection | false;
  onSwipe?: (direction: SwipeDirection) => void;
  isTop: boolean;
  style?: StyleProp<ViewStyle>;
  dragX?: SharedValue<number>;
};

export type SwipeCardHandle = {
  swipe: (direction: SwipeDirection) => void;
};


const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(({
  poi,
  onSwipeRequest,
  onSwipe,
  isTop,
  style,
  dragX,
}, ref) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const [imageIndex, setImageIndex] = useState(0);

  const hasImage = Boolean(poi.imageUrls[0]);
  const hasMultipleImages = poi.imageUrls.length > 1;

  const completeSwipe = useCallback(
    (direction: SwipeDirection) => {
      onSwipe?.(direction);
    },
    [onSwipe],
  );

  const animateSwipe = useCallback((direction: SwipeDirection) => {
    const targetX = direction === 'right' ? SCREEN_WIDTH * 1.3 : -SCREEN_WIDTH * 1.3;
    if (dragX) {
      dragX.value = withTiming(1, { duration: 220 });
    }
    translateX.value = withTiming(targetX, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(completeSwipe)(direction);
      }
    });
    translateY.value = withTiming(0, { duration: 220 });
  }, [completeSwipe, translateX, translateY, dragX]);

  const requestSwipe = useCallback((direction: SwipeDirection) => {
    const approvedDirection = onSwipeRequest ? onSwipeRequest(direction) : direction;

    if (!approvedDirection) {
      translateX.value = withSpring(0, { damping: 15 });
      translateY.value = withSpring(0, { damping: 15 });
      if (dragX) dragX.value = withSpring(0, { damping: 15 });
      return;
    }

    animateSwipe(direction);
  }, [animateSwipe, onSwipeRequest, translateX, translateY, dragX]);

  useImperativeHandle(ref, () => ({
    swipe: animateSwipe,
  }), [animateSwipe]);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    if (isTop && dragX) {
      dragX.value = 0;
    }
    setImageIndex(0);

    poi.imageUrls.forEach((url) => {
      if (url) {
        Image.prefetch(url).catch(() => {});
      }
    });
  }, [poi.id, translateX, translateY]);

  const gesture = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
      if (dragX) {
        dragX.value = Math.min(1, Math.abs(e.translationX) / SWIPE_THRESHOLD);
      }
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(requestSwipe)('right');
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(requestSwipe)('left');
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        if (dragX) {
          dragX.value = withSpring(0, { damping: 15 });
        }
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-CARD_ROTATION_DEG, 0, CARD_ROTATION_DEG],
    );
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const rightOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], 'clamp'),
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], 'clamp'),
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.card, hasImage && styles.cardWithImage, style, cardStyle]}>
        {hasImage ? (
          <View style={styles.imageStack}>
            {poi.imageUrls.map((url, index) => (
              <Image
                key={`${poi.id}-${url}-${index}`}
                source={{ uri: url }}
                style={[
                  styles.backgroundImage,
                  index === imageIndex ? styles.activeBackgroundImage : styles.hiddenBackgroundImage,
                ]}
                resizeMode="cover"
                fadeDuration={0}
              />
            ))}
          </View>
        ) : null}

        {hasImage ? <View style={styles.imageScrim} /> : null}

        {hasMultipleImages ? (
          <View style={styles.dotsContainer}>
            {poi.imageUrls.map((_, i) => (
              <View key={i} style={[styles.dot, i === imageIndex && styles.dotActive]} />
            ))}
          </View>
        ) : null}

        {hasMultipleImages ? (
          <>
            <Pressable
              style={styles.tapZoneLeft}
              onPress={() => setImageIndex(i => Math.max(0, i - 1))}
            />
            <Pressable
              style={styles.tapZoneRight}
              onPress={() => setImageIndex(i => Math.min(poi.imageUrls.length - 1, i + 1))}
            />
          </>
        ) : null}

        <Animated.View style={[styles.overlay, styles.overlayRight, rightOverlayStyle]}>
          <Ionicons name="heart" size={72} color="#0F8226" />
        </Animated.View>

        <Animated.View style={[styles.overlay, styles.overlayLeft, leftOverlayStyle]}>
          <Ionicons name="close" size={72} color="#CC0000" />
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.cardHeader}>
            <View style={[styles.typeBadge, hasImage && styles.typeBadgeOnImage]}>
              <Text style={[styles.typeBadgeText, hasImage && styles.typeBadgeTextOnImage]}>
                {poi.type}
              </Text>
            </View>
            {poi.distance ? (
              <View style={[styles.distanceBadge, hasImage && styles.distanceBadgeOnImage]}>
                <Ionicons
                  name="navigate-outline"
                  size={14}
                  color={hasImage ? '#FFFFFF' : '#666'}
                />
                <Text style={[styles.distanceText, hasImage && styles.textOnImage]}>
                  {poi.distance} km
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={[styles.cardName, hasImage && styles.titleOnImage]}>{poi.name}</Text>
          <Text style={[styles.cardDescription, hasImage && styles.textOnImage]}>
            {poi.description}
          </Text>

          {poi.length !== undefined && (
            <Text style={[styles.cardLength, hasImage && styles.textOnImage]}>
              Pituus: {poi.length} km
            </Text>
          )}

          <View style={styles.tagsContainer}>
            {poi.tags.map((tag) => (
              <View key={tag} style={[styles.tag, hasImage && styles.tagOnImage]}>
                <Text style={[styles.tagText, hasImage && styles.tagTextOnImage]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

export default SwipeCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    minHeight: 380,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardWithImage: {
    backgroundColor: '#1F1F1F',
  },
  imageStack: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  activeBackgroundImage: {
    opacity: 1,
  },
  hiddenBackgroundImage: {
    opacity: 0,
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  dotsContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    backgroundColor: '#FFFFFF',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tapZoneLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '40%',
    bottom: '35%',
    zIndex: 9,
  },
  tapZoneRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    bottom: '35%',
    zIndex: 9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayRight: {
    backgroundColor: 'rgba(15, 130, 38, 0.12)',
  },
  overlayLeft: {
    backgroundColor: 'rgba(204, 0, 0, 0.10)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 130, 38, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  typeBadgeOnImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#0F8226',
  },
  typeBadgeTextOnImage: {
    color: '#FFFFFF',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceBadgeOnImage: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  distanceText: {
    fontSize: 13,
    color: '#666',
  },
  textOnImage: {
    color: '#FFFFFF',
  },
  cardName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  titleOnImage: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.30)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  cardLength: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  tag: {
    backgroundColor: '#F0F0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagOnImage: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  tagText: {
    fontSize: 12,
    color: '#444',
  },
  tagTextOnImage: {
    color: '#FFFFFF',
  },
});
