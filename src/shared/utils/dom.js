const isContentEditable = (element) => {
  return element.hasAttribute('contenteditable') && (
    element.getAttribute('contenteditable').toLowerCase() === 'true' ||
    element.getAttribute('contenteditable').toLowerCase() === ''
  );
};

export { isContentEditable };
