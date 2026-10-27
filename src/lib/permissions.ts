import { Role, Action, UserRoleOrGuest } from './types';

/**
 * Ma trận phân quyền duy nhất của hệ thống (Single Source of Truth)
 *
 * Hành động           guest   user   admin
 * Xem deadline          ✓      ✓       ✓
 * Đánh dấu đã xong      ✗      ✓       ✓
 * Thêm deadline         ✗      ✗       ✓
 * Xoá deadline          ✗      ✗       ✓
 */
export const PERMISSION_MATRIX: Record<UserRoleOrGuest, Record<Action, boolean>> = {
  guest: {
    view_deadline: true,
    mark_completed: false,
    create_deadline: false,
    delete_deadline: false,
  },
  user: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: false,
    delete_deadline: false,
  },
  admin: {
    view_deadline: true,
    mark_completed: true,
    create_deadline: true,
    delete_deadline: true,
  },
};

/**
 * Kiểm tra xem một vai trò có quyền thực hiện một hành động hay không.
 * @param role Vai trò người dùng ('admin' | 'user' | 'guest' | undefined | null)
 * @param action Hành động cần kiểm tra ('view_deadline' | 'mark_completed' | 'create_deadline' | 'delete_deadline')
 */
export function can(
  role: UserRoleOrGuest | null | undefined,
  action: Action
): boolean {
  const currentRole: UserRoleOrGuest = role ?? 'guest';
  return PERMISSION_MATRIX[currentRole]?.[action] ?? false;
}
