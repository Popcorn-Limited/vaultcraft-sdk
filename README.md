# Introducing VaultCraft
VaultCraft is your one-stop shop for building, deploying, and monetizing automated DeFi strategies, allowing seamless yield discovery across all of DeFi. Find the best yield opportunities for your assets, select a strategy, and deploy your automated yield strategy (vault) within minutes.


## Products of Vaultcraft
**Protocol:**  VaultCraft provides an open infrastructure on-chain to create and manage Vaults. Our modular approach allows users to mix and match protocols with verified strategies to create their unique ERC-4626-compliant vaults. All our contracts are open source and audited multiple times. Find them [here](https://github.com/Popcorn-Limited/contracts).<br/>

**VCI:** With our [app](https://vaultcraft.io/), anyone can access the protocol via an easy-to-use frontend.<br/>

**SDK:** If you prefer to integrate VaultCraft into your app you can easily do so with the SDK. The VaultCraft SDK provides everything you need, from analyzing yield opportunities to creating, deploying, and accessing vaults. Read more about the SDK in our [docs](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/main/docs/overview.md).


## VaultCrafts Smart Contracts
Each asset strategy contains two types of contracts: <br/>
**Vault:** A simple ERC-4626 implementation that allows the creator to add various types of fees and interact with other protocols via any ERC-4626 compliant Adapter. Fees and Adapter can be changed by the creator after a ragequit period.<br/>
**Strategy:** An immutable contract that wraps existing yield opportunities and can be enhanced with arbitrary modules to perform various tasks from compounding, leveraging, or simply forwarding rewards. 
> [!NOTE]  
> Currently we are using the word `Adapter` and `Strategy` interchangeably. In V2 we will simplify this wording to name every yield-earning contract a `Strategy`. 


## Security
Vaultcraft was audited by **Code4rena**, **BlockSec** and **0xRuhum** with active bounties on **Immunefi**.