import { Permission, UserRole } from "types/permissions";

export const permissions: Record<UserRole, Permission[]> = {
  [UserRole.Visitor]: [],
  [UserRole.Free]: [],
  [UserRole.Open]: [],
  [UserRole.Premium]: [
    Permission.ConnectDevices,
    Permission.PictureInPictureLyrics,
  ],
  [UserRole.Admin]: Object.values(Permission),
};
