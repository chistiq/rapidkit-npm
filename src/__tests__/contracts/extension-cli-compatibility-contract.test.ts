import { describe, expect, it } from 'vitest';

import {
  buildExtensionCliCompatibilityContract,
  EXTENSION_CLI_COMPATIBILITY_SCHEMA_VERSION,
  WORKSPAI_COMPATIBILITY_CLI_VERSION,
} from '../../contracts/extension-cli-compatibility-contract.js';

describe('extension-cli-compatibility contract', () => {
  it('publishes the successor Workspai version as the extension verification floor', () => {
    const contract = buildExtensionCliCompatibilityContract();

    expect(contract.schemaVersion).toBe(EXTENSION_CLI_COMPATIBILITY_SCHEMA_VERSION);
    expect(contract.cli).toBe('workspai');
    expect(contract.minimumVerifiedCliVersion).toBe(WORKSPAI_COMPATIBILITY_CLI_VERSION);
    expect(contract.publishedContractSchemas.runtimeCommandSurface).toContain(
      'runtime-command-surface'
    );
    expect(contract.publishedContractSchemas.doctorRemediationPlan).toBe(
      'doctor-remediation-plan-v2'
    );
    expect(contract.publishedContractSchemas.artifactRemediationPlan).toBe(
      'artifact-remediation-plan-v1'
    );
    expect(contract.publishedContractSchemas.factFreshness).toBe('rapidkit-fact-freshness-v1');
    expect(contract.publishedContractSchemas.doctorFixResult).toBe('rapidkit-doctor-fix-result-v1');
  });
});
