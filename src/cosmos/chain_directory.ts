import axios from "axios";

class ChainDirectory {
    constructor() {
    }

    async getAPR(chain: string): Promise<string|null> {
        console.log(chain);
        let data = null;
        try {
            data = (await axios.get('https://chains.cosmos.directory/'+chain)).data;
        } catch (err) {
            console.log(err);

            return null;
        }

        if (
            !data.hasOwnProperty('chain')
            || !data.chain.hasOwnProperty('params')
            || !data.chain.params.hasOwnProperty('calculated_apr')
        ) {
            return null;
        }

        return (data.chain.params.calculated_apr * 100).toFixed(2);
    }
}

exports.ChainDirectory = new ChainDirectory();
