type iProject = {
  name: string
  description?: string
  estimatedTime: string
  repository: string
  startDate: Date
  endDate?: Date
  developerId: number
};

type iTechnology = {
  id: number
  name: string
};

type iValidTechnologyResult = Omit<iTechnology, "id">;

type iProjectTechnology = {
  id: number
  addedIn: Date
  technologyId: number
  projectId: number
};

type iAddTechnologyResponse = {
  technologyId: number
  technologyName: string
  projectId: number
  projectName: string
  projectDescription?: string | undefined
  projectEstimatedTime: string
  projectRepository: string
  projectStartDate: Date
  projectEndDate?: Date | undefined
};

export {
  iProject,
  iTechnology,
  iProjectTechnology,
  iAddTechnologyResponse,
  iValidTechnologyResult
};