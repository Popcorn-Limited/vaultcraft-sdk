# Vault


## Initialization

## Methods

### `totalSupply(): Promise<bigint>`

Returns the amount of tokens in existence. Note that the supply will be atleast 1e9 higher than the amount of assets since the vault has always 9 decimals more than the asset to prevent the [inflation attack](https://docs.openzeppelin.com/contracts/4.x/erc4626).

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `totalAssets(): Promise<bigint>`

Returns the total amount of the underlying asset that is “managed” by Vault.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `balanceOf(who: Address): Promise<bigint>`

Returns the amount of tokens owned by the given address.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `asset(): Promise<Address>`

Returns the address of the underlying token used for the Vault for accounting, depositing, and withdrawing.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `convertToShares(amount: bigint): Promise<bigint>`

Returns the amount of shares that the Vault would exchange for the amount of assets provided, in an ideal scenario where all the conditions are met. 
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `convertToAssets(amount: bigint): Promise<bigint>`

Returns the amount of assets that the Vault would exchange for the amount of shares provided, in an ideal scenario where all the conditions are met.
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `maxDeposit(receiver: Address): Promise<bigint>`

Returns the maximum amount of the underlying asset that can be deposited into the Vault for the receiver, through a deposit call.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `maxMint(receiver: Address): Promise<bigint>`

Returns the maximum amount of the Vault shares that can be minted for the receiver, through a mint call.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `maxWithdraw(owner: Address): Promise<bigint>`

Returns the maximum amount of the underlying asset that can be withdrawn from the owner balance in the Vault, through a withdraw call.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `maxRedeem(owner: Address): Promise<bigint>`

Returns the maximum amount of Vault shares that can be redeemed from the owner balance in the Vault, through a redeem call.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `previewDeposit(amount: bigint): Promise<bigint>`

Return as close to and no more than the exact amount of Vault shares that would be minted in a deposit call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their deposit at the current block, given current on-chain conditions.
The actual deposit call should return equal or more shares than this preview function.
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `previewMint(amount: bigint): Promise<bigint>`

Return as close to and no fewer than the exact amount of assets that would be deposited in a mint call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their mint at the current block, given current on-chain conditions.
The actual mint call should use equal or less assets than this preview function.
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `previewWithdraw(amount: bigint): Promise<bigint>`

Return as close to and no fewer than the exact amount of Vault shares that would be burned in a withdraw call in the same transaction. 
Allows an on-chain or off-chain user to simulate the effects of their withdrawal at the current block, given current on-chain conditions.
The actual withdraw call should use equal or less shares than this preview function.
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `previewRedeem(amount: bigint): Promise<bigint>`

Return as close to and no more than the exact amount of assets that would be withdrawn in a redeem call in the same transaction.
Allows an on-chain or off-chain user to simulate the effects of their redeemption at the current block, given current on-chain conditions. 
The actual redeem call should return equal or more assets than this preview function.
This function takes slippage and fees into account.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `adapter(): Promise<Address>`

Returns the address of the strategy used for the Vault for accounting, depositing, and withdrawing.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `proposedAdapter(): Promise<Address>`

Returns the address of the new proposed strategy.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `proposedAdapterTime(): Promise<bigint>`

Returns the on-chain timestamp when the new strategy was proposed.
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `fees(): Promise<VaultFees>`

Returns an object containing all fees of the Vault. Fees are set in 1e18 (1e18 = 100%, 1e14 = 1 BPS). Fees can be 0 but never 1e18.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
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
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

See more information about the VaultFees type above in 'fees'.

### `proposedFeeTime(): Promise<bigint>`

Returns the on-chain timestamp when new fees were proposed.
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `quitPeriod(): Promise<bigint>`

Returns the rage quit period in seconds. The quit period is set per default to 3 days and can be between 1 and 7 days. This time needs to pass between proposing an adapter or fees and changing the actual values. This allows depositors to withdraw from the vault if they dont agree with the proposed changes.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `depositLimit(): Promise<bigint>`

Returns the maximum amount of assets that can be deposited.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `accruedManagementFee(): Promise<bigint>`

Returns the accrued but non-realized management fee of this vault.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `accruedPerformanceFee(): Promise<bigint>`

Returns the accrued but non-realized performance fee of this vault.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `highWaterMark(): Promise<bigint>`

Returns the latest HighWaterMark in assets per share. New performance fees can only be taken if the assets per share are higher than the last HighWaterMark.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `feesUpdatedAt(): Promise<bigint>`

Returns the on-chain timestamp of the last time fees were taken. 
(Timestamps are stored in seconds. Multiply this timestamp by 1000 to use it in most DateTime implementations).

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```


### `feeRecipient(): Promise<Address>`

Returns the address of the fee recipient. This address earns all vault shares minted by taking fees.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `deposit(amount: bigint, receiver: Address, options: WriteOptions): Promise<Hash>`

Mints shares Vault shares to receiver by depositing exactly amount of underlying tokens.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `mint(amount: bigint, receiver: Address, options: WriteOptions): Promise<Hash>`

Mints exactly shares Vault shares to receiver by depositing amount of underlying tokens.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `withdraw(amount: bigint, receiver: Address, owner: Address, options: WriteOptions): Promise<Hash>`

Burns shares from owner and sends exactly assets of underlying tokens to receiver.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```

### `redeem(amount: bigint, receiver: Address, owner: Address, options: WriteOptions): Promise<Hash>`

Burns exactly shares from owner and sends assets of underlying tokens to receiver.

```ts
const totalSupply = vault.totalSupply();
// totalSupply = ....
```