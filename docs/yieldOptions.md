# Yield Options

The YieldOptions class allows you to access yield data for different protocols on multiple chains. Use this class to compare available farms and their yield for the assets you are interested in or find interesting yield opportunities for assets that you were not tracking before.

YieldOptions allows you to fetch data about the following topics:
1. Supported protocols per chain
2. Supported assets per protocol and chain
3. Expected yield for each supported asset per protocol 

Currently we support the following networks and protocols with more beeing added soon:
```
Ethereum
├── Aave V2
├── Aave V3
├── Aura
├── Balancer
├── Beefy
├── Compound V2
├── Compound V3
├── Convex
├── Curve
├── Flux
├── Idle
├── Origin
├── Yearn
├── More protocols coming soon...
More networks coming soon...
```


## Initialization


To initialize it, you need to provide a yield data source and specify the time-to-live (in seconds) for the in-memory caching.

```ts
const ttl = 3600; // cache for 1 hour
const yieldOptions = new YieldOptions({provider, ttl});
```

There are two options for the provider:

## Cached Provider

The CachedProvider is a simple wrapper class for static yield data. You pass it a URL pointing to a JSON file on initialization and it stores the data in memory.

```ts
const provider = new CachedProvider();
await provider.initialize("https://raw.githubusercontent.com/Popcorn-Limited/apy-data/main/apy-data.json");

const ttl = 3600;
const yieldOptions = new YieldOptions({provider, ttl:3600});
```

The CachedProvider is the most efficient solution 

Every day, a cronjob pulls the yield data for all the integrated protocols and saves it in a JSON file in a separate branch of the vaultcraft-sdk repo.
You can find the file [here](https://github.com/Popcorn-Limited/apy-data/blob/main/apy-data.json).

## Protocol Provider

The LiveProvider uses live yield data that it gets from on-chain contracts or the protocol's API.
To access on-chain data it needs access to a viem public client.

```ts
const ttl = 3600;
const clients = {
    1: createPublicClient({ 
        chain: mainnet,
        transport: http()
    }),
};
const provider = new LiveProvider({clients, ttl});
const yieldOptions = new YieldOptions({provider, ttl});
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

### `getProtocolsByAsset({chainId: number, asset: Address}): Promise<ProtocolName[]>`

Returns a list of protocols that give you yield for a given asset.

```ts
const protocols = await yieldOptions.getProtocolsByAsset({chainId:1, asset: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"});
// protocols = ["aaveV2", "compoundV2", "curve", ...]
```

### `getYieldOptionsByProtocol({chainId: number, protocol: ProtocolName}): Promise<YieldOptions[]>`

Returns a list of assets and their apy for a given protocol.

```ts
const yields = await yieldOptions.getYieldOptionsByProtocol({chainId:1, protocol: "aaveV2"});
```

A YieldOptions is defined as:

```ts
type YieldOption = {
    asset: Address;
    yield: Yield;
}
type Yield = {
    total: number;
    apy?: {
        rewardToken: Address,
        apy: number,     
    }[];
}
```

- `yield.total` is the total amount of yield you earn.
- `yield.apy` breaks down the different yield sources, e.g. 2% Comp Supply APY + 1% COMP reward APY.
  - `apy.rewardToken` is the token in which you're paid.
  - `apy.apy` is the percentage you earn.

### `getApy({chainId: number, protocol: ProtocolName, asset: Address}): Promise<Yield>`

Returns the yield for a given asset & proctol:

```ts
const yield = await yieldOptions.getApy({chainId:1, protocol: "aaveV2", asset:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"});
```
See more information about the Yield type above in 'getYieldOptionsByProtocol'.
