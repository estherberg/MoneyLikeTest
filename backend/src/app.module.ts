import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { CreativesModule } from './modules/creatives/creatives.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';


@Module({
  imports: [
    SharedModule,
    AuthModule,
    UsersModule,
    WalletModule,
    CampaignsModule,
    CreativesModule,
    InteractionsModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
