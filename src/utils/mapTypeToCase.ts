import {SelectType} from '../prompt/prompt.js';

export const mapTypeToCase = (type: SelectType) => {
  switch (type) {
    case 'Component':
      return 'PascalCase';
    case 'Hook':
      return 'camelCase with use prefix';
    case 'Sub-Module':
      return 'PascalCase';
    case 'Service':
      return 'camelCase';
    case 'Util':
      return 'camelCase';
    default:
      return 'Invalid type';
  }
};
