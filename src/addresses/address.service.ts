import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import type { Browser } from 'puppeteer';
import { IAdrressSearchResponse } from './address.interfaces';

@Injectable()
export class AddressService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}
  async getAddressByPostalCode(
    postalCode: string,
  ): Promise<IAdrressSearchResponse> {
    const formatedPostalCode = postalCode.replace(/-/g, '');
    const page = await this.browser.newPage();
    await page.goto(
      'https://buscacepinter.correios.com.br/app/endereco/index.php?t',
    );
    await page.waitForSelector('input[name=endereco]');
    await page.$eval(
      'input[name=endereco]',
      (el: HTMLInputElement, value: any) => (el.value = value),
      formatedPostalCode,
    );
    await page.click('button[name=btn_pesquisar]');

    try {
      await page.waitForSelector('#navegacao-resultado', {
        visible: true,
        timeout: 5000,
      });
      const result = await page.evaluate(() => {
        const rows = document.querySelectorAll('#resultado-DNEC tr');

        return Array.from(rows, (row) => {
          const columns = row.querySelectorAll('td');
          return Array.from(columns, (column) => column.innerText);
        });
      });

      await this.browser.close();
      return {
        street: result[1][0],
        district: result[1][1],
        cityAndState: result[1][2],
      };
    } catch (err) {
      throw new NotFoundException(
        `No Brazil address found with the postal code: ${postalCode}`,
      );
    }
  }
}
