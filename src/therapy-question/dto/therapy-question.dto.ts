import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTherapyQuestionDto {
    @ApiProperty({ example: 'What brings you here today?', description: 'The therapy question' })
    question: string;

    @ApiProperty({ example: 1, description: 'Therapy type ID' })
    therapyTypeId: number;
}

export class UpdateTherapyQuestionDto extends PartialType(CreateTherapyQuestionDto) {}

export class TherapyQuestionResponseDto {
    @ApiProperty({ example: 1, description: 'Therapy question ID' })
    id: number;

    @ApiProperty({ example: 'What brings you here today?', description: 'The therapy question' })
    question: string;

    @ApiProperty({ example: 1, description: 'Associated therapy type ID' })
    therapyTypeId: number;
}