#!/bin/sh

GREP=grep
if grep --version | grep -- '-FreeBSD' >/dev/null; then
  if [ ! -x /usr/local/bin/grep ]; then
    echo 'GNU grep not found' >&2
    exit 1
  fi
  # use GNU grep instead of BSD grep which does not support PCRE
  GREP=/usr/local/bin/grep
fi

MANIFEST="manifest.json"

version=$(jq -r '.version' $MANIFEST)

icons=$(jq -r '.icons[]' $MANIFEST)
content_scripts=$(jq -r '.content_scripts[].js[]' $MANIFEST)
background_scripts=$(jq -r '.background.scripts[]' $MANIFEST)
web_accessible_resources=$(jq -r '.web_accessible_resources[]' $MANIFEST)
options_ui=$(jq -r '.options_ui.page' $MANIFEST)
options_scripts=""
for html in $options_ui; do
  scripts=$(${GREP} -Po "(?<=src=['\"])[^'\"]*" "$html")
  for js in $scripts; do
    options_scripts="$options_scripts $(dirname $html)/$js"
  done
done

zip ${version}.zip $MANIFEST $icons $content_scripts $background_scripts $web_accessible_resources $options_ui $options_scripts
