import { useCustomContext } from "./useCustomContext";
import { PermissionsContext } from "context/PermissionsContextProvider";

export const usePermissions = (): PermissionsContext => {
  const permissionsManager = useCustomContext(PermissionsContext);

  return permissionsManager;
};
