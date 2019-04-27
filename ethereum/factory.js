import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xeb1f29aA8dA13cd122b28a2e9fA903d4a424E2bD'
);

export default instance;