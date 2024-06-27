export type TReportCategory = {
    description: string;
    iconLibrary: string;
    iconName: string;
    name: string;
    priority: "Medium" | "High" | "Low";
}

export type TReportCategorySnapshot = {
    id: string;
    data: TReportCategory;
}