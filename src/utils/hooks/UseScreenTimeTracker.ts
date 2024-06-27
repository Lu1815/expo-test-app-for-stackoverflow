import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';

const useScreenTimeTracker = (screenName: string) => {
  const { updateScreenTime } = useAnalytics();
  const memoizedUpdateScreenTime = useCallback(updateScreenTime, []);
  const focusTime = useRef<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      // When the screen comes into focus
      focusTime.current = new Date();

      return () => {
        // When the screen goes out of focus
        const blurTime = new Date();
        const timeSpent = (blurTime.getTime() - focusTime.current!.getTime()) / (1000 * 60); // time spent in minutes
        memoizedUpdateScreenTime(screenName, timeSpent);
      };
    }, [memoizedUpdateScreenTime, screenName])
  );
};

export default useScreenTimeTracker;
