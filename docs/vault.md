# Vault


## Initialization

The Vault class needs to be instantiated once per vault contract that you want to interact with. To initialize a Vault class you need address of your vault, a public client to read view functions and a walletClient to send write calls. We simply use [viems](https://viem.sh/) [public-](https://viem.sh/docs/clients/public.html) and [wallet client](https://viem.sh/docs/clients/wallet.html). 

In short the public client uses some Json-RPC API to fetch data from chain.<br/>
The wallet client connects with an [EOA](https://ethereum.org/en/glossary/#account) to allow the user to sign and execute transactions.<br/>
You can find the addresses of all existing vaults by calling `allVaults` on the VaultRegistry contract of that chain. For example through [etherscan]([VaultRegistry](https://etherscan.io/address/0x007318Dc89B314b47609C684260CfbfbcD412864#readContract)).

Find all current VaultRegistry addresses right here:
```ts
mainnet: "0x007318Dc89B314b47609C684260CfbfbcD412864"
optimism: "0xdD0d135b5b52B7EDd90a83d4A4112C55a1A6D23A"
arbitrum: "0xB205e94D402742B919E851892f7d515592a7A6cC"
polygon: "0x2246c4c469735bCE95C120939b0C078EC37A08D0"
bsc: "0x25172C73958064f9ABc757ffc63EB859D7dc2219"
```
More chains will follow in the future. Additionally we are working on a VaultRegistry class for this SDK to make this process easier. On top of that our [app](https://vaultcraft.io/) will soon feature a dedicated page to allow you to see and manage all your vaults.

To initalize the Vault class simply follow this example:
```ts
const vaultAddress = "0x5d344226578DC100b2001DA251A4b154df58194f",
const publicClient = createPublicClient({ 
  chain: mainnet,
  transport: http()
})
const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum)
})

const vault = new Vault(vaultAddress, publicClient, walletClient);
```

## Methods

### `totalSupply(): Promise<bigint>`

Returns the amount of tokens in existence. Note that the supply will be atleast 1e9 higher than the amount of assets since the vault has always 9 decimals more than the asset to prevent the [inflation attack](https://docs.openzeppelin.com/contracts/4.x/erc4626).

```ts
const totalSupply = vault.totalSupply();
// totalSupply = 1000000000000000000n
```

### `totalAssets(): Promise<bigint>`

Returns the total amount of the underlying asset that is “managed” by Vault.

```ts
const totalAssets = vault.totalAssets();
// totalAssets = 1000000000000000000n
```

### `balanceOf(who: Address): Promise<bigint>`

Returns the amount of tokens owned by the given address.

```ts
const balance = vault.balanceOf("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// balance = 1000000000000000000n
```

### `asset(): Promise<Address>`

Returns the address of the underlying token used for the Vault for accounting, depositing, and withdrawing.

```ts
const asset = vault.asset();
// asset = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
```

### `convertToShares(amount: bigint): Promise<bigint>`

Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met. 
This function takes slippage and fees into account.

```ts
const sharesPerAsset = vault.convertToShares(BigInt("1e18"));
// sharesPerAsset = 1000000000000000000n
```

### `convertToAssets(amount: bigint): Promise<bigint>`

Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met.
This function takes slippage and fees into account.

```ts
const assetsPerShare = vault.convertToAssets(BigInt("1e18"));
// assetsPerShare = 1000000000000000000n
```

### `maxDeposit(receiver: Address): Promise<bigint>`

Returns the maximum amount of the underlying asset that can be deposited into the Vault for the receiver, through a deposit call.

```ts
const maxDeposit = vault.maxDeposit("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// maxDeposit = 1000000000000000000n
```

### `maxMint(receiver: Address): Promise<bigint>`

Returns the maximum amount of the Vault shares that can be minted for the receiver, through a mint call.

```ts
const maxMint = vault.maxMint("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// maxMint = 1000000000000000000n
```

### `maxWithdraw(owner: Address): Promise<bigint>`

Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the Vault, through a withdraw call.

```ts
const maxWithdraw = vault.maxWithdraw("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// maxWithdraw = 1000000000000000000n
```

### `maxRedeem(owner: Address): Promise<bigint>`

Returns the maximum amount of Vault shares that can be redeemed from the owner balance in the Vault, through a redeem call.

```ts
const maxRedeem = vault.maxRedeem("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// maxRedeem = 1000000000000000000n
```

### `previewDeposit(amount: bigint): Promise<bigint>`

Return as close to and no more than the exact amount of Vault shares that would be minted in a deposit call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
The actual deposit call should return equal or more shares than this preview function.
This function takes slippage and fees into account.

```ts
const expectedShares = vault.previewDeposit(BigInt("1e18"));
// expectedShares = 1000000000000000000n
```

### `previewMint(amount: bigint): Promise<bigint>`

Return as close to and no fewer than the exact amount of assets that would be deposited in a mint call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
The actual mint call should use equal or less assets than this preview function.
This function takes slippage and fees into account.

```ts
const expectedAssets = vault.previewMint(BigInt("1e18"));
// expectedAssets = 1000000000000000000n
```

### `previewWithdraw(amount: bigint): Promise<bigint>`

Return as close to and no fewer than the exact amount of Vault shares that would be burned in a withdraw call in the same transaction. 
Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
The actual withdraw call should use equal or less shares than this preview function.
This function takes slippage and fees into account.

```ts
const expectedShares = vault.previewWithdraw(BigInt("1e18"));
// expectedShares = 1000000000000000000n
```

### `previewRedeem(amount: bigint): Promise<bigint>`

Return as close to and no more than the exact amount of assets that would be withdrawn in a redeem call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions. 
The actual redeem call should return equal or more assets than this preview function.
This function takes slippage and fees into account.

```ts
const expectedAssets = vault.previewRedeem(BigInt("1e18"));
// expectedAssets = 1000000000000000000n
```


### `adapter(): Promise<Address>`

Returns the address of the strategy used for the Vault for accounting, depositing, and withdrawing.

```ts
const adapter = vault.adapter();
// adapter = "0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc"
```

### `proposedAdapter(): Promise<Address>`

Returns the address of the new proposed strategy.

```ts
const proposedAdapter = vault.proposedAdapter();
// proposedAdapter = "0xE48d33e869f874D6BEe3701beF22ae72c60A3b3c"
```


### `proposedAdapterTime(): Promise<bigint>`

Returns the on-chain timestamp when the new strategy was proposed.
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const proposedAdapterTime = vault.proposedAdapterTime();
// proposedAdapterTime = 17883751
```

### `fees(): Promise<VaultFees>`

Returns an object containing all fees of the Vault. Fees are set in 1e18 (1e18 = 100%, 1e14 = 1 BPS). Fees can be 0 but never 1e18.

```ts
const fees = vault.fees();
// fees = { deposit: 0, withdrawal: 0, management: 10000000000000000n, performance: 100000000000000000n }
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


### `proposedFees(): Promise<VaultFees>`

Returns an object containing new proposed fees for the Vault. 

```ts
const proposedFees = vault.proposedFees();
// proposedFees = { deposit: 0, withdrawal: 0, management: 0, performance: 200000000000000000n }
```

See more information about the VaultFees type above in 'fees'.

### `proposedFeeTime(): Promise<bigint>`

Returns the on-chain timestamp when new fees were proposed.
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const proposedFeeTime = vault.proposedFeeTime();
// proposedFeeTime = 17883751
```


### `quitPeriod(): Promise<bigint>`

Returns the rage quit period in seconds. The quit period is set per default to 3 days and can be between 1 and 7 days. This time needs to pass between proposing an adapter or fees and changing the actual values. This allows depositors to withdraw from the vault if they dont agree with the proposed changes.

```ts
const quitPeriod = vault.quitPeriod();
// quitPeriod = 86400n
```


### `depositLimit(): Promise<bigint>`

Returns the maximum amount of assets that can be deposited.

```ts
const depositLimit = vault.depositLimit();
// depositLimit = 1000000000000000000n
```


### `accruedManagementFee(): Promise<bigint>`

Returns the accrued but non-realized management fee of this vault in assets.

```ts
const accruedManagementFee = vault.accruedManagementFee();
// accruedManagementFee = 1000000000000000000n
```

### `accruedPerformanceFee(): Promise<bigint>`

Returns the accrued but non-realized performance fee of this vault in assets.

```ts
const accruedPerformanceFee = vault.accruedPerformanceFee();
// accruedPerformanceFee = 1000000000000000000n
```


### `highWaterMark(): Promise<bigint>`

Returns the latest HighWaterMark in assets per share. New performance fees can only be taken if the assets per share are higher than the last HighWaterMark.

```ts
const highWaterMark = vault.highWaterMark();
// highWaterMark = 1000000000000000000n
```


### `feesUpdatedAt(): Promise<bigint>`

Returns the on-chain timestamp of the last time fees were taken. 
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const feesUpdatedAt = vault.feesUpdatedAt();
// feesUpdatedAt = 17883751
```


### `feeRecipient(): Promise<Address>`

Returns the address of the fee recipient. This address earns all vault shares minted by taking fees.

```ts
const feeRecipient = vault.feeRecipient();
// feeRecipient = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
```

### `deposit(amount: bigint, receiver: Address, options: WriteOptions): Promise<Hash>`

Mints shares Vault shares to receiver by depositing exactly amount of underlying tokens.

```ts
const txHash = vault.deposit(BigInt("1e18"), "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `mint(amount: bigint, receiver: Address, options: WriteOptions): Promise<Hash>`

Mints exactly shares Vault shares to receiver by depositing amount of underlying tokens.

```ts
const txHash = vault.mint(BigInt("1e18"), "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `withdraw(amount: bigint, receiver: Address, owner: Address, options: WriteOptions): Promise<Hash>`

Burns shares from owner and sends exactly assets of underlying tokens to receiver.

```ts
const txHash = vault.withdraw(BigInt("1e18"), "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```

### `redeem(amount: bigint, receiver: Address, owner: Address, options: WriteOptions): Promise<Hash>`

Burns exactly shares from owner and sends assets of underlying tokens to receiver.

```ts
const txHash = vault.redeem(BigInt("1e18"), "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```