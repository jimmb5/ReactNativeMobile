import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navTypes';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useSavedPlaces } from '../hooks/useSavedPlaces';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Ionicons } from '@expo/vector-icons';
import SaveButton from '../components/SaveButton';

const PlaceDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PlaceDetail'>>();
  const { place } = route.params;
  const { user } = useAuth();
  const { savePlace } = useSavedPlaces();
  const isOwner = user?.uid === place.createdBy;

const handleDelete = async () => {
  try {
    await deleteDoc(doc(db, 'places', place.id));
    navigation.goBack();
  } catch (error) {
    console.error('Poisto epäonnistui:', error);
    alert('Poisto epäonnistui');
  }
};

const handleSave = async () => {
  try {
    await savePlace(place);
    alert('Paikka tallennettu!');
  } catch (error) {
    console.error('Tallennus epäonnistui:', error);
    alert('Tallennus epäonnistui');
  }
};

return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.name}>{place.name}</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>

    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.type}>{place.type}</Text>

      {place.length && place.length > 0 ? (
      <Text style={styles.info}>Pituus: {place.length} m</Text>
      ) : null}

      {place.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {place.tags.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {place.description ? (
        <Text style={styles.description}>{place.description}</Text>
      ) : null}

      {place.imageUrls.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {place.imageUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>
      )}
    </ScrollView>

<View style={styles.floatingButtons}>
    {isOwner ? (
  <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
    <Text style={styles.deleteButtonText}>Poista paikka</Text>
  </TouchableOpacity>
) : (
  <SaveButton place={place} />
)}
  </View>

  </SafeAreaView>
);
};

export default PlaceDetailScreen;

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: colors.background,
},
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
  fontSize: 20,
  color: colors.gray,
  padding: 8,
},
  header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 8,
  paddingBottom: 4,
},
  name: {
  fontSize: 24,
  fontWeight: 'bold',
  flex: 1,
  marginRight: 8,
},
  type: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  imageScroll: {
    marginBottom: 16,
  },
  scrollContent: {
  padding: 16,
  paddingTop: 4,
},
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.tertiary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
  },
saveButton: {
  margin: 16,
  padding: 16,
  backgroundColor: colors.primary,
  borderRadius: 8,
  alignItems: 'center',
},
saveButtonText: {
  color: colors.white,
  fontSize: 16,
  fontWeight: 'bold',
},
floatingButtons: {
  position: 'absolute',
  bottom: 32,
  right: 24,
},
heartButton: {
  width: 64,
  height: 64,
  borderRadius: 32,
  backgroundColor: colors.white,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#0F8226',
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
heartButtonPressed: {
  opacity: 0.75,
  ...Platform.select({ android: { elevation: 2 } }),
},
deleteButton: {
  margin: 16,
  padding: 16,
  backgroundColor: colors.danger,
  borderRadius: 8,
  alignItems: 'center',
},
deleteButtonText: {
  color: colors.white,
  fontSize: 16,
  fontWeight: 'bold',
},
});