# Yield Options

The YieldOptions class allows you to access yield data for different protocols on multiple chains. To initialize it, you need to provide a yield data source and specify the time-to-live for the in-memory caching.

```ts
const ttl = 3600; // cache for 1 hour
const yieldOptions = new YieldOptions(provider, ttl);
```

There are two options for the provider:

## Cached Provider

The CachedProvider is a simple wrapper class for static yield data. You pass it a URL pointing to a JSON file on initialization and it stores the data in memory.

```ts
const provider = new CachedProvider();
await provider.initialize("url to JSON file");

const ttl = 3600;
const yieldOptions = new YieldOptions(provider, 3600);
```

The CachedProvider is the most efficient solution 

Every hour, a cronjob pulls the yield data for all the integrated protocols and saves it in a JSON file in a separate branch of the vaultcraft-sdk repo.
You can find the file [here](https://github.com/Popcorn-Limited/apy-data/blob/main/apy-data.json).

## Protocol Provider

The ProtocolProvider uses live yield data that it gets from on-chain contracts or the protocol's API.
To access on-chain data it needs access to a viem public client.

```ts
const ttl = 3600;
const clients = {
    1: createPublicClient({ 
        chain: mainnet,
        transport: http()
    }),
};
const provider = new ProtocolProvider(clients, ttl);
const yieldOptions = new YieldOptions(provider, ttl);
```


## Methods

### `getProtocols(chainId: number): ProtocolName[]`

Returns a list of the protocols for which it can provide yield data given a chainId.

```ts
const protocols = yieldOptions.getProtocols(1);
// protocols = ["aaveV2", "compoundV2", "curve", ...]
```

### `getAssets(chainId: number): Promise<Address[]>`

Returns a list of all the assets for which there is a protocol that you can earn yield on.

```ts
const assets = await yieldOptions.getAssets(1);
// assets = ["0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", ...]
```

### `getProtocolsByAsset(chainId: number, asset: Address): Promise<ProtocolName[]>`

Returns a list of protocols that give you yield for a given asset.

```ts
const protocols = await yieldOptions.getProtocolsByAsset(1,"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
// protocols = ["aaveV2", "compoundV2", "curve", ...]
```

### `getYieldOptionsByProtocol(chainId: number, protocol: ProtocolName): Promise<YieldOptions[]>`

Returns a list of assets and their apy for a given protocol.

```ts
const yields = await yieldOptions.getYieldOptionsByProtocol(1, "aaveV2");
```

A YieldOptions is defined as:

```ts
type Yield = {
    total: number;
    apy?: {
        rewardToken: Address,
        apy: number,     
    }[];
}
type YieldOption = {
    address: Address;
    yield: Yield;
}
```

- `yield.total` is the total amount of yield you earn.
- `yield.apy` breaks down the different yield sources, e.g. 2% Comp Supply APY + 1% COMP reward APY.
  - `apy.rewardToken` is the token in which you're paid.
  - `apy.apy` is the percentage you earn.

### `getapy(chainId: number, protocol: ProtocolName, asset: Address): Promise<Yield>`

Returns the yield for a given asset & proctol:

```ts
const yield = await yieldOptions.getApy(1, "aaveV2", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
```
