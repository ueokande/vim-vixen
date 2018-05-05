const url = (version) => {
  if (version) {
    return 'https://github.com/ueokande/vim-vixen/releases/tag/' + version;
  }
  return 'https://github.com/ueokande/vim-vixen/releases/';
};

export { url };
