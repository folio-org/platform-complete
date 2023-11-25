# Change history for platform-complete

# 2023-R2, Poppy

* Bump `react` to `^18.2.0`, `stripes` to `^9.0.0`, `stripes-cli` to `3.0.0`. Refs STRIPES-870.
* Bump `stripes-erm-components` to `^9.0.0`. Refs ERM-2989.
* Bump `react-intl` to `^6.4.4`. Refs STRIPES-868.
* Bump `react-titled` to `^2.0.0`.
* Optional refresh token rotation. Refs FOLIO-3627.

## 2023-R1, Orchid

* Bump `stripes-erm-components` to `v8`. Refs ERM-2235 and ERM-2453.
* Bump `stripes` to `8.0.0`. Refs STCOM-1067, STSMACOM-1067, STCOR-663, et al.
* Bump `stripes-cli` to `2.7.0`. Refs STCLI-227.
* Upgrade `react-redux` to `v8`. Refs STRIPES-834.
* Remove `swr`. Refs STCOR-611`.
* Bump `stripes-authority-components` to `v2`. Refs UISAUTCOMP-37.
* Bump `@rehooks/local-storage` to `2.4.4`. Refs STRIPES-839.

## 2022-R3, Nolana

* Add additional shared third-party dependencies. Refs FOLIO-3602.
* Bump `stripes-erm-components` from `v6` to `v7`. Refs FOLIO-3620.
* Lock `enhanced-resolve` to `~5.10.0` to avoid the buggy 5.11.0 release. Refs STRWEB-61.
* Remove `enhanced-resolve` resolutions entry. Refs STRWEB-62.

## 2022-R2, Morning Glory
* `yarn install` now runs with `--ignore-scripts` by default, which prevents packages from running scripts after install. Only one case is currently needed for `stripes-core` to build icons, so a post-install step has been added to invoke that automatically. Refs STRIPES-726
