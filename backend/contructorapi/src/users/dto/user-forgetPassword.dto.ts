import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserForgetPasswordDto {
  @IsNotEmpty({ message: 'Email is missing' })
  @IsEmail({}, { message: 'Input a validate email' })
  email: string;
}
