/* eslint-disable max-len */

const fields = [
  [
    ['scroll.vertically?{"count":1}', 'Scroll down'],
    ['scroll.vertically?{"count":-1}', 'Scroll up'],
    ['scroll.horizonally?{"count":-1}', 'Scroll left'],
    ['scroll.horizonally?{"count":1}', 'Scroll right'],
    ['scroll.home', 'Scroll to leftmost'],
    ['scroll.end', 'Scroll to rightmost'],
    ['scroll.top', 'Scroll to top'],
    ['scroll.bottom', 'Scroll to bottom'],
    ['scroll.pages?{"count":-0.5}', 'Scroll up by half of screen'],
    ['scroll.pages?{"count":0.5}', 'Scroll down by half of screen'],
    ['scroll.pages?{"count":-1}', 'Scroll up by a screen'],
    ['scroll.pages?{"count":1}', 'Scroll down by a screen'],
  ], [
    ['mark.set.prefix', 'Set mark at current position'],
    ['mark.jump.prefix', 'Jump to the mark'],
  ], [
    ['tabs.close?{"select":"right"}', 'Close a tab'],
    ['tabs.close.right', 'Close all tabs to the right'],
    ['tabs.reopen', 'Reopen closed tab'],
    ['tabs.next', 'Select next tab'],
    ['tabs.prev', 'Select prev tab'],
    ['tabs.first', 'Select first tab'],
    ['tabs.last', 'Select last tab'],
    ['tabs.reload?{"cache":false}', 'Reload current tab'],
    ['tabs.reload?{"cache":true}', 'Reload with no caches'],
    ['tabs.pin.toggle', 'Toggle pinned state'],
    ['tabs.duplicate', 'Duplicate a tab'],
  ], [
    ['follow.start?{"newTab":false,"background":false}', 'Follow a link'],
    ['follow.start?{"newTab":true,"background":false}', 'Follow a link in new tab'],
    ['navigate.history.prev', 'Go back in histories'],
    ['navigate.history.next', 'Go forward in histories'],
    ['navigate.link.next', 'Open next link'],
    ['navigate.link.prev', 'Open previous link'],
    ['navigate.parent', 'Go to parent directory'],
    ['navigate.root', 'Go to root directory'],
    ['page.source', 'Open page source'],
    ['page.home?{"newTab":false}', 'Open start page to current tab'],
    ['page.home?{"newTab":true}', 'Open start page in new tab'],
    ['focus.input', 'Focus input'],
  ], [
    ['find.start', 'Start find mode'],
    ['find.next', 'Find next word'],
    ['find.prev', 'Find previous word'],
  ], [
    ['command.show', 'Open console'],
    ['command.show.open?{"alter":false}', 'Open URL'],
    ['command.show.open?{"alter":true}', 'Alter URL'],
    ['command.show.tabopen?{"alter":false}', 'Open URL in new tab'],
    ['command.show.tabopen?{"alter":true}', 'Alter URL in new tab'],
    ['command.show.winopen?{"alter":false}', 'Open URL in new window'],
    ['command.show.winopen?{"alter":true}', 'Alter URL in new window'],
    ['command.show.buffer', 'Open buffer command'],
    ['command.show.addbookmark?{"alter":true}', 'Open addbookmark command'],
  ], [
    ['addon.toggle.enabled', 'Enable or disable'],
    ['urls.yank', 'Copy current URL'],
    ['urls.paste?{"newTab":false}', 'Open clipboard\'s URL in current tab'],
    ['urls.paste?{"newTab":true}', 'Open clipboard\'s URL in new tab'],
    ['zoom.in', 'Zoom-in'],
    ['zoom.out', 'Zoom-out'],
    ['zoom.neutral', 'Reset zoom level'],
    ['repeat.last', 'Repeat last change'],
  ]
];

export default {
  fields,
};
