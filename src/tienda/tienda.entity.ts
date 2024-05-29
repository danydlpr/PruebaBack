import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Producto } from '../producto/producto.entity';

@Entity()
export class Tienda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  ciudad: string;

  @Column()
  direccion: string;

  @ManyToMany(() => Producto, (producto) => producto.tiendas)
  productos: Producto[];
}
