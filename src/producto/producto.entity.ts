import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tienda } from '../tienda/tienda.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column('decimal')
  precio: number;

  @Column()
  tipo: string;

  @ManyToMany(() => Tienda, (tienda) => tienda.productos)
  @JoinTable()
  tiendas: Tienda[];
}
