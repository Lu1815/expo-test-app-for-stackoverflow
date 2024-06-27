export interface TAppAnalytics extends IAppTotalAppUsage {
    appDailyUsage: IAppDailyUsage[];
    appMonthlySummary: IAppMonthlySummary[];
    appAnualSummary: IAppAnualSummary[];
}

interface IAppDailyUsage extends IAppTotalAppUsage {
    date: string; // "YYYY-MM-DD"
}

interface IAppMonthlySummary extends IAppTotalAppUsage {
    month: string; // "YYYY-MM"
}

interface IAppAnualSummary extends IAppTotalAppUsage{
    year: number; // "YYYY"
}

interface IAppTotalAppUsage {
    // AVERAGE TIME SPENT IN APP
    avgTimeInApp: number; // Average time spent in the app (in seconds)
    avgTimeOnFeedScreen: number; // Average time on feed screen (in seconds)
    avgTimeOnSearchScreen: number; // Average time on search screen (in seconds)
    avgTimeOnAddPostScreen: number; // Average time on add post screen (in seconds)
    avgTimeOnBookmarksScreen: number; // Average time on bookmarks screen (in seconds)
    avgTimeOnProfileScreen: number; // Average time on profile screen (in seconds)

    // TOTAL TIME SPENT IN APP
    totalSecondsInApp: number;
    totalSecondsInFeed: number;
    totalSecondsInProfile: number;
    totalSecondsInSearch: number;
    totalSecondsInBookmarks: number;
    totalSecondsInAddPost: number;

    // POSTS, LIKES, SHARES
    totalPosts: number;
    totalLikes: number;
    totalShares: number;

    // Ad data
    adImpressions: number; // Total number of ad impressions
    adClicks: number; // Total number of ad clicks

    // Engagement metrics
    // avgSessionDuration: number; // Average sessio duration (in seconds)
    // totalSessions: number; // Total number of sessions
    // activeUsers: number; // Number of active users within a time frame (e.g., daily active users)
    // retentionRate: number; // Retention rate percentage (e.g., users who return within a specific period)

    totalUsers: number; // Total number of users
}