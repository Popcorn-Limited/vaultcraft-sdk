# VaultController

// TODO -- explain propose-change(ragequit) system
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

### `proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash>`

Proposes new adapters for the given vaults. Caller must be creator of the vaults. Adapter must exist in the CloneRegistry (Be deployed through the VaultController)

```ts
const txHash = vaultController.proposeVaultAdapters(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],["0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc", "0xE48d33e869f874D6BEe3701beF22ae72c60A3b3c"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `changeVaultAdapters(vaults: Address[], options: WriteOptions): Promise<Hash>`

Changes the adapters for given vaults. This will move the funds from the old adapter into the new one. Anyone can call this given there is a proposed adapter set in the vault. Resets proposed adapters.

```ts
const txHash = vaultController.changeVaultAdapters(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `proposeVaultFees(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<Hash>`

Proposes new fees per vault. Caller must be creator of the vaults. Value is in 1e18, e.g. 100% = 1e18 - 1 BPS = 1e12

```ts
const txHash = vaultController.proposeVaultFees(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [{ deposit: 0, withdrawal: 0, management: BigInt("1e16"), performance: BigInt("1e17") },
  { deposit: 0, withdrawal: 0, management: 0, performance: BigInt("1e17") }]
  );
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

VaultFees are defined as:

```ts
type VaultFees = {
    deposit: bigint;
    withdrawal: bigint;
    management: bigint;
    performance: bigint;
};
```


### `changeVaultFees(vaults: Address[], options: WriteOptions): Promise<Hash>`

Changes fees to previously proposed fees. Anyone can call this function. Takes fees once called. Resets proposed fees.

```ts
const txHash = vaultController.changeVaultFees(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `setVaultQuitPeriods(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<Hash>`

Sets new Quit Periods for Vaults. Caller must be creator of the vaults. Quit periods in seconds. New quit period must be within 1 day and 7 days. Cant be called if recently a new fee or adapter has been proposed (proposal time + quit period)

```ts
const txHash = vaultController.setVaultQuitPeriods(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [BigInt("86400"),BigInt("86400")]
  );
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `setVaultFeeRecipients(vaults: Address[], recipients: Address[], options: WriteOptions): Promise<Hash>`

Sets new Fee Recipients for Vaults. Caller must be creator of the vaults. address must not be 0. Accrued fees wont be transferred to the new feeRecipient.

```ts
const txHash = vaultController.setVaultFeeRecipients(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  ["0xd8da6bf26964af9d7eed9e03e53415d37aa96045","0xd8da6bf26964af9d7eed9e03e53415d37aa96045"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```



### `pauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Pause deposits. Caller must be owner or creator of the Vault.

```ts
const txHash = vaultController.pauseVaults(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `unpauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Unpause deposits. Caller must be owner or creator of the Vault.

```ts
const txHash = vaultController.unpauseVaults(["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `setVaultDepositLimits(vaults: Address[], limits: bigint[], options: WriteOptions): Promise<Hash>`

Sets new DepositLimit for Vaults. Caller must be creator of the vaults. Maximum amount of assets that can be deposited.

```ts
const txHash = vaultController.setVaultDepositLimits(
  ["0x5d344226578DC100b2001DA251A4b154df58194f", "0x3D04Aade5388962C9A4f83B636a3a8ED63ea5b4D"],
  [BigInt("1e27", "1e27")]
  );
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```