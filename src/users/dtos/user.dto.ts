// Since this is a response (outgoing) DTO, no validation is needed here
import { Expose, Exclude } from 'class-transformer';

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Exclude()
    password: string;
}
