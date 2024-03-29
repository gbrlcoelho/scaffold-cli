# Scaffold CLI

This is a CLI tool to scaffold components, modules, and hooks for React applications.

## Installation

You can use the CLI without installing it by using `npx`:

```sh
npx @gbrlcoelho/scaffold-cli create <path>
```

Where `<path>` is the path to the folder where you want to scaffold the component, module, or hook.

## Usage

### Create a Component

To create a component, select 'Component' when prompted for the type. The CLI will create a new directory with the name you provide, and it will generate the necessary files including `index.ts`, `<name>.tsx`, `types.ts`, `styles.ts`, and a `__tests__` directory with a `<name>.test.tsx` file.

### Create a Hook

To create a hook, select 'Hook' when prompted for the type. The CLI will append an export statement to the `index.ts` file in the hooks directory and create a new hook file with the name you provide. It will also create a `__tests__` directory with a `<name>.test.ts` file.

### Create a Submodule

To create a module, select 'Module' when prompted for the type. The CLI will prompt you to select a directory to create the module in. It will then create a new directory with the name you provide, and generate the necessary files including `index.ts`, a `screens` directory with a screen file and a `translations` directory.

### Util

To create a util, select 'Util' when prompted for the type. The CLI will prompt you to select the type of util you want to create (e.g. `strings`, `objects`, `arrays`, `numbers`, `dates`, `validations`, `others`, etc.). It will then create a new file with the name you provide, type, and the necessary imports.

### Service

To create a service, select 'Service' when prompted for the type. The CLI will prompt you to select or create a directory to create the service in (e.g. `auth`, `products`, `users`, etc.). It will prompt again to select the type of service you want to create (e.g. `cart` or `wishlist` for the `products` service) or create a new one. It will then create a new file with the name you provide, type, and the necessary imports.
