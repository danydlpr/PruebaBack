import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity';
import { Tienda } from '../tienda/tienda.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { TiendaService } from 'src/tienda/tienda.service';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private tiendaService: TiendaService,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    this.validateTipo(createProductoDto.tipo);
    const producto = this.productoRepository.create(createProductoDto);
    return this.productoRepository.save(producto);
  }

  findAll(): Promise<Producto[]> {
    return this.productoRepository.find();
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto with ID ${id} not found`);
    }
    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    this.validateTipo(updateProductoDto.tipo);
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
  }

  private validateTipo(tipo: string): void {
    const validTipos = ['Perecedero', 'No perecedero'];
    if (!validTipos.includes(tipo)) {
      throw new BadRequestException(
        'Tipo must be either Perecedero or No perecedero',
      );
    }
  }

  async addStoreToProduct(
    productId: number,
    tienda: Tienda,
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const tiendaExists = await this.tiendaService.findOne(tienda.id);
    if (!tiendaExists) {
      throw new NotFoundException(`Store with ID ${tienda.id} not found`);
    }
    producto.tiendas.push(tienda);
    return this.productoRepository.save(producto);
  }

  async findStoresFromProduct(productId: number): Promise<Tienda[]> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    return producto.tiendas;
  }

  async findStoreFromProduct(
    productId: number,
    tiendaId: number,
  ): Promise<Tienda> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const tienda = producto.tiendas.find(
      (tienda) => tienda.id.toString() === tiendaId.toString(),
    );
    if (!tienda) {
      throw new NotFoundException(
        `Store with ID ${tiendaId} not found for product with ID ${productId}`,
      );
    }
    return tienda;
  }

  async updateStoresFromProduct(
    productId: number,
    tiendas: Tienda[],
  ): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const tiendasExist = await this.tiendaService.findAll();
    tiendas.forEach((tienda) => {
      const tiendaExists = tiendasExist.find(
        (t) => t.id.toString() === tienda.id.toString(),
      );
      if (!tiendaExists) {
        throw new NotFoundException(`Store with ID ${tienda.id} not found`);
      }
    });
    producto.tiendas = tiendas;
    return this.productoRepository.save(producto);
  }

  async deleteStoreFromProduct(
    productId: number,
    tiendaId: number,
  ): Promise<void> {
    const producto = await this.productoRepository.findOne({
      where: { id: productId },
      relations: ['tiendas'],
    });
    if (!producto) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const productoExist = producto.tiendas.find(
      (tienda) => tienda.id.toString() === tiendaId.toString(),
    );
    if (!productoExist) {
      throw new NotFoundException(
        `Store with ID ${tiendaId} not found for product with ID ${productId}`,
      );
    }
    producto.tiendas = producto.tiendas.filter(
      (tienda) => tienda.id.toString() !== tiendaId.toString(),
    );
    await this.productoRepository.save(producto);
  }
}
