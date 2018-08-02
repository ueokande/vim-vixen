// describe types of a propety as:
//    mystr: 'string',
//    mynum: 'number',
//    mybool: 'boolean',
const types = {
  hintchars: 'string',
  smoothscroll: 'boolean',
  adjacenttab: 'boolean',
};

// describe default values of a property
const defaults = {
  hintchars: 'abcdefghijklmnopqrstuvwxyz',
  smoothscroll: false,
  adjacenttab: true,
};

const docs = {
  hintchars: 'hint characters on follow mode',
  smoothscroll: 'smooth scroll',
  adjacenttab: 'open adjacent tabs',
};

export { types, defaults, docs };
