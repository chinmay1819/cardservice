import { Controller, Get,HttpStatus,Query,Res } from '@nestjs/common';
import { CardService } from './card.service';
import { Card } from './card.model';
import { join } from 'path';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
  @Get('/health')
  healthCheck(@Res() res: Response): void {
    (res as any).status(HttpStatus.OK).send();
  }


  @Get('/get_card_status')
  async getCardStatus(@Res() res: Response, @Query('cardId') cardId: string): Promise<void> {
    try {
      if (!cardId) {
        (res as any).status(HttpStatus.BAD_REQUEST).send('Card ID is required as a query parameter.');
        return;
      }
      await console.log("card Id = ",cardId);
      // Call the functions to insert data from CSV to the database
      await this.cardService.processPickupData();
      await this.cardService.processDeliveryExpectationsData();
      await this.cardService.processDeliveryData();
      await this.cardService.processReturnedData();

      // Get the status of the card
      const result = await this.cardService.getCardStatus(cardId);

      (res as any).status(HttpStatus.OK).json(result);
    } catch (error) {
      (res as any).status(HttpStatus.INTERNAL_SERVER_ERROR).send(`Error: ${error.message}`);
    }
  }

}
