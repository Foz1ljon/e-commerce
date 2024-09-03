import { Module } from '@nestjs/common';
import { TerritoryService } from './territory.service';
import { TerritoryController } from './territory.controller';

@Module({
  controllers: [TerritoryController],
  providers: [TerritoryService],
})
export class TerritoryModule {}
