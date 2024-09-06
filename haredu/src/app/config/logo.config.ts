import { USER_ROLE } from '#utils/const';

export const MappingLogoDefaultLinkByRole = {
  [USER_ROLE.ADMIN]: '/master/dashboard',
  [USER_ROLE.STAFF]: '/admin/dashboard',
  [USER_ROLE.STUDENT]: '/student/dashboard',
  [USER_ROLE.TUTOR]: '/lecture/dashboard',
};
