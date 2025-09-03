// Purpose: HTTP layer, apply guards & roles, map req.user → service

import {
  Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CampaignsService } from './campaigns.service';
import {
  CreateCampaignDto, UpdateCampaignDto, CreateCreativeDto, UpdateCreativeDto,
} from './dto';

type JwtUser = { sub: string; email: string; role: 'USER' | 'ADVERTISER' | 'ADMIN' };

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('campaigns') // prefixed by RouterModule: 'campaigns'
export class CampaignsController {
  constructor(private readonly svc: CampaignsService) {}


  // List campaigns for current advertiser (ADMIN sees all)
  @Get()
  async list(@Req() req: any) {
    const user = req.user as JwtUser;
    return this.svc.listForUser(user);
  }

  // Create campaign (ADVERTISER/ADMIN)
  @Roles('ADVERTISER', 'ADMIN')
  @Post()
  async create(@Req() req: any, @Body() dto: CreateCampaignDto) {
    const user = req.user as JwtUser;
    return this.svc.create(user, dto);
  }

  // Get one
  @Get(':id')
  async get(@Req() req: any, @Param('id') id: string) {
    const user = req.user as JwtUser;
    return this.svc.get(user, id);
  }

  // Update
  @Roles('ADVERTISER', 'ADMIN')
  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    const user = req.user as JwtUser;
    return this.svc.update(user, id, dto);
  }

  // Delete
  @Roles('ADVERTISER', 'ADMIN')
  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = req.user as JwtUser;
    return this.svc.remove(user, id);
  }


  // List creatives 
  @Get('/creatives')
  async listCreatives(@Req() req: any, @Query('campaignId') campaignId?: string) {
    const user = req.user as JwtUser;
    return this.svc.listCreatives(user, campaignId);
  }

  // Create creative
  @Roles('ADVERTISER', 'ADMIN')
  @Post('/creatives')
  async createCreative(@Req() req: any, @Body() dto: CreateCreativeDto) {
    const user = req.user as JwtUser;
    return this.svc.createCreative(user, dto);
  }

  // Update creative
  @Roles('ADVERTISER', 'ADMIN')
  @Patch('/creatives/:id')
  async updateCreative(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCreativeDto) {
    const user = req.user as JwtUser;
    return this.svc.updateCreative(user, id, dto);
  }

  // Delete creative
  @Roles('ADVERTISER', 'ADMIN')
  @Delete('/creatives/:id')
  async removeCreative(@Req() req: any, @Param('id') id: string) {
    const user = req.user as JwtUser;
    return this.svc.removeCreative(user, id);
  }
}
