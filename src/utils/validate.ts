const isPascalCase = (input: string) => {
  return /^[A-Z][a-z]*(?:[A-Z][a-z]*)*$/.test(input);
};

const isValidHookName = (input: string) => {
  return /^use[A-Z][a-zA-Z]*$/.test(input);
};

const isCamelCase = (input: string) => {
  return /^[a-z][a-zA-Z]*$/.test(input);
};

export const validate = {
  isPascalCase,
  isValidHookName,
  isCamelCase,
};
