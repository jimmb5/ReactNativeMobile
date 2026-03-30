import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddPlaceScreen = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.label}>Nimi</Text>
        <TextInput
          style={styles.input}
          placeholder="Laita paikan nimi"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Paikan kuvaus</Text>
        <TextInput
          style={styles.input}
          placeholder="Laita paikan kuvaus"
          value={desc}
          onChangeText={setDesc}
          multiline
        />
      </ScrollView>
    </SafeAreaView>

    
  );
};
// TODO: teksti paikan nimelle
// TODO: teksti kuvaukselle
// TODO: lisää kuvan valitsin ja näytä lisäämät kuvat
// TODO: lisää kategorian valinta
// TODO: lisää sijainnin valinta
// TODO: lisää tallennus nappi
// TODO: tallenna tiedot db
// TODO: tallenna kuvat db

export default AddPlaceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});