import Enquirer from 'enquirer';

import {mapTypeToCase, validate} from '../utils/index.js';

export type SelectType =
  | 'Component'
  | 'Hook'
  | 'Sub-Module'
  | 'Service'
  | 'Util';

const selectType = async (): Promise<{type: SelectType}> => {
  const {type} = await Enquirer.prompt<{type: SelectType}>([
    {
      type: 'select',
      name: 'type',
      message: 'What do you want to create?',
      choices: ['Component', 'Hook', 'Sub-Module', 'Service', 'Util'],
    },
  ]);

  return {type};
};

const inputName = async (type: SelectType): Promise<{name: string}> => {
  const {name} = await Enquirer.prompt<{name: string}>([
    {
      type: 'input',
      name: 'name',
      message: `What is the name of the ${type} in ${mapTypeToCase(type)}?`,
      validate: input => {
        switch (type) {
          case 'Component':
            return validate.isPascalCase(input);
          case 'Sub-Module':
            return validate.isPascalCase(input);
          case 'Hook':
            return validate.isValidHookName(input);
          case 'Service':
            return validate.isCamelCase(input);
          case 'Util':
            return validate.isCamelCase(input);
          default:
            return 'Invalid type';
        }
      },
    },
  ]);

  return {name};
};

export const prompt = {
  selectType,
  inputName,
};
