import Enquirer from 'enquirer';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {
  appendToFile,
  createDirectoryIfNotExists,
  findDirectories,
} from '../../utils/fileSystemUtils.js';
import {capitalizeFirstLetter} from '../../utils/stringUtils.js';
const require = createRequire(import.meta.url);

delete require.cache[require.resolve('./templates/request.json')];
const template = require('./templates/request.json');

export const createSdkService = async (
  rootPath: string,
  serviceName: string,
) => {
  const servicesPath = ensureServicesPath(rootPath);
  createDirectoryIfNotExists(servicesPath);

  const modules = getModules(servicesPath);
  const selectedModule = await selectModule(modules, servicesPath);

  const modulePath = join(servicesPath, selectedModule);
  const subModules = getModules(modulePath);
  const selectedSubModule = await selectModule(subModules, modulePath);

  const indexModulePath = join(modulePath, 'index.ts');
  const exportStatement = `export * from './${selectedSubModule}';\n`;
  appendToFile(indexModulePath, exportStatement);

  const servicePath = join(modulePath, selectedSubModule, serviceName);
  createDirectoryIfNotExists(servicePath);

  const serviceIndexFile = join(modulePath, selectedSubModule, 'index.ts');
  const serviceExportStatement = `export * from './${serviceName}';\n`;
  appendToFile(serviceIndexFile, serviceExportStatement);

  const serviceFolderIndexFile = join(servicePath, 'index.ts');
  const serviceFolderExportStatement = `export * from './${serviceName}';\n`;
  appendToFile(serviceFolderIndexFile, serviceFolderExportStatement);

  const serviceFile = join(servicePath, `${serviceName}.ts`);

  const requestReplacements = {
    name: serviceName,
    errorClass: `${capitalizeFirstLetter(serviceName)}Error`,
  };

  const templateContent = template.request
    .replace(/{{name}}/g, requestReplacements.name)
    .replace(/{{errorClass}}/g, requestReplacements.errorClass)
    .replace(
      /{{nameUpperCase}}/g,
      capitalizeFirstLetter(requestReplacements.name),
    );

  appendToFile(serviceFile, templateContent);

  const errorFolder = join(servicePath, 'error');
  createDirectoryIfNotExists(errorFolder);

  const errorIndexFile = join(errorFolder, 'index.ts');
  const errorExportStatement = `export * from './error';\n`;

  appendToFile(errorIndexFile, errorExportStatement);

  const typesFile = join(errorFolder, 'types.ts');
  const typesContent = `export type ${capitalizeFirstLetter(serviceName)}ErrorType = 'unknown';\n`;

  appendToFile(typesFile, typesContent);

  const errorFile = join(errorFolder, 'error.ts');
  const errorContent = `import {${capitalizeFirstLetter(serviceName)}ErrorType} from './types';\n\nexport class ${capitalizeFirstLetter(serviceName)}Error extends Error {\n  type: ${capitalizeFirstLetter(serviceName)}ErrorType;\n\n  constructor(type: ${capitalizeFirstLetter(serviceName)}ErrorType) {\n    super();\n    this.type = type;\n  }\n}\n`;

  appendToFile(errorFile, errorContent);

  const middleFolder = join(servicePath, 'middle');
  createDirectoryIfNotExists(middleFolder);

  const middleIndexFile = join(middleFolder, 'index.ts');
  const middleExportStatement = `export * from './${serviceName}Middle';\nexport * from './types';\n`;

  appendToFile(middleIndexFile, middleExportStatement);

  const middleFile = join(middleFolder, `${serviceName}Middle.ts`);
  const middleContent = template.middle.replace(/{{name}}/g, serviceName);

  appendToFile(middleFile, middleContent);

  const middleTypes = join(middleFolder, 'types.ts');
  const middleTypesContent = `export interface MiddleResponse {}\n\nexport interface RequestParams {}\n`;

  appendToFile(middleTypes, middleTypesContent);

  const adapterFile = join(servicePath, `adapter.ts`);
  const adapterContent = template.adapter.replace(
    /{{name}}/g,
    capitalizeFirstLetter(serviceName),
  );

  appendToFile(adapterFile, adapterContent);

  const typesFileRoot = join(servicePath, `types.ts`);
  const typesContentRoot = `export interface ${capitalizeFirstLetter(serviceName)}Adapter {}\n`;

  appendToFile(typesFileRoot, typesContentRoot);

  console.log(
    `Service ${serviceName} created in ${selectedModule}/${selectedSubModule}`,
  );
};

const ensureServicesPath = (rootPath: string): string => {
  return rootPath.includes('services') ? rootPath : join(rootPath, 'services');
};

const getModules = (path: string): string[] => {
  return findDirectories(path).filter(
    directory => !['types', '__tests__'].includes(directory),
  );
};

const selectModule = async (
  modules: string[],
  parentPath: string,
): Promise<string> => {
  modules.push('Create new module');
  const {selectedModule} = await Enquirer.prompt<{selectedModule: string}>({
    type: 'select',
    name: 'selectedModule',
    message: 'Select a module or create a new one:',
    choices: modules,
  });

  if (selectedModule === 'Create new module') {
    const {newModule} = await Enquirer.prompt<{newModule: string}>({
      type: 'input',
      name: 'newModule',
      message: 'Enter the name of the new module:',
    });

    const newModulePath = join(parentPath, newModule);
    createDirectoryIfNotExists(newModulePath);

    const servicesIndexFile = join(parentPath, 'index.ts');
    const exportStatement = `export * from './${newModule}';\n`;
    appendToFile(servicesIndexFile, exportStatement);

    return newModule;
  }

  return selectedModule;
};
