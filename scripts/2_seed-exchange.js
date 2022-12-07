const { ethers } = require("hardhat");
const config = require('../src/config.json');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork();
  console.log('Using chainId: ', chainId)

  // Fetch deployed tokens
  const DApp = await ethers.getContractAt('Token', config[chainId].DApp.address); // '0x0165878A594ca255338adfa4d48449f69242Eb8F'
  console.log('DApp Token fetched: ', DApp.address);

  const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address); //'0xa513E6E4b8f2a923D98304ec87F64353C4D5C853' 
  console.log('mETH Token fetched: ', mETH.address);

  const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address); //'0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
  console.log('mDAI Token fetched: ', mDAI.address);
  // Fetch the deployed exchange
  const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address); //'0x8A791620dd6260079BF849Dc5567aDC3F2FdC318' 
  console.log('Exchange Token fetched: ', exchange.address);
  // Give tokens to accounts[1]
  const sender = accounts[0]; // deployer
  const receiver = accounts[1];
  let amount = tokens(10000);

  // user1 transfers 10,000 mETH...
  let transaction, result;
  transaction = await mETH.connect(sender).transfer(receiver.address, amount);
  console.log(`Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`);

  // Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);

  // User1 approves 10,000 Dapp...
  transaction = await DApp.connect(user1).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);
  // User1 deposits 10,000 DApp...
  transaction = await exchange.connect(user1).depositToken(DApp.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user1.address}\n`);

  // User2 approves mETH...
  transaction = await mETH.connect(user2).approve(exchange.address, amount);
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user2.address}\n`);

  // User2 deposit mETH
  transaction = await exchange.connect(user2).depositToken(mETH.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} tokens from ${user2.address}\n`);

  //---------------------------------------------------------/
  // Seed a Cancelled Order
  //---------------------------------------------------------/
  // User1 makes order to get tokens
  let orderId;
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DApp.address, tokens(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);
  console.log('Result of make order event: ', result.events.length)

  // User1 cancels order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`)
  // Wait 1 second
  await wait(1);
  
  //---------------------------------------------------------/
  // Seed a Filled Order
  //---------------------------------------------------------/
  // User1 make order 
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), DApp.address, tokens(10));
  result = await transaction.wait();
  console.log(`made order from ${user1.address}`)
  // User2 fills order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait();

  // User1 makes another order
  transaction = await exchange.makeOrder(mETH.address, tokens(50), DApp.address, tokens(15));
  result = await transaction.wait();
  console.log(`Make order from ${user1.address}`);

  // User2 fills another order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log('Filled order from ', user1.address);

  // Wait 1 second
  await wait();

  // User1 makes final order
  transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), DApp.address, tokens(20));
  result = await transaction.wait();
  console.log('Made order from ', user1.address);

  // User2 fills final order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log('Filled order from ', user1.address);

  // Wait 1 second
  await wait();

//-------------------------------------------------------------/
// Seed Open Orders
//-------------------------------------------------------------/
// User1 makes 10 orders 
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), DApp.address, tokens(10));
    result = await transaction.wait();
    console.log('Made order from ', user1.address);
    // Wait 1 second
    await wait();
  };
// User2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange.connect(user2).makeOrder(DApp.address, tokens(10), mETH.address, tokens(10 *i));
    result = await transaction.wait();
    console.log('Made order from ', user2.address);
    // Wait 1 second
    await wait();
  };


  
  



}
main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
