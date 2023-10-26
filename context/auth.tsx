import { router, useRootNavigationState, useSegments } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const userInitialState = {
  uid: "",
  createdAt: "",
  displayName: "",
  lastLoginAt: "",
  photoURL: "",
  providerId: "",
  email: "",
};

const contextInitialState: ContextInterface = {
  user: userInitialState,
  signIn: () => {},
  signOut: () => {},
};

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  providerId: string;
  createdAt: string;
  lastLoginAt: string;
  email: string;
}

interface ContextInterface {
  user: User | null;
  signIn: Dispatch<SetStateAction<User>>;
  signOut: () => void;
}
// create context
const AuthContext = createContext(contextInitialState);

// this hook can be used to access the user info
export function useAuth(): ContextInterface {
  const context = useContext<ContextInterface>(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used with a provider");
  }
  return context;
}
// this hook protects the route access based on user authentication
function useProtectedRoute(user: User) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (!navigationState.key || hasNavigated) return;
    const inAuthGroup = segments[0] === "(auth)";

    if (!user.uid && !inAuthGroup) {
      router.replace("/(auth)/sign-in");
      setHasNavigated(true);
    } else if (user.uid && inAuthGroup) {
      router.replace("/(tabs)");
      setHasNavigated(true);
    }
  }, [user.uid, segments, navigationState, hasNavigated]);
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<User>(userInitialState);

  useProtectedRoute(user);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const dataWeCareAbout: User = {
          uid: user.providerData[0].uid,
          displayName: user.providerData[0].displayName ?? "",
          photoURL: user.providerData[0].photoURL ?? "",
          providerId: user.providerData[0].providerId,
          createdAt: user.metadata.creationTime!,
          lastLoginAt: user.metadata.lastSignInTime!,
          email: user.providerData[0].email!,
        };
        console.log(user);
        setUser(dataWeCareAbout);
        router.replace("/(tabs)");
      } else {
        console.log("user is not authenticated");
        router.replace("/(auth)/sign-in");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: setUser,
        signOut: () => {
          setUser(userInitialState);
          signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
