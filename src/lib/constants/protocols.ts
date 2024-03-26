import type { Protocol } from "src/yieldOptions/types.js";

const protocols: { [key: string]: Protocol } = {
  aaveV2: {
    name: "Aave V2",
    key: "aaveV2",
    logoURI: "https://cryptologos.cc/logos/aave-aave-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1]
  },
  aaveV3: {
    name: "Aave V3",
    key: "aaveV3",
    logoURI: "https://cryptologos.cc/logos/aave-aave-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1, 42161]
  },
  aura: {
    name: "Aura",
    key: "aura",
    logoURI: "https://app.aura.finance/assets/aura-362899d2.png",
    description: "",
    tags: [],
    chains: [1]
  },
  balancer: {
    name: "Balancer",
    key: "balancer",
    logoURI: "https://cryptologos.cc/logos/balancer-bal-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1]
  },
  beefy: {
    name: "Beefy",
    key: "beefy",
    logoURI: "https://cryptologos.cc/logos/beefy-finance-bifi-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1, 137, 10, 42161, 56]
  },
  compoundV2: {
    name: "Compound V2",
    key: "compoundV2",
    logoURI: "https://cdn.furucombo.app/assets/img/token/COMP.svg",
    description: "",
    tags: [],
    chains: [1]
  },
  compoundV3: {
    name: "Compound V3",
    key: "compoundV3",
    logoURI: "https://cdn.furucombo.app/assets/img/token/COMP.svg",
    description: "",
    tags: [],
    chains: [1, 42161]
  },
  convex: {
    name: "Convex",
    key: "convex",
    logoURI: "https://cdn.furucombo.app/assets/img/token/CVX.png",
    description: "",
    tags: [],
    chains: [1]
  },
  curve: {
    name: "Curve",
    key: "curve",
    logoURI: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.png?v=025",
    description: "",
    tags: [],
    chains: [1]
  },
  flux: {
    name: "Flux Finance",
    key: "flux",
    logoURI: "https://icons.llamao.fi/icons/protocols/flux-finance",
    description: "",
    tags: [],
    chains: [1]
  },
  idleJunior: {
    name: "Idle Junior",
    key: "idleJunior",
    logoURI: "https://icons.llamao.fi/icons/protocols/idle",
    description: "",
    tags: [],
    chains: [1, 10]
  },
  idleSenior: {
    name: "Idle Senior",
    key: "idleSenior",
    logoURI: "https://icons.llamao.fi/icons/protocols/idle",
    description: "",
    tags: [],
    chains: [1, 10]
  },
  origin: {
    name: "Origin",
    key: "origin",
    logoURI: "https://icons.llamao.fi/icons/protocols/origin-defi",
    description: "",
    tags: [],
    chains: [1]
  },
  stargate: {
    name: "Stargate",
    key: "stargate",
    logoURI: "https://icons.llamao.fi/icons/protocols/stargate",
    description: "",
    tags: [],
    chains: [1]
  },
  yearn: {
    name: "Yearn",
    key: "yearn",
    logoURI: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1, 42161]
  },
  yearnFactory: {
    name: "Yearn",
    key: "yearnFactory",
    logoURI: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png?v=024",
    description: "",
    tags: [],
    chains: [1]
  },
  pirex: {
    name: "Pirex",
    key: "pirex",
    logoURI: "https://icons.llamao.fi/icons/protocols/pirex?w=48&h=48",
    description: "",
    tags: [],
    chains: [1, 42161]
  },
  sommelier: {
    name: "Sommelier",
    key: "sommelier",
    logoURI: "https://icons.llamao.fi/icons/protocols/sommelier?w=48&h=48",
    description: "",
    tags: [],
    chains: [1]
  },
  velodrome: {
    name: "Velodrome",
    key: "velodrome",
    logoURI: "https://icons.llamao.fi/icons/protocols/velodrome?w=48&h=48",
    description: "",
    tags: [],
    chains: [10]
  },
  stader: {
    name: "Stader",
    key: "stader",
    logoURI: "https://icons.llamao.fi/icons/protocols/stader?w=48&h=48",
    description: "",
    tags: [],
    chains: [1]
  },
  kelpDao: {
    name: "KelpDao",
    key: "kelpDao",
    logoURI: "https://icons.llamao.fi/icons/protocols/kelp-dao?w=48&h=48",
    description: "",
    tags: [],
    chains: [1]
  },
  ion: {
    name: "ION",
    key: "ion",
    logoURI: "https://www.app.ionprotocol.io/logo.svg",
    description: "",
    tags: [],
    chains: [1]
  }
}
export default protocols;