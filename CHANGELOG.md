# Change history for platform-complete

# 2026-R1, Trillium

* Build with `--lazy` to leverage code-splitting. Refs FOLIO-4392.

# 2025-R1, Sunflower

* Bump `react-intl` to `^7`. Refs STRIPES-960 (and FOLIO-4262, FOLIO-4263).
* Bump `@folio/stripes` to `^10`. Refs STRIPES-961.
* Order user-visible apps alphabetically by title in `stripes.config.js`. Refs FOLIO-4245. 
* Include `@folio/stripes-build` as a direct-dep; `@folio/stripes-cli` as a dev-dep.
* Bump `react-intl` to `^7.1.9`. Refs FOLIO-4262.

# 2024-R2, Ramsons

# 2024-R1, Quesnelia

* Preserve console log on logout, at least for reference envs. Refs STCOR-761.
* Use secure tokens in cookies (RTR). Refs STCOR-671.

# 2023-R2, Poppy 

* Bump `react` to `^18.2.0`, `stripes` to `^9.0.0`, `stripes-cli` to `3.0.0`. Refs STRIPES-870.
* Bump `stripes-erm-components` to `^9.0.0`. Refs ERM-2989.
* Bump `react-intl` to `^6.4.4`. Refs STRIPES-868.
* Bump `react-titled` to `^2.0.0`.

# 2023-R1, Orchid

* Bump `stripes-erm-components` to `v8`. Refs ERM-2235 and ERM-2453
* Bump `stripes` to `8.0.0`. Refs STCOM-1067, STSMACOM-1067, STCOR-663, et al.
* Upgrade `react-redux` to `v8`. Refs STRIPES-834.
* Remove `swr`. Refs STCOR-611.
* Bump `stripes-authority-components` to `v2`. Refs UISAUTCOMP-37.
* Bump `stripes-cli` to `^2.7.0`. Refs STCLI-227.
* Bump `@rehooks/local-storage` to `^2.4.4`. Refs STRIPES-839.

# 2022-R3, Nolana

* Add additional shared third-party dependencies. Refs FOLIO-3602.
* Bump `stripes-erm-components` from `v6` to `v7`. Refs FOLIO-3620.
* Lock `enhanced-resolve` to `~5.10.0` to avoid the buggy 5.11.0 release. Refs STRWEB-61.
* Remove `enhanced-resolve` resolutions entry. Refs STRWEB-62.

## 1.0.0
* Add oai-pmh module. Refs MODOAIPMH-94.
* Add `ui-plugin-create-inventory-records` to the list of dependencies and modules.
* Update `react-intl` to `^5.7.0`, STRIPES-694
* Update `moment` to `~2.29.0`. STRIPES-702
* Update `redux` to `^4.0`, `react-redux` to `^7.2`. Refs STRIPES-721.
* Provide `react-titled`. Refs STCOR-503.
* Update `@folio/stripes-cli` to `v2`. Refs STRIPES-733.
* Provide `react-query` and `swr`. Refs STRIPES-735.
* Update `react` to `v171. Refs STRIPES-722.
* Provide `rxjs` `v6`. Refs STRIPES-723.
* Lock to `react-intl` `v5.21.1`. Refs FOLIO-3342.
* Lock to `colors` `1.4.0`. Refs FOLIO-3383.
* Unlock `react-intl` from `v5.21.0`. Refs FOLIO-3503.
