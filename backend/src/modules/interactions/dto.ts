import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export enum InteractionType {
  CLICK = 'CLICK',
  LIKE = 'LIKE',
  VOTE = 'VOTE',
}

export class CreateInteractionDto {
  @IsString()
  creativeId!: string;

  @IsEnum(InteractionType)
  type!: InteractionType;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  metadata?: Record<string, any>;
}
