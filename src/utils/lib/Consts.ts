// FIREBASE
export enum FirebaseErrors {
    AUTH_INVALID_EMAIL = "auth/invalid-email",
    AUTH_INVALID_PWD = "auth/invalid-password",
    AUTH_NETWORK_REQUEST_FAILED = "auth/network-request-failed",
    AUTH_EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
    AUTH_WEAK_PASSWORD = "auth/weak-password",
    AUTH_INVALID_CREDENTIALS = "auth/invalid-credential",
    AUTH_USER_NOT_FOUND = "auth/user-not-found",
    TOO_MANY_REQUESTS = "auth/too-many-requests",
}

export enum LoginCodes {
    EMAIL_NOT_VERIFIED = "auth/email-not-verified",
    USER_DETAILS_NOT_FOUND = "auth/user-details-not-found",
    OTP_LOGIN_ENABLED = "auth/otp-login-enabled",
    PHONE_NUMBER_NOT_VERIFIED = "auth/phone-number-not-verified",
    VALID_LOGIN = "auth/valid-login",
}

// LOGIN
export enum LoginErrorMessages {
    INVALID_EMAIL = "Invalid email",
    INVALID_PWD = "Invalid password",
    PASSWORD_RESET_INVALID_EMAIL = "The email you are providing does not exist in our records",
    PASSWORD_RESET_NETWORK_REQUEST_FAILED = "There was an error sending the password reset email. Please try again later.",
    INVALID_CRENDENTIALS = "Invalid credentials or user does not exists",
    USER_NOT_FOUND = "User not found",
}

export enum LoginInfoMessages {
    PASSWORD_RESET_SEND = "An email to reset password has been sent to you email address",
}

// SIGNUP
export enum SignUpMessages {
    OTP_CODE_SENT = "A verification code was sent to your phone number",
    OTP_CODE_NOT_SENT = "There was an error sending the code",
    EMAIL_ALREADY_IN_USE = "This email address is already in use",
    WEAK_PASSWORD = "Password requires to be at least 6 characters long"
}

// COMPONENTS
export enum ComponentNames {
    LOGIN = "Login",
    SIGNUP = "Signup",
    TABS_NAVIGATOR = "TabsNavigator",
    SETTINGS = "Settings",
    OTP = "OtpConfirmation",
    PHONE_AUTH = "PhoneAuth"
}

// API ROUTES 
export enum APIRoutes {
    GOOGLE_USER_INFO = "https://www.googleapis.com/userinfo/v2/me",
}

// FIRESTORE COLLECTION NAMES
export enum FirestoreCollections {
    ACCOUNTS_KEYWORDS = "accountsKeywords",
    ACCOUNTS_OPTIONS = "accountsOptions",
    COMMENTS = "comments",
    COMMENT_ANSWERS = "commentAnswers",
    COMMENT_MENTIONS = "commentMentions",
    FOLLOWS = "follows",
    LIKES_COMMENT_ANSWERS = "likesCommentAnswers",
    LIKES_COMMENTS = "likesComments",
    LIKES_POSTS = "likesPosts",
    POST_KEYWORDS = "postKeywords",
    POST_MENTIONS = "postMentions",
    POST_OPTIONS = "postsOptions",
    POST_REPORTS = "postReports",
    POSTS = "posts",
    REPORTS_CATEGORIES = "reportsCategories",
    SEARCH_KEYWORDS = "searchKeywords",
    USER_ANALYTICS = "userAnalytics",
    USER_DETAILS = "userDetails",
    USER_PREFERENCES = "userPreferences",
    USER_REPORTS = "userReports",

    // SUBCOLLECTIONS NAMES
    DAILY_USAGE = "dailyUsage",
    MONTHLY_SUMMARY = "monthlySummary",
    ANUAL_SUMMARY = "anualSummary",
    OPTIONS = "options",
    BOOKMARKS = "bookmarks",
}

// PREDEFINED LIST OF UNDESIRED TERMS TO FILTER POST AND ACCOUNT KEYWORDS
export const filterTerms = [
    "the", "and", "but", "or", "because", "as", "until",
    "while", "of", "at", "by", "for", "with", "about", "against",
    "between", "into", "through", "during", "before", "after", "above",
    "below", "to", "from", "up", "down", "in", "out", "on", "off", "over",
    "under", "again", "further", "then", "once", "here", "there", "when",
    "where", "why", "how", "all", "any", "both", "each", "few", "more",
    "most", "other", "some", "such", "no", "nor", "not", "only", "own",
    "same", "so", "than", "too", "very", "s", "t", "can", "will", "just",
    "don", "should", "now"
];

// POST OPTIONS
export enum PostOptionNames {
    REPORT = "report",
    EDIT = "edit",
    DELETE = "delete",
    BOOKMARK = "bookmark",
}

export enum ScreenNamesEnum {
    FEED = "Feed",
    PROFILE = "Profile",
    SEARCH = "Search",
    ADD_POST = "AddPost",
    BOOKMARKS = "Bookmarks",
}

export type TScreenNames = "Feed" | "Profile" | "Search" | "AddPost" | "Bookmarks";

export enum ScreenRoutes {
    // FEED NAVIGATOR
    FEED = "Feed",
    FEED_PROFILE = "Feed.Profile",
    FEED_PROFILE_PROFILE = "Feed.Profile.Profile",
    FEED_MAP = "Feed.Map",
    FEED_POST = "Feed.Post",
    FEED_PROFILE_FEED = "Feed.Profile.Feed",
    FEED_PROFILE_FOLLOWS = "Feed.Profile.Follows",

    // SEARCH NAVIGATOR
    SEARCH_SEARCH = "Search.Search",
    SEARCH_MAP = "Search.Map",
    SEARCH_PROFILE = "Search.Profile",
    SEARCH_PROFILE_PROFILE = "Search.Profile.Profile",
    SEARCH_PROFILE_FEED = "Search.Profile.Feed",
    SEARCH_POST = "Search.Post",
    SEARCH_PROFILE_FOLLOWS = "Search.Profile.Follows",

    // ADD NAVIGATOR
    ADD_FORM = "Add.Form",
    ADD_FORM_LOCATION = "Add.Form.Location",

    // BOOKMARK NAVIGATOR
    BOOKMARK = "Bookmark",
    BOOKMARK_PROFILE = "Bookmark.Profile",
    BOOKMARK_PROFILE_PROFILE = "Bookmark.Profile.Profile",
    BOOKMARK_PROFILE_FEED = "Bookmark.Profile.Feed",
    BOOKMARK_FEED = "Bookmark.Feed",
    BOOKMARK_POST = "Bookmark.Post",
    BOOKMARK_MAP = "Bookmark.Map",
    BOOKMARK_ADD_COLLECTION = "Bookmark.AddCollection",
    BOOKMARK_CREATE_COLLECTION = "Bookmark.CreateCollection",
    BOOKMARK_PROFILE_FOLLOWS = "Bookmark.Profile.Follows",

    // PROFILE NAVIGATOR
    PROFILE_PROFILE = "Profile.Profile",
    PROFILE_NOT_CURRENT_USER_PROFILE = "Profile.NotCurrentUserProfile",
    PROFILE_FEED = "Profile.Feed",
    PROFILE_POST = "Profile.Post",
    PROFILE_POST_EDIT = "Profile.Post_Edit",
    PROFILE_PREFERENCES = "Profile.Preferences",
    PROFILE_DETAILS = "Profile.Details",
    PROFILE_MAP = "Profile.Map",
    PROFILE_FOLLOWS = "Profile.Follows",
}