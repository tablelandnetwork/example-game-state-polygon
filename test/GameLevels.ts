import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("GameLevels", function () {
  let accounts: SignerWithAddress[];
  let registry: any;
  let gameLevels: any;

  beforeEach(async function () {
    accounts = await ethers.getSigners();

    const RegistryFactory = await ethers.getContractFactory("TablelandTables");
    registry = await RegistryFactory.deploy();
    await registry.deployed();
    await registry.connect(accounts[0]).initialize("http://localhost:8080/");

    const GameLevels = await ethers.getContractFactory("GameLevels");
    gameLevels = await upgrades.deployProxy(GameLevels, [], {
      kind: "uups",
    });

    await gameLevels.deployed();

    await gameLevels.connect(accounts[0])._initGameStore();
  });

  it("Should allow minting", async function () {
    const tx = await gameLevels
      .connect(accounts[0])
      .safeMint(accounts[0].address);

    const receipt = await tx.wait();
    const [, transferEvent] = receipt.events ?? [];
    const tokenId1 = transferEvent.args!.tokenId;

    const tx2 = await gameLevels
      .connect(accounts[1])
      .safeMint(accounts[1].address, "testword");

    const receipt2 = await tx2.wait();
    const [, transferEvent2] = receipt2.events ?? [];
    const tokenId2 = transferEvent2.args!.tokenId;

    await expect(tokenId1).to.equal(0);
    await expect(tokenId2).to.equal(1);
  });
});