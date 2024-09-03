import { PartialType } from '@nestjs/swagger';
import { CreateTerritoryDto } from './create-territory.dto';

export class UpdateTerritoryDto extends PartialType(CreateTerritoryDto) {}
