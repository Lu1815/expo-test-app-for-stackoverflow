export interface ReportBaseEntity {
    reportReason: string;
    reportedBy: string;
    description: string;
    reportCreationDate: string;
    reportCreationDateTimestamp: number;
    status: "Pending" | "Resolved" | "Rejected";
    priority: "High" | "Medium" | "Low";
    resolution: string;
    resolutionDate: string;
    resolutionDateTimestamp: number;
    resolutionBy: string;
}