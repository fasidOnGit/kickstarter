import Web3 from 'web3';
import * as HDWalletProvider from 'truffle-hdwallet-provider';


const provider = new HDWalletProvider(
    '12 words mnemonics',
    'https://rinkeby.theInfuraApi.io/justAnExample'
);

//Metamask no longer imports web3. :(
const web3 = new Web3(provider);

export default web3;