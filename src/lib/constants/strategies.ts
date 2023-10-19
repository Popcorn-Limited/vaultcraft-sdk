import type { Strategy } from "src/vaultFactory/types.js"

const strategies: { [key: string]: Strategy } = {
  CurveStargateCompounder: {
    name: "Stargate Compounder",
    key: "CurveStargateCompounder",
    resolver: "curveStargateCompounder",
    protocol: "stargate",
    adapter: "StargateDepositor",
    chains: [1],
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
  },
  CurveCompounder: {
    name: "Curve Compounder",
    key: "CurveCompounder",
    resolver: "curveCompounder",
    protocol: "curve",
    adapter: "CurveGaugeDepositor",
    chains: [1],
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
  },
  ConvexCompounder: {
    name: "Convex Compounder",
    key: "CurveCompounder",
    resolver: "convexCompounder",
    protocol: "convex",
    adapter: "ConvexDepositor",
    chains: [1],
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
  },
  BalancerLpCompounder: {
    name: "Balancer Compounder",
    key: "BalancerLpCompounder",
    resolver: "balancerLpCompounder",
    protocol: "balancer",
    adapter: "BalancerGaugeDepositor",
    chains: [1],
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
  },
  AuraCompounder: {
    name: "Aura Compounder",
    key: "BalancerLpCompounder",
    resolver: "auraCompounder",
    protocol: "aura",
    adapter: "AuraDepositor",
    chains: [1],
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
  },
  AaveV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "AaveV2 Depositor",
    key: "AaveV2Adapter",
    protocol: "aaveV2",
    chains: [1, 1337],
    resolver: "aaveV2"
  },
  AaveV3Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "AaveV3 Depositor",
    key: "AaveV3Adapter",
    protocol: "aaveV3",
    chains: [1, 1337, 42161],
    resolver: "aaveV3"
  },
  AlpacaLendV1Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Alpaca LendV1 Depositor",
    key: "AlpacaLendV1Adapter",
    protocol: "alpaca",
    chains: [56],
    resolver: "default"
  },
  AlpacaLendV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Alpaca LendV2 Depositor",
    key: "AlpacaLendV2Adapter",
    protocol: "alpaca",
    chains: [56],
    resolver: "default"
  },
  AuraDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Aura Depositor",
    key: "AuraAdapter",
    protocol: "aura",
    chains: [],
    resolver: "aura"
  },
  BalancerGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Balancer Gauge Depositor",
    key: "BalancerGaugeAdapter",
    protocol: "balancer",
    chains: [],
    resolver: "balancer"
  },
  BeefyDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Beefy Depositor",
    key: "BeefyAdapter3",
    protocol: "beefy",
    chains: [1, 1337, 42161],
    resolver: "beefy"
  },
  CompoundV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "CompoundV2 Depositor",
    key: "CompoundAdapter",
    protocol: "compoundV2",
    chains: [1],
    resolver: "compoundV2"
  },
  CompoundV3Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "CompoundV3 Depositor",
    key: "CompoundV3Adapter",
    protocol: "compoundV3",
    chains: [1, 1337],
    resolver: "compoundV3"
  },
  FluxFinanceDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Flux Finance Depositor",
    key: "CompoundV2Adapter",
    protocol: "flux",
    chains: [1, 1337],
    resolver: "flux"
  },
  ConvexDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Convex Depositor",
    key: "ConvexAdapter",
    protocol: "convex",
    chains: [],
    resolver: "convex"
  },
  CurveGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Curve Gauge Depositor",
    key: "CurveGaugeAdapterV2",
    protocol: "curve",
    chains: [],
    resolver: "curve"
  },
  CurveChildGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Curve Child Gauge Depositor",
    key: "CurveChildGaugeAdapter",
    protocol: "curve",
    chains: [],
    resolver: "curve"
  },
  DotDotGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "DotDot Gauge Depositor",
    key: "DotDotGaugeAdapter",
    protocol: "dotdot",
    chains: [56],
    resolver: "default"
  },
  EllipsisGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Ellipsis Gauge Depositor",
    key: "EllipsisGaugeAdapter",
    protocol: "ellipsis",
    chains: [56],
    resolver: "default"
  },
  GearboxPassiveDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Gearbox Passive Depositor",
    key: "GearboxPassiveAdapter",
    protocol: "gearbox",
    chains: [],
    resolver: "default"
  },
  IdleJuniorDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Idle Junior Depositor",
    key: "IdleJuniorAdapterV2",
    protocol: "idleJunior",
    chains: [1, 1337],
    resolver: "idle"
  },
  IdleSeniorDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Idle Senior Depositor",
    key: "IdleSeniorAdapterV2",
    protocol: "idleSenior",
    chains: [1, 1337],
    resolver: "idle"
  },
  OriginDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Origin Depositor",
    key: "OriginAdapter",
    protocol: "origin",
    chains: [1, 1337],
    resolver: "origin"
  },
  RadiantDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Radiant Depositor",
    key: "RadiantAdapter",
    protocol: "radiant",
    chains: [56, 42161],
    resolver: "default"
  },
  SolidlyDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Solidly Depositor",
    key: "SolidlyAdapter",
    protocol: "solidly",
    chains: [250],
    resolver: "default"
  },
  StargateDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Stargate Depositor",
    key: "StargateLpStakingAdapter",
    protocol: "stargate",
    chains: [1, 1337],
    resolver: "stargate"
  },
  MasterChefV1Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "MasterChefV1 Depositor",
    key: "MasterChefV1Adapter",
    protocol: "sushi",
    chains: [],
    resolver: "default"
  },
  MasterChefV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "MasterChefV2 Depositor",
    key: "MasterChefV2Adapter",
    protocol: "sushi",
    chains: [],
    resolver: "default"
  },
  VelodromeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Velodrome Depositor",
    key: "VelodromeAdapter",
    protocol: "velodrome",
    chains: [],
    resolver: "velodrome"
  },
  YearnDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Yearn Depositor",
    key: "YearnAdapter1",
    protocol: "yearn",
    chains: [1, 1337, 42161],
    resolver: "yearn"
  },
  YearnFactoryDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Yearn Factory Depositor",
    key: "YearnFactoryAdapter",
    protocol: "yearnFactory",
    chains: [1],
    resolver: "yearnFactory"
  }
}

export default strategies;