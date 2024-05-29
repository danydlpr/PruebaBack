import { IsString, IsNumber, IsIn } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsString()
  @IsIn(['Perecedero', 'No perecedero'], {
    message: 'El tipo de producto debe ser Perecedero o No perecedero',
  })
  tipo: string;
}
