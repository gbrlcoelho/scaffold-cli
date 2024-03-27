import Enquirer from 'enquirer';
import {join} from 'node:path';
import {
  appendToFile,
  createDirectoryIfNotExists,
  findDirectories,
} from '../../utils/fileSystemUtils.js';

export const createSdkService = async (
  servicesRootPath: string,
  serviceName: string,
) => {
  const servicesPath = ensureServicesPath(servicesRootPath);
  createDirectoryIfNotExists(servicesPath);

  const modules = getModules(servicesPath);
  const selectedModule = await selectOrCreateModule(modules, servicesPath);
  const modulePath = join(servicesPath, selectedModule);

  const subModules = getModules(modulePath);
  const selectedSubModule = await selectOrCreateModule(
    subModules,
    modulePath,
    serviceName,
  );
  const subModulePath = join(modulePath, selectedSubModule);

  createDirectoryIfNotExists(subModulePath);
};

const ensureServicesPath = (rootPath: string): string => {
  return rootPath.includes('services') ? rootPath : join(rootPath, 'services');
};

const getModules = (path: string): string[] => {
  return findDirectories(path).filter(
    directory => !['types', '__tests__'].includes(directory),
  );
};

const selectOrCreateModule = async (
  modules: string[],
  parentPath: string,
  serviceName?: string,
): Promise<string> => {
  if (modules.length === 0 || serviceName) {
    return await createNewModule(parentPath);
  }

  modules.push('Create new module');
  const {selectedModule} = await Enquirer.prompt<{selectedModule: string}>({
    type: 'select',
    name: 'selectedModule',
    message: 'Select a module or create a new one:',
    choices: modules,
  });

  return selectedModule === 'Create new module'
    ? await createNewModule(parentPath)
    : selectedModule;
};

const createNewModule = async (parentPath: string): Promise<string> => {
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
};
