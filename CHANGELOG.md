# Change history for platform-complete

## 4.0.0 (IN PROGRESS)
* `yarn install` now runs with `--ignore-scripts` by default, which prevents packages from running scripts after install. Only one case is currently needed for `stripes-core` to build icons, so a post-install step has been added to invoke that automatically.
* Upgrade `react-redux` to `v8`. Refs STRIPES-834.