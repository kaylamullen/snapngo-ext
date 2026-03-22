import React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [participantId, setParticipantId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedId = await AsyncStorage.getItem('participantId');
        const trackingStatus = await AsyncStorage.getItem('isTracking');

        if (savedId) setParticipantId(savedId);
        if (trackingStatus === 'true') setIsTracking(true);
      } catch (error) {
        console.error('Error loading home screen data:', error);
      }
    };

    loadData();
  }, []);

  const startTracking = async () => {
    try {
      setIsTracking(true);
      await AsyncStorage.setItem('isTracking', 'true');
      console.log('Tracking started');
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  };

  const stopTracking = async () => {
    try {
      setIsTracking(false);
      await AsyncStorage.setItem('isTracking', 'false');
      console.log('Tracking stopped');
    } catch (error) {
      console.error('Error stopping tracking:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Snap’n Go Home</ThemedText>

      <ThemedText style={styles.participantText}>
        Participant ID: {participantId || 'Not found'}
      </ThemedText>

      <ThemedView style={styles.statusRow}>
        <ThemedView
          style={[
            styles.statusDot,
            { backgroundColor: isTracking ? '#22c55e' : '#9ca3af' },
          ]}
        />
        <ThemedText>
          {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={[
          styles.button,
          isTracking ? styles.disabledButton : styles.startButton,
        ]}
        onPress={startTracking}
        disabled={isTracking}
      >
        <ThemedText style={styles.buttonText}>Start Shift</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          !isTracking ? styles.disabledButton : styles.endButton,
        ]}
        onPress={stopTracking}
        disabled={!isTracking}
      >
        <ThemedText style={styles.buttonText}>End Shift</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 18,
  },
  participantText: {
    textAlign: 'center',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#2563eb',
  },
  endButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});