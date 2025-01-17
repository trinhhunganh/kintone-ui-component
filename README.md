# kintone UI Component
[![npm version][npm-image]][npm-url]

## Usage

### For javascript
#### Step 1: Use below files  from './dist' folder
```
./dist/kintone-ui-component.min.js
./dist/kintone-ui-component.min.css
```
#### Step 2: Upload them to kintone following help site. ([Setting JavaScript Customization on kintone](https://help.kintone.com/en/k/user/js_customize.html)) Or add the copied URL.

### For React

#### Step 1: Create react project
```
$ npm install -g create-react-app
$ create-react-app my-customization
```
#### Step 2: Install kintone-ui-component
* Install kintone-ui-component from npm.
```
$ cd my-customization
$ npm install @kintone/kintone-ui-component
```
* If you don't want to install kintone-ui-component from npm, you can follow below steps to install it.
```
$ git clone https://github.com/kintone/kintone-ui-component.git
$ cd my-customization
$ npm link ../kintone-ui-component
```

## Document
[kintone UI Component](https://kintone.github.io/kintone-ui-component)

## How to build

### Requirement
```
* Node.js
* Git
```

```
$ git clone https://github.com/kintone/kintone-ui-component.git
$ cd kintone-ui-component
$ npm install
$ npm run build
```
#### Output
```
./dist/kintone-ui-component.min.js
./dist/kintone-ui-component.min.css
./dist/esm
```

## License
MIT License

## Copyright
Copyright(c) Cybozu, Inc.


[npm-image]: https://img.shields.io/npm/v/@kintone/kintone-ui-component.svg
[npm-url]: https://npmjs.org/package/@kintone/kintone-ui-component
