import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExecutionDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  testCaseIds: string[];
}

export class UpdateExecutionCaseDto {
  @ApiProperty()
  @IsString()
  status: string; // Passed, Failed, Pending

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  actualResult?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}