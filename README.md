## Introducing VaultCraft

### YieldOptions
The YieldOptions class provides data about yield options across all supported chains.
In order to fetch data one must first call `setupNetwork(chainId)` so the sdk can fetch and store all data for that particular network. This will take a moment but all other calls afterwards will simply read from memory.
Adresses are dealt with in lowercase.


For the future: 
The object can be populated all at once or step by step.
Each "get"-call checks if the requested data exists already within the main object. If so it simply returns data from it. Otherwise it fetches the data and adds it to the main object. (Should increase loading speed)

```
MainObject {
  [chain:number]: Chain
}

Chain {
  protocols: string[];
  assetAddresses: string[];
  assetsByProtocol: {
    [protocol:string]: Asset[]
  };
  protocolsByAsset: {
    [asset:string]: string[]
  };
}

Asset {
  address: string;
  yield: Yield[];
}

Yield {
  total:number;
  apys: APY[]
}

APY {
  rewardToken:string; 
  apy:number;
}
```

#### SetupNetwork(chainId:number)
Fetches and stores all data for the specified network.

#### GetProtocols(chainId:number)
Returns Chain.protocols
#### GetAssetAddresses(chainId:number)
Returns Chain.assetAddresses

#### GetAssetsByProtocol(chainId:number, protocol?:string)
Returns Chain.assetsByProtocol or Chain.assetsByProtocol[protocol] if protocol is specified.

#### GetProtocolsByAsset(chainId:number, asset?:string)
Returns Chain.protocolsByAsset or Chain.protocolsByAsset[asset] if asset is specified

#### GetApy(chainId:number, protocol:string, asset:string)
Returns Asset.Yield from the specified protocol and asset.

### Factory
The Factory Class allows to create new Vaults and provides default configuration data to aid this process.

### VaultManagement
The VaultManagement Class provides data of a creators vaults and allows management of those vaults.

### Vault
The Vault Class provides data to display a vault and offers functionality to deposit and withdraw from a vault.