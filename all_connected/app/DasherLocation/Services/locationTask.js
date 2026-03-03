import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── 1. NAME YOUR BACKGROUND TASK ───────────────────────────────────────────
// This string is an ID — it links the task definition to the task runner.
// It must be the same string in BOTH defineTask() and startLocationUpdatesAsync()
const LOCATION_TASK_NAME = 'background-location-task';

// ─── 2. DEFINE WHAT HAPPENS WHEN A LOCATION UPDATE ARRIVES ──────────────────
// This runs in the background even when the app is closed.
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {

  // Always check for errors first
  if (error) {
    console.error('Location task error:', error.message);
    return;
  }

  if (data) {
    // Extract the coordinates from the incoming data
    const { locations } = data;
    const latitude  = locations[0].coords.latitude;
    const longitude = locations[0].coords.longitude;

    console.log(`📍 New location: ${latitude}, ${longitude}`);
    const participantId = await AsyncStorage.getItem('participant_id');
    // ── 3. SEND THE LOCATION TO YOUR SERVER ─────────────────────────────────
    // Replace the URL below with your real server endpoint later.
    // For now, webhook.site lets you see the incoming data in a browser.
    // Go to https://webhook.site and copy your unique URL, paste it below.
    try {
      await fetch('https://webhook.site/a3002f60-c8d1-4b55-9cdc-38bbc0e08499', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            participant_id: participantId,
            latitude,
            longitude,
            timestamp: new Date().toISOString(),
          }),
      });
      console.log('✅ Location sent to server');
    } catch (fetchError) {
      console.error('❌ Failed to send location:', fetchError.message);
    }
  }
});

// ─── 4. START TRACKING ───────────────────────────────────────────────────────
// Call this function when the user presses "Start" in your UI
export async function startTracking() {

  // Ask the user for background location permission
  const { status } = await Location.requestBackgroundPermissionsAsync();

  // If they said no, stop here and return an error message
  if (status !== 'granted') {
    return {
      success: false,
      message: 'Permission denied. Please enable background location in your phone settings to use tracking.',
    };
  }

  // Check if tracking is already running (avoid starting it twice)
  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRunning) {
    return { success: true, message: 'Tracking is already running.' };
  }

  // Start the background location updates
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.High,       // Best GPS accuracy
    timeInterval: 10000,                    // Update every 10 seconds (in ms)
    distanceInterval: 0,                    // Update regardless of distance moved
    showsBackgroundLocationIndicator: true, // iOS: shows blue bar so user knows
    foregroundService: {                    // Android: required to run in background
      notificationTitle: 'Tracking Active',
      notificationBody: 'Your location is being tracked.',
    },
  });

  return { success: true, message: 'Tracking started!' };
}

// ─── 5. STOP TRACKING ────────────────────────────────────────────────────────
// Call this function when the user presses "Stop" in your UI
export async function stopTracking() {

  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    return { success: true, message: 'Tracking stopped.' };
  }

  return { success: false, message: 'Tracking was not running.' };
}

//npx expo install @react-native-async-storage/async-storage
//npm install @react-native-async-storage/async-storage
