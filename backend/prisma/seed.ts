import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('password123', 10);

  const u1 = await prisma.user.create({
    data: { email: 'user1@moneylike.io', password: hash, role: 'USER' },
  });

  const u2 = await prisma.user.create({
    data: { email: 'user2@moneylike.io', password: hash, role: 'USER' },
  });

  const advUser = await prisma.user.create({
    data: { email: 'adv@moneylike.io', password: hash, role: 'ADVERTISER' },
  });


  await prisma.wallet.createMany({
    data: [
      { userId: u1.id, balance: 500 },
      { userId: u2.id, balance: 250 },
      { userId: advUser.id, balance: 1000 }, 
    ],
  });

  const advOrg = await prisma.advertiser.create({
    data: { orgName: 'Test Advertiser', billingEmail: 'adv@moneylike.io' },
  });


  const camp = await prisma.campaign.create({
    data: {
      advertiserId: advOrg.id,
      name: 'Test Campaign – Food & Beauty',
      objective: 'CTR',
      status: 'DRAFT',
      budget: 100000,
      cpc: 50,
      targeting: { interests: ['food', 'beauty'] },
    },
  });


  await prisma.creative.createMany({
    data: [
      {
        campaignId: camp.id,
        ctype: 'IMAGE',
        title: 'Promo Burger',
        body: '2 pour 1',
        mediaUrl: 'https://placehold.co/600x400',
        cta: 'Commander',
        lang: 'fr',
        status: 'APPROVED',
      },
      {
        campaignId: camp.id,
        ctype: 'VIDEO',
        title: 'Dentifrice X',
        body: 'Sourire éclatant',
        mediaUrl: 'https://placehold.co/600x400.mp4',
        cta: 'Acheter',
        lang: 'fr',
        status: 'AI_DRAFT',
      },
    ],
  });

  console.log('✅ Seed done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
