import {SelectType} from '../prompt/prompt.js';

import {createComponent} from './component/create.js';
import {createHook} from './hook/create.js';
import {createSdkService} from './sdk-service/create.js';
import {createSubModule} from './sub-module/create.js';

export const handlers = (
  subcommand: string,
  type: SelectType,
  name: string,
) => {
  switch (type) {
    case 'Component':
      return createComponent(subcommand, name);
    case 'Hook':
      return createHook(subcommand, name);
    case 'Sub-Module':
      return createSubModule(subcommand, name);
    case 'Service':
      return createSdkService(subcommand, name);
    default:
      return 'Invalid type';
  }
};
