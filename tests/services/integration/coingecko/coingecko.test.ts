import {describe} from "@jest/globals";
import {CoinGecko} from "../../../../src/services/integration/coingecko/coingecko";

const coinGecko = new CoinGecko();

describe('Coingecko', () => {
    test('Searching by a coin will return the first coin id', async () => {
        const searchData = await coinGecko.search('bitsong')
        expect(searchData).not.toBeNull();
        expect(searchData).not.toBeUndefined();
        expect(searchData?.coins[0].id).toBe('bitsong');
    });

    test('Searching by a coin token return the first coin id', async () => {
        const searchData = await coinGecko.search('crbrus')
        expect(searchData).not.toBeNull();
        expect(searchData).not.toBeUndefined();
        expect(searchData?.coins[0].id).toBe('cerberus-2');
    });

    test('Looking for an exact coin should return coin price', async () => {
        expect(
            await coinGecko.getPrice('cosmos')
        ).toBeGreaterThan(0.1)
    });

    test('Fetching a token price recurring to search functionality', async () => {
        const price = await coinGecko.getPrice('juno');
        expect(price).toBeGreaterThan(0.1);
    });
});