import * as PropertyDefs from '../../shared//property-defs';

const mustNumber = (v: any): number => {
  let num = Number(v);
  if (isNaN(num)) {
    throw new Error('Not number: ' + v);
  }
  return num;
};

const parseSetOption = (
  args: string,
): any[] => {
  let [key, value]: any[] = args.split('=');
  if (value === undefined) {
    value = !key.startsWith('no');
    key = value ? key : key.slice(2);
  }
  let def = PropertyDefs.defs.find(d => d.name === key);
  if (!def) {
    throw new Error('Unknown property: ' + key);
  }
  if (def.type === 'boolean' && typeof value !== 'boolean' ||
       def.type !== 'boolean' && typeof value === 'boolean') {
    throw new Error('Invalid argument: ' + args);
  }

  switch (def.type) {
  case 'string': return [key, value];
  case 'number': return [key, mustNumber(value)];
  case 'boolean': return [key, value];
  }
  throw new Error('Unknown property type: ' + def.type);
};

export { parseSetOption };
