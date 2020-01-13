# Docrester  [![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Description

An utility to convert a Postman collection json (v2, v2.1) to Swagger JSON.

## ✅ Prerequisites

In order to work with this project, your local environment must have at least the following versions:

* NodeJS Version: 12.xx
* NPM Version: 6.12.0

## 📐 How to work with this project

```bash
$./docrester [options] <input_file>
```

### More config

Option |  | Description | Type
--- | --- | --- | ---
--version | --vv | Version of the document | boolean
--output | -o | Path for the output file | string (default: "swagger.json")
--domain | -d | Url for host domain | string
--base | -b | Base path | string
--env | -e | Environment variables file path | string
--contact | -c | Contact info | boolean
--help | -h | Show help | boolean

### Examples

Creates a swagger json based in the "./test_environment.json ./test.json" test.json file including the test_environment variables.
```bash
$docrester -o ./swagger.json -e
```           

## ⛽️ Review and Update Dependences

For review and update all npm dependences of this project you need install in global npm package "npm-check" npm module.

```bash
# Install and Run
$npm i -g npm-check
$npm-check
```

## Happy Code

Created with JavaScript, lot of ❤️ and a few ☕️

## This README.md file has been written keeping in mind

* [GitHub Markdown](https://guides.github.com/features/mastering-markdown/)
* [Emoji Cheat Sheet](https://www.webfx.com/tools/emoji-cheat-sheet/)