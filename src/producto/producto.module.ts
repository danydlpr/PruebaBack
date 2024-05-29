import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { Tienda } from 'src/tienda/tienda.entity';
import { TiendaService } from 'src/tienda/tienda.service';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Tienda])],
  controllers: [ProductoController],
  providers: [ProductoService, TiendaService],
})
export class ProductoModule {}
