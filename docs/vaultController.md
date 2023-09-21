# VaultController

// TODO -- explain propose-change(ragequit) system
## Initialization

VaultController needs to be instantiated once per chain.

`constructor(address: Address, publicClient: PublicClient, walletClient: WalletClient<Transport, Chain>)`

To initialize it, you need to provide a yield data source and specify the time-to-live (in seconds) for the in-memory caching.

```ts
const vaultControllerAddress = "",
const publicClient = ;
const walletClient = ;
const vaultController = new VaultController(vaultControllerAddress, publicClient, walletClient);
```

## Methods

### `proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash>`

Proposes new adapters for the given vaults. Caller must be creator of the vaults. Adapter must exist in the CloneRegistry (Be deployed through the VaultController)

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `changeVaultAdapters(vaults: Address[], options: WriteOptions): Promise<Hash>`

Changes the adapters for given vaults. This will move the funds from the old adapter into the new one. Anyone can call this given there is a proposed adapter set in the vault. Resets proposed adapters.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `proposeVaultFees(vaults: Address[], fees: VaultFees[], options: WriteOptions): Promise<Hash>`

Proposes new fees per vault. Caller must be creator of the vaults. Value is in 1e18, e.g. 100% = 1e18 - 1 BPS = 1e12

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `changeVaultFees(vaults: Address[], options: WriteOptions): Promise<Hash>`

Changes fees to previously proposed fees. Anyone can call this function. Takes fees once called. Resets proposed fees.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `setVaultQuitPeriods(vaults: Address[], quitPeriods: bigint[], options: WriteOptions): Promise<Hash>`

Sets new Quit Periods for Vaults. Caller must be creator of the vaults. Quit periods in seconds. New quit period must be within 1 day and 7 days. Cant be called if recently a new fee or adapter has been proposed (proposal time + quit period)

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `setVaultFeeRecipients(vaults: Address[], recipients: Address[], options: WriteOptions): Promise<Hash>`

Sets new Fee Recipients for Vaults. Caller must be creator of the vaults. address must not be 0. Accrued fees wont be transferred to the new feeRecipient.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```



### `pauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Pause deposits. Caller must be owner or creator of the Vault.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `unpauseVaults(vaults: Address[], options: WriteOptions): Promise<Hash>`

Unpause deposits. Caller must be owner or creator of the Vault.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `setVaultDepositLimits(vaults: Address[], limits: bigint[], options: WriteOptions): Promise<Hash>`

Sets new DepositLimit for Vaults. Caller must be creator of the vaults. Maximum amount of assets that can be deposited.

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```