import { Address } from "viem";
import TokenMetadata, { addLpMetadata } from "./metadata/tokenMetadata.js";
import ProtocolMetadata from "./metadata/protocolMetadata.js";
import StrategyMetadata, { addGenericStrategyDescription } from "./metadata/strategyMetadata.js";
import type { Token } from "src/types.js";
import type { OptionalMetadata } from "../types.js";

function getStargateMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.stargate,
    token: { name: `STG-${asset.symbol.slice(2)}`, description: addLpMetadata("stargate", asset.symbol.slice(2)) },
    strategy: { name: "Stargate Compounding", description: addGenericStrategyDescription("lpCompounding", "Stargate") },
    getTokenUrl: `https://stargate.finance/pool/${asset.symbol.slice(2)}-ETH/add`,
    resolver: "stargate"
  }
}

function getConvexMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.convex,
    token: { name: `STG-${asset.symbol.slice(2)}`, description: addLpMetadata("stableLp", "curve") },
    strategy: { name: "Convex Compounding", description: addGenericStrategyDescription("lpCompounding", "Convex") },
    getTokenUrl: `https://curve.fi/#/ethereum/pools`,
    resolver: "convex",
  }
}

function getAaveV2Metadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.aave,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Aave Lending", description: addGenericStrategyDescription("lending", "Aave") },
    resolver: "aaveV3",

  }
}

function getAaveV3Metadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.aave,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Aave Lending", description: addGenericStrategyDescription("lending", "Aave") },
    resolver: "aaveV3",

  }
}

function getAuraMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.aura,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Aura Compounding", description: addGenericStrategyDescription("lpCompounding", "Aura") },
    resolver: "aura",

  }
}

function getCompoundV2Metadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.compound,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Compound Lending", description: addGenericStrategyDescription("lending", "Compound") },
    resolver: "compoundV2",
  }
}

function getCompoundV3Metadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.compound,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Compound Lending", description: addGenericStrategyDescription("lending", "Compound") },
    resolver: "compoundV3",

  }
}

function getFluxMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.flux,
    token: { name: asset.symbol, description: "None available" },
    strategy: StrategyMetadata.fluxLending,
    resolver: "flux",

  }
}

function getBeefyMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.beefy,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Beefy Vault", description: addGenericStrategyDescription("automatedAssetStrategy", "Beefy") },
    resolver: "beefy",

  }
}

function getYearnMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.yearn,
    token: { name: asset.symbol, description: "None available" },
    strategy: { name: "Yearn Vault", description: addGenericStrategyDescription("automatedAssetStrategy", "Yearn") },
    resolver: "yearn",

  }
}

function getIdleMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.idle,
    token: { name: asset.symbol, description: "None available" },
    strategy: adapter?.name?.includes("Senior") ?
      { name: "Senior Tranche", description: addGenericStrategyDescription("seniorTranche", "Idle") } :
      { name: "Junior Tranche", description: addGenericStrategyDescription("juniorTranche", "Idle") },
    resolver: adapter?.name?.includes("Senior") ? "idleSenior" : "idleJunior",
  }
}

function getOriginMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    protocol: ProtocolMetadata.origin,
    token: adapter?.name?.includes("Ether") ? TokenMetadata.oeth : TokenMetadata.ousd,
    strategy: adapter?.name?.includes("Ether") ? StrategyMetadata.oeth : StrategyMetadata.ousd,
    resolver: "origin"
  }
}

function getEmptyMetadata(adapter: Token, asset: Token): OptionalMetadata {
  return {
    token: { name: "Token", description: "Not found" },
    protocol: { name: "Protocol", description: "Not found" },
    strategy: { name: "Strategy", description: "Not found" },
  }
}


function getFactoryMetadata({ adapter, asset }: { adapter: Token, asset: Token }): OptionalMetadata {
  if (adapter?.name?.includes("Stargate")) {
    return getStargateMetadata(adapter, asset)
  } else if (adapter?.name?.includes("Convex")) {
    return getConvexMetadata(adapter, asset)
  } else if (adapter?.name?.includes("AaveV2")) {
    return getAaveV2Metadata(adapter, asset)
  } else if (adapter?.name?.includes("AaveV3")) {
    return getAaveV3Metadata(adapter, asset)
  } else if (adapter?.name?.includes("Aura")) {
    return getAuraMetadata(adapter, asset)
  } else if (adapter?.name?.includes("CompoundV2")) {
    return getCompoundV2Metadata(adapter, asset)
  } else if (adapter?.name?.includes("CompoundV3")) {
    return getCompoundV3Metadata(adapter, asset)
  } else if (adapter?.name?.includes("Flux")) {
    return getFluxMetadata(adapter, asset)
  } else if (adapter?.name?.includes("Beefy")) {
    return getBeefyMetadata(adapter, asset)
  } else if (adapter?.name?.includes("Yearn")) {
    return getYearnMetadata(adapter, asset)
  } else if (adapter?.name?.includes("Idle")) {
    return getIdleMetadata(adapter, asset)
  } else if (adapter?.name?.includes("Origin")) {
    return getOriginMetadata(adapter, asset)
  }
  return getEmptyMetadata(adapter, asset)
}


export default function getOptionalMetadata({ vaultAddress, asset, adapter }: { vaultAddress: Address, asset: Token, adapter: Token }): OptionalMetadata {
  return getFactoryMetadata({ adapter, asset })
}