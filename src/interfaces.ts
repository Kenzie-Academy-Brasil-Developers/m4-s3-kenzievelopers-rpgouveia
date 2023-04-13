type iDeveloper = {
  id: number
  name: string
  email: string
};

type iDeveloperRequest = Omit <iDeveloper, "id">;

type iDeveloperInfo = {
  id: number
  developerSince: Date
  preferredOs: string
  developerId: number
};

type iDeveloperInfoRequest = Omit <iDeveloperInfo, "id">;

interface iEnumRange {
  enum_range: string;
}

export {
  iDeveloper,
  iDeveloperRequest,
  iDeveloperInfo,
  iDeveloperInfoRequest,
  iEnumRange
};