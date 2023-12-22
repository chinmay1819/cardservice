// src/card/card.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum CardStatus {
  GENERATED = 'generated',
  PICKEDUP = 'pickedup',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  FAILED = 'failed',
}

@Schema()
export class Card extends Document {
  @Prop({ required: true })
  cardId: string;

  @Prop({ required: true })
  mobileNumber: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  comment: string;

  @Prop({
    type: String,
    enum: Object.values(CardStatus),
    default: CardStatus.GENERATED,
  })
  status: CardStatus;
}

export const CardSchema = SchemaFactory.createForClass(Card);
export const CardModel = new MongooseSchema(
  {
    cardId: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    timestamp: { type: Date, required: true },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CardStatus),
      default: CardStatus.GENERATED,
    },
  },
  { collection: 'Card' },
);
