import api from "./interceptor";

export function signIn(input: { username: string; password: string }) {
  return api.post("/sessions/@password", {
    email: input.username,
    password: input.password,
  });
}
export function register(input: {
  email: string;
  fullName: string;
  description: string;
  role: string;
  password: string;
  confirmPassword: string;
  prferedJobPostingIds: number[];
}) {
  return api.post("/users", {
    email: input.email,
    name: input.fullName,
    description: input.description,
    roleId: input.role === "COMPANY" ? 2 : 3,
    enabledState: "ENABLED",
    password: input.password,
    preferredJobPositionIds: input.prferedJobPostingIds,
  });
}
