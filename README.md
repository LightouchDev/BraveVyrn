# BraveVyrn

> Someday, Vyrn learned magic and became a very helpful companion.

**PS: It's not recommended using this program due to [EULA](#disclaimer).**

<!-- [![Travis Build Status](https://travis-ci.org/LightouchDev/BraveVyrn.svg?branch=master)](https://travis-ci.org/LightouchDev/BraveVyrn) -->
[![CircleCI](https://circleci.com/gh/LightouchDev/BraveVyrn.svg?style=shield)](https://circleci.com/gh/LightouchDev/BraveVyrn) [![AppVeyor Build status](https://ci.appveyor.com/api/projects/status/y697va7p5m024ulh?svg=true)](https://ci.appveyor.com/project/MiauLightouch/bravevyrn) [![Bitrise Build Status](https://www.bitrise.io/app/29e9934c359b832e/status.svg?token=uHWH5DZG81fhed1QwDZ1pg&branch=master)](https://www.bitrise.io/app/29e9934c359b832e) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/LightouchDev/BraveVyrn/blob/master/LICENSE)

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[Download here](https://github.com/LightouchDev/BraveVyrn/releases)

## Disclaimer

quote from official EULA:

![EULA](eula.png)

## Feature

* **Keep clean**: BraveVyrn doesn't modify any game content. actually, it's as same as browser version of GBF.
  * only inject css to hide scrollbar
  * only hook ajax response to fetch info
  * only hook socket event to fetch raid info
* **Performance**: It's dedicated and no game throttling. (fight won't stop at current turn when program inactive.)
* **Work safe**: There's no different with regular Chromium.

## Problem

BraveVyrn is still in **alpha** stage:

* There's a big [BraveVyrn 1.0 Roadmap](https://github.com/LightouchDev/BraveVyrn/issues/1) pending, no new feature request is allowed.

## Supported Platform

* Mobage Account
* DMM Account (experimental, but recommended)*

\* Other than Mobage account login would make game loading faster, because even hidden mobage sidebar, it still cause very heavily performance drop when page loading, but this issue affected Mobage accounts only.

## Hotkey

* DevTools:
  * OSX: `Command + Alt + I`
  * Windows/Linux: `F12`
* Hide Sub Menu: `H`

## Thanks to

* Software framework: [muon](https://github.com/brave/muon)
* Front-end framework: [Vue.js](https://vuejs.org/)
* Icon framework: [Font Awesome 5](https://fontawesome.com)
* Localization support: [vue-i18n](https://github.com/kazupon/vue-i18n)
* Boilerplate: [electron-vue](https://github.com/SimulatedGREG/electron-vue)

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn dev

# build electron application for production
yarn build

# run unit & end-to-end tests
yarn test

# lint all JS/Vue component files in `src/`
yarn lint

```

## License

It's [MIT](https://github.com/LightouchDev/BraveVyrn/blob/master/LICENSE) literally, but [DBAD](https://github.com/philsturgeon/dbad) in mind.
