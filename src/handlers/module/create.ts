import Enquirer from 'enquirer';

import {join} from 'path';

import {
  appendToFile,
  createDirectoryIfNotExists,
  createFileWithContent,
  findDirectories,
} from '../../utils/fileSystemUtils.js';

export async function createModule(subcommand: string, name: string) {
  let modulePath = join(process.cwd(), subcommand);
  if (!modulePath.includes('modules')) {
    modulePath = join(modulePath, 'modules');
  }

  createDirectoryIfNotExists(modulePath);

  const directories = findDirectories(modulePath);

  if (directories.length === 0) {
    console.error(`The path "${subcommand}" does not contain any directories.`);
    return;
  }

  const {directory} = await Enquirer.prompt<{
    directory: string;
  }>({
    type: 'select',
    name: 'directory',
    message: 'Select a directory to create the module in:',
    choices: directories,
  });

  const selectedDirectory = directory;

  const indexFile = join(modulePath, selectedDirectory, 'index.ts');
  const exportStatement = `export * from './${name}';\n`;
  appendToFile(indexFile, exportStatement);

  const moduleDirectory = join(modulePath, selectedDirectory, name);
  createDirectoryIfNotExists(moduleDirectory);

  const moduleDirectoryIndex = join(moduleDirectory, 'index.ts');
  createFileWithContent(
    moduleDirectoryIndex,
    "export * from './screens';\nexport * from './translations';\n",
  );

  const screensDirectory = join(moduleDirectory, 'screens');
  createDirectoryIfNotExists(screensDirectory);

  const screensIndex = join(screensDirectory, 'index.ts');
  createFileWithContent(screensIndex, `export * from './${name}Screen';\n`);

  const firstScreenDirectory = join(screensDirectory, `${name}Screen`);
  createDirectoryIfNotExists(firstScreenDirectory);

  const firstScreenFile = join(firstScreenDirectory, `${name}Screen.tsx`);
  createFileWithContent(
    firstScreenFile,
    `import React from 'react';\n\nexport const ${name}Screen = () => {\n  return <></>;\n};\n`,
  );

  const firstScreenIndex = join(firstScreenDirectory, 'index.ts');
  createFileWithContent(firstScreenIndex, `export * from './${name}Screen';\n`);

  const translationsDirectory = join(moduleDirectory, 'translations');
  createDirectoryIfNotExists(translationsDirectory);

  const en = join(translationsDirectory, 'en.json');
  createFileWithContent(en, '{}');

  const es = join(translationsDirectory, 'es.json');
  createFileWithContent(es, '{}');

  const pt_BR = join(translationsDirectory, 'pt-BR.json');
  createFileWithContent(pt_BR, '{}');

  const indexTranslations = join(translationsDirectory, 'index.ts');
  createFileWithContent(
    indexTranslations,
    `import i18n from 'i18next';\n\nimport ${name}EN from './en.json';\nimport ${name}ES from './es.json';\nimport ${name}PT_BR from './pt-BR.json';\n\nconst translations_EN = {\n  ${name}: {\n    ...${name}EN,\n  },\n};\n\nconst translations_ES = {\n  ${name}: {\n    ...${name}ES,\n  },\n};\n\nconst translations_PT_BR = {\n  ${name}: {\n    ...${name}PT_BR,\n  },\n};\n\nexport const loadTranslation${name} = () => {\n  i18n.addResourceBundle('en', 'translation', translations_EN, true, true);\n  i18n.addResourceBundle('es', 'translation', translations_ES, true, true);\n  i18n.addResourceBundle(\n    'pt-BR',\n    'translation',\n    translations_PT_BR,\n   true,\n   true\n);\n};\n`,
  );

  console.log(`Module ${name} created in ${moduleDirectory}`);
}
