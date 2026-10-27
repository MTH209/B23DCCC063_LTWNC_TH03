import { can, PERMISSION_MATRIX } from '@/lib/permissions';
import { Action, Role, UserRoleOrGuest } from '@/lib/types';

describe('Kiểm thử ma trận phân quyền can(role, action)', () => {
  describe('1. Khách vãng lai (Guest)', () => {
    it('cho phép xem danh sách và chi tiết deadline (view_deadline)', () => {
      expect(can('guest', 'view_deadline')).toBe(true);
    });

    it('không cho phép đánh dấu hoàn thành deadline (mark_completed)', () => {
      expect(can('guest', 'mark_completed')).toBe(false);
    });

    it('không cho phép thêm deadline mới (create_deadline)', () => {
      expect(can('guest', 'create_deadline')).toBe(false);
    });

    it('không cho phép xoá deadline (delete_deadline)', () => {
      expect(can('guest', 'delete_deadline')).toBe(false);
    });
  });

  describe('2. Sinh viên đã đăng nhập (User)', () => {
    it('cho phép xem danh sách và chi tiết deadline (view_deadline)', () => {
      expect(can('user', 'view_deadline')).toBe(true);
    });

    it('cho phép đánh dấu bài tập đã hoàn thành (mark_completed)', () => {
      expect(can('user', 'mark_completed')).toBe(true);
    });

    it('không cho phép thêm deadline (create_deadline)', () => {
      expect(can('user', 'create_deadline')).toBe(false);
    });

    it('không cho phép xoá deadline (delete_deadline)', () => {
      expect(can('user', 'delete_deadline')).toBe(false);
    });
  });

  describe('3. Lớp trưởng / Quản trị viên (Admin)', () => {
    it('cho phép xem danh sách và chi tiết deadline (view_deadline)', () => {
      expect(can('admin', 'view_deadline')).toBe(true);
    });

    it('cho phép đánh dấu bài tập cá nhân hoàn thành (mark_completed)', () => {
      expect(can('admin', 'mark_completed')).toBe(true);
    });

    it('cho phép tạo thêm deadline mới của môn học (create_deadline)', () => {
      expect(can('admin', 'create_deadline')).toBe(true);
    });

    it('cho phép xoá deadline khỏi hệ thống (delete_deadline)', () => {
      expect(can('admin', 'delete_deadline')).toBe(true);
    });
  });

  describe('4. Trường hợp đặc biệt và giá trị biên (Edge cases)', () => {
    it('khi role là undefined thì tự động áp dụng quyền của guest', () => {
      expect(can(undefined, 'view_deadline')).toBe(true);
      expect(can(undefined, 'mark_completed')).toBe(false);
      expect(can(undefined, 'create_deadline')).toBe(false);
      expect(can(undefined, 'delete_deadline')).toBe(false);
    });

    it('khi role là null thì tự động áp dụng quyền của guest', () => {
      expect(can(null, 'view_deadline')).toBe(true);
      expect(can(null, 'mark_completed')).toBe(false);
      expect(can(null, 'create_deadline')).toBe(false);
      expect(can(null, 'delete_deadline')).toBe(false);
    });

    it('khi role không hợp lệ (ví dụ hacker) thì trả về false cho mọi thao tác bị cấm', () => {
      const invalidRole = 'hacker' as unknown as UserRoleOrGuest;
      expect(can(invalidRole, 'view_deadline')).toBe(false);
      expect(can(invalidRole, 'create_deadline')).toBe(false);
      expect(can(invalidRole, 'delete_deadline')).toBe(false);
      expect(can(invalidRole, 'mark_completed')).toBe(false);
    });

    it('khi action không tồn tại thì trả về false', () => {
      const invalidAction = 'drop_database' as unknown as Action;
      expect(can('admin', invalidAction)).toBe(false);
      expect(can('user', invalidAction)).toBe(false);
      expect(can('guest', invalidAction)).toBe(false);
    });
  });

  describe('5. Tính toàn vẹn của Ma trận PERMISSION_MATRIX', () => {
    it('phải định nghĩa đầy đủ 3 vai trò: guest, user, admin', () => {
      expect(PERMISSION_MATRIX).toHaveProperty('guest');
      expect(PERMISSION_MATRIX).toHaveProperty('user');
      expect(PERMISSION_MATRIX).toHaveProperty('admin');
    });

    it('mỗi vai trò phải có đủ 4 hành vi cốt lõi', () => {
      const actions: Action[] = [
        'view_deadline',
        'mark_completed',
        'create_deadline',
        'delete_deadline',
      ];

      (['guest', 'user', 'admin'] as const).forEach((role) => {
        actions.forEach((act) => {
          expect(typeof PERMISSION_MATRIX[role][act]).toBe('boolean');
        });
      });
    });
  });
});
