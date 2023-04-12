type iDeveloper = {
  id: number
  name: string
  email: string
};

type iDeveloperRequest = Omit <iDeveloper, "id">;

export {
  iDeveloper,
  iDeveloperRequest
};