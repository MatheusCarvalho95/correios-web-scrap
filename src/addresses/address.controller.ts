import { Controller, Get, Query } from '@nestjs/common';
import { IAdrressSearchResponse } from './address.interfaces';

import { AddressService } from './address.service';

@Controller()
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('/address')
  async getAddressByPostalCode(
    @Query('postalCode') postalCode: string,
  ): Promise<IAdrressSearchResponse> {
    return await this.addressService.getAddressByPostalCode(postalCode);
  }
}
