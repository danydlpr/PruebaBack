import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto/producto.entity';
import { Tienda } from './tienda/tienda.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'postgres',
      entities: [Producto, Tienda],
      synchronize: true,
    }),
    ProductoModule,
    TiendaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
