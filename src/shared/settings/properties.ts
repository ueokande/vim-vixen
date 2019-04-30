// describe types of a propety as:
//    mystr: 'string',
//    mynum: 'number',
//    mybool: 'boolean',
const types: { [key: string]: string } = {
  hintchars: 'string',
  smoothscroll: 'boolean',
  complete: 'string',
};

// describe default values of a property
const defaults: { [key: string]: string | number | boolean } = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  complete: 'sbh',
};

const docs: { [key: string]: string } = {
  hintchars: 'hint characters on follow mode',
  smoothscroll: 'smooth scroll',
  complete: 'which are completed at the open page',
};

export { types, defaults, docs };
