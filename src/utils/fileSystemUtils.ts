import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync,
} from 'node:fs';

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
