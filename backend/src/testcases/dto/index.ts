import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestCaseDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  featureId?: string;

  @ApiProperty()
  @IsString()
  scenario: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsArray()
  steps: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  testData?: string;

  @ApiProperty()
  @IsString()
  expectedResult: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string;
}

export class UpdateTestCaseDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  scenario?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  steps?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  testData?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  expectedResult?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}