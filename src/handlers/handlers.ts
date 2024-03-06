import {SelectType} from '../prompt/prompt.js';

import {createComponent} from './component/create.js';
import {createHook} from './hook/create.js';
import {createModule} from './module/create.js';

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
    case 'Module':
      return createModule(subcommand, name);
    default:
      return 'Invalid type';
  }
};
