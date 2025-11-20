import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProposalsModule } from './proposals/proposals.module';
import { VotesModule } from './votes/votes.module';
import { Proposal } from './proposals/entities/proposal.entity';
import { Vote } from './votes/entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'adfam_proposals_db.sqlite',
      entities: [Proposal, Vote],
      synchronize: true, // Auto-create tables for dev
    }),
    ProposalsModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
