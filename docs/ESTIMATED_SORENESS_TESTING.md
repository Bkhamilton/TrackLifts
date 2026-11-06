# Testing estimated soreness before merging

This branch preserves the soreness-indicator purpose and supersedes the workload-only approach in PR #58. It targets main directly; do not merge the old PR first.

```sh
git fetch origin
git switch --track origin/feature/physiology-soreness-estimate
npm ci
npm run test:soreness
npm run typecheck
npx expo start --clear
```

Use a compatible development build/device. If already on the branch, use `git pull --ff-only` instead of creating it again. Automated Node tests use `node:sqlite`; Node 24 is suitable. Avoid mixing this branch with uncommitted local changes. Prefer a test profile/database when exercising deletion or historical edits.

## Device scenarios

| Scenario | Expected behavior |
|---|---|
| Complete 3–4 sets of bodyweight pull-ups/push-ups, added weight 0 | Involved muscles have a nonzero current estimate and a higher next-48-hour forecast. No extra weight is required. |
| Complete assisted pull-ups/dips | Assistance is subtracted when historical mass is known. Work contributes even if mass is missing. Positive assistance input displays a minus prefix. |
| Same set count/reps, Easy vs Failure effort | Harder effort produces a higher estimate. Set effort before checking completion; uncheck to edit it. |
| Mark sets Warm-up | Much smaller contribution than otherwise identical working sets. |
| Leave effort unset | Estimate remains nonzero; assumptions/history-derived effort are disclosed. |
| Plank/Side Plank/Hollow Body Hold/Wall Sit | Counter shows seconds; positive duration is required for new completed holds; no hold 1RM is generated. |
| Check some sets, leave others unchecked, finish | Only checked sets enter saved history and soreness. Template can retain planned sets. |
| Inspect after saving, switching tabs, foregrounding | Indicator refreshes without restarting. |
| Inspect a workout 24–48 hours old | Delayed response is generally higher than immediately afterward. After 5–7 days the isolated bout is very small. Automated tests cover the clock without changing a device's date. |
| Repeat a movement after prior sessions | Familiarity moderately lowers the response; it never removes it. Missing effort may also be inferred from earlier comparable sets. |
| Edit/delete a saved session | Contributions update from surviving records; other users' workouts do not enter this profile. |
| Inspect an existing database | Legacy logs are retained, with unknown effort/mass labeled; old reps are not reinterpreted as hold seconds. |
| Inspect each group and breakdown | Main score, bar/color and exercise contribution total agree. Multi-muscle exercises do not multiply set counts. Unsupported muscles are gray. |
| Simulate save/read failure in a development test | Failed write rolls back; read failure shows unavailable with Retry instead of a recovered score. |
| Start a routine again | Previous effort/warm-up choices reset; no old effort is represented as newly reported. |

## Interpreting test results

The number is a model estimate, not a measured pain percentage. An immediate low value can precede tomorrow's soreness: inspect the forecast. At equal explicitly reported effort, changing assistance alone need not change soreness. Without effort/history, the app cannot know that an exercise was exceptionally easy or hard. Catalog mappings, exact coefficients and score bands remain assumptions awaiting validation against actual soreness reports.

Automated behavioral tests do not establish clinical accuracy. Device layout, touch controls, navigation, persistence across restarts and existing-user migration should be checked before merging. This implementation has not been run on a physical iOS/Android device during development.
