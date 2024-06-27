import auth from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import React, { createContext, useContext, useState } from "react";
import { TUserAnalytics } from "../entities/UserAnalytics";
import { FirestoreCollections } from "../lib/Consts";

type AnalyticsData = {
  [screenName: string]: number;
};

type AnalyticsContextType = {
  analyticsData: AnalyticsData;
  updateScreenTime: (screenName: string, timeSpent: number) => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({});
  const USER_ANALYTICS_COLLECTION = FirestoreCollections.USER_ANALYTICS;
  const DAILY_USAGE_COLLECTION = FirestoreCollections.DAILY_USAGE;

  function getUserAnalyticsRef(
    userId: string
  ): FirebaseFirestoreTypes.DocumentReference {
    return firestore().collection(USER_ANALYTICS_COLLECTION).doc(userId);
  }

  function getDailyUsageDoc(
    userAnalyticsRef: FirebaseFirestoreTypes.DocumentReference,
    today: string
  ): FirebaseFirestoreTypes.DocumentReference {
    return userAnalyticsRef.collection(DAILY_USAGE_COLLECTION).doc(today);
  }

  async function updateScreenTime(
    screenName: string,
    timeSpent: number
  ): Promise<void> {
    setAnalyticsData((prevData) => ({
      ...prevData,
      [screenName]: (prevData[screenName] || 0) + timeSpent,
    }));

    const userId = auth().currentUser?.uid;
    const today = firestore.Timestamp.now()
      .toDate()
      .toISOString()
      .split("T")[0]; // "YYYY-MM-DD"

    if (!userId) return; // Ensure user is logged in

    try {
      const userAnalyticsRef = getUserAnalyticsRef(userId);
      const userAnalyticsDoc = await userAnalyticsRef.get();

      if (!userAnalyticsDoc.exists) {
        const newUserAnalytics: TUserAnalytics = {
          accountCreatedAt: new Date().toISOString(),
          accountCreatedAtTimestamp: firestore.Timestamp.now().toMillis(),
          accountDuration: "",
          accountDurationInDays: 0,
          accountDurationInMonths: 0,
          accountDurationInYears: 0,
          userId,
        };

        await userAnalyticsRef.set(newUserAnalytics);
      }

      const dailyUsageDoc = getDailyUsageDoc(userAnalyticsRef, today);

      const doc = await dailyUsageDoc.get();
      if (doc.exists) {
        await dailyUsageDoc.update({
          [`totalMinutesIn${screenName}`]:
            firestore.FieldValue.increment(timeSpent),
        });
      } else {
        await dailyUsageDoc.set({
          date: today,
          [`totalMinutesIn${screenName}`]: timeSpent,
        });
      }
    } catch (error) {
      console.error("Error updating analytics:", error);
    }
  }

  return (
    <AnalyticsContext.Provider value={{ analyticsData, updateScreenTime }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
