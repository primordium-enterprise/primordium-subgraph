# primordium-dao-subgraph
Subgraph for the PrimordiumDAO smart contracts.

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
2. Start the graph node locally using docker:

    ```bash
    docker-compose up
    ```

3. Deploy the anvil subgraph template to the graph node (the below command includes `pnpm prepare:anvil` to create the proper subgraph.yaml manifest and `pnpm create:local` to create the subgraph on the local Graph Node prior to deploying):

    ```bash
    pnpm deploy:local
    ```

More info on local deployment [here](https://thegraph.academy/developers/local-development/).
