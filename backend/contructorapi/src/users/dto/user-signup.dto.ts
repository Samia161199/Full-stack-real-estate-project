import { IsNotEmpty, IsString } from 'class-validator';
import { UserSignInDto } from './user-signin.dto';

export class UserSignUpDto extends UserSignInDto {
  @IsNotEmpty({ message: 'Username is missing' })
  @IsString({ message: 'Input a validate name' })
  name: string;
}
