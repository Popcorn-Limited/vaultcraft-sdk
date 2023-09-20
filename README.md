# Introducing VaultCraft
VaultCraft is your on-stop shop to find and access yield across all of DeFi.
Find the best opportunities for your assets, select a strategy and create your automated asset strategy (vault) within minutes. 

## Products of Vaultcraft
**Protocol:**  VaultCraft provides an open infrastructure on-chain to create and manage Vaults. Our modular approach allows users to mix and match protocols with verified strategies to create their own unique ERC-4626 compliant vaults. All our contracts are open source and audited multiple times. Find them [here](https://github.com/Popcorn-Limited/contracts).<br/>

**VCI:** With our [app](https://vaultcraft.io/) anyone can access the protocol via an easy to use frontend. <br/>

**SDK:** If you prefer to integrate infrastructure in your own app we have this SDK for you. The SDK provides everything you need to analyze yield opportunities or to create and access your vaults. Read more about the SDK in our [docs](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/overview.md).

## VaultCrafts Smart Contracts
Each asset strategy contains two types of contracts: <br/>
**Vault:** A simple ERC-4626 implementation which allows the creator to add various types of fees and interact with other protocols via any ERC-4626 compliant Adapter. Fees and Adapter can be changed by the creator after a ragequit period.<br/>
**Strategy:** An immutable contract that wraps existing yield opportunities and can be enhanced with arbitrary modules to perform various tasks from compounding, leverage or simply forwarding rewards.

## Security
Vaultcraft was audited by Code4rena, BlockSec, and 0xRuhum with active bounties on Immunefi.