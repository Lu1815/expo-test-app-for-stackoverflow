import crashlytics from '@react-native-firebase/crashlytics';
import { AppRegistry } from 'react-native';
import App from './App';

const globalErrorHandler = (error, isFatal) => {
    crashlytics().recordError(error);  // Register the error in Firebase Crashlytics
    crashlytics().log(`${error}`);  // Log the error in Firebase Crashlytics
};

// Setear el handler global
ErrorUtils.setGlobalHandler(globalErrorHandler);

// Registro del componente App
AppRegistry.registerComponent('main', () => App);
