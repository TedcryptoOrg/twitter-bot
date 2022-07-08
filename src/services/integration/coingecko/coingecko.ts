import axios from "axios";
import {CoinFullInfo, CoinGeckoClient} from "coingecko-api-v3";

export type SearchData = {
    coins: [{
        id: string,
        name: string,
        symbol: string,
        market_cap_rank: number,
        thumb: string,
        large: string
    }],
}

export class CoinGecko {
    private baseUrl: string = 'https://api.coingecko.com/api/v3';
    private client: CoinGeckoClient;

    constructor() {
        this.client = new CoinGeckoClient({
            timeout: 10000,
            autoRetry: true,
        });
    }

    async search(search: string): Promise<SearchData|null> {
        console.debug('Looking up coin:', search);
        try {
            const params = new URLSearchParams([['query', search]]);
            const data = (await axios.get(
                this.baseUrl + '/search',
                {
                    params
                })
            );

            return data.data;
        } catch (err) {
            console.log(err);

            return null;
        }
    }

    async getCoin(coin: string): Promise<CoinFullInfo> {
        return await this.client.coinId({id: coin});
    }

    async getPrice(coin: string): Promise<number|undefined> {
        let coinData = await this.getCoin(coin);
        if (coinData && !coinData.hasOwnProperty('error')) {
            return coinData.market_data?.current_price?.['usd']
        }

        let searchData = await this.search(coin);
        if (!searchData || !searchData.hasOwnProperty('coins')) {
            return undefined;
        }

        return await this.getPrice(searchData.coins[0].id);
    }
}
