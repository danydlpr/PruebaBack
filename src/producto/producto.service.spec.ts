import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';

describe('ProductoService', () => {
  let service: ProductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a producto', async () => {
      const createProductoDto = {
        nombre: 'Producto test',
        tipo: 'Perecedero',
        precio: 10000,
      };

      const producto = await service.create(createProductoDto);

      expect(producto).toEqual({
        id: expect.any(Number),
        ...createProductoDto,
      });
    });

    it('should throw a BadRequestException if tipo is invalid', async () => {
      const createProductoDto = {
        nombre: 'Producto test',
        tipo: 'Invalido',
        precio: 10000,
      };

      await expect(service.create(createProductoDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of productos', async () => {
      const productos = await service.findAll();

      expect(productos).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            nombre: expect.any(String),
            tipo: expect.any(String),
            precio: expect.any(Number),
          }),
        ]),
      );
    });
  });

  describe('findOne', () => {
    it('should return a producto by ID', async () => {
      const productos = await service.findAll();
      const producto = await service.findOne(productos[0].id);

      expect(producto).toEqual(productos[0]);
    });

    it('should throw a NotFoundException if the producto does not exist', async () => {
      await expect(service.findOne(9999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a producto by ID', async () => {
      const productos = await service.findAll();
      const producto = await service.update(productos[0].id, {
        nombre: 'Producto test updated',
        tipo: 'No perecedero',
        precio: 20000,
      });

      expect(producto).toEqual({
        id: productos[0].id,
        nombre: 'Producto test updated',
        tipo: 'No perecedero',
        precio: 20000,
      });
    });

    it('should throw a BadRequestException if tipo is invalid', async () => {
      const productos = await service.findAll();

      await expect(
        service.update(productos[0].id, {
          nombre: 'Producto test updated',
          tipo: 'Invalido',
          precio: 20000,
        }),
      ).rejects.toThrow();
    });

    it('should throw a NotFoundException if the producto does not exist', async () => {
      await expect(
        service.update(9999, {
          nombre: 'Producto test updated',
          tipo: 'No perecedero',
          precio: 20000,
        }),
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a producto by ID', async () => {
      const productos = await service.findAll();
      await service.remove(productos[0].id);

      await expect(service.findOne(productos[0].id)).rejects.toThrow();
    });

    it('should throw a NotFoundException if the producto does not exist', async () => {
      await expect(service.remove(9999)).rejects.toThrow();
    });
  });

  describe('addStoreToProduct', () => {
    it('should add a store to a product', async () => {
      const productos = await service.findAll();
      const producto = await service.addStoreToProduct(productos[0].id, {
        id: 1,
        nombre: 'Tienda test',
        ciudad: 'MED',
        direccion: 'Calle 1 # 1-1',
        productos: [],
      });

      expect(producto.tiendas).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            nombre: 'Tienda test',
            ciudad: 'MED',
            direccion: 'Calle 1 # 1-1',
          }),
        ]),
      );
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      await expect(
        service.addStoreToProduct(9999, {
          id: 1,
          nombre: 'Tienda test',
          ciudad: 'MED',
          direccion: 'Calle 1 # 1-1',
          productos: [],
        }),
      ).rejects.toThrow();
    });
  });

  describe('findStoresFromProduct', () => {
    it('should return the stores from a product', async () => {
      const productos = await service.findAll();
      const tiendas = await service.findStoresFromProduct(productos[0].id);

      expect(tiendas).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            nombre: expect.any(String),
            ciudad: expect.any(String),
            direccion: expect.any(String),
          }),
        ]),
      );
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      await expect(service.findStoresFromProduct(9999)).rejects.toThrow();
    });
  });

  describe('findStoreFromProduct', () => {
    it('should return a store from a product', async () => {
      const productos = await service.findAll();
      const producto = await service.findStoreFromProduct(
        productos[0].id,
        productos[0].tiendas[0].id,
      );

      expect(producto).toEqual(productos[0].tiendas[0]);
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      await expect(service.findStoreFromProduct(9999, 1)).rejects.toThrow();
    });

    it('should throw a NotFoundException if the store does not exist', async () => {
      const productos = await service.findAll();

      await expect(
        service.findStoreFromProduct(productos[0].id, 9999),
      ).rejects.toThrow();
    });
  });

  describe('updateStoresFromProduct', () => {
    it('should update the stores from a product', async () => {
      const productos = await service.findAll();
      const producto = await service.updateStoresFromProduct(productos[0].id, [
        {
          id: 1,
          nombre: 'Tienda test',
          ciudad: 'MED',
          direccion: 'Calle 1 # 1-1',
          productos: [],
        },
      ]);

      expect(producto.tiendas).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            nombre: 'Tienda test',
            ciudad: 'MED',
            direccion: 'Calle 1 # 1-1',
          }),
        ]),
      );
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      await expect(
        service.updateStoresFromProduct(9999, [
          {
            id: 1,
            nombre: 'Tienda test',
            ciudad: 'MED',
            direccion: 'Calle 1 # 1-1',
            productos: [],
          },
        ]),
      ).rejects.toThrow();
    });
  });

  describe('deleteStoreFromProduct', () => {
    it('should delete a store from a product', async () => {
      const productos = await service.findAll();
      await service.deleteStoreFromProduct(
        productos[0].id,
        productos[0].tiendas[0].id,
      );

      const producto = await service.findOne(productos[0].id);

      expect(producto.tiendas).not.toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: productos[0].tiendas[0].id,
          }),
        ]),
      );
    });

    it('should throw a NotFoundException if the product does not exist', async () => {
      await expect(service.deleteStoreFromProduct(9999, 1)).rejects.toThrow();
    });

    it('should throw a NotFoundException if the store does not exist', async () => {
      const productos = await service.findAll();

      await expect(
        service.deleteStoreFromProduct(productos[0].id, 9999),
      ).rejects.toThrow();
    });
  });
});
