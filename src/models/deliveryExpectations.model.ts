// delivery_expectations.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DeliveryExpectation extends Document {
  @Prop({ required: true })
  id_: string;

  @Prop({ required: true })
  cardId: string;

  @Prop({ required: true })
  userMobile: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  comment: string;
}

export const DeliveryExpectationSchema = SchemaFactory.createForClass(DeliveryExpectation);
