// describe types of a propety as:
//    mystr: 'string',
//    mynum: 'number',
//    mybool: 'boolean',
const types = {
  hintchars: 'string',
  smoothscroll: 'boolean',
  complete: 'string',
};

// describe default values of a property
const defaults = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  complete: 'sbn',
};

const docs = {
  hintchars: 'hint characters on follow mode',
  smoothscroll: 'smooth scroll',
  complete: 'which are completed at the open page',
};

export { types, defaults, docs };
