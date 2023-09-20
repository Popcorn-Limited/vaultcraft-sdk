# VaultCraft SDK
The VaultCraft SDK is written in Typescript and utilizes viem for all contract interactions.
Its split in multiple classes which can be instantiated individually depending on their use case.

## Classes
**YieldOptions:** The YieldOptions class allows you to access yield data for different protocols on multiple chains. Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/yieldOptions.md).<br/>
**Vault:** The Vault class wraps a provided ERC-4626 compliant vault and allows access to all necessary view and write functions in an easy manner. Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/vault.md).<br/>
**VaultController:** Read more about it [here](https://github.com/Popcorn-Limited/vaultcraft-sdk/blob/docs/docs/vault.md).<br/>
**VaultFactory:** (Coming Soon) This class will make deploying vaults and strategies easy.<br/>
**VaultRegistry:** (Coming Soon) The VaultRegistry class will provide metadata for all deployed vaults.<br/>

## Installation
1. Install the `vaultcraft-sdk` package.
2. Follow the initializion instructions in the class specific docs.