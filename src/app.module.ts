import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './card/card.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Pickup, PickupSchema } from './models/pickup.model';
import { DeliveryExpectation, DeliveryExpectationSchema } from './models/deliveryExpectations.model';
import { Delivery, DeliverySchema } from './models/delivery.model';
import { Returned, ReturnedSchema } from './models/returned.model';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `envs/.env`,
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    MongooseModule.forFeature([
      { name: Pickup.name, schema: PickupSchema },
      { name: DeliveryExpectation.name, schema: DeliveryExpectationSchema },
      { name: Delivery.name, schema: DeliverySchema },
      { name: Returned.name, schema: ReturnedSchema },
    ]),

    CardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
