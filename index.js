const fs = require('fs'),
  yargs = require('yargs'),
  chalk = require('chalk'),
  defaultStatus = {
    produces: ['application/json'],
    consumes: ['application/json']
  };
let consumes = [], produces = [], tags = [], paths = {};

function matchType(type) {
  switch (type) {
    case 'text': return 'string';
    default: return 'string';
  }
}

function genParams(elem) {
  return [['header', 'header'], ['variable', 'path'], ['query', 'query']].map(s => {
    const arr = (s[0] !== 'header') ? elem.request.url[s[0]] : elem.request.header;
    return !arr || arr.lenght === 0 ? [] : arr.map(h => ({
      name: h.key,
      in: s[1],
      required: true,
      type: matchType(h.type),
      default: h.value || '',
      description: h.description || 'TODO'
    }));
  }).reduce((a, b) => a.concat(b), []);
}

function genPath(elem, t, opt) {
  if (!elem.request) return;
  const pathName = `${elem.request.url.raw.split('?')[0].replace(opt.domain, '')}`;
  if (!paths[pathName]) paths[pathName] = {};
  const path = {
    description: elem.request.description || 'TODO',
    summary: elem.name,
    tags: t,
    operationId: elem.name.trim(),
    deprecated: false,
    produces: defaultStatus.produces,
    parameters: genParams(elem)
  };
  paths[pathName][elem.request.method.toLowerCase()] = path;
  console.log(chalk.hex('#666')('Processing path ... '), chalk.hex('#00ff00')(`[${elem.request.method}]`), chalk.hex('#00d4ff')(`[${pathName}]`));
}

function recursive(elem, t, opt) {
  if (elem.item && Array.isArray(elem.item))
    for (let i = 0; i < elem.item.length; i++) {
      if (elem.name && tags.indexOf(elem.name) < 0) tags.push(elem.name);
      recursive(elem.item[i], [...t, elem.name].filter(f => !!f), opt);
    }
  else if (elem.request) genPath(elem, t, opt);
}

function getEnvironmentData(envPath) {
  return envPath ? readEnvFile(envPath) : null;
}

function readEnvFile(envPath) {
  console.info(); console.log(chalk.hex('#00d4ff')('Reading Environment File'), chalk.hex('#666')(`[${envPath}]`));
  return JSON.parse(fs.readFileSync(envPath, 'utf8')).values.filter(v => !!v.enabled);
}

async function docrester(opt) {
  if (opt.c) return console.info('Jesús R Peinado https://github.com/jesusr');
  if (opt.v) return console.info(require('./package.json').version);
  const env = getEnvironmentData(opt.e);
  console.info(); console.log(chalk.hex('#00d4ff')('Reading Collection File'), chalk.hex('#666')(`[${opt._[0]}]`));
  let file = fs.readFileSync(opt._[0], 'utf8');
  if (env) env.map(e => (file = file.replace(new RegExp(`{{${e.key}}}`, 'g'), e.value)));
  file = JSON.parse(file);
  recursive(file, [], opt);
  const main = {
    info: {
      version: opt.version || '1.0.0',
      title: file.info.name,
      description: 'Created by Docrester https://www.npmjs.com/package/docrester',
      contact: opt.contact || ''
    },
    host: opt.domain || 'example.com',
    basePath: opt.base || '/',
    securityDefinitions: { auth: { type: 'basic' } },
    schemes: opt.scheme || ['http', 'https'],
    swagger: '2.0', consumes, produces, tags, paths
  };
  fs.writeFileSync(`${__dirname}/${opt.o}`, JSON.stringify(main, null, 4), { encoding: 'utf8' });
  console.info(); console.info(chalk.hex('#00d4ff').underline(`Swagger JSON stored at ${__dirname}/${opt.o}`));
}

function parseArguments() {
  return yargs
    .usage('Usage: $0 ./docrester [options] <input_file>')
    .example('docrester -o ./swagger.json -e ./test_environment.json ./test.json', 'Creates a swagger json based in the test.json file including the test_environment variables.')
    .option('output', { description: 'path for the output file', alias: 'o', type: 'string' })
    .option('domain', { description: 'url for host domain ', alias: 'd', type: 'string' })
    .option('base', { description: 'base path ', alias: 'b', type: 'string' })
    .option('env', { description: 'environment variables file path', alias: 'e', type: 'string' })
    .option('version', { description: 'version of the document', alias: 'vv', type: 'boolean' })
    .option('contact', { description: 'contact info', alias: 'c', type: 'boolean' })
    .default('o', 'swagger.json').demandCommand(1)
    .help().alias('help', 'h').argv;
}

async function main() {
  await docrester(parseArguments());
}

main();