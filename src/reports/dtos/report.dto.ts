import { Expose, Transform, Exclude } from 'class-transformer';

// DTO === Data Transfer Object
export class ReportDto {
    @Expose()
    price: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    milage: number;

    @Expose()
    approved: boolean;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}
