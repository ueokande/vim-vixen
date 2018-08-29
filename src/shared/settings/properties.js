// describe types of a propety as:
//    mystr: 'string',
//    mynum: 'number',
//    mybool: 'boolean',
const types = {
  hintchars: 'string',
  smoothscroll: 'boolean',
  adjacenttab: 'boolean',
  complete: 'string',
};

// describe default values of a property
const defaults = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  adjacenttab: true,
  complete: 'sbn',
};

const docs = {
  hintchars: 'hint characters on follow mode',
  smoothscroll: 'smooth scroll',
  adjacenttab: 'open adjacent tabs',
  complete: 'which are completed at the open page',
};

export { types, defaults, docs };
