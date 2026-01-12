import { IsNotEmpty, IsString, Matches, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: 'Phone must be in format +998XXXXXXXXX' })
  phone: string;
}

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+998\d{9}$/, { message: 'Phone must be in format +998XXXXXXXXX' })
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}

export class CompleteProfileDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  surname: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsEnum(['MALE', 'FEMALE'])
  gender: 'MALE' | 'FEMALE';

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsNotEmpty()
  @IsEnum([
    'TOSHKENT_SHAHAR',
    'TOSHKENT_VILOYATI',
    'ANDIJON',
    'BUXORO',
    'FARGONA',
    'JIZZAX',
    'XORAZM',
    'NAMANGAN',
    'NAVOIY',
    'QASHQADARYO',
    'QORAQALPOGISTON',
    'SAMARQAND',
    'SIRDARYO',
    'SURXONDARYO',
  ])
  region: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
