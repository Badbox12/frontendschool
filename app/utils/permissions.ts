export const canModify = (role: string) => {
  return role === "admin" || role === "superadmin";
};
