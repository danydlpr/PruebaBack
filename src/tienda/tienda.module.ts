import { Module } from '@nestjs/common';
import { TiendaController } from './tienda.controller';
import { TiendaService } from './tienda.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tienda } from './tienda.entity';
import { Producto } from 'src/producto/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tienda, Producto])],
  controllers: [TiendaController],
  providers: [TiendaService],
})
export class TiendaModule {}
