import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('npm publish contract', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  ) as {
    bin?: Record<string, string>;
    description?: string;
    files?: string[];
    keywords?: string[];
    repository?: {
      url?: string;
    };
    scripts?: Record<string, string>;
  };

  function isPublishedByFiles(assetPath: string): boolean {
    return (packageJson.files ?? []).some((entry) => {
      if (entry === assetPath) {
        return true;
      }
      return assetPath.startsWith(`${entry.replace(/\/$/, '')}/`);
    });
  }

  const enterpriseSmokeScript = 'scripts/enterprise-package-smoke.mjs';
  const enterprisePrepackScript = 'scripts/prepack-enterprise.mjs';

  it('publishes the canonical rapidkit bin and an explicit npm alias', () => {
    expect(packageJson.bin?.rapidkit).toBe('dist/index.js');
    expect(packageJson.bin?.['rapidkit-npm']).toBe('dist/index.js');
  });

  it('positions the package as a legacy compatibility bridge to Workspai', () => {
    expect(packageJson.description).toBe(
      'Legacy RapidKit npm compatibility CLI for existing users and migration to Workspai. New projects should use the workspai package.'
    );
    expect(packageJson.description?.length).toBeLessThanOrEqual(160);
    expect(packageJson.keywords).toEqual(
      expect.arrayContaining(['workspace-intelligence', 'governance', 'workspai'])
    );
  });

  it('builds and verifies dist before npm pack or publish', () => {
    expect(packageJson.scripts?.prepack).toBe(`node ${enterprisePrepackScript}`);
    expect(packageJson.scripts?.['smoke:enterprise-package']).toBe(`node ${enterpriseSmokeScript}`);

    const prepack = fs.readFileSync(path.join(process.cwd(), enterprisePrepackScript), 'utf8');
    expect(prepack).toContain("node_modules', 'tsup', 'dist', 'cli-default.js'");
    expect(prepack).toContain('scripts/prepare-mock-embeddings.mjs');
    expect(prepack).toContain('scripts/verify-package-cli.mjs');
    expect(prepack).toContain(enterpriseSmokeScript);

    const smoke = fs.readFileSync(path.join(process.cwd(), enterpriseSmokeScript), 'utf8');
    expect(smoke).toContain('REQUIRED_PACKAGE_FILES');
    expect(smoke).toContain('assertPackageFilesPolicy(missingRequired)');
    expect(smoke).toContain('ignored generated asset');
  });

  it('ships and runs a Windows CLI resolution guard on install', () => {
    expect(packageJson.files).toContain('scripts/check-cli-resolution.cjs');
    expect(packageJson.scripts?.postinstall).toBe('node scripts/check-cli-resolution.cjs');
  });

  it('publishes enterprise-critical runtime assets used by create and AI surfaces', () => {
    for (const assetPath of [
      'templates/kits/fastapi-standard/README.md.j2',
      'templates/kits/fastapi-standard/env.example.j2',
      'templates/kits/fastapi-ddd/README.md.j2',
      'templates/kits/fastapi-ddd/env.example.j2',
      'templates/kits/nestjs-standard/package.json.j2',
      'templates/kits/nestjs-standard/env.example.j2',
      'data/modules-embeddings.json',
      enterpriseSmokeScript,
      enterprisePrepackScript,
    ]) {
      expect(fs.existsSync(path.join(process.cwd(), assetPath)), assetPath).toBe(true);
      expect(isPublishedByFiles(assetPath), assetPath).toBe(true);
    }
  });

  it('runs enterprise package smoke in CI and release gates', () => {
    const ciWorkflow = fs.readFileSync(
      path.join(process.cwd(), '.github/workflows/ci.yml'),
      'utf8'
    );
    const releaseWorkflow = fs.readFileSync(
      path.join(process.cwd(), '.github/workflows/release-npm-manual.yml'),
      'utf8'
    );
    const securityWorkflow = fs.readFileSync(
      path.join(process.cwd(), '.github/workflows/security.yml'),
      'utf8'
    );

    expect(ciWorkflow).toContain('npm run smoke:enterprise-package');
    expect(releaseWorkflow).toContain('npm run smoke:enterprise-package');
    expect(releaseWorkflow).toContain('npm run test:prepare-embeddings');
    expect(securityWorkflow).toContain('npm audit --audit-level=high');
  });

  it('publishes migration guidance and validates any npm README image assets', () => {
    const readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
    const rawImageUrls = [
      ...readme.matchAll(/!\[[^\]]+\]\((https:\/\/raw\.githubusercontent\.com\/[^)]+)\)/g),
    ].map((match) => match[1]);

    expect(readme).toContain('`rapidkit` is the legacy npm compatibility package');
    expect(readme).toContain('https://github.com/chistiq/workspai');
    expect(readme).toContain('docs/MIGRATING_TO_WORKSPAI.md');
    expect(isPublishedByFiles('docs/MIGRATING_TO_WORKSPAI.md')).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), 'docs/MIGRATING_TO_WORKSPAI.md'))).toBe(true);
    expect(packageJson.repository?.url).toBe('git+https://github.com/chistiq/rapidkit-npm.git');
    expect(packageJson.author).toBe('Chistiq');
    expect(packageJson.homepage).toBe('https://www.getrapidkit.com/');
    expect(packageJson.bugs?.url).toBe('https://github.com/chistiq/rapidkit-npm/issues');

    for (const imageUrl of rawImageUrls) {
      const pathname = new URL(imageUrl).pathname;
      const match = pathname.match(/^\/chistiq\/rapidkit-npm\/main\/(.+)$/);
      expect(match, imageUrl).not.toBeNull();

      const encodedAssetPath = match?.[1] ?? '';
      expect(encodedAssetPath, imageUrl).toContain('%20');
      const assetPath = decodeURIComponent(encodedAssetPath);

      expect(fs.existsSync(path.join(process.cwd(), assetPath)), assetPath).toBe(true);
      expect(isPublishedByFiles(assetPath), assetPath).toBe(true);
    }
  });

  it('publishes local documentation linked from the npm README', () => {
    const readme = fs.readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');
    const localDocLinks = [...readme.matchAll(/\[[^\]]+\]\((docs\/[^)#]+)(?:#[^)]+)?\)/g)].map(
      (match) => match[1]
    );

    expect(localDocLinks.length).toBeGreaterThan(5);

    for (const link of localDocLinks) {
      expect(fs.existsSync(path.join(process.cwd(), link)), link).toBe(true);
      expect(isPublishedByFiles(link), link).toBe(true);
    }
  });
});
