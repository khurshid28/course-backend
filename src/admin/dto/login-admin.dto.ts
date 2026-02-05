import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
