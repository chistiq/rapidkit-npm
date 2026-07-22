import fs from 'fs';
import path from 'path';

type ExtensionCliCompatibility = {
  schemaVersion?: unknown;
  cli?: unknown;
  minimumVerifiedCliVersion?: unknown;
};

function readCompatibility(contractPath: string): ExtensionCliCompatibility | null {
  if (!fs.existsSync(contractPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(contractPath, 'utf8')) as ExtensionCliCompatibility;
  } catch {
    return null;
  }
}

export function resolveCompatibleExtensionContractsDir(): string | null {
  const npmContractsDir = path.resolve(process.cwd(), 'contracts');
  const extensionRoot = process.env.RAPIDKIT_VSCODE_REPO_PATH?.trim()
    ? path.resolve(process.env.RAPIDKIT_VSCODE_REPO_PATH.trim())
    : path.resolve(process.cwd(), '..', 'rapidkit-vscode');
  const extensionContractsDir = path.join(extensionRoot, 'contracts');

  const npmCompatibility = readCompatibility(
    path.join(npmContractsDir, 'extension-cli-compatibility.v1.json')
  );
  const extensionCompatibility = readCompatibility(
    path.join(extensionContractsDir, 'extension-cli-compatibility.v1.json')
  );

  if (!npmCompatibility || !extensionCompatibility) return null;

  const sameGeneration =
    npmCompatibility.schemaVersion === extensionCompatibility.schemaVersion &&
    npmCompatibility.cli === extensionCompatibility.cli &&
    npmCompatibility.minimumVerifiedCliVersion === extensionCompatibility.minimumVerifiedCliVersion;

  return sameGeneration ? extensionContractsDir : null;
}
