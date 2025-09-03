import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum, IsUrl, Min, IsObject } from 'class-validator';
import { Type, Transform } from 'class-transformer';

enum ObjectiveEnum { CTR='CTR', LEAD='LEAD', VIEW='VIEW' }
enum CampaignStatusEnum { DRAFT='DRAFT', RUNNING='RUNNING', PAUSED='PAUSED' }
enum CreativeTypeEnum { IMAGE='IMAGE', VIDEO='VIDEO', POLL='POLL' }
enum CreativeStatusEnum { AI_DRAFT='AI_DRAFT', APPROVED='APPROVED', REJECTED='REJECTED' }

export class CreateCampaignDto {
  @IsNotEmpty() @IsString()
  name!: string;

  @IsEnum(ObjectiveEnum)
  objective!: 'CTR' | 'LEAD' | 'VIEW';

  @Type(() => Number) @IsInt() @Min(0)
  budget!: number; 

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  cpc?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  cpm?: number;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  targeting?: Record<string, any>;
}

export class UpdateCampaignDto {
  @IsOptional() @IsString()
  name?: string;

  @IsOptional() @IsEnum(ObjectiveEnum)
  objective?: 'CTR' | 'LEAD' | 'VIEW';

  @IsOptional() @IsEnum(CampaignStatusEnum)
  status?: 'DRAFT' | 'RUNNING' | 'PAUSED';

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  budget?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  cpc?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(0)
  cpm?: number;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return value; }
    }
    return value;
  })
  targeting?: Record<string, any>;
}

export class CreateCreativeDto {
  @IsNotEmpty() @IsString()
  campaignId!: string;

  @IsEnum(CreativeTypeEnum)
  ctype!: 'IMAGE' | 'VIDEO' | 'POLL';

  @IsNotEmpty() @IsString()
  title!: string;

  @IsOptional() @IsString()
  body?: string;

  @IsOptional() @IsUrl()
  mediaUrl?: string;

  @IsOptional() @IsString()
  cta?: string;

  @IsOptional() @IsString()
  lang?: string;
}

export class UpdateCreativeDto {
  @IsOptional() @IsEnum(CreativeTypeEnum)
  ctype?: 'IMAGE' | 'VIDEO' | 'POLL';

  @IsOptional() @IsString()
  title?: string;

  @IsOptional() @IsString()
  body?: string;

  @IsOptional() @IsUrl()
  mediaUrl?: string;

  @IsOptional() @IsString()
  cta?: string;

  @IsOptional() @IsString()
  lang?: string;

  @IsOptional() @IsEnum(CreativeStatusEnum)
  status?: 'AI_DRAFT' | 'APPROVED' | 'REJECTED';
}
