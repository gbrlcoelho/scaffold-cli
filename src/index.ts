#!/usr/bin/env node
import {Command} from 'commander';
import figlet from 'figlet';

import {handlers} from './handlers/handlers.js';
import {prompt} from './prompt/prompt.js';

export const CLILayer = () => {
  console.log(figlet.textSync('Scaffold CLI', {horizontalLayout: 'full'}));

  const program = new Command();

  program
    .name('modernization-cli')
    .version('0.0.1')
    .description('CLI to scaffold components, sub-modules, and hooks');

  program
    .command('create')
    .argument('<subcommand>', 'path to create a component, sub-module, or hook')
    .action(async subcommand => {
      const {type} = await prompt.selectType();

      const {name} = await prompt.inputName(type);

      handlers(subcommand, type, name);
    });

  return program.parse();
};
