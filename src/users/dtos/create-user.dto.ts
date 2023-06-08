import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

// DTO === Data Transfer Object
export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(21)
    password: string;
}
