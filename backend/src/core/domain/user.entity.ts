export class UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  createdAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
