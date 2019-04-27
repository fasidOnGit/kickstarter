const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory');


const provider = new HDWalletProvider(
    'word win world fall valid field awkward tool bridge knee blush afford',
    // 'https://mainnet.infura.io/L40Is7cV2Vr6TCf0ZCoI'
    // 'https://rinkeby.infura.io/L40Is7cV2Vr6TCf0ZCoI'
    'https://rinkeby.infura.io/v3/53f8390b02fe40b4961e11cfe5d79f20'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);
    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: '0x' + compiledFactory.evm.bytecode.object})
        .send({from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};
deploy();