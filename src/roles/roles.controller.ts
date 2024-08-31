import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Role } from './entities/role.entity';

@ApiTags('Roles') // Swagger uchun rolning kategoriyasini belgilaydi
@Controller('roles') // Rol controllerini "roles" yo'lida joylash
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Rol muvaffaqiyatli yaratildi.',
    type: Role, // Qaytariladigan ob'ekt turi
  })
  @ApiResponse({
    status: 409,
    description: 'Bu rol allaqachon mavjud.',
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Barcha rollar muvaffaqiyatli topildi.',
    type: [Role], // Qaytariladigan ob'ektlar ro'yxati
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Rol muvaffaqiyatli topildi.',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol topilmadi.',
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiResponse({
    status: 200,
    description: 'Rol muvaffaqiyatli yangilandi.',
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol topilmadi.',
  })
  @ApiResponse({
    status: 409,
    description: 'Bu rol nomi allaqachon mavjud.',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: "Rol muvaffaqiyatli o'chirildi.",
    type: Role,
  })
  @ApiResponse({
    status: 404,
    description: 'Rol topilmadi.',
  })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
