// @ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ParticipantIDScreen() {
  const [participantId, setParticipantId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSavedId = async () => {
      try {
        const savedId = await AsyncStorage.getItem('participantId');
        if (savedId && savedId.trim() !== '') {
          router.replace('/(tabs)');
          return;
        }
      } catch (error) {
        console.error('Error reading participant ID:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSavedId();
  }, []);

  const handleSubmit = async () => {
    const trimmedId = participantId.trim();

    if (!trimmedId) {
      Alert.alert('Missing ID', 'Please enter your study ID before continuing.');
      return;
    }

    try {
      await AsyncStorage.setItem('participantId', trimmedId);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving participant ID:', error);
      Alert.alert('Error', 'Could not save participant ID.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Participant ID</Text>
      <Text style={styles.helperText}>
        Please enter your study ID to continue.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. P001"
        value={participantId}
        onChangeText={setParticipantId}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  helperText: {
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});