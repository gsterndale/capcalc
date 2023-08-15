# Capcalc

## An equity financing scenario analysis tool

Users can use this tool to evaluate the impact of different deal mechanics on each share class across a number of investment scenarios.

## Assumptions

-

## Developer setup

### Tooling

This project makes use of:

- [TypeScript](https://www.typescriptlang.org) to provide static typing for [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
- [Node.js](https://nodejs.org) JavaScript runtime environment
- [Jest](https://jestjs.io) for unit testing
- [asdf](https://asdf-vm.com) for tool version management
- [direnv](https://direnv.net) to load ENV variables based on the current directory

### Install

Clone this repo and run the following:

```bash
asdf install
npm install
```

## Running the web app locally

```bash
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000/) in your browser.

### Test

```bash
npm run test
```

### Deploy

The web app is automatically deployed on GitHub pages using a GitHub Workflow that triggered by pushing to the "main" branch. Workflow configuration details can be found in `.github/workflows/build-and-deploy.yml`.

### Secrets

Secrets are stored as ENV variables and should **not** be committed to this repository. An `.envrc.example` file _can_ be committed, and can be used as a template and copied.

```bash
cp .envrc.example .envrc
```

Using your text editor, edit it, changing the proper values.

```bash
open .envrc
```

Any time you update `.envrc` you'll need to tell `direnv` that the changes you made are safe.

```bash
direnv allow .
```
