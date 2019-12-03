import Ajv from 'ajv';

export default class Validator<T> {
  constructor(
    private schema: object | boolean,
  ) {
  }

  validate(data: any): T {
    let ajv = new Ajv();
    let valid = ajv.validate(this.schema, data);
    if (!valid) {
      let message = ajv.errors!!
        .map(err => `'${err.dataPath}' of ${err.keyword} ${err.message}`)
        .join('; ');
      throw new TypeError(message);
    }
    return data as T;
  }
}
