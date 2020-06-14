# Contributing

## Getting your dev environment set up

You'll need the following:

- Node version 12. I recommend [nvm](https://github.com/nvm-sh/nvm) to switch between versions of Node.
- Yarn installed globally, you can `npm install -g yarn` once Node 12 is set up and activated.

## Cloning the repo and installing dependencies

```sh
$ git clone git@github.com:azcn2503/sct.git
$ cd sct
$ nvm use
$ yarn
```

## Running the dev environment

```sh
yarn dev
```

This will start up a webpack-dev-server backed Electron app, so will live-reload as you make changes.

This project is based on [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). You can find documentation about other supported commands for packaging, running in dist mode, etc. on their site.

## UI

All frontend code is using React. Some "internals" like the file monitor are also rendered using React since React lifecycle hooks make this scale trivially. App state is held in Redux where possible. A charting library has not yet been decided on.

## Database

Currently using PouchDB. Subject to change as I discover its capabilities/limitations.
