import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';

type Role = 'USER' | 'ADVERTISER' | 'ADMIN';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  // Resolve advertiser for current user (create on first use)
  private async getOrCreateAdvertiserForUser(email: string) {
    let adv = await this.prisma.advertiser.findFirst({ where: { billingEmail: email } });
    if (!adv) {
      adv = await this.prisma.advertiser.create({
        data: { orgName: email.split('@')[0] || 'Advertiser', billingEmail: email },
      });
    }
    return adv;
  }

  // Check that a given campaign belongs to the current user's advertiser
  private async assertCampaignOwnership(campaignId: string, userEmail: string) {
    const row = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { advertiser: { select: { billingEmail: true } } },
    });
    if (!row) throw new NotFoundException('Campaign not found');
    if (row.advertiser.billingEmail !== userEmail) {
      throw new ForbiddenException('Not your campaign');
    }
  }

  // ===== CAMPAIGNS =====

  async listForUser(user: { email: string; role: Role }) {
    if (user.role === 'ADMIN') {
      return this.prisma.campaign.findMany({
        orderBy: { createdAt: 'desc' },
        include: { advertiser: true, creatives: true },
      });
    }
    const email = user.email;
    return this.prisma.campaign.findMany({
      where: { advertiser: { billingEmail: email } },
      orderBy: { createdAt: 'desc' },
      include: { advertiser: true, creatives: true },
    });
  }

  async create(user: { email: string; role: Role }, dto: {
    name: string; objective: 'CTR'|'LEAD'|'VIEW'; budget: number;
    cpc?: number; cpm?: number; targeting?: Record<string, any>;
  }) {
    if (user.role !== 'ADVERTISER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('ADVERTISER or ADMIN required');
    }
    const adv = await this.getOrCreateAdvertiserForUser(user.email);
    return this.prisma.campaign.create({
      data: {
        advertiserId: adv.id,
        name: dto.name,
        objective: dto.objective,
        status: 'DRAFT',
        budget: dto.budget,
        cpc: dto.cpc,
        cpm: dto.cpm,
        targeting: dto.targeting ?? {},
        creatives: { create: [] },
      },
      include: { advertiser: true, creatives: true },
    });
  }

  async get(user: { email: string; role: Role }, id: string) {
    if (user.role !== 'ADMIN') {
      await this.assertCampaignOwnership(id, user.email);
    }
    return this.prisma.campaign.findUnique({
      where: { id },
      include: { advertiser: true, creatives: true },
    });
  }

  async update(user: { email: string; role: Role }, id: string, dto: any) {
    if (user.role !== 'ADMIN') {
      await this.assertCampaignOwnership(id, user.email);
    }
    return this.prisma.campaign.update({
      where: { id },
      data: {
        name: dto.name ?? undefined, 
        objective: dto.objective ?? undefined,
        status: dto.status ?? undefined,
        budget: dto.budget ?? undefined,
        cpc: dto.cpc ?? undefined,
        cpm: dto.cpm ?? undefined,
        targeting: dto.targeting ?? undefined,
      },
      include: { advertiser: true, creatives: true },
    });
  }

  async remove(user: { email: string; role: Role }, id: string) {
    if (user.role !== 'ADMIN') {
      await this.assertCampaignOwnership(id, user.email);
    }
    await this.prisma.campaign.delete({ where: { id } });
    return { ok: true };
  }

  // ===== CREATIVES =====

  private async assertCreativeOwnership(creativeId: string, userEmail: string) {
    const row = await this.prisma.creative.findUnique({
      where: { id: creativeId },
      select: { campaign: { select: { advertiser: { select: { billingEmail: true } } } } },
    });
    if (!row) throw new NotFoundException('Creative not found');
    if (row.campaign.advertiser.billingEmail !== userEmail) {
      throw new ForbiddenException('Not your creative');
    }
  }

  async listCreatives(user: { email: string; role: Role }, campaignId?: string) {
    if (user.role === 'ADMIN') {
      return this.prisma.creative.findMany({
        where: campaignId ? { campaignId } : undefined,
        orderBy: { id: 'desc' },
      });
    }
    // only those belonging to this advertiser
    return this.prisma.creative.findMany({
      where: {
        campaign: {
          advertiser: { billingEmail: user.email },
          ...(campaignId ? { id: campaignId } : {}),
        },
      },
      orderBy: { id: 'desc' },
    });
  }

  async createCreative(user: { email: string; role: Role }, dto: {
    campaignId: string; ctype: 'IMAGE'|'VIDEO'|'POLL';
    title: string; body?: string; mediaUrl?: string; cta?: string; lang?: string;
  }) {
    if (user.role !== 'ADVERTISER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('ADVERTISER or ADMIN required');
    }
    if (user.role !== 'ADMIN') {
      await this.assertCampaignOwnership(dto.campaignId, user.email);
    }
    return this.prisma.creative.create({
      data: {
        campaignId: dto.campaignId,
        ctype: dto.ctype,
        title: dto.title,
        body: dto.body,
        mediaUrl: dto.mediaUrl,
        cta: dto.cta,
        lang: dto.lang,
        status: 'AI_DRAFT',
      },
    });
  }

  async updateCreative(user: { email: string; role: Role }, id: string, dto: any) {
    if (user.role !== 'ADMIN') {
      await this.assertCreativeOwnership(id, user.email);
    }
    return this.prisma.creative.update({
      where: { id },
      data: {
        ctype: dto.ctype ?? undefined,
        title: dto.title ?? undefined,
        body: dto.body ?? undefined,
        mediaUrl: dto.mediaUrl ?? undefined,
        cta: dto.cta ?? undefined,
        lang: dto.lang ?? undefined,
        status: dto.status ?? undefined,
      },
    });
  }

  async removeCreative(user: { email: string; role: Role }, id: string) {
    if (user.role !== 'ADMIN') {
      await this.assertCreativeOwnership(id, user.email);
    }
    await this.prisma.creative.delete({ where: { id } });
    return { ok: true };
  }
}
