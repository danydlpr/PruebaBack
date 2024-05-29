import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { Tienda } from './tienda.entity';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';

@Controller('stores')
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Post()
  create(@Body() createTiendaDto: CreateTiendaDto): Promise<Tienda> {
    return this.tiendaService.create(createTiendaDto);
  }

  @Get()
  findAll(): Promise<Tienda[]> {
    return this.tiendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Tienda> {
    return this.tiendaService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTiendaDto: UpdateTiendaDto,
  ): Promise<Tienda> {
    return this.tiendaService.update(id, updateTiendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.tiendaService.remove(id);
  }
}
