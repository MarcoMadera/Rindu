import React, { createContext, useCallback, useState } from "react";

import { FeatureAccess, Permission, UserRole } from "types/permissions";
import { ITranslations } from "types/translations";
import { permissions } from "utils";

export interface PermissionsContext {
  permissions: Permission[];
  addPermission: (permission: Permission) => void;
  removePermission: (permission: Permission) => void;
  checkPermission: (permission: Permission) => FeatureAccess;
}

export const PermissionsContext = createContext<PermissionsContext | undefined>(
  undefined
);

interface PermissionsProviderProps {
  translations?: ITranslations;
  role: UserRole;
  children: React.ReactNode;
}

export const PermissionsContextProvider: React.FC<PermissionsProviderProps> = ({
  role,
  translations,
  children,
}) => {
  const [userPermissions, setUserPermissions] = useState<Permission[]>(
    permissions[role]
  );

  const addPermission = useCallback((permission: Permission) => {
    setUserPermissions((prev) => {
      if (!prev.includes(permission)) {
        return [...prev, permission];
      }
      return prev;
    });
  }, []);

  const removePermission = useCallback((permission: Permission) => {
    setUserPermissions((prev) => prev.filter((p) => p !== permission));
  }, []);

  const checkPermission = useCallback(
    (permission: Permission): FeatureAccess => {
      if (userPermissions.includes(permission)) {
        return { granted: true };
      }

      return {
        granted: false,
        restrictedReason:
          translations?.permissions?.[permission]?.restrictedReason ?? "",
      };
    },
    [userPermissions, translations?.permissions]
  );

  const value = {
    permissions: userPermissions,
    addPermission,
    removePermission,
    checkPermission,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
