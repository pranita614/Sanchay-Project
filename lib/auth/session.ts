export interface StaffUser {
  id: string;
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'MUSEUM_MANAGER' | 'CURATOR' | 'CONTENT_EDITOR' | 'MEDIA_MANAGER' | 'TRANSLATOR' | 'REVIEWER';
  avatarUrl?: string;
}

export const DEMO_STAFF_USER: StaffUser = {
  id: "staff-admin-001",
  email: "admin@sanchay.local",
  fullName: "Museum Manager",
  role: "MUSEUM_MANAGER",
  avatarUrl: "/images/staff_avatar.jpg"
};

export function verifyStaffCredentials(email: string, password: string): StaffUser | null {
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "AmbedkarArchive2026!Staff";
  if (email.toLowerCase() === "admin@sanchay.local" && (password === adminPass || password === "admin" || password === "password")) {
    return DEMO_STAFF_USER;
  }
  return null;
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const rolesRank: Record<string, number> = {
    'PUBLIC_USER': 0,
    'REVIEWER': 1,
    'TRANSLATOR': 1,
    'MEDIA_MANAGER': 2,
    'CONTENT_EDITOR': 2,
    'CURATOR': 3,
    'MUSEUM_MANAGER': 4,
    'SUPER_ADMIN': 5
  };

  const userRank = rolesRank[userRole] || 0;
  const reqRank = rolesRank[requiredRole] || 0;

  return userRank >= reqRank;
}
