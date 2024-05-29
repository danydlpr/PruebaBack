import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tienda } from './tienda.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<Tienda>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        {
          provide: getRepositoryToken(Tienda),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<Tienda>>(getRepositoryToken(Tienda));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tienda', async () => {
      const createTiendaDto = {
        nombre: 'Tienda test',
        ciudad: 'BOG',
        direccion: 'Calle 1 # 1-1',
      };
      const tienda = new Tienda();
      tienda.nombre = createTiendaDto.nombre;
      tienda.ciudad = createTiendaDto.ciudad;
      tienda.direccion = createTiendaDto.direccion;

      jest.spyOn(repository, 'create').mockReturnValue(tienda);
      jest.spyOn(repository, 'save').mockResolvedValue(tienda);

      expect(await service.create(createTiendaDto)).toEqual(tienda);
    });

    it('should throw a BadRequestException if ciudad is invalid', async () => {
      const createTiendaDto = {
        nombre: 'Tienda test',
        ciudad: 'Bogota',
        direccion: 'Calle 1 # 1-1',
      };

      await expect(service.create(createTiendaDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of tiendas', async () => {
      const tiendas = [new Tienda(), new Tienda()];
      jest.spyOn(repository, 'find').mockResolvedValue(tiendas);

      expect(await service.findAll()).toEqual(tiendas);
    });
  });

  describe('findOne', () => {
    it('should return a tienda', async () => {
      const tienda = new Tienda();
      jest.spyOn(repository, 'findOne').mockResolvedValue(tienda);

      expect(await service.findOne(1)).toEqual(tienda);
    });

    it('should throw a NotFoundException if tienda is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tienda', async () => {
      const updateTiendaDto = {
        nombre: 'Tienda 2',
        ciudad: 'MED',
        direccion: 'Calle 2 # 2-2',
      };
      const tienda = new Tienda();
      jest.spyOn(service, 'findOne').mockResolvedValue(tienda);
      jest.spyOn(repository, 'save').mockResolvedValue(tienda);

      expect(await service.update(1, updateTiendaDto)).toEqual(tienda);
    });

    it('should throw a BadRequestException if ciudad is invalid', async () => {
      const updateTiendaDto = {
        nombre: 'Tienda 2',
        ciudad: 'Medellin',
        direccion: 'Calle 2 # 2-2',
      };

      await expect(service.update(1, updateTiendaDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a NotFoundException if tienda is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(service.update(100, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a tienda', async () => {
      const tienda = new Tienda();
      jest.spyOn(service, 'findOne').mockResolvedValue(tienda);
      jest.spyOn(repository, 'remove').mockResolvedValue(tienda);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(tienda);
    });

    it('should throw a NotFoundException if tienda is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateCiudad', () => {
    it('should not throw an error if ciudad is valid', () => {
      expect(() => service['validateCiudad']('BOG')).not.toThrow();
    });

    it('should throw a BadRequestException if ciudad is invalid', () => {
      expect(() => service['validateCiudad']('Bogota')).toThrow(
        BadRequestException,
      );
    });
  });
});
