import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from './producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Tienda } from 'src/tienda/tienda.entity';

@Controller('products')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Producto> {
    return this.productoService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.productoService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.productoService.remove(id);
  }

  @Post(':productId/stores/:tiendaId')
  addStoreToProduct(
    @Param('productId') productId: number,
    @Param('tiendaId') tiendaId: number,
  ): Promise<Producto> {
    return this.productoService.addStoreToProduct(productId, {
      id: tiendaId,
    } as Tienda);
  }

  @Get(':productId/stores')
  findStoresFromProduct(
    @Param('productId') productId: number,
  ): Promise<Tienda[]> {
    return this.productoService.findStoresFromProduct(productId);
  }

  @Get(':productId/stores/:tiendaId')
  findStoreFromProduct(
    @Param('productId') productId: number,
    @Param('tiendaId') tiendaId: number,
  ): Promise<Tienda> {
    return this.productoService.findStoreFromProduct(productId, tiendaId);
  }

  @Put(':productId/stores')
  updateStoresFromProduct(
    @Param('productId') productId: number,
    @Body() tiendas: Tienda[],
  ): Promise<Producto> {
    return this.productoService.updateStoresFromProduct(productId, tiendas);
  }

  @Delete(':productId/stores/:tiendaId')
  deleteStoreFromProduct(
    @Param('productId') productId: number,
    @Param('tiendaId') tiendaId: number,
  ): Promise<void> {
    return this.productoService.deleteStoreFromProduct(productId, tiendaId);
  }
}
