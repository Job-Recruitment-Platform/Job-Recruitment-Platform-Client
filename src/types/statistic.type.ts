import { JobResponse } from "./job.type";

export interface StatisticResponse {
  currentPublishJobCount: number;

  totalNewApplicationCount: number;

  totalPendingApplicationCount: number;

  weeklyApplicationCount: Record<number, number>;

  newestJobs: Array<JobResponse>;

  newestJobApplications: Array<NewestJobApplication>;
}

interface NewestJobApplication {
    jobTitle: string;
    candidateName: string;
    appliedAt: string;
}
