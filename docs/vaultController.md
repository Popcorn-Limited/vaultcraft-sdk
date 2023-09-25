# VaultController
The VaultController class wraps a given vaultController contract per chain and provides all necessary write functions to manage your vaults. Any kind of vault management functions from changing `Strategies`, `Fees` or similar are done through this class. 

Most changes to vaults have to go trough a two-step process. The vault creator (owner) must propose changes and than wait till a `quitPeriod` of 1-7 days has passed before anyone can enact the proposed changes. This gives vault users time to withdraw their funds from the vault should they not accept the proposed changes.

> [!NOTE]  
> Currently we are using the word `Adapter` and `Strategy` interchangeably. In V2 we will simplify this wording to name every yield-earning contract a `Strategy`. 


## Initialization

VaultController needs to be instantiated once per chain. To initialize a VaultController class you need the vaultController address of that chain, a public client to read view functions and a walletClient to send write calls. We simply use [viems](https://viem.sh/) [public-](https://viem.sh/docs/clients/public.html) and [wallet client](https://viem.sh/docs/clients/wallet.html). 

In short the public client uses some Json-RPC API to fetch data from chain.<br/>
The wallet client connects with an [EOA](https://ethereum.org/en/glossary/#account) to allow the user to sign and execute transactions.<br/>
Find all current VaultController addresses right here:
```ts
mainnet: "0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb"
optimism: "0x757D953c53aD28748aCf94AD2d59C13955E09c08"
arbitrum: "0xF40749d72Ab5422CC5d735A373E66d67f7cA9393"
polygon: "0xCe22Ff6d00c5414E64b9253Dd49a35e0B9Ea8b60"
bsc: "0x815B4A955169Ba1D66944A4d8F18B69bc9553a62"
```
More chains will follow in the future.<br/>

To initalize the VaultController class simply follow this example:
```ts
const vaultControllerAddress = "0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb",
const publicClient = createPublicClient({ 
  chain: mainnet,
  transport: http()
})
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})

const vaultController = new VaultController(vaultControllerAddress, publicClient, walletClient);
```

## Methods
### Change Adapter

### `proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash>`

Proposes a new adapter for the selected vaults. The adapters must have been previuosly deployed through VaultCrafts protocol. ERC-4626 compliant contracts from other protocols can not be used. Adapters can be used for multiple vaults though. <br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.proposeVaultAdapters(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc", "0xE48d33e869f874D6BEe3701beF22ae72c60A3b3c"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `changeVaultAdapters(vaults: Address[], options: WriteOptions): Promise<Hash>`

Sets the previously proposed adapters as the new active adapters for selected vaults. This will move all funds from the old adapter into the new one. Anyone can call this function once new adapters were proposed and the `vault.quitPeriod()` has passed (`now() > vault.proposedAdapterTime() + vault.quitPeriod()`). This function takes fees before setting the new fee structure. The function will also reset `vault.proposedAdapter()` and `vault.proposedAdapterTime()`.

```ts
const txHash = vaultController.changeVaultAdapters(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


__________
### Change Fees

There are four fee types:

**Deposit Fee:** Deposit fees take a percentage of deposited assets on each `vault.deposit()` or `vault.mint()` call.<br/>

**Withdrawal Fee:** Withdrawal fees take a percentage of withdrawn assets on each `vault.withdraw()` or `vault.redeem()` call.<br/>

**Management Fee:** Management fees are continuously applied on the total value of deposits. A fee of 5% for example should take 5% of `vault.totalAssets()` over the span of a year. Note that the vault doesnt necessarily need to accrue any yield in order for this fee to apply. A user could theoratically therefore end up with less assets than before.<br/>

**Performance Fee:** Charge a fee whenever the share value reaches a new all time high in terms of assets per share. The fee will only be applied to gains realized by the vault, never the principal. Lets assume we have a performance fee of 20% and our vault realizes gains of 10% in assets. Our vault would now take 20% of these 10% or simply 2% of the vault value. If the vault doesnt earn any yield this fee will never be applied.<br/>

The vault fee type is defined as:

```ts
type VaultFees = {
    deposit: bigint;
    withdrawal: bigint;
    management: bigint;
    performance: bigint;
};
```
The following steps can be taken to change the fees in a vault.

#### Propose Vault Fees
```
proposeVaultFees(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<Hash>
```

Proposes a new fee structure for the selected vaults. Fees can range from 0 - 1e18 whereby 1e18 equals 100% (1e12 = 1 Basis Point). Fees are calculated in assets. When taking fees these will be minted as vault shares to the `vault.feeRecipient()` and therefore continue to earn yield.<br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.proposeVaultFees(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [
    { deposit: 0, withdrawal: 0, management: BigInt("1e16"), performance: BigInt("1e17") },
    { deposit: 0, withdrawal: 0, management: 0, performance: BigInt("1e17") }
  ]
);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

#### Change Vault Fees
```
changeVaultFees(vaults: Address[], options: WriteOptions): Promise<Hash>
```

Sets the previously proposed fees as the new active fees for selected vaults. Anyone can call this function once fees were proposed and the `vault.quitPeriod()` has passed (`now() > vault.proposedFeeTime() + vault.quitPeriod()`). This function takes fees before setting the new fee structure. The function will also reset `vault.proposedFees()` and `vault.proposedFeeTime()`.

```ts
const txHash = vaultController.changeVaultFees(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


#### Set Vault Fee Recipients
```
setVaultFeeRecipients(vaults: Address[], recipients: Address[], options: WriteOptions): Promise<Hash>
```

Sets new fee recipients for selected vaults. The new fee recipients must be valid addresses and cant be the zero address. Its important to not that already minted fee shares wont be transfered to the new fee recipient.<br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.setVaultFeeRecipients(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045","0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


__________
### Pausing

### `pauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Pause the selected vaults to prevent users to deposit. Assets will remain in the strategies of each vault and can still be withdrawn by vault users.<br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.pauseVaults(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `unpauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Unpause the selected vaults to allow users to deposit again.<br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.unpauseVaults(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


__________
### Other

### `setVaultDepositLimits(vaults: Address[], limits: bigint[], options: WriteOptions): Promise<Hash>`

Sets a new deposit limit in assets for selected vaults. Use this function if you want to slowly scale TVL in your vaults. <br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.setVaultDepositLimits(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [BigInt("1e27", "1e27")]
  );
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `setVaultQuitPeriods(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<Hash>`

Sets new quit periods in seconds for selected vaults. New quit periods must be within 1 day and 7 days. Cant be called if a new fee or adapter has been recently proposed. (You have to wait atleast after the `proposalTime + quitPeriod` is passed) <br/>
The account calling this function must be the `creator` (owner) of all selected vaults.

```ts
const txHash = vaultController.setVaultQuitPeriods(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [BigInt("86400"),BigInt("86400")]
  );
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```
