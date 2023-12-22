import { Injectable } from '@nestjs/common';
import * as csvtojson from 'csvtojson';
import { join } from 'path';
import { Card, CardModel } from './card.model';
import { Pickup, PickupSchema } from '../models/pickup.model';
import {
  DeliveryExpectation,
  DeliveryExpectationSchema,
} from '../models/deliveryExpectations.model';
import { Delivery, DeliverySchema } from '../models/delivery.model';
import { Returned, ReturnedSchema } from '../models/returned.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class CardService {
  constructor(
    @InjectModel(Pickup.name) private readonly pickupModel: Model<Pickup>,
    @InjectModel(DeliveryExpectation.name) private readonly deliveryExpectationModel: Model<DeliveryExpectation>,
    @InjectModel(Delivery.name) private readonly deliveryModel: Model<Delivery>,
    @InjectModel(Returned.name) private readonly returnedModel: Model<Returned>,
  ) {}

  private async readCsvFile(filePath: string): Promise<any[]> {
    const jsonData = await csvtojson().fromFile(filePath);
    return jsonData;
  }

  private async saveDataToCollection(
    data: any[],
    collectionModel: Model<any>,
  ): Promise<void> {
    try {
      await collectionModel.create(data);
    } catch (error) {
      throw new Error(`Error saving data to the database: ${error.message}`);
    }
  }

  async processPickupData(): Promise<void> {
    let filePath = '/home/chinmay/zywa/card-tracking/data/pickup.csv';
    const pickupData = await this.readCsvFile(filePath);
    // Map CSV data to match the Mongoose model
    const mappedPickupData = pickupData.map((row) => {
      const timestamp = new Date(
        row.Timestamp.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3'),
      );
      return {
        id_: row.ID,
        cardId: row['Card ID'],
        userMobile: row['User Mobile'],
        timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
      };
    });

    await this.saveDataToCollection(mappedPickupData, this.pickupModel);
  }

  async processDeliveryExpectationsData(): Promise<void> {
    // const filePath = join(__dirname, '../../../data/delivery_expectations.csv');
    let filePath =
      '/home/chinmay/zywa/card-tracking/data/delivery_expectations.csv';
    const deliveryExpectationsData = await this.readCsvFile(filePath);

    // Map CSV data to match the Mongoose model
    const mappedDeliveryExpectationsData = deliveryExpectationsData.map(
      (row) => {
        const userMobile = row['User Contact']
          ? row['User Contact'].replace(/"/g, '')
          : null;
        const timestamp = new Date(
          row.Timestamp.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3'),
        );
        return {
          id_: row.ID,
          cardId: row['Card ID'],
          userMobile,
          timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
          comment: row.Comment,
        };
      },
    );

    await this.saveDataToCollection(
      mappedDeliveryExpectationsData,
      this.deliveryExpectationModel,
    );
  }

  async processDeliveryData(): Promise<void> {
    // const filePath = join(__dirname, '../../../data/delivered.csv');
    let filePath = '/home/chinmay/zywa/card-tracking/data/delivered.csv';
    const deliveryData = await this.readCsvFile(filePath);

    // Map CSV data to match the Mongoose model
    const mappedDeliveryData = deliveryData.map((row) => {
      const userMobile = row['User contact']
        ? row['User contact'].replace(/"/g, '')
        : null;
      const timestamp = new Date(row.Timestamp);
      return {
        id_: row.ID,
        cardId: row['Card ID'],
        userMobile,
        timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
        comment: row.Comment,
      };
    });

    await this.saveDataToCollection(mappedDeliveryData, this.deliveryModel);
  }

  async processReturnedData(): Promise<void> {
    // const filePath = join(__dirname, '../../../data/returned.csv');
    let filePath = '/home/chinmay/zywa/card-tracking/data/returned.csv';
    const returnedData = await this.readCsvFile(filePath);

    // Map CSV data to match the Mongoose model
    const mappedReturnedData = returnedData.map((row) => {
      const userMobile = row['User contact'];
      const timestamp = new Date(row.Timestamp.replace(/(\d{2})-(\d{2})-(\d{4})/, '$2-$1-$3'));
      return {
        id_: row.ID,
        cardId: row['Card ID'],
        userMobile,
        timestamp: isNaN(timestamp.getTime()) ? new Date() : timestamp,
      };
    });

    await this.saveDataToCollection(mappedReturnedData, this.returnedModel);
  }

  // returning the status of the card 
  async getCardStatus(cardId: string): Promise<{ status: string; timestamp?: Date; comment?: string }> {
    const returnedDocument = await this.returnedModel.findOne({ cardId });
    if (returnedDocument) {
      return { status: 'returned', timestamp: returnedDocument.timestamp, comment: '' };
    }
  
    const deliveryDocument = await this.deliveryModel.findOne({ cardId });
    if (deliveryDocument) {
      return { status: 'delivered', timestamp: deliveryDocument.timestamp, comment: deliveryDocument.comment };
    }
  
    const deliveryExpectationDocument = await this.deliveryExpectationModel.findOne({ cardId });
    if (deliveryExpectationDocument) {
      return { status: 'delivery-expected' };
    }
  
    const pickupDocument = await this.pickupModel.findOne({ cardId });
    if (pickupDocument) {
      return { status: 'picked up', timestamp: pickupDocument.timestamp, comment: '' };
    }
  
    return { status: 'not found' };
  }
  
}
