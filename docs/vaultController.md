# VaultController


## Initialization


## Methods

### `proposeVaultAdapters(vaults: Address[], adapters: Address[], options: WriteOptions): Promise<Hash>`

Proposes new adapters for the given vaults. 

```ts
const txHash = vaultController.proposeVaultAdapters([],[]);
// txHash = "0xb315ebed9539d8f46c1b3f95a538ff38db9716f83fd37789d2458f2b6c812bb6"
```