import { getPublishedContractVersions } from './published-contract-versions.js';

export const EXTENSION_CLI_COMPATIBILITY_SCHEMA_VERSION = 'rapidkit-extension-cli-compatibility.v1';

export type ExtensionCliCompatibilityContract = {
  schemaVersion: typeof EXTENSION_CLI_COMPATIBILITY_SCHEMA_VERSION;
  /** Successor npm CLI package this extension release was verified against. */
  cli: 'workspai';
  /** Semver floor for the linked successor `workspai` CLI. */
  minimumVerifiedCliVersion: string;
  /** Schema versions bundled with this extension release (from npm contract generator). */
  publishedContractSchemas: ReturnType<typeof getPublishedContractVersions>;
};

export const WORKSPAI_COMPATIBILITY_CLI_VERSION = '0.43.1';

export function buildExtensionCliCompatibilityContract(): ExtensionCliCompatibilityContract {
  return {
    schemaVersion: EXTENSION_CLI_COMPATIBILITY_SCHEMA_VERSION,
    cli: 'workspai',
    minimumVerifiedCliVersion: WORKSPAI_COMPATIBILITY_CLI_VERSION,
    publishedContractSchemas: getPublishedContractVersions(),
  };
}
