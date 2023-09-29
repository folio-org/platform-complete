# Change history for platform-complete

# 2023-R1 Orchid SP 6

* Pin `react-virtualized-auto-sizer` to `v1.0.7`, preserving CSS behavior of `<Pane>` Actions menus. Refs UISACQCOMP-160.

## 3.9.0 (IN PROGRESS)
* `yarn install` now runs with `--ignore-scripts` by default, which prevents packages from running scripts after install. Only one case is currently needed for `stripes-core` to build icons, so a post-install step has been added to invoke that automatically.