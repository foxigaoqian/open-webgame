import fs from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';

const schemaUrl = new URL('../schema/open-webgame.schema.json', import.meta.url);
const schema = JSON.parse(fs.readFileSync(schemaUrl, 'utf8'));

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  allowUnionTypes: false,
});

const validate = ajv.compile(schema);

const formatInstancePath = (instancePath) => {
  if (!instancePath) return 'config';
  return `config${instancePath.replaceAll('/', '.')}`;
};

export function validateConfigSchema(config) {
  const valid = validate(config);
  if (valid) return [];

  return (validate.errors || []).map((error) => {
    const location = formatInstancePath(error.instancePath || '');
    if (error.keyword === 'additionalProperties') {
      return `${location} contains unknown property "${error.params.additionalProperty}".`;
    }
    if (error.keyword === 'required') {
      return `${location} is missing required property "${error.params.missingProperty}".`;
    }
    return `${location} ${error.message || 'failed schema validation'}.`;
  });
}
