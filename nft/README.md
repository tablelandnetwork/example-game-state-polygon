# A Shared File System on Tableland & IPFS

A simple file manager UI running on top of a filesystem built with IPFS and Tableland.

## Overview

Many collaborations (DAOs, decentralized teams, scientific orgs) need to be able to collaborate on shared file systems. [IPFS](https://ipfs.io) and [Filecoin](filecoin.io) provide a robust storage and retrieval network for those files. However, two challenges are commonly faced when using IFPS or Filecoin alone. 

1. Creating flexible access control rules for shared directories is challenging. For example, allowing for read-only files, allowing some members to update only specific directories or metadata, etc. 
2. It's difficult to modify some or all of the directories and then distribute those changes to all interested parties. Doing so requires some combination of a global naming registry, the ability to mix and match DAGs based on new and old path trees, and more. 

In this demo, we show one-half of a solution for creating shared filesystems for orgs. Using the solution below, a project can create a filesystem owned by a DAO or smart contract such that it cannot be tampered with but it can be updated by collaborating members according to preset rules. 

## Preview

View the app running on IPFS: https://bafybeiagrnxaxv3hwrb57gai5b7bmdbnkvwpwbhon3oziqkgi5pycb4v2q.ipfs.cf-ipfs.com/

## Background

The longer format write-up for how to design a data dao using Tableland and Filecoin can be found here: [How to build a DAO owned filesystem with Tableland and Filecoin](https://textile.notion.site/How-to-build-a-DAO-owned-filesystem-with-Tableland-and-Filecoin-2e7c6e5dca704761b68e19c831a5ce55).

This repo contains the examples for how to structure the tables of metadata and build interfaces to read and modify those tables. 

## Setup

### Creating a fileystem database

As outlined in the document above, we can create a simple filesystem schema and store it on Tableland. You can run the create command using the [Tableland CLI](https://docs.tableland.xyz/cli) or the [Console](https://console.tableland.xyz/), in a production system, you would run this directly from a smart contract and can use [EVM-Tableland](https://github.com/tablelandnetwork/evm-tableland). 

```sql
CREATE TABLE dao_filesystem_80001 (
  path text primary key not null,
  name text,
  cid text,
  file_type text,
  file_size int,
  last_write int,
  last_writer text,
  bool_flags int not null,
  notes text
)
```

Here is a filesystem table I already pushed an populated:

[dao_filesystem_80001_4276](https://testnets.opensea.io/assets/mumbai/0x4b48841d4b32c4650e4abc117a03fe8b51f38f68/4276)

### Populating your filesystem table

You can use the [w3up CLI](https://github.com/web3-storage/w3up-cli) or any similar tool for pushing data to a storage network. Your first time populating should be the easiest, since you'll likely push one directory and have a single CID and path for every file within it. The benefit of the filesystem database is now that any single file can change within it easily (update a single row in your database).

You can use bash, python, or any tool of choice to now convert each file in your target directory into an insert statement conforming to the table above. 

**Example**

```sql
INSERT INTO 
  dao_filesystem_80001_4276 
  (path, parent, cid, file_type, file_size, last_write, last_writer, bool_flags) 
  VALUES
    ('/','','','dir',0,1670629367,'0x82Da49fdB997E058c4a8e5Ee63b4A336689Ca394',1),
    ('/LICENSE-APACHE','/','bafybeibbwe7jcnivdanqeeuilshsquadsgypurowhh7ntwl7ty7qlvlxpi/LICENSE-APACHE','',9723,1670629367,'0x82Da49fdB997E058c4a8e5Ee63b4A336689Ca394',0),
    ('/LICENSE','/','bafybeibbwe7jcnivdanqeeuilshsquadsgypurowhh7ntwl7ty7qlvlxpi/LICENSE','',1092,1670629367,'0x82Da49fdB997E058c4a8e5Ee63b4A336689Ca394',0)
```

## Run the UI

**Running the app as a dev**

```
npm install
npm run start
```

**View your filesystem**

By default, app displays the filesystem for [dao_filesystem_80001_4276](https://testnets.opensea.io/assets/mumbai/0x4b48841d4b32c4650e4abc117a03fe8b51f38f68/4276). If you would like it to load your files, include the get parameter `?table={TABLELAND TABLE ID HERE}`. So to load `dao_filesystem_80001_4276` you would go to `http://localhost:3000/?table=dao_filesystem_80001_4276`.

**Viewing any single file**

Open the console of your browser to view the CID and the direct link to download any file in the filesystem.

**Moving folders and files**

Not implemented. However, you can open the console of your browser and view the SQL statements that would be used to make the changes. Ideally, the UI would build a buffer of SQL statements that a user could flush back to the table (if they had permissions) with a single transaction. 

## Next steps

Instead of creating the able on your own, use a smart contract to create a the filesystem table with [EVM-Tableland](https://github.com/tablelandnetwork/evm-tableland). Tables created this way are owned by the smart contract and can't be updated by individuals. The smart contract can then grant individuals permissions or expose custom functions for updating tables. This way, a smart contract such as a DAO can define nuanced access control rules for changing the file system. 

# Credits

The UI was cloned from the [Exploration](https://github.com/jaredLunde/exploration#) examples.

# Warning

This demo will not be maintained. 
