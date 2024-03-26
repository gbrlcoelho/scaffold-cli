import {join} from 'node:path';

import {
  appendToFile,
  createDirectoryIfNotExists,
  createFileWithContent,
} from '../../utils/index.js';

export const createComponent = (subcommand: string, name: string) => {
  createDirectoryIfNotExists(subcommand);

  const componentsDir = subcommand.includes('components')
    ? subcommand
    : join(subcommand, 'components');
  createDirectoryIfNotExists(componentsDir);
  const componentDir = join(componentsDir, name);

  createDirectoryIfNotExists(componentDir);

  const indexFile = join(componentDir, 'index.ts');
  createFileWithContent(indexFile, '');

  const componentFile = join(componentDir, `${name}.tsx`);
  const componentContent = `import React from 'react';\n\nimport {${name}Props} from './types';\n\nexport const ${name} = ({}: ${name}Props) => {\n  return <></>;\n};\n`;
  createFileWithContent(componentFile, componentContent);

  const typesFile = join(componentDir, 'types.ts');
  const typesContent = `export interface ${name}Props {}\n`;
  createFileWithContent(typesFile, typesContent);

  const stylesFile = join(componentDir, 'styles.ts');
  createFileWithContent(stylesFile, '');

  const testsDir = join(componentDir, '__tests__');
  createDirectoryIfNotExists(testsDir);

  const testFile = join(testsDir, `${name}.test.tsx`);
  const testContent = `import React from 'react';\n\nimport {render} from '@Modernization/test/test-utils';\n\nimport {${name}} from '../${name}';\n\ndescribe('${name}', () => {\n  it('should render', () => {\n    const {toJSON} = render(<${name} />);\n    expect(toJSON()).toMatchSnapshot();\n  });\n});\n`;
  createFileWithContent(testFile, testContent);

  const exportStatement = `export {${name}} from './${name}';\n`;
  appendToFile(indexFile, exportStatement);

  const componentsIndexFile = join(componentsDir, 'index.ts');
  createFileWithContent(componentsIndexFile, '');

  const componentsExportStatement = `export * from './${name}';\n`;
  appendToFile(componentsIndexFile, componentsExportStatement);

  return console.log(`Component ${name} created successfully`);
};
