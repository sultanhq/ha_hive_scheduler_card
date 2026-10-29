# HACS default catalogue submission

The card is already installable as a custom **Dashboard** repository. Inclusion in the default catalogue is a separate review by the HACS maintainers; it is not a PR to the HACS integration itself.

## Already verified

- Repository `sultanhq/ha_hive_scheduler_card` is public, active, has a description and topics, and has issues enabled.
- GitHub recognises the MIT licence; the original attribution remains in the source, documentation and compiled card.
- README includes usage instructions and an image.
- `hacs.json` explicitly selects `hive-scheduler-card.js`, and the compiled file is committed under `dist/`.
- HACS validation uses `category: plugin` with no ignored checks. In HACS’s UI this category is called **Dashboard**.
- The owner confirmed hardware acceptance and successful custom HACS installation on 29 October 2026.

## Publish the first release

1. Merge the dependency update and wait for CI and HACS validation to pass on `main`.
2. Create and push an unused version tag from that passing `main` commit. At preparation time this repository has no tags or releases, so `v1.0.0` is available and matches the package version.
3. The existing release workflow builds the card and creates a **draft** release with `hive-scheduler-card.js` attached. Wait for that workflow to finish successfully.
4. Review the draft’s target commit, asset and release notes, then publish it as a normal release. HACS default inclusion requires a published GitHub release, not only a tag, draft or prerelease.

The instructions above do not create a tag or publish a release. The release workflow remains draft-only.

## Submit the catalogue PR

1. Using the repository owner’s personal GitHub account, fork [hacs/default](https://github.com/hacs/default).
2. Create a new branch from its current `master` branch.
3. Edit the JSON array in [`plugin`](https://github.com/hacs/default/blob/master/plugin), inserting this entry in alphabetical order:

   ```json
   "sultanhq/ha_hive_scheduler_card"
   ```

4. Open a PR back to `hacs/default:master`. Enable maintainer edits and complete the current PR template truthfully, including the public release and passing HACS validation links. Use a title such as **Add Hive Scheduler Card**.
5. Address validation failures and maintainer feedback. Inclusion is complete only after the HACS maintainers merge the PR; the repository is then picked up by a scheduled scan.

If the repository is explicitly limited to particular countries, HACS also requires the applicable `country` value in the released `hacs.json`. Hassfest and Home Assistant brand submissions apply to integrations, not this dashboard card.

The HACS documentation says new catalogue submissions can take months to be reviewed. Custom-repository installation continues to work while a submission waits.

Official references: [default inclusion](https://www.hacs.xyz/docs/publish/include/), [dashboard plugin structure](https://www.hacs.xyz/docs/publish/plugin/), [general manifest requirements](https://www.hacs.xyz/docs/publish/start/).
