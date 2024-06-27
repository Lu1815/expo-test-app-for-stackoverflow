import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../../utils/contexts/AuthContext';
import { ITotalAppUsage } from '../../utils/entities/UserAnalytics';
import { FirestoreCollections } from '../../utils/lib/Consts';
import { errorLogger } from '../../utils/lib/errors/ErrorLogger';

export const _googleadService = () => {
    const { currentUser } = useAuth();
    const userAnalyticsCollectionName = FirestoreCollections.USER_ANALYTICS;
    const dailyUsageCollectionName = FirestoreCollections.DAILY_USAGE;

    async function updateField(fieldName: keyof ITotalAppUsage, errorMessage: string) {
        const userId = currentUser?.uid;
        const collectionPath = `${userAnalyticsCollectionName}/${userId}/${dailyUsageCollectionName}`;
        const todaysDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        try {
            const dailyUsageRef = firestore()
                .collection(collectionPath)
                .doc(todaysDate);
            const dailyUsage = await dailyUsageRef.get();

            if(!dailyUsage.exists) {
                console.log('No daily usage data found. Creating new entry.')
                await dailyUsageRef.set({
                    [fieldName]: 1
                })
                return;
            }

            const dailyUsageData = dailyUsage.data();
            
            if (dailyUsageData) {
                const amountToAdd = dailyUsageData[fieldName] 
                    ? dailyUsageData[fieldName] + 1
                    : 1;

                await dailyUsageRef.update({
                    [fieldName]: amountToAdd
                })
            }
        } catch (error) {
            errorLogger(
                error,
                errorMessage,
                currentUser,
            )
            console.error(errorMessage, error)
        }
    }

    async function handleAdLoaded() {
        await updateField('adImpressions', 'Error updating adImpressions field in userAnalytics');
    }
    
    async function handleAdOpened() {
        await updateField('adClicks', 'Error updating adClicks field in userAnalytics');
    }

    const handleFailedToLoad = (error) => {
        errorLogger(error, 'There was an error loading the Google Ad.');
    }

    return {
        handleAdLoaded,
        handleAdOpened,
        handleFailedToLoad
    }
}