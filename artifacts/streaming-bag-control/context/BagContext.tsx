import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type CameraView = 'Wide' | 'Front' | 'Rear';
export type ActivityKind = 'recording' | 'camera' | 'actuator' | 'system' | 'voice';

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: ActivityKind;
}

interface BagContextValue {
  isRecording: boolean;
  recordingSeconds: number;
  cameraOn: boolean;
  cameraView: CameraView;
  actuatorPosition: number;
  ledOn: boolean;
  isListening: boolean;
  obsConnected: boolean;
  lastVoiceCommand: string;
  activity: ActivityItem[];
  toggleRecording: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
  moveActuator: (delta: number) => void;
  toggleLed: () => void;
  startListening: () => void;
  connectObs: () => void;
  disconnectObs: () => void;
}

const initialActivity: ActivityItem[] = [
  { id: '1', title: 'Bag powered on', detail: 'All systems nominal', time: 'Now', kind: 'system' },
  { id: '2', title: 'Camera view set to Wide', detail: '4K / 30 FPS', time: 'Today, 09:42', kind: 'camera' },
  { id: '3', title: 'Actuator retracted', detail: 'Position 0%', time: 'Today, 09:40', kind: 'actuator' },
  { id: '4', title: 'Recording session ended', detail: '18 min 24 sec', time: 'Yesterday, 18:12', kind: 'recording' },
];

const BagContext = createContext<BagContextValue | null>(null);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [cameraView, setCameraView] = useState<CameraView>('Wide');
  const [actuatorPosition, setActuatorPosition] = useState(0);
  const [ledOn, setLedOn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [obsConnected, setObsConnected] = useState(true);
  const [lastVoiceCommand, setLastVoiceCommand] = useState('Tap the mic to issue a command');
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);

  useEffect(() => {
    if (!isRecording) return undefined;
    const timer = setInterval(() => setRecordingSeconds((seconds) => seconds + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    AsyncStorage.getItem('streaming-bag-state')
      .then((stored) => {
        if (!stored) return;
        const parsed = JSON.parse(stored) as Partial<{ cameraView: CameraView; actuatorPosition: number; ledOn: boolean }>;
        if (parsed.cameraView) setCameraView(parsed.cameraView);
        if (typeof parsed.actuatorPosition === 'number') setActuatorPosition(parsed.actuatorPosition);
        if (typeof parsed.ledOn === 'boolean') setLedOn(parsed.ledOn);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('streaming-bag-state', JSON.stringify({ cameraView, actuatorPosition, ledOn })).catch(() => undefined);
  }, [cameraView, actuatorPosition, ledOn]);

  const addActivity = (item: Omit<ActivityItem, 'id' | 'time'>) => {
    setActivity((items) => [{ ...item, id: `${Date.now()}-${Math.random()}`, time: nowLabel() }, ...items].slice(0, 12));
  };

  const toggleRecording = () => {
    const next = !isRecording;
    setIsRecording(next);
    if (next) {
      setRecordingSeconds(0);
      addActivity({ title: 'Recording started', detail: 'OBS Studio is receiving video', kind: 'recording' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      addActivity({ title: 'Recording stopped', detail: `${recordingSeconds} sec captured`, kind: 'recording' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const toggleCamera = () => {
    setCameraOn((value) => !value);
    addActivity({ title: cameraOn ? 'Camera disabled' : 'Camera enabled', detail: `${cameraView} view`, kind: 'camera' });
    Haptics.selectionAsync();
  };

  const switchCamera = () => {
    const next: CameraView = cameraView === 'Wide' ? 'Front' : cameraView === 'Front' ? 'Rear' : 'Wide';
    setCameraView(next);
    addActivity({ title: `Camera view set to ${next}`, detail: '4K / 30 FPS', kind: 'camera' });
    Haptics.selectionAsync();
  };

  const moveActuator = (delta: number) => {
    setActuatorPosition((position) => {
      const next = Math.max(0, Math.min(100, position + delta));
      addActivity({ title: delta > 0 ? 'Actuator extended' : 'Actuator retracted', detail: `Position ${next}%`, kind: 'actuator' });
      return next;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleLed = () => {
    setLedOn((value) => !value);
    addActivity({ title: ledOn ? 'Visibility LED off' : 'Visibility LED on', detail: ledOn ? 'Manual control' : 'Darkness mode armed', kind: 'system' });
    Haptics.selectionAsync();
  };

  const startListening = () => {
    setIsListening(true);
    setLastVoiceCommand('Listening… say “start recording”');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setIsListening(false);
      setLastVoiceCommand('Start recording');
      if (!isRecording) toggleRecording();
      addActivity({ title: 'Voice command completed', detail: 'Start recording', kind: 'voice' });
    }, 1400);
  };

  const value = useMemo(
    () => ({
      isRecording, recordingSeconds, cameraOn, cameraView, actuatorPosition, ledOn, isListening, obsConnected,
      lastVoiceCommand, activity, toggleRecording, toggleCamera, switchCamera, moveActuator, toggleLed, startListening,
      connectObs: () => { setObsConnected(true); addActivity({ title: 'OBS Studio connected', detail: 'Ready to stream', kind: 'system' }); },
      disconnectObs: () => { setObsConnected(false); addActivity({ title: 'OBS Studio disconnected', detail: 'Local controls still available', kind: 'system' }); },
    }),
    [isRecording, recordingSeconds, cameraOn, cameraView, actuatorPosition, ledOn, isListening, obsConnected, lastVoiceCommand, activity],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) throw new Error('useBag must be used within BagProvider');
  return context;
}