# From Code to Shared Understanding

> [!NOTE]
> Historical RapidKit architecture documentation retained for compatibility.
> Current Workspace Intelligence architecture is maintained in
> [Workspai](https://www.workspai.dev/). See the [migration guide](./MIGRATING_TO_WORKSPAI.md).

How RapidKit transforms projects and repositories into workspace intelligence for developers, CI, and AI agents.

This Mermaid diagram is kept in the internal documentation because GitHub renders it correctly. The main npm README uses a PNG version of the same diagram so it remains visible on npm package pages.

```mermaid
flowchart TB

    Code["Code & Repositories"]
    Projects["Projects"]
    Workspace["Workspace"]

    Code --> Projects
    Projects --> Workspace

    subgraph Intelligence["Workspace Intelligence"]
        Model["Workspace Model"]
        Context["Agent Context"]
        Impact["Impact Analysis"]
        Verify["Verification"]
        Evidence["Evidence & Gates"]
    end

    Workspace --> Model
    Workspace --> Context
    Workspace --> Impact
    Workspace --> Verify
    Workspace --> Evidence

    Model --> Dev["Developers"]
    Model --> CI["CI"]
    Model --> Agents["AI Agents"]

    Context --> Agents

    Impact --> Dev
    Impact --> CI

    Verify --> CI
    Verify --> Agents
    Evidence --> Dev
    Evidence --> CI
    Evidence --> Agents
```
