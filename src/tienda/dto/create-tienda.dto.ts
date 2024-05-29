import { IsString, Length } from 'class-validator';

export class CreateTiendaDto {
  @IsString()
  nombre: string;

  @IsString()
  @Length(3, 3, { message: 'La ciudad debe ser un código de tres caracteres' })
  ciudad: string;

  @IsString()
  direccion: string;
}
