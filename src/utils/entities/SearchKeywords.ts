export type TSearchKeywords = {
    keyword: string;
    postId?: string[];
    accountId?: string[];
}

export type TSearchKeywordsSnapshot = {
    id: string;
    data: TSearchKeywords;
}