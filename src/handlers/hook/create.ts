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

  const typesFile = join(hooksDir, 'types.ts');
  const interfaceName = name.charAt(0).toUpperCase() + name.slice(1) + 'Params';
  const typesContent = `export interface ${interfaceName} {}\n\n`;

  appendToFile(typesFile, typesContent);

  const hookFile = join(hooksDir, `${name}.ts`);
  const hookContent = `import {useState} from 'react';\n\nexport const ${name} = () => {\n  const [count, setCount] = useState(0)\n  return {count};\n};\n`;

  createFileWithContent(hookFile, hookContent);

  const testsDir = join(hooksDir, '__tests__');
  createDirectoryIfNotExists(testsDir);

  const testFile = join(testsDir, `${name}.test.ts`);

  const testContent = `import {renderHook} from '@Modernization/test/test-utils';\n\nimport {${name}} from '../${name}';\n\ndescribe('${name}', () => {\n  it('should render', () => {\n    const {result} = renderHook(() => ${name}());\n    expect(result.current).toBeUndefined();\n  });\n});\n`;

  createFileWithContent(testFile, testContent);

  return console.log(`Hook ${name} created successfully`);
};
