import {join} from 'path';

import {
  appendToFile,
  createDirectoryIfNotExists,
  createFileWithContent,
} from '../../utils/index.js';

export const createHook = (subcommand: string, name: string) => {
  createDirectoryIfNotExists(subcommand);

  const hooksDir = subcommand.includes('hooks')
    ? subcommand
    : join(subcommand, 'hooks');
  createDirectoryIfNotExists(hooksDir);

  const indexFile = join(hooksDir, 'index.ts');

  const exportStatement = `export * from './${name}';\n`;

  appendToFile(indexFile, exportStatement);

  const hookFile = join(hooksDir, `${name}.ts`);
  const hookContent = `import React from 'react';\n\nexport const ${name} = () => {\n  return;\n};\n`;

  createFileWithContent(hookFile, hookContent);

  const testsDir = join(hooksDir, '__tests__');
  createDirectoryIfNotExists(testsDir);

  const testFile = join(testsDir, `${name}.test.ts`);

  const testContent = `import {renderHook} from '@testing-library/react-native';\n\nimport {${name}} from '../${name}';\n\nit('should render', () => {\n  const {result} = renderHook(() => ${name}());\n  expect(result.current).toBeUndefined();\n});\n`;

  createFileWithContent(testFile, testContent);

  return console.log(`Hook ${name} created successfully`);
};
