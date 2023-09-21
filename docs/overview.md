# VaultCraft SDK
## Introducing VaultCraft
VaultCraft is your one-stop shop for building, deploying, and monetizing automated DeFi strategies, allowing seamless yield discovery across all of DeFi. Find the best yield opportunities for your assets, select a strategy, and deploy your automated yield strategy (vault) within minutes.

## SDK
The VaultCraft SDK is written in Typescript and utilizes viem for all contract interactions. 
The SDK is split into multiple classes which can be instantiated individually depending on their use case.

## Classes
**YieldOptions:** The YieldOptions class allows you to access yield data for different protocols on multiple chains. Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/yieldOptions.md).<br/>
**Vault:** The Vault class wraps a provided ERC-4626 compliant vault and allows access to all necessary view and write functions easily. Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/vault.md).<br/>
**VaultController:** Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/vault.md).<br/>
**VaultFactory:** (Coming Soon) This class will make deploying vaults and strategies easy.<br/>
**VaultRegistry:** (Coming Soon) The VaultRegistry class will provide metadata for all deployed vaults.<br/>

## Installation
1. Install the `vaultcraft-sdk` package.
2. Follow the initializion instructions in the class specific docs.