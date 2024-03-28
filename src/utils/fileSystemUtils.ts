import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';
import {join} from 'node:path';

export const createDirectoryIfNotExists = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, {recursive: true});
  }
};

export const createFileWithContent = (filePath: string, content: string) => {
  if (!existsSync(filePath)) {
    writeFileSync(filePath, content, 'utf8');
  }
};

export const appendToFile = (filePath: string, content: string) => {
  appendFileSync(filePath, content, 'utf8');
};

export const findDirectories = (path: string) => {
  return readdirSync(path, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

export const getTemplateContent = (
  templatePath: string,
  replacements: Record<string, string>,
) => {
  let template = readFileSync(join(process.cwd(), templatePath), 'utf8');
  for (const placeholder in replacements) {
    const regex = new RegExp(`{{${placeholder}}}`, 'g');
    template = template.replace(regex, replacements[placeholder]);
  }
  return template;
};
