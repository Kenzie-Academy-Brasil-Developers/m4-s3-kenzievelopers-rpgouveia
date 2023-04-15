type iDeveloper = {
  id: number
  name: string
  email: string
};

type iDeveloperRequest = Omit <iDeveloper, "id">;

type iDeveloperInfos = {
  id: number
  developerSince: Date
  preferredOs: string
  developerId: number
};

type iDeveloperInfosRequest = Omit <iDeveloperInfos, "id">;

interface iEnumRange { enum_range: string };

interface iGetDeveloperRequest extends iDeveloper, iDeveloperInfos {};

export {
  iDeveloper,
  iDeveloperRequest,
  iDeveloperInfos,
  iDeveloperInfosRequest,
  iEnumRange,
  iGetDeveloperRequest
};