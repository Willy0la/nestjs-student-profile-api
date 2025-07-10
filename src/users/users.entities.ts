import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export const role = ['admin', 'student', 'teacher'] as const;
export type UserRole = (typeof role)[number];
@Schema({ timestamps: true, collection: 'user' })
export class User {
  @Prop({
    unique: true,
    required: true,
    type: String,
  })
  email: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    required: true,
    type: String,
  })
  firstName: string;

  @Prop({
    required: true,
    type: String,
  })
  lastName: string;
  @Prop({
    enum: role,
    default: 'student',
    required: true,
    type: String,
  })
  role: UserRole;
}
export type UsersDocument = User & Document;
export const UsersSchema = SchemaFactory.createForClass(User);
export const UsersModelName = 'User';
