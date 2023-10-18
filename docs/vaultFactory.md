## VaultFactory
The VaultFactory class wraps a given vaultController contract per chain and provides all necessary write functions to deploy new vaults and strategies. It also provides helper functions to fetch required configuration params for strategies and their defaults.

> [!NOTE]  
> Currently we are using the word `Adapter` and `Strategy` interchangeably. In V2 we will simplify this wording to name every yield-earning contract a `Strategy`. 


## Initialization

VaultFactory needs to be instantiated once per chain. To initialize a VaultFactory class you need the vaultController address of that chain, a public client to read view functions and a walletClient to send write calls. We simply use [viems](https://viem.sh/) [public-](https://viem.sh/docs/clients/public.html) and [wallet client](https://viem.sh/docs/clients/wallet.html). 

In short the public client uses some Json-RPC API to fetch data from chain.<br/>
The wallet client connects with an [EOA](https://ethereum.org/en/glossary/#account) to allow the user to sign and execute transactions.<br/>
Find all current vaultController addresses right here:
```ts
mainnet: "0x7D51BABA56C2CA79e15eEc9ECc4E92d9c0a7dbeb"
optimism: "0x757D953c53aD28748aCf94AD2d59C13955E09c08"
arbitrum: "0xF40749d72Ab5422CC5d735A373E66d67f7cA9393"
polygon: "0xCe22Ff6d00c5414E64b9253Dd49a35e0B9Ea8b60"
bsc: "0x815B4A955169Ba1D66944A4d8F18B69bc9553a62"
```
More chains will follow in the future.<br/>

To initalize the VaultFactory class simply follow this example:
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

const vaultFactory = new VaultFactory(vaultControllerAddress, publicClient, walletClient);
```

## Methods
### View Calls

### `getStrategyKeys({ chainId }: { chainId: number }): string[]`

This function will return the keys for all available strategies on the chain corresponding to `chainId`.

```ts
const keys = vaultController.getStrategyKeys({chainId:1});
// keys = ["AaveV2Depositor", "AaveV3Depositor", "AuraCompounder", ...]
```


### `async getStrategyParams({ strategy, asset }: { strategy: string, asset: Address }): Promise<StrategyDefault>`

Given the name of a strategy and the address of an asset this function will return configuration params and the default values for these initialization params. 

```ts
const params = vaultController.getStrategyParams({strategy:"yearn", asset:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"});
// txHash = {
//   params: [{ name: "maxLoss", type: "uint256"}],
//   default: [{ name: "maxLoss", value: 1 }]
// ]}
```

__________
### Deploy Strategy

### `async createStrategyByKey({ asset, initialDeposit, strategy, options }: CreateStrategyByKeyParams): Promise<Hash>`

Given an asset, initalDeposit and the name of a strategy this function will deploy a new strategy. All configuration for the wanted strategy will be resolved by the sdk without the user needing to provide these parameter. This is the recommended function for most user to deploy a strategy. 

```ts
const txHash = vaultController.createStrategyByKey({
  asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  intialDeposit: BigInt(0),
  strategy: "yearn"
  });
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `async createStrategy({ asset, adapterData, strategyData, initialDeposit, options }:CreateStrategyParams ): Promise<Hash>`

This function is a minimal wrapper around the strategy deployment function of the vaultController. `adapterData` and `strategyData` are the encoded adapter and strategy key with encoded init-params. The required initData can be figured out by calling `getStrategyParams` for the desired strategy.

```ts
const txHash = vaultController.createStrategy({
  asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  adapterData:{ 
    id: "0x0000000000000000000000005dca0b3ed7594a6613c1a2acd367d56e1f74f92d",
    data: "0x"
    },
  strategyData:{
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
    },
  intialDeposit: BigInt(0)
});
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


__________
### Deploy Vault

### `async createVaultByKey({ vault, metadataCID, strategy, options }: CreateVaultByKeyParams): Promise<Hash>`

This function is the recommended way to deploy a new vault with a newly deployed strategy. The strategy key takes care of selecting and encoding the correct strategy data automatically. Metadata can be via the metadataCID which is typically an IPFS-hash. If no metadata exists this would simply be an empty string. All other vault configurations are set in the `vault`-object. 
Fees can range from 0 - 1e18 whereby 1e18 equals 100% (1e12 = 1 Basis Point). Fees are calculated in assets.
The four fee types are:<br/>
**Deposit Fee:** Deposit fees take a percentage of deposited assets on each `vault.deposit()` or `vault.mint()` call.<br/>
**Withdrawal Fee:** Withdrawal fees take a percentage of withdrawn assets on each `vault.withdraw()` or `vault.redeem()` call.<br/>
**Management Fee:** Management fees are continuously applied on the total value of deposits. A fee of 5% for example should take 5% of `vault.totalAssets()` over the span of a year. Note that the vault doesnt necessarily need to accrue any yield in order for this fee to apply. A user could theoratically therefore end up with less assets than before.<br/>
**Performance Fee:** Charge a fee whenever the share value reaches a new all time high in terms of assets per share. The fee will only be applied to gains realized by the vault, never the principal. Lets assume we have a performance fee of 20% and our vault realizes gains of 10% in assets. Our vault would now take 20% of these 10% or simply 2% of the vault value. If the vault doesnt earn any yield this fee will never be applied.<br/>

> [!NOTE]  
> The `adapter` address controls if a predeployed strategy will be used or if we deploy a new strategy. When the `adapter` address is 0 the contract will expect adapter and strategy data to deploy a new strategy. Since this function always deploys a new strategy it will error if the `adapter` address is not 0.


```ts
const txHash = vaultController.createVaultByKey({
  vault: {
    asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      adapter: ADDRESS_ZERO,
      fees: {
        deposit: BigInt(0),
        withdrawal: BigInt(0),
        management: BigInt(0),
        performance: BigInt(10)
      },
      feeRecipient: ADMIN_ADDRESS,
      owner: ADMIN_ADDRESS,
      initialDeposit: BigInt(0),
      depositLimit: MAX_UINT256
  },
  metadataCid:"bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
  strategy:"yearn"
});
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```


### `async createVault({ vault, adapterData, strategyData, metadata, options }: { vault: VaultOptions, adapterData: StrategyData, strategyData: StrategyData, metadata: VaultMetadata, options?: WriteOptions }): Promise<Hash>`

This function is a minimal wrapper around the vault deployment function of the vaultController. `adapterData` and `strategyData` are the encoded adapter and strategy key with encoded init-params. The required initData can be figured out by calling `getStrategyParams` for the desired strategy. Metadata can be via the metadataCID which is typically an IPFS-hash. If no metadata exists this would simply be an empty string. All other vault configurations are set in the `vault`-object. 

> [!NOTE]  
> The `adapter` address controls if a predeployed strategy will be used or if we deploy a new strategy. When the `adapter` address is 0 the contract will expect adapter and strategy data to deploy a new strategy. Therefore make sure to either have the `adapter` address set and `adapterData` + `strategyData` empty to use an existing strategy. Alternatively set the `adapter` address to 0 and have correct `adapterData` + `strategyData` to deploy a new strategy alongside the vault.

```ts
const txHash = vaultController.createVault({
  vault: {
    asset: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      adapter: "0x612465C8d6F1B2Bc85DF43224a8A3b5e04F634fc",
      fees: {
        deposit: BigInt(0),
        withdrawal: BigInt(0),
        management: BigInt(0),
        performance: BigInt(10)
      },
      feeRecipient: ADMIN_ADDRESS,
      owner: ADMIN_ADDRESS,
      initialDeposit: BigInt(0),
      depositLimit: MAX_UINT256
  },
  metadataCid:"bafkreiewrachblhjeuv4laknz7z4nwyjtzcovar5tc2rqy4xutmbx2qpia",
  adapterData: {
    id: "0x0000000000000000000000000000000000000000000000000000000000000000",
    data: "0x"
  },
  strategyData: {
      id: "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: "0x"
  },
});
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```