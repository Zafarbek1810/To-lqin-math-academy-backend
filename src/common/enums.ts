export enum Role {
  ADMIN = 'admin',
  RECEPTION = 'reception',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export enum HomeworkStatus {
  FULL = 'full',
  PARTIAL = 'partial',
  NONE = 'none',
}

export enum OrderStatus {
  NEW = 'new',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum ApplicationStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CLOSED = 'closed',
}

export enum ExamStatus {
  UPCOMING = 'upcoming',
  COMPLETED = 'completed',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  OTHER = 'other',
}

export enum PaymentStatus {
  PAID = 'paid',
  PENDING = 'pending',
  OVERDUE = 'overdue',
}
