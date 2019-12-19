const fs = require('fs'),
  yargs = require('yargs'),
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
      description: h.description || 'TODO'
    }));
  }).reduce((a, b) => a.concat(b), []);
}

function genPath(elem, t) {
  if (!elem.request) return;
  const pathName = `/${elem.request.url.raw.split('/').slice(1).join('/').split('?')[0]}`;
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
}

function recursive(elem, t) {
  if (elem.item && Array.isArray(elem.item))
    for (let i = 0; i < elem.item.length; i++) {
      if (elem.name && tags.indexOf(elem.name) < 0) tags.push(elem.name);
      recursive(elem.item[i], [...t, elem.name].filter(f => !!f));
    }
  else if (elem.request) genPath(elem, t);
}

async function docrester(opt) {
  const file = JSON.parse(fs.readFileSync(opt._[0], 'utf8'));
  recursive(file, []);
  const main = {
    info: {
      version: opt.version || '1.0.0',
      title: file.info.name,
      description: 'TODO: Add Description',
      contact: opt.contact || ''
    },
    host: opt.domain || 'example.com',
    basePath: opt.base || '/',
    securityDefinitions: {
      auth: {
        type: 'basic'
      }
    },
    schemes: opt.scheme || ['http', 'https'],
    swagger: '2.0',
    consumes,
    produces,
    tags,
    paths
  };
  fs.writeFileSync(`${__dirname}/${opt.o}`, JSON.stringify(main, null, 4), { encoding: 'utf8' });
  console.log(`Swagger JSON stored at ${__dirname}/${opt.o}`);
}

function parseArguments() {
  return yargs
    .option('output', { description: 'file output', alias: 'o', type: 'string' })
    .option('format', { description: 'json or yaml', alias: 'f', type: 'string' })
    .option('version', { description: 'version of the document', alias: 'vv', type: 'string' })
    .option('contact', { description: 'contact info', alias: 'c', type: 'string' })
    .help().alias('help', 'h').argv;
}

async function main() {
  await docrester(parseArguments());
}

main();
