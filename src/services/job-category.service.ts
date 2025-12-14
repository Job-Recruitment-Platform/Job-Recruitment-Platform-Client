import { JobFamily } from "@/types/job-category.type";
import { BaseService } from "./base.service";
import { PaginationResponse } from "@/types/api.type.";


class JobCategoryService extends BaseService {
    constructor() {
        super('/jobs/category')
    }

    async getAllCategories(page: number = 0, size: number = 10): Promise<PaginationResponse<JobFamily[]>> {
        const response = await this.get<PaginationResponse<JobFamily[]>>(`?page=${page}&size=${size}`);
        return response.data;
    }
}

export const jobCategoryService = new JobCategoryService()