// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  console.log('Preparing deployment...')
  // Fetch contract to deploy
  const Token = await ethers.getContractFactory("Token");
  const Exchange = await ethers.getContractFactory("Exchange");
  // Fetch accounts
  const accounts = await ethers.getSigners();
  console.log(`Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`)
  
  // Deploy contracts
  const dapp = await Token.deploy("Dapp Univer", "DAPP", "1000000");
  await dapp.deployed();
  console.log('Dapp token deployed to: ', dapp.address);

  const mETH = await Token.deploy('mETH', 'mETH', "1000000");
  await mETH.deployed();
  console.log('mETH deployed to: ', mETH.address);

  const mDAI = await Token.deploy('mDAI', 'mDAI', "1000000");
  await mDAI.deployed();
  console.log('mDAI deployed to: ', mDAI.address);

  const exchange = await Exchange.deploy(accounts[1].address, 10); 
  await exchange.deployed();
  console.log('Exchange deployed to: ', exchange.address);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
