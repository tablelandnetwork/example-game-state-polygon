import { ethers, network, upgrades } from "hardhat";
import { writeFileSync } from "fs";
import * as dotenv from "dotenv";

async function main() {
  const GameLevels = await ethers.getContractFactory("GameLevels");
  const gameLevels = await upgrades.deployProxy(GameLevels, [], {
    kind: "uups",
  });
  await gameLevels.deployed();

  console.log("proxy deployed to:", gameLevels.address, "on", network.name);

  const impl = await upgrades.erc1967.getImplementationAddress(gameLevels.address);
  console.log("New implementation address:", impl);

  console.log("running post deploy");
  await gameLevels._initGameStore();

  writeFileSync(`./.${network.name}.env`, `CONTRACT=${gameLevels.address}`, "utf-8");
  dotenv.config({ path: `./.${network.name}.env` });
  console.log(process.env.CONTRACT, "added");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
