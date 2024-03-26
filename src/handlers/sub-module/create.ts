import Enquirer from 'enquirer';

import {join} from 'path';

import {
  appendToFile,
  createDirectoryIfNotExists,
  createFileWithContent,
  findDirectories,
} from '../../utils/fileSystemUtils.js';

export async function createSubModule(subcommand: string, name: string) {
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
    message: 'Select a module to create the sub-module in:',
    choices: directories,
  });

  const selectedDirectory = directory;

  const indexFile = join(modulePath, selectedDirectory, 'index.ts');
  const exportStatement = `export * from './${name}';\n`;
  appendToFile(indexFile, exportStatement);

  const subModuleDirectory = join(modulePath, selectedDirectory, name);
  createDirectoryIfNotExists(subModuleDirectory);

  const subModuleDirectoryIndex = join(subModuleDirectory, 'index.ts');
  createFileWithContent(
    subModuleDirectoryIndex,
    "export * from './screens';\nexport * from './translations';\n",
  );

  const screensDirectory = join(subModuleDirectory, 'screens');
  createDirectoryIfNotExists(screensDirectory);

  const screensIndex = join(screensDirectory, 'index.ts');
  createFileWithContent(screensIndex, `export * from './${name}Screen';\n`);

  const firstScreenDirectory = join(screensDirectory, `${name}Screen`);
  createDirectoryIfNotExists(firstScreenDirectory);

  const firstScreenTestDirectory = join(firstScreenDirectory, '__tests__');

  createDirectoryIfNotExists(firstScreenTestDirectory);

  const firstScreenTestFile = join(
    firstScreenTestDirectory,
    `${name}Screen.test.tsx`,
  );

  createFileWithContent(
    firstScreenTestFile,
    `import React from 'react';\nimport {render} from '@Modernization/test/test-utils';\n\nimport {${name}Screen} from '../${name}Screen';\n\ndescribe('${name}Screen', () => {\n  it('should render the screen', () => {\n    render(<${name}Screen />);\n  });\n});\n`,
  );

  const firstScreenFile = join(firstScreenDirectory, `${name}Screen.tsx`);
  createFileWithContent(
    firstScreenFile,
    `import React from 'react';\n\nexport const ${name}Screen = () => {\n  return <></>;\n};\n`,
  );

  const firstScreenIndex = join(firstScreenDirectory, 'index.ts');
  createFileWithContent(firstScreenIndex, `export * from './${name}Screen';\n`);

  const translationsDirectory = join(subModuleDirectory, 'translations');
  createDirectoryIfNotExists(translationsDirectory);

  const translationContent = `{\n  "${name}Screen": {}\n}`;

  const en = join(translationsDirectory, 'en.json');
  createFileWithContent(en, translationContent);

  const es = join(translationsDirectory, 'es.json');
  createFileWithContent(es, translationContent);

  const pt_BR = join(translationsDirectory, 'pt-BR.json');
  createFileWithContent(pt_BR, translationContent);

  const indexTranslations = join(translationsDirectory, 'index.ts');
  createFileWithContent(
    indexTranslations,
    `import i18n from 'i18next';\n\nimport ${name}EN from './en.json';\nimport ${name}ES from './es.json';\nimport ${name}PT_BR from './pt-BR.json';\n\nconst translations_EN = {\n  ${name}Module: {\n    ...${name}EN,\n  },\n};\n\nconst translations_ES = {\n  ${name}Module: {\n    ...${name}ES,\n  },\n};\n\nconst translations_PT_BR = {\n  ${name}Module: {\n    ...${name}PT_BR,\n  },\n};\n\nexport const loadTranslation${name} = () => {\n  i18n.addResourceBundle('en', 'translation', translations_EN, true, true);\n  i18n.addResourceBundle('es', 'translation', translations_ES, true, true);\n  i18n.addResourceBundle(\n    'pt-BR',\n    'translation',\n    translations_PT_BR,\n    true,\n    true,\n  );\n};\n`,
  );

  const storeRootDirectory = join(subModuleDirectory, 'store');
  createDirectoryIfNotExists(storeRootDirectory);

  const indexStoreRoot = join(storeRootDirectory, 'index.ts');
  createFileWithContent(indexStoreRoot, `export * from './${name}Store';\n`);

  const storeDirectory = join(subModuleDirectory, 'store', `${name}Store`);
  createDirectoryIfNotExists(storeDirectory);

  const indexStore = join(storeDirectory, 'index.ts');
  createFileWithContent(indexStore, `export * from './${name}Store';\n`);

  const typesStore = join(storeDirectory, 'types.ts');
  createFileWithContent(typesStore, `export interface Use${name}Store {}\n`);

  const store = join(storeDirectory, `${name}Store.ts`);

  createFileWithContent(
    store,
    `import {create} from 'zustand';\n\nimport {Use${name}Store} from './types';\n\nexport const use${name}Store = create<Use${name}Store>(() => ({}));\n\n// SERVICES => Methods to interact with the store state\nexport const use${name}Services = () => {\n  return {};\n};\n\n// STATES => Every state should have a hook to access it\nexport const use${name}State = () => {\n  return {};\n};\n`,
  );

  const analyticsDirectory = join(subModuleDirectory, 'analytics');
  createDirectoryIfNotExists(analyticsDirectory);

  const indexAnalytics = join(analyticsDirectory, 'index.ts');
  createFileWithContent(
    indexAnalytics,
    `export * from './constants';\nexport * from './log${name}';\n`,
  );

  const constantsAnalytics = join(analyticsDirectory, 'constants.ts');

  createFileWithContent(
    constantsAnalytics,
    `// Enums representing log event names\nexport const enum LOG {\n  EVENT_NAME = 'event_name',\n}\n\n// Names of the screens that will be used in the useScreenView hook\nexport const enum SCREEN {\n  SCREEN_NAME = 'screen_name',\n}\n`,
  );

  const analyticsTypes = join(analyticsDirectory, 'types.ts');

  createFileWithContent(
    analyticsTypes,
    `export interface Log${name}Params {}\n\nexport interface LogInterface {}\n`,
  );

  const logAnalytics = join(analyticsDirectory, `log${name}.ts`);

  createFileWithContent(
    logAnalytics,
    `import {LOG} from './constants';\nimport {Log${name}Params, LogInterface} from './types';\n\nexport const log${name} = (params: Log${name}Params) => {\n  // import from the sdk\n  // analytics.logEvent<LogInterface>(LOG.EVENT_NAME, {});\n};\n`,
  );

  const analyticsTestDirectory = join(analyticsDirectory, '__tests__');

  createDirectoryIfNotExists(analyticsTestDirectory);

  const logAnalyticsTest = join(analyticsTestDirectory, `log${name}.test.ts`);

  createFileWithContent(
    logAnalyticsTest,
    `import {log${name}} from '../log${name}';\n\ndescribe('log${name}', () => {\n  it('should log the event', () => {\n    // test\n  });\n});\n`,
  );

  console.log(`Sub-Module ${name} created in ${subModuleDirectory}`);
}
