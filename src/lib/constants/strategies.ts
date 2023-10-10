import { Strategy } from "src/vaultFactory/types"

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
    initParams: [
      {
        name: "Staking Id",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid used for stargate staking"
      },
      {
        name: "Reward Token",
        type: "address",
        requirements: ["Required"],
        description: "Addresses of reward tokens",
        multiple: true
      },
      {
        name: "Minimum Trade Amounts",
        type: "uint256",
        requirements: ["Required"],
        description: "The minimum amount of tokens to trade (in wei)",
        multiple: true
      },
      {
        name: "Base Asset",
        type: "address",
        requirements: ["Required"],
        description: "Middle asset to trade through"
      },
      {
        name: "Stargate Router",
        type: "uint256",
        requirements: ["Required"],
        description: "Stargate Router Address"
      }
    ]
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
    initParams: [
      {
        name: "GaugeId",
        type: "uint256",
        requirements: ["Required"],
        description: "Id of the Gauge to use"
      },
      {
        name: "Reward Token",
        type: "address",
        requirements: ["Required"],
        description: "Addresses of reward tokens",
        multiple: true
      },
      {
        name: "Minimum Trade Amounts",
        type: "uint256",
        requirements: ["Required"],
        description: "The minimum amount of tokens to trade (in wei)",
        multiple: true
      },
      {
        name: "Base Asset",
        type: "address",
        requirements: ["Required"],
        description: "Middle asset to trade through"
      }
    ]
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
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Convex Pool"
      },
      {
        name: "Reward Token",
        type: "address",
        requirements: ["Required"],
        description: "Addresses of reward tokens",
        multiple: true
      },
      {
        name: "Minimum Trade Amounts",
        type: "uint256",
        requirements: ["Required"],
        description: "The minimum amount of tokens to trade (in wei)",
        multiple: true
      },
      {
        name: "Base Asset",
        type: "address",
        requirements: ["Required"],
        description: "Middle asset to trade through"
      }
    ]
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
    initParams: [
      {
        name: "BalancerGauge",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Balancer Gauge to use"
      },
      {
        name: "Reward Token",
        type: "address",
        requirements: ["Required"],
        description: "Addresses of reward tokens",
        multiple: true
      },
      {
        name: "Minimum Trade Amounts",
        type: "uint256",
        requirements: ["Required"],
        description: "The minimum amount of tokens to trade (in wei)",
        multiple: true
      },
      {
        name: "Base Asset",
        type: "address",
        requirements: ["Required"],
        description: "Middle asset to trade through"
      },
      {
        name: "Optional Data",
        type: "bytes32",
        requirements: ["Required"],
        description: "Pool Id of the LpToken and Index of the DepositToken",
        multiple: true
      }
    ]
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
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Aura Pool"
      },
      {
        name: "Reward Token",
        type: "address",
        requirements: ["Required"],
        description: "Addresses of reward tokens",
        multiple: true
      },
      {
        name: "Minimum Trade Amounts",
        type: "uint256",
        requirements: ["Required"],
        description: "The minimum amount of tokens to trade (in wei)",
        multiple: true
      },
      {
        name: "Base Asset",
        type: "address",
        requirements: ["Required"],
        description: "Middle asset to trade through"
      },
      {
        name: "Optional Data",
        type: "bytes32",
        requirements: ["Required"],
        description: "Pool Id of the LpToken and Index of the DepositToken",
        multiple: true
      }
    ]
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
    initParams: [
      {
        name: "AlpacaVault",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Alpaca Vault to use"
      }
    ],
    chains: [56],
    resolver: "default"
  },
  AlpacaLendV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Alpaca LendV2 Depositor",
    key: "AlpacaLendV2Adapter",
    protocol: "alpaca",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the AlpacaV2 Pool"
      }
    ],
    chains: [56],
    resolver: "default"
  },
  AuraDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Aura Depositor",
    key: "AuraAdapter",
    protocol: "aura",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Aura Pool"
      }
    ],
    chains: [],
    resolver: "aura"
  },
  BalancerGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Balancer Gauge Depositor",
    key: "BalancerGaugeAdapter",
    protocol: "balancer",
    initParams: [
      {
        name: "BalancerGauge",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Balancer Gauge to use"
      }
    ],
    chains: [],
    resolver: "balancer"
  },
  BeefyDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Beefy Depositor",
    key: "BeefyAdapter3",
    protocol: "beefy",
    initParams: [
      {
        name: "BeefyVault",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Beefy Vault to use"
      },
      {
        name: "BeefyBooster",
        type: "address",
        description: "Address of the BeefyBooster to use if the BeefyVault has any."
      }
    ],
    chains: [1, 1337, 42161],
    resolver: "beefy"
  },
  CompoundV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "CompoundV2 Depositor",
    key: "CompoundAdapter",
    protocol: "compoundV2",
    initParams: [
      {
        name: "CToken",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the fitting CToken for the asset"
      }
    ],
    chains: [1],
    resolver: "compoundV2"
  },
  CompoundV3Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "CompoundV3 Depositor",
    key: "CompoundV3Adapter",
    protocol: "compoundV3",
    initParams: [
      {
        name: "CToken",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the fitting CToken for the asset"
      },
      {
        name: "CometRewarder",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the fitting CometRewarder for the asset"
      }
    ],
    chains: [1, 1337],
    resolver: "compoundV3"
  },
  FluxFinanceDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Flux Finance Depositor",
    key: "CompoundV2Adapter",
    protocol: "flux",
    initParams: [
      {
        name: "CToken",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the fitting CToken for the asset"
      }
    ],
    chains: [1, 1337],
    resolver: "flux"
  },
  ConvexDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Convex Depositor",
    key: "ConvexAdapter",
    protocol: "convex",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Convex Pool"
      }
    ],
    chains: [],
    resolver: "convex"
  },
  CurveGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Curve Gauge Depositor",
    key: "CurveGaugeAdapterV2",
    protocol: "curve",
    initParams: [
      {
        name: "GaugeId",
        type: "uint256",
        requirements: ["Required"],
        description: "Id of the Gauge to use"
      }
    ],
    chains: [],
    resolver: "curve"
  },
  CurveChildGaugeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Curve Child Gauge Depositor",
    key: "CurveChildGaugeAdapter",
    protocol: "curve",
    initParams: [
      {
        name: "CRV",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the CRV-Token on the specific network"
      }
    ],
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
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Ellipsis Pool"
      }
    ],
    chains: [56],
    resolver: "default"
  },
  GearboxPassiveDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Gearbox Passive Depositor",
    key: "GearboxPassiveAdapter",
    protocol: "gearbox",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Gearbox Pool"
      }
    ],
    chains: [],
    resolver: "default"
  },
  IdleJuniorDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Idle Junior Depositor",
    key: "IdleJuniorAdapterV2",
    protocol: "idleJunior",
    initParams: [
      {
        name: "CDO",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the CDO Contract"
      }
    ],
    chains: [1, 1337],
    resolver: "idle"
  },
  IdleSeniorDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Idle Senior Depositor",
    key: "IdleSeniorAdapterV2",
    protocol: "idleSenior",
    initParams: [
      {
        name: "CDO",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the CDO Contract"
      }
    ],
    chains: [1, 1337],
    resolver: "idle"
  },
  OriginDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Origin Depositor",
    key: "OriginAdapter",
    protocol: "origin",
    initParams: [
      {
        name: "Wrapped Asset",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the wrapped version of the asset"
      }
    ],
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
    initParams: [
      {
        name: "Gauge",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Solidly Gauge"
      }
    ],
    chains: [250],
    resolver: "default"
  },
  StargateDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Stargate Depositor",
    key: "StargateLpStakingAdapter",
    protocol: "stargate",
    initParams: [
      {
        name: "Staking Id",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid used for stargate staking"
      }
    ],
    chains: [1, 1337],
    resolver: "stargate"
  },
  MasterChefV1Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "MasterChefV1 Depositor",
    key: "MasterChefV1Adapter",
    protocol: "sushi",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Convex Pool"
      },
      {
        name: "RewardsToken",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "RewardToken of the MasterChef contract"
      }
    ],
    chains: [],
    resolver: "default"
  },
  MasterChefV2Depositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "MasterChefV2 Depositor",
    key: "MasterChefV2Adapter",
    protocol: "sushi",
    initParams: [
      {
        name: "Pid",
        type: "uint256",
        requirements: ["Required"],
        description: "Pid of the Convex Pool"
      },
      {
        name: "RewardsToken",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "RewardToken of the MasterChef contract"
      }
    ],
    chains: [],
    resolver: "default"
  },
  VelodromeDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Velodrome Depositor",
    key: "VelodromeAdapter",
    protocol: "velodrome",
    initParams: [
      {
        name: "Gauge",
        type: "address",
        requirements: ["Required", "NotAddressZero"],
        description: "Address of the Velodrome Gauge"
      }
    ],
    chains: [],
    resolver: "velodrome"
  },
  YearnDepositor: {
    description: "description",
    logoURI: "/images/icons/popLogo.svg",
    name: "Yearn Depositor",
    key: "YearnAdapter1",
    protocol: "yearn",
    initParams: [
      {
        name: "MaxLoss",
        type: "uint256",
        description: "Max Loss for the yVault"
      }
    ],
    chains: [1, 1337, 42161],
    resolver: "yearn"
  }
}

export default strategies;