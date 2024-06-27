export type TUserAnalytics = {
    userId: string;

    // ACCOUNT DURATION
    accountDurationInDays: number;
    accountDurationInMonths: number;
    accountDurationInYears: number;
    accountDuration: string; // "X years, Y months, Z days"
    accountCreatedAt: string;
    accountCreatedAtTimestamp: number;

    // TIME SPENT IN APP (OVERALL)
    dailyUsage?: IDailyUsage[]
    monthlySummary?: IMonthlySummary[]
    annualSummary?: IAnnualSummary[]
}

interface IDailyUsage extends ITotalAppUsage {
    date: string; // "YYYY-MM-DD"
}

interface IMonthlySummary extends ITotalAppUsage {
    month: string; // "YYYY-MM"
}

interface IAnnualSummary extends ITotalAppUsage {
    year: number; // "YYYY"
}

export interface ITotalAppUsage {
    // TIME SPENT IN APP
    totalMinutesInApp: number;
    totalMinutesInFeed: number;
    totalMinutesInProfile: number;
    totalMinutesInSearch: number;
    totalMinutesInBookmarks: number;
    totalMinutesInAddPost: number;

    // POSTS, LIKES, SHARES
    totalPosts: number;
    totalLikes: number;
    totalShares: number;

    // AD METRICS
    adImpressions: number;
    adClicks: number;
}
