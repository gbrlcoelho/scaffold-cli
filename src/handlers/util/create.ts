import Enquirer from 'enquirer';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {join, resolve} from 'path';
import {
  createDirectoryIfNotExists,
  createFileWithContent,
} from '../../utils/fileSystemUtils.js';

export const createUtil = async (subcommand: string, utilName: string) => {
  createDirectoryIfNotExists(subcommand);

  const utilsDir = subcommand.endsWith('utils')
    ? subcommand
    : resolve(subcommand, 'utils');
  createDirectoryIfNotExists(utilsDir);

  const {utilType} = await Enquirer.prompt<{utilType: string}>({
    type: 'select',
    name: 'utilType',
    message: 'What type of utility do you want to create?',
    choices: [
      'Strings',
      'Objects',
      'Arrays',
      'Numbers',
      'Dates',
      'Validations',
      'Others',
    ],
  });

  const utilsIndexFilePath = join(utilsDir, 'index.ts');

  let utilsIndexFileContent = '';
  if (existsSync(utilsIndexFilePath)) {
    let fileContent = readFileSync(utilsIndexFilePath, 'utf-8');
    const exportStatement = `export * from './${utilType.toLowerCase()}';`;
    if (!fileContent.includes(exportStatement)) {
      utilsIndexFileContent = `${fileContent}\n${exportStatement}\n`;
    }
  } else {
    utilsIndexFileContent = `export * from './${utilType.toLowerCase()}';\n`;
  }

  writeFileSync(utilsIndexFilePath, utilsIndexFileContent);

  const utilTypePath = resolve(utilsDir, utilType.toLowerCase());
  createDirectoryIfNotExists(utilTypePath);

  const utilFilePath = join(utilTypePath, `${utilName}.ts`);
  createFileWithContent(utilFilePath, `export const ${utilName} = () => {};\n`);

  const testFolder = join(utilTypePath, '__tests__');
  createDirectoryIfNotExists(testFolder);

  const testFilePath = join(testFolder, `${utilName}.test.ts`);
  createFileWithContent(
    testFilePath,
    `import {${utilName}} from '../${utilName}';\n\ndescribe('${utilName}', () => {\n  it('should work', () => {\n    expect(${utilName}()).toBeUndefined();\n  });\n});\n`,
  );

  const interfaceName = `${utilType.charAt(0).toUpperCase() + utilType.slice(1)}Utils`;
  const typesFilePath = join(utilTypePath, 'types.ts');

  let typesFileContent = '';
  if (existsSync(typesFilePath)) {
    let fileContent = readFileSync(typesFilePath, 'utf-8');
    if (fileContent.includes(`interface ${interfaceName}`)) {
      const position = fileContent.lastIndexOf(`}`);
      typesFileContent = `${fileContent.slice(0, position)}  ${utilName}: () => void;\n}\n`;
    } else {
      typesFileContent = `${fileContent}\nexport interface ${interfaceName} {\n  ${utilName}: () => void;\n}\n`;
    }
  } else {
    typesFileContent = `export interface ${interfaceName} {\n  ${utilName}: () => void;\n}\n`;
  }

  writeFileSync(typesFilePath, typesFileContent);

  const objectName = `${utilType.toLowerCase()}Utils`;
  const indexFilePath = join(utilTypePath, 'index.ts');

  let indexFileContent = '';
  if (existsSync(indexFilePath)) {
    let fileContent = readFileSync(indexFilePath, 'utf-8');
    if (fileContent.includes(`const ${objectName}`)) {
      const importStatement = `import {${utilName}} from './${utilName}';`;
      if (!fileContent.includes(importStatement)) {
        fileContent = `${importStatement}\n${fileContent}`;
      }
      const position = fileContent.lastIndexOf(`}`);
      indexFileContent = `${fileContent.slice(0, position)}  ${utilName},\n};\n`;
    } else {
      indexFileContent = `import {${utilName}} from './${utilName}';\n\nexport const ${objectName}: ${interfaceName} = {\n  ${utilName},\n};\n`;
    }
  } else {
    indexFileContent = `import {${utilName}} from './${utilName}';\nimport {${interfaceName}} from './types';\n\nexport const ${objectName}: ${interfaceName} = {\n  ${utilName},\n};\n`;
  }

  writeFileSync(indexFilePath, indexFileContent);
};
