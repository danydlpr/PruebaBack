import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tienda } from './tienda.entity';
import { CreateTiendaDto } from './dto/create-tienda.dto';
import { UpdateTiendaDto } from './dto/update-tienda.dto';

@Injectable()
export class TiendaService {
  constructor(
    @InjectRepository(Tienda)
    private tiendaRepository: Repository<Tienda>,
  ) {}

  async create(createTiendaDto: CreateTiendaDto): Promise<Tienda> {
    this.validateCiudad(createTiendaDto.ciudad);
    const tienda = this.tiendaRepository.create(createTiendaDto);
    return this.tiendaRepository.save(tienda);
  }

  findAll(): Promise<Tienda[]> {
    return this.tiendaRepository.find();
  }

  async findOne(id: number): Promise<Tienda> {
    const tienda = await this.tiendaRepository.findOne({ where: { id } });
    if (!tienda) {
      throw new NotFoundException(`Tienda with ID ${id} not found`);
    }
    return tienda;
  }

  async update(id: number, updateTiendaDto: UpdateTiendaDto): Promise<Tienda> {
    const tienda = await this.findOne(id);
    this.validateCiudad(updateTiendaDto.ciudad);
    Object.assign(tienda, updateTiendaDto);
    return this.tiendaRepository.save(tienda);
  }

  async remove(id: number): Promise<void> {
    const tienda = await this.findOne(id);
    await this.tiendaRepository.remove(tienda);
  }

  private validateCiudad(ciudad: string): void {
    const ciudadRegex = /^[A-Z]{3}$/;
    if (!ciudadRegex.test(ciudad)) {
      throw new BadRequestException(
        'Ciudad must be a three-letter code (e.g., SMR, BOG, MED)',
      );
    }
  }
}
