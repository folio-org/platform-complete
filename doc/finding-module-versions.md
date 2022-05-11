# Finding what module versions are included in a flower release

It often happens that we need to know what versions of certain packages are compatible with a specific flower release. Typically, the question relates to both backend and UI modules making up and app. For example, if we want to run the LDP app on a Kiwi installation, we might need to know which `mod-ldp` and `ui-ldp` versions are compatible with the Kiwi release.

The process for determining this is as follows:

1. Look up https://wiki.folio.org/display/REL/Flower+Release+Names to discover what release the flower-name corresponds to -- in this case, "Kiwi" is R3 2021.
2. Look up the tags that have been registered for `platform-complete` at https://github.com/folio-org/platform-complete/tags to find the corresponding tag -- in this case one of those beginning `R3-2021`, and if your system is fully upgraded, `R3-2021-hotfix-2`
3. Look at the tree for this tag, in this case https://github.com/folio-org/platform-complete/tree/R3-2021-hotfix-2
4. Find the version of `mod-ldp` mentioned in the `install-extras.json` file at https://github.com/folio-org/platform-complete/blob/R3-2021-hotfix-2/install-extras.json -- in this case, 1.0.2.
5. Find the version of `ui-ldp` mentioned in the `package.json` file at https://github.com/folio-org/platform-complete/blob/R3-2021-hotfix-2/package.json -- in this case 1.5.0.

So Kiwi has v1.0.2 of `mod-ldp` and v1.5.0 of `ui-lpd`.

In accordance with standard semantic versioning behaviour, you can safely upgrade to any subsequent patch release of these minor releases. e.g. `mod-ldp` 1.0.3 when it comes out, `and ui-ldp` v.1.5.1 if that existed.

And you can upgrade to any subsequent minor release of those major releases provided you're happy to get new features. In this case that means any of the 1.6.x sequence of `ui-ldp` releases including the most recent (v1.6.2) release.

