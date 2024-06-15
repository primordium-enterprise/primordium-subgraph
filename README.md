# primordium-subgraph
Subgraph for the Primordium business enterprise smart contracts.

## Setup
This project uses pnpm for managing packages.
```bash
pnpm install
```

To generate the subgraph ABI schemas:
```bash
pnpm codegen
```

The subgraph manifest can be generated using the mustache template file `subgraph.template.yaml` and a network config JSON file from the [`./config`](./config) directory. Use the `prepare:[network]` script for the network to generate the manifest for.

## Run Locally

To run locally:
1. Start an anvil instance at port 8545 and deploy the contracts
    > **NOTE:** *When starting a fresh anvil instance to index, you will need to delete the "./data" folder before starting the graph-node.*
2. Start the graph node locally using docker:

    ```bash
    pnpm graph-node
    ```


3. Deploy the anvil subgraph template to the graph node (the below command creates the proper subgraph.yaml manifest with the mustache template and additionally creates the subgraph on the local Graph Node prior to deploying):

    ```bash
    pnpm deploy:local
    ```

More info on local deployment [here](https://thegraph.academy/developers/local-development/).
