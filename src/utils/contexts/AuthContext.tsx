// AuthContext.js
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React, { createContext, useContext, useEffect, useState } from "react";

type TAuth = {
  currentUser: FirebaseAuthTypes.User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  otpConfirmation: FirebaseAuthTypes.ConfirmationResult;
  setOtpConfirmation: React.Dispatch<
    React.SetStateAction<FirebaseAuthTypes.ConfirmationResult>
  >;
  verificationIdForMultifactorAuth: string;
  setVerificationIdForMultifactorAuth: React.Dispatch<
    React.SetStateAction<string>
  >;
  multifactorUser: FirebaseAuthTypes.MultiFactorUser | null;
  setMultifactorUser: React.Dispatch<FirebaseAuthTypes.MultiFactorUser | null>;
  multifactorResolver: FirebaseAuthTypes.MultiFactorResolver | null;
  setMultifactorResolver: React.Dispatch<FirebaseAuthTypes.MultiFactorResolver | null>;
};

const AuthContext = createContext<TAuth>({
  currentUser: null,
  setCurrentUser: () => null,
  loading: true,
  setLoading: () => true,
  otpConfirmation: null,
  setOtpConfirmation: () => null,
  verificationIdForMultifactorAuth: "",
  setVerificationIdForMultifactorAuth: () => "",
  multifactorUser: null,
  setMultifactorUser: () => null,
  multifactorResolver: null,
  setMultifactorResolver: () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User>(null);
  const [loading, setLoading] = useState(true);
  const [otpConfirmation, setOtpConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult>(null);
  const [verificationIdForMultifactorAuth, setVerificationIdForMultifactorAuth ] = useState<string>("");
  const [multifactorUser, setMultifactorUser ] = useState<FirebaseAuthTypes.MultiFactorUser | null>(null);
  const [multifactorResolver, setMultifactorResolver] = useState<FirebaseAuthTypes.MultiFactorResolver | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user: FirebaseAuthTypes.User) => {  
      setCurrentUser(user);
      setLoading(false);
    });
  
    return unsubscribe;
  }, []); // THE DEPENDENCY IS ONLY USED FOR THE handleCodeConfirmation FUNCTION FROM THE OtpConfirmation.Services.ts FILE
  

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loading,
        setLoading,
        otpConfirmation,
        setOtpConfirmation,
        verificationIdForMultifactorAuth,
        setVerificationIdForMultifactorAuth,
        multifactorUser,
        setMultifactorUser,
        multifactorResolver,
        setMultifactorResolver,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
