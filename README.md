# Scaffold CLI

This is a CLI tool to scaffold components, modules, and hooks for React applications.

## Installation

To install the CLI, clone the repository and install the dependencies using the following commands:

```sh
git clone https://github.com/gbrlcoelho/scaffold-cli
cd scaffold-cli
npm i
```

## Usage

First build the CLI using the following command inside the scaffold-cli directory:

```sh
npm run build
```

You can use the CLI by running the following command on the folder where you want to scaffold the component, module, or hook

```sh
node path/to/scaffold-cli/dist/app.js create <path>
```

Where `<path>` is the path to the folder where you want to scaffold the component, module, or hook.

### Create a Component

To create a component, when prompted for the type. The CLI will create a new directory with the name you provide, and it will generate the necessary files including `index.ts`, `<name>.tsx`, `types.ts`, `styles.ts`, and a `__tests__` directory with a `<name>.test.tsx` file.

### Create a Hook

To create a hook, select 'Hook' when prompted for the type. The CLI will append an export statement to the `index.ts` file in the hooks directory and create a new hook file with the name you provide. It will also create a `__tests__` directory with a `<name>.test.ts` file.

### Create a Module

To create a module, select 'Module' when prompted for the type. The CLI will prompt you to select a directory to create the module in. It will then create a new directory with the name you provide, and generate the necessary files including `index.ts`, a `screens` directory with a screen file and a `translations` directory.
