import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty({ message: 'Email is missing' })
  @IsEmail({}, { message: 'Input a validate email' })
  email: string;

  @IsNotEmpty({ message: 'Password is missing' })
  @MinLength(5, { message: 'Password minimum character should be 5' })
  password: string;
}
