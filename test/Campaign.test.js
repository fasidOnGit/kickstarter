const assert = require('assert');
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory');
const compiledCampaign = require('../ethereum/build/Campaign');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();
   factory = await new web3.eth.Contract(compiledFactory.abi)
       .deploy({data: compiledFactory.evm.bytecode.object})
       .send({from: accounts[0], gas: '2000000', gasPrice: '12334545'});
   await factory.methods.createCampaign('100').send({
       from: accounts[0], //manager
       gas: '1000000'
   });

   [campaignAddress] = await factory.methods.getDeployedCampaigns().call({
       from: accounts[0]
   });

   campaign = await new web3.eth.Contract(
       compiledCampaign.abi,
       campaignAddress
   );
   factory.setProvider(provider);
});

describe('Campaigns', () => {
   it('deploys a factory and a campaign', () => {
     assert.ok(factory.options.address);
     assert.ok(campaign.options.address);
   });

   it('marks called as the campaign manager', async () => {
      const manager = await campaign.methods.manager().call();
      assert.strictEqual(manager, accounts[0]);
   });

   it('allows people to contrubute money and marks them as approvers', async () => {
      await campaign.methods.contribute().send({from: accounts[1], value: '200'});
      const isContributor = await campaign.methods.approvers(accounts[1]).call();
      assert(isContributor);
   });

   it('requires a minimum contribution', async () => {
      try {
          await campaign.methods.contribute().send({from: accounts[1], value: '99'});
          assert(false);
      } catch (err) {
          assert(err);
      }
   });

   it('allows a manager to make a payment request', async () => {
      await campaign.methods.createRequest(
          'Buy Batteries', '100', accounts[2]
      ).send({
          from: accounts[0], gas: '1000000'
      });

      const request = await campaign.methods.requests(0).call();
      assert.strictEqual('Buy Batteries', request.description);
      assert.strictEqual(request.recipient, accounts[2]);
   });

   it('processes requests', async () => {

       await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei('10', 'ether')
      });

      await campaign.methods.createRequest(
          'Buy Accessories', web3.utils.toWei('5', 'ether'), accounts[2]
      ).send({
          from: accounts[0],
          gas: '1000000'
      });

      await campaign.methods.approveRequest(0).send({
          from: accounts[0],
          gas: '1000000'
      });

      await campaign.methods.finalizeRequest(0).send({
          from: accounts[0],
          gas: '1000000'
      });

      let balance = await web3.eth.getBalance(accounts[2]);
      balance = web3.utils.fromWei(balance, 'ether');
      balance = parseFloat(balance);

      assert(balance > 104);
      assert.strictEqual(balance, 105);
   });
});