export interface Schedule {
    id: number;
    startTime: Date;
    endTime: Date;
    userId: number;
    jobId: number;
    firstName: String;
    lastName: String;
    jobName: String;
    isApproved: boolean;
}
