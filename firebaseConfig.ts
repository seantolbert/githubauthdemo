import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqML8yt7lib_Xr53GUTeWJLHgAiOelTKI",
  authDomain: "githubauthdemo-30ad1.firebaseapp.com",
  projectId: "githubauthdemo-30ad1",
  storageBucket: "githubauthdemo-30ad1.appspot.com",
  messagingSenderId: "443239606100",
  appId: "1:443239606100:web:eb147456c554f6c5bdcac1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };

// export const auth = getAuth(app);
