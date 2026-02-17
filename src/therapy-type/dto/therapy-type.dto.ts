import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTherapyTypeDto {
    @ApiProperty({ example: 'Individual Therapy', description: 'The name of the therapy type' })
    name: string;

    @ApiProperty({ example: 'One-on-one therapy session', description: 'A short description of the therapy type', required: false })
    description?: string;
}

export class UpdateTherapyTypeDto extends PartialType(CreateTherapyTypeDto) { }

export class TherapyTypeResponseDto {
    @ApiProperty({ example: 1, description: 'Unique identifier for the therapy type' })
    id: number;

    @ApiProperty({ example: 'Individual Therapy', description: 'The name of the therapy type' })
    name: string;

    @ApiProperty({ example: 'One-on-one therapy session', description: 'A short description of the therapy type', required: false })
    description?: string;

    @ApiProperty({ example: '2025-01-01T12:00:00Z', description: 'Timestamp when the therapy type was created' })
    createdAt: Date;

    @ApiProperty({ example: '2025-01-02T12:00:00Z', description: 'Timestamp when the therapy type was last updated' })
    updatedAt: Date;
}
