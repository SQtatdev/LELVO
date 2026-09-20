export class UpdateUserDto {
  email?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  role?: 'EMPLOYEE' | 'MANAGER';
}