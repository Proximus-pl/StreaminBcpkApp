import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type LanguageCode = 'en' | 'pl' | 'de' | 'uk';

const english = {
  fieldControl: 'FIELD CONTROL / 01',
  home: 'Home',
  navigation: 'NAVIGATION',
  map: 'Map',
  logout: 'Log out',
  drawerHint: 'Swipe from the left edge to open this menu',
  fieldUnitLocation: 'FIELD UNIT LOCATION',
  gpsSynced: 'GPS synced · 2 sec ago',
  mapMockDescription: 'Mock field view for the connected streaming bag.',
  goodMorning: 'Good morning',
  streamingBag: 'STREAMING BAG',
  unit: 'Unit SB-2048',
  obsLinked: 'OBS LINKED',
  localMode: 'LOCAL MODE',
  recordingLive: 'Recording live',
  readyToRecord: 'Ready to record',
  liveCapture: 'LIVE CAPTURE',
  captureStandby: 'CAPTURE STANDBY',
  k4: '4K / 30 FPS',
  glance: 'At a glance',
  allControls: 'All controls',
  on: 'ON',
  off: 'OFF',
  wideCamera: 'Wide camera',
  frontCamera: 'Front camera',
  rearCamera: 'Rear camera',
  actuatorPosition: 'Actuator position',
  visibilityLed: 'Visibility LED',
  obsStudio: 'OBS Studio',
  handsFree: 'Hands-free control',
  useVoice: 'Use your voice while moving',
  hardware: 'HARDWARE / 02',
  bagControls: 'Bag controls',
  moreControls: 'More controls',
  cameraSystem: 'Camera system',
  primaryCapture: 'Primary capture module',
  active: 'ACTIVE',
  currentView: 'CURRENT VIEW',
  switchView: 'Switch view',
  cameraSpecs: '4K · 30 FPS · H.264',
  moveOut: 'Move out',
  moveIn: 'Move in',
  actuatorArm: 'Actuator arm',
  physicalLift: 'Physical camera lift',
  ledDescription: 'Shows who is recording',
  darknessAssist: 'Darkness assist',
  darknessDescription: 'Turns on automatically below 20 lux',
  voiceCommand: 'Voice command',
  listening: 'Listening now…',
  voiceHint: 'Tap to issue a command',
  timeline: 'TIMELINE / 03',
  activity: 'Activity',
  idle: 'IDLE',
  live: 'LIVE',
  sessionStatus: 'SESSION STATUS',
  capturingStream: 'Capturing your stream',
  readyNextTake: 'Ready for your next take',
  everyControl: 'Every control action appears here',
  recentActivity: 'Recent activity',
  noActivity: 'No activity yet',
  noActivityBody: 'Your bag events will appear here.',
  preferences: 'PREFERENCES / 04',
  settings: 'Settings',
  appearance: 'Appearance',
  appTheme: 'APP THEME',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  language: 'Language',
  chooseLanguage: 'Choose the language for the app',
  connections: 'Connections',
  connectedLocal: 'Connected to local instance',
  notConnected: 'Not connected',
  connected: 'CONNECTED',
  offline: 'OFFLINE',
  disconnectInstance: 'Disconnect instance',
  connectObs: 'Connect OBS Studio',
  about: 'About',
  appName: 'Streaming Bag Control',
  appVersion: 'Mobile console · Version 0.1.0',
  manageAccount: 'Manage account access',
  accountAccess: 'Account access',
  operatorLogin: 'Operator login',
  accountLinked: 'Use the account linked to your OBS workspace.',
  emailAddress: 'Email address',
  password: 'Password',
  loginValidation: 'Enter your operator email and password to continue.',
  continueObs: 'Continue to OBS Studio',
  sampleLogin: 'Use sample login',
  sampleCredentials: 'Demo account · operator@example.com',
  privacy: 'Your connection details stay on this device.',
  now: 'Now',
  today: 'Today',
  yesterday: 'Yesterday',
  activityBagPoweredOn: 'Bag powered on',
  activityAllSystemsNominal: 'All systems nominal',
  activityCameraViewSet: 'Camera view set to {view}',
  activityCameraQuality: '4K / 30 FPS',
  activityActuatorExtended: 'Actuator extended',
  activityActuatorRetracted: 'Actuator retracted',
  activityPosition: 'Position {value}%',
  activityRecordingEnded: 'Recording session ended',
  activityRecordingEndedDetail: '18 min 24 sec',
  activityRecordingStarted: 'Recording started',
  activityObsReceiving: 'OBS Studio is receiving video',
  activityRecordingStopped: 'Recording stopped',
  activitySecondsCaptured: '{value} sec captured',
  activityCameraDisabled: 'Camera disabled',
  activityCameraEnabled: 'Camera enabled',
  activityView: '{view} view',
  activityVisibilityLedOff: 'Visibility LED off',
  activityVisibilityLedOn: 'Visibility LED on',
  activityManualControl: 'Manual control',
  activityDarknessArmed: 'Darkness mode armed',
  activityVoiceCompleted: 'Voice command completed',
  activityStartRecording: 'Start recording',
  activityObsConnected: 'OBS Studio connected',
  activityReadyToStream: 'Ready to stream',
  activityObsDisconnected: 'OBS Studio disconnected',
  activityLocalControls: 'Local controls still available',
  // --- New Signup Keys ---
  allFieldsRequired: 'All fields are required.',
  passwordsDoNotMatch: 'Passwords do not match.',
  createAccount: 'Create Account',
  welcomeAboard: 'Welcome Aboard',
  signupDescription: 'Create your operator account to get started.',
  phoneNumber: 'Phone number',
  city: 'City',
  confirmPassword: 'Re-type password',
  registrationSuccess: 'Registration Successful',
  readyToLogin: 'Your account has been created successfully. You can now log in.',
  goToLogin: 'Log in',
  register: 'Register',
  passwordTooShort: 'Password must be at least 8 characters long.',
  passwordNoSpecial: 'Password must contain at least one special mark.',
} as const;

export type TranslationKey = keyof typeof english;

const translations: Record<LanguageCode, Partial<Record<TranslationKey, string>>> = {
  en: english,
  pl: {
    fieldControl: 'STEROWANIE TERENOWE / 01', home: 'Start', goodMorning: 'Dzień dobry', streamingBag: 'PLECAK STREAMINGOWY', unit: 'Jednostka SB-2048', obsLinked: 'OBS POŁĄCZONY', localMode: 'TRYB LOKALNY', recordingLive: 'Nagrywanie na żywo', readyToRecord: 'Gotowy do nagrywania', liveCapture: 'NAGRYWANIE NA ŻYWO', captureStandby: 'GOTOWY DO NAGRYWANIA', k4: '4K / 30 FPS', glance: 'Podgląd', allControls: 'Wszystkie sterowania', on: 'WŁ.', off: 'WYŁ.', wideCamera: 'Kamera szeroka', frontCamera: 'Kamera przednia', rearCamera: 'Kamera tylna', actuatorPosition: 'Pozycja siłownika', visibilityLed: 'Dioda widoczności', obsStudio: 'OBS Studio', handsFree: 'Sterowanie głosem', useVoice: 'Używaj głosu podczas ruchu', hardware: 'SPRZĘT / 02', bagControls: 'Sterowanie plecakiem', moreControls: 'Więcej ustawień', cameraSystem: 'System kamery', primaryCapture: 'Główny moduł nagrywania', active: 'AKTYWNA', currentView: 'AKTUALNY WIDOK', switchView: 'Zmień widok', cameraSpecs: '4K · 30 FPS · H.264', moveOut: 'Wysuń', moveIn: 'Wsuń', actuatorArm: 'Ramię siłownika', physicalLift: 'Podnośnik kamery', ledDescription: 'Wskazuje, kto nagrywa', darknessAssist: 'Tryb ciemności', darknessDescription: 'Włącza się automatycznie poniżej 20 lx', voiceCommand: 'Polecenie głosowe', listening: 'Słucham…', voiceHint: 'Dotknij, aby wydać polecenie', timeline: 'OŚ CZASU / 03', activity: 'Aktywność', idle: 'BEZCZYNNOŚĆ', live: 'NA ŻYWO', sessionStatus: 'STATUS SESJI', capturingStream: 'Trwa nagrywanie transmisji', readyNextTake: 'Gotowy na kolejne nagranie', everyControl: 'Każda akcja pojawi się tutaj', recentActivity: 'Ostatnia aktywność', noActivity: 'Brak aktywności', noActivityBody: 'Zdarzenia plecaka pojawią się tutaj.', preferences: 'PREFERENCJE / 04', settings: 'Ustawienia', appearance: 'Wygląd', appTheme: 'MOTYW APLIKACJI', system: 'Systemowy', light: 'Jasny', dark: 'Ciemny', language: 'Język', chooseLanguage: 'Wybierz język aplikacji', connections: 'Połączenia', connectedLocal: 'Połączono z lokalną instancją', notConnected: 'Nie połączono', connected: 'POŁĄCZONO', offline: 'OFFLINE', disconnectInstance: 'Odłącz instancję', connectObs: 'Połącz z OBS Studio', about: 'Informacje', appName: 'Sterowanie plecakiem streamingowym', appVersion: 'Konsola mobilna · Wersja 0.1.0', manageAccount: 'Zarządzaj dostępem do konta', accountAccess: 'Dostęp do konta', operatorLogin: 'Logowanie operatora', accountLinked: 'Użyj konta połączonego z przestrzenią OBS.', emailAddress: 'Adres e-mail', password: 'Hasło', loginValidation: 'Wpisz e-mail operatora i hasło, aby kontynuować.', continueObs: 'Przejdź do OBS Studio', sampleLogin: 'Użyj przykładowego logowania', sampleCredentials: 'Konto demo · operator@example.com', privacy: 'Dane połączenia pozostają na tym urządzeniu.', now: 'Teraz', today: 'Dzisiaj', yesterday: 'Wczoraj', activityBagPoweredOn: 'Plecak włączony', activityAllSystemsNominal: 'Wszystkie systemy działają prawidłowo', activityCameraViewSet: 'Ustawiono widok kamery: {view}', activityCameraQuality: '4K / 30 FPS', activityActuatorExtended: 'Siłownik wysunięty', activityActuatorRetracted: 'Siłownik wsunięty', activityPosition: 'Pozycja {value}%', activityRecordingEnded: 'Sesja nagrywania zakończona', activityRecordingEndedDetail: '18 min 24 sek.', activityRecordingStarted: 'Rozpoczęto nagrywanie', activityObsReceiving: 'OBS Studio odbiera obraz', activityRecordingStopped: 'Zatrzymano nagrywanie', activitySecondsCaptured: 'Nagrano {value} sek.', activityCameraDisabled: 'Kamera wyłączona', activityCameraEnabled: 'Kamera włączona', activityView: 'Widok: {view}', activityVisibilityLedOff: 'Dioda widoczności wyłączona', activityVisibilityLedOn: 'Dioda widoczności włączona', activityManualControl: 'Sterowanie ręczne', activityDarknessArmed: 'Tryb ciemności uzbrojony', activityVoiceCompleted: 'Polecenie głosowe wykonane', activityStartRecording: 'Rozpocznij nagrywanie', activityObsConnected: 'Połączono z OBS Studio', activityReadyToStream: 'Gotowy do transmisji', activityObsDisconnected: 'Odłączono OBS Studio', activityLocalControls: 'Sterowanie lokalne jest nadal dostępne',
    allFieldsRequired: 'Wszystkie pola są wymagane.',
    passwordsDoNotMatch: 'Hasła nie pasują do siebie.',
    createAccount: 'Utwórz konto',
    welcomeAboard: 'Witamy na pokładzie',
    signupDescription: 'Utwórz konto operatora, aby rozpocząć.',
    phoneNumber: 'Numer telefonu',
    city: 'Miasto',
    confirmPassword: 'Powtórz hasło',
    registrationSuccess: 'Rejestracja zakończona sukcesem',
    readyToLogin: 'Twoje konto zostało pomyślnie utworzone. Możesz się teraz zalogować.',
    goToLogin: 'Zaloguj się',
    register: 'Zarejestruj się',
    passwordTooShort: 'Hasło musi mieć co najmniej 8 znaków.',
    passwordNoSpecial: 'Hasło musi zawierać co najmniej jeden znak specjalny.',
  },
  de: {
    fieldControl: 'FELDSTEUERUNG / 01', home: 'Startseite', goodMorning: 'Guten Morgen', streamingBag: 'STREAMING-RUCKSACK', unit: 'Einheit SB-2048', obsLinked: 'OBS VERBUNDEN', localMode: 'LOKALER MODUS', recordingLive: 'Aufnahme läuft', readyToRecord: 'Bereit zur Aufnahme', liveCapture: 'LIVE-AUFNAHME', captureStandby: 'AUFNAHMEBEREIT', k4: '4K / 30 FPS', glance: 'Auf einen Blick', allControls: 'Alle Steuerungen', on: 'AN', off: 'AUS', wideCamera: 'Weitwinkelkamera', frontCamera: 'Frontkamera', rearCamera: 'Rückkamera', actuatorPosition: 'Aktuatorposition', visibilityLed: 'Sichtbarkeits-LED', obsStudio: 'OBS Studio', handsFree: 'Freihandsteuerung', useVoice: 'Nutze deine Stimme unterwegs', hardware: 'HARDWARE / 02', bagControls: 'Rucksacksteuerung', moreControls: 'Weitere Steuerungen', cameraSystem: 'Kamerasystem', primaryCapture: 'Primäres Aufnahmemodul', active: 'AKTIV', currentView: 'AKTUELLE ANSICHT', switchView: 'Ansicht wechseln', cameraSpecs: '4K · 30 FPS · H.264', moveOut: 'Ausfahren', moveIn: 'Einfahren', actuatorArm: 'Aktuatorarm', physicalLift: 'Kamera-Lift', ledDescription: 'Zeigt, wer aufnimmt', darknessAssist: 'Dunkelheitsassistent', darknessDescription: 'Schaltet sich unter 20 Lux automatisch ein', voiceCommand: 'Sprachbefehl', listening: 'Höre zu…', voiceHint: 'Tippen für einen Befehl', timeline: 'ZEITLEISTE / 03', activity: 'Aktivität', idle: 'INAKTIV', live: 'LIVE', sessionStatus: 'SITZUNGSSTATUS', capturingStream: 'Stream wird aufgenommen', readyNextTake: 'Bereit für die nächste Aufnahme', everyControl: 'Jede Steueraktion erscheint hier', recentActivity: 'Letzte Aktivitäten', noActivity: 'Noch keine Aktivitäten', noActivityBody: 'Ereignisse des Rucksacks erscheinen hier.', preferences: 'EINSTELLUNGEN / 04', settings: 'Einstellungen', appearance: 'Darstellung', appTheme: 'APP-DESIGN', system: 'System', light: 'Hell', dark: 'Dunkel', language: 'Sprache', chooseLanguage: 'App-Sprache auswählen', connections: 'Verbindungen', connectedLocal: 'Mit lokaler Instanz verbunden', notConnected: 'Nicht verbunden', connected: 'VERBUNDEN', offline: 'OFFLINE', disconnectInstance: 'Instanz trennen', connectObs: 'OBS Studio verbinden', about: 'Über', appName: 'Steuerung des Streaming-Rucksacks', appVersion: 'Mobile Konsole · Version 0.1.0', manageAccount: 'Kontozugriff verwalten', accountAccess: 'Kontozugriff', operatorLogin: 'Operator-Anmeldung', accountLinked: 'Nutze das mit deinem OBS-Arbeitsbereich verknüpfte Konto.', emailAddress: 'E-Mail-Adresse', password: 'Passwort', loginValidation: 'Gib deine Operator-E-Mail und dein Passwort ein.', continueObs: 'Mit OBS Studio fortfahren', sampleLogin: 'Beispiel-Login verwenden', sampleCredentials: 'Demo-Konto · operator@example.com', privacy: 'Deine Verbindungsdaten bleiben auf diesem Gerät.', now: 'Jetzt', today: 'Heute', yesterday: 'Gestern', activityBagPoweredOn: 'Rucksack eingeschaltet', activityAllSystemsNominal: 'Alle Systeme normal', activityCameraViewSet: 'Kameraansicht eingestellt auf {view}', activityCameraQuality: '4K / 30 FPS', activityActuatorExtended: 'Aktuator ausgefahren', activityActuatorRetracted: 'Aktuator eingefahren', activityPosition: 'Position {value}%', activityRecordingEnded: 'Aufnahmesitzung beendet', activityRecordingEndedDetail: '18 Min. 24 Sek.', activityRecordingStarted: 'Aufnahme gestartet', activityObsReceiving: 'OBS Studio empfängt Video', activityRecordingStopped: 'Aufnahme gestoppt', activitySecondsCaptured: '{value} Sek. aufgenommen', activityCameraDisabled: 'Kamera deaktiviert', activityCameraEnabled: 'Kamera aktiviert', activityView: '{view}-Ansicht', activityVisibilityLedOff: 'Sichtbarkeits-LED aus', activityVisibilityLedOn: 'Sichtbarkeits-LED an', activityManualControl: 'Manuelle Steuerung', activityDarknessArmed: 'Dunkelheitsmodus aktiviert', activityVoiceCompleted: 'Sprachbefehl ausgeführt', activityStartRecording: 'Aufnahme starten', activityObsConnected: 'OBS Studio verbunden', activityReadyToStream: 'Bereit zum Streamen', activityObsDisconnected: 'OBS Studio getrennt', activityLocalControls: 'Lokale Steuerung weiterhin verfügbar',
    allFieldsRequired: 'Alle Felder sind erforderlich.',
    passwordsDoNotMatch: 'Die Passwörter stimmen nicht überein.',
    createAccount: 'Konto erstellen',
    welcomeAboard: 'Willkommen an Bord',
    signupDescription: 'Erstelle dein Operator-Konto, um loszulegen.',
    phoneNumber: 'Telefonnummer',
    city: 'Stadt',
    confirmPassword: 'Passwort wiederholen',
    registrationSuccess: 'Registrierung erfolgreich',
    readyToLogin: 'Dein Konto wurde erfolgreich erstellt. Du kannst dich jetzt anmelden.',
    goToLogin: 'Anmelden',
    register: 'Registrieren',
    passwordTooShort: 'Das Passwort muss mindestens 8 Zeichen lang sein.',
    passwordNoSpecial: 'Das Passwort muss mindestens ein Sonderzeichen enthalten.',
  },
  uk: {
    fieldControl: 'ПОЛЬОВЕ КЕРУВАННЯ / 01', home: 'Головна', goodMorning: 'Доброго ранку', streamingBag: 'СТРІМІНГОВИЙ РЮКЗАК', unit: 'Пристрій SB-2048', obsLinked: 'OBS ПІДКЛЮЧЕНО', localMode: 'ЛОКАЛЬНИЙ РЕЖИМ', recordingLive: 'Запис триває', readyToRecord: 'Готовий до запису', liveCapture: 'ЗАПИС НАЖИВО', captureStandby: 'ГОТОВИЙ ДО ЗАПИСУ', k4: '4K / 30 FPS', glance: 'Короткий огляд', allControls: 'Усі елементи керування', on: 'УВІМК.', off: 'ВИМК.', wideCamera: 'Широка камера', frontCamera: 'Фронтальна камера', rearCamera: 'Задня камера', actuatorPosition: 'Позиція актуатора', visibilityLed: 'Світлодіод видимості', obsStudio: 'OBS Studio', handsFree: 'Керування голосом', useVoice: 'Керуйте голосом у русі', hardware: 'ОБЛАДНАННЯ / 02', bagControls: 'Керування рюкзаком', moreControls: 'Більше керування', cameraSystem: 'Система камери', primaryCapture: 'Основний модуль зйомки', active: 'АКТИВНА', currentView: 'ПОТОЧНИЙ ВИГЛЯД', switchView: 'Змінити вигляд', cameraSpecs: '4K · 30 FPS · H.264', moveOut: 'Висунути', moveIn: 'Втягнути', actuatorArm: 'Важіль актуатора', physicalLift: 'Підйомник камери', ledDescription: 'Показує, хто записує', darknessAssist: 'Режим темряви', darknessDescription: 'Автоматично вмикається нижче 20 люкс', voiceCommand: 'Голосова команда', listening: 'Слухаю…', voiceHint: 'Торкніться, щоб дати команду', timeline: 'ХРОНОЛОГІЯ / 03', activity: 'Активність', idle: 'ПРОСТІЙ', live: 'НАЖИВО', sessionStatus: 'СТАТУС СЕСІЇ', capturingStream: 'Виконується запис трансляції', readyNextTake: 'Готовий до наступного запису', everyControl: 'Кожна дія з’явиться тут', recentActivity: 'Остання активність', noActivity: 'Активності ще немає', noActivityBody: 'Події рюкзака з’являться тут.', preferences: 'НАЛАШТУВАННЯ / 04', settings: 'Налаштування', appearance: 'Вигляд', appTheme: 'ТЕМА ЗАСТОСУНКУ', system: 'Системна', light: 'Світла', dark: 'Темна', language: 'Мова', chooseLanguage: 'Оберіть мову застосунку', connections: 'Підключення', connectedLocal: 'Підключено до локального екземпляра', notConnected: 'Не підключено', connected: 'ПІДКЛЮЧЕНО', offline: 'ОФЛАЙН', disconnectInstance: 'Від’єднати екземпляр', connectObs: 'Підключити OBS Studio', about: 'Про застосунок', appName: 'Керування стримінговим рюкзаком', appVersion: 'Мобільна консоль · Версія 0.1.0', manageAccount: 'Керування доступом до облікового запису', accountAccess: 'Доступ до облікового запису', operatorLogin: 'Вхід оператора', accountLinked: 'Використайте обліковий запис, пов’язаний із робочим простором OBS.', emailAddress: 'Електронна пошта', password: 'Пароль', loginValidation: 'Введіть електронну пошту оператора та пароль.', continueObs: 'Продовжити до OBS Studio', sampleLogin: 'Використати демонстраційний вхід', sampleCredentials: 'Демообліковий запис · operator@example.com', privacy: 'Дані підключення залишаються на цьому пристрої.', now: 'Зараз', today: 'Сьогодні', yesterday: 'Вчора', activityBagPoweredOn: 'Рюкзак увімкнено', activityAllSystemsNominal: 'Усі системи працюють нормально', activityCameraViewSet: 'Встановлено вигляд камери: {view}', activityCameraQuality: '4K / 30 FPS', activityActuatorExtended: 'Актуатор висунуто', activityActuatorRetracted: 'Актуатор втягнуто', activityPosition: 'Позиція {value}%', activityRecordingEnded: 'Сесію запису завершено', activityRecordingEndedDetail: '18 хв 24 с', activityRecordingStarted: 'Запис розпочато', activityObsReceiving: 'OBS Studio отримує відео', activityRecordingStopped: 'Запис зупинено', activitySecondsCaptured: 'Записано {value} с', activityCameraDisabled: 'Камеру вимкнено', activityCameraEnabled: 'Камеру увімкнено', activityView: 'Вигляд: {view}', activityVisibilityLedOff: 'Світлодіод видимості вимкнено', activityVisibilityLedOn: 'Світлодіод видимості увімкнено', activityManualControl: 'Ручне керування', activityDarknessArmed: 'Режим темряви активовано', activityVoiceCompleted: 'Голосову команду виконано', activityStartRecording: 'Почати запис', activityObsConnected: 'OBS Studio підключено', activityReadyToStream: 'Готовий до трансляції', activityObsDisconnected: 'OBS Studio відключено', activityLocalControls: 'Локальне керування все ще доступне',
    allFieldsRequired: 'Усі поля обов’язкові для заповнення.',
    passwordsDoNotMatch: 'Паролі не збігаються.',
    createAccount: 'Створити обліковий запис',
    welcomeAboard: 'Ласкаво просимо',
    signupDescription: 'Створіть обліковий запис оператора, щоб почати.',
    phoneNumber: 'Номер телефону',
    city: 'Місто',
    confirmPassword: 'Повторіть пароль',
    registrationSuccess: 'Реєстрація успішна',
    readyToLogin: 'Ваш обліковий запис успішно створено. Тепер ви можете увійти.',
    goToLogin: 'Увійти',
    register: 'Зареєструватися',
    passwordTooShort: 'Пароль має містити щонайменше 8 символів.',
    passwordNoSpecial: 'Пароль має містити принаймні один спеціальний символ.',
  },
};

export const languageOptions: { code: LanguageCode; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'pl', label: 'Polski', nativeLabel: 'Polski' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська' },
];

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    AsyncStorage.getItem('streaming-bag-language')
      .then((saved) => {
        if (saved === 'en' || saved === 'pl' || saved === 'de' || saved === 'uk') setLanguageState(saved);
      })
      .catch(() => undefined);
  }, []);

  const setLanguage = (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    AsyncStorage.setItem('streaming-bag-language', nextLanguage).catch(() => undefined);
  };

  const value = useMemo(
    () => ({ language, setLanguage, t: (key: TranslationKey) => translations[language][key] ?? translations.en[key] ?? key }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}