import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/enums/role.enum";

export class UserDTO {

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsDateString()
  birthAt?: string | Date;

  @IsStrongPassword({
    minLength: 6,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minLowercase: 0
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role: number;

}