import {
    IsEmail,
    IsString,
    IsOptional,
    MinLength,
    MaxLength,
} from 'class-validator';

// DTO === Data Transfer Object
export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(21)
    password: string;
}
