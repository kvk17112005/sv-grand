export function getDashboardPath(role) {
  return role === "admin" || role === "super_admin" ? "/admin" : "/account";
}
