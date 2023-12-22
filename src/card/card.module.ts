import { Module } from '@nestjs/common';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { Card, CardSchema } from './card.model';
import { MongooseModule } from '@nestjs/mongoose';
import { Delivery, DeliverySchema } from 'src/models/delivery.model';
import { DeliveryExpectation, DeliveryExpectationSchema } from 'src/models/deliveryExpectations.model';
import { Pickup, PickupSchema } from 'src/models/pickup.model';
import { Returned, ReturnedSchema } from 'src/models/returned.model';

@Module({
  imports:[    MongooseModule.forFeature([
    { name: Pickup.name, schema: PickupSchema },
    { name: DeliveryExpectation.name, schema: DeliveryExpectationSchema },
    { name: Delivery.name, schema: DeliverySchema },
    { name: Returned.name, schema: ReturnedSchema },
  ])],
  controllers: [CardController],
  providers: [CardService]
})
export class CardModule {}
