// returned.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Returned extends Document {
  @Prop({ required: true })
  id_: string;

  @Prop({ required: true })
  cardId: string;

  @Prop({ required: true })
  userMobile: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const ReturnedSchema = SchemaFactory.createForClass(Returned);
