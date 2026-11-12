# React Native Cleanup Backlog

## Origin and scope

This backlog preserves the React Native Cleanup Reviewer's November 8, 2026
static audit and the findings reported in the conversation. Recorded here on
November 11, 2026. It is an implementation reference, not a new audit or approval
to begin fixes.

The audit identified **31 actionable findings: 8 P1, 22 P2, and 1 P3**, plus six
separate verification questions. Its main concerns were workout-data safety,
hook correctness, stale state, incorrect statistics, and history-dependent work.

The reviewer inspected routes/startup, all ten context providers, hooks,
database modules, schema/views/migrations, shared calculations, main screens and
modals, charts, native/web entry points, relevant tests/documentation, and
targeted Android configuration. This was not a line-by-line review of every
presentational component, asset, document, or manual test. Native linking,
builds, signing, release behavior, and device interactions were not verified.
Secrets, personal records, databases, generated files, and dependency bulk
traversal were excluded.

**No code was changed, tests run, bugs reproduced, or performance measured by
the audit.** Creating this document does not resolve or revalidate any finding.
All source paths and line ranges below describe the audited checkout and may
have moved or changed. Recheck current code before accepting an item as a defect
or implementing its suggested solution.

Historical dependency observations: Expo 58.0.23, React Native 0.88.1, React
19.3.0, SQLite 58.0.15, Victory Native 42.0.1, Skia 2.14.0, Reanimated 4.7.1,
and Worklets 0.13.0. Read current manifests/lockfile rather than assuming these
versions still apply.

## How to maintain this backlog

- Keep `RN-001` through `RN-031` stable. Do not renumber completed or rejected
  findings. Use `VERIFY-01` through `VERIFY-06` for the separate questions.
- All entries initially have status **Needs revalidation**. This means their
  evidence is inherited from the audit, not independently checked against the
  current checkout.
- Update status in the index when work begins. Use **Confirmed**, **In progress**,
  **Blocked**, **Implemented - verification pending**, **Verified**, **Not
  reproduced**, **Superseded**, or **Deferred**, as appropriate.
- Under the relevant entry, record dated revalidation evidence, decisions,
  implementation/commit/PR references, checks actually run and their outcomes,
  and remaining device checks. Explain rejected/superseded findings rather than
  deleting them.
- Do not mark an item Verified merely because code changed or typechecking
  passed. Its behavioral acceptance criteria must be satisfied; explicitly
  retain any outstanding native, upgrade, or profiling requirements.
- Use small, coherent fixes. Confirm actual prerequisites rather than assuming
  every earlier-numbered item is a dependency.
- Preserve the owner's design, offline behavior, database identity, historical
  records, and calculation semantics unless an intentional correction is agreed.
  Never clear user data to make a fix pass.
- Use synthetic fixtures and backed-up test copies for database/upgrade checks.
  Do not put personal workout data or secrets in this backlog.

Priority meanings: **P1** = crashes, data loss, severe blocking, or unsafe
persistence; **P2** = significant correctness or credible recurring/scaling
problems; **P3** = lower-impact actionable cleanup. Priority reflects the original
audit and may be revised with documented evidence.

Confidence below is the original reviewer's assessment. All acceptance scenarios
and profiling checks in this document are **not run** unless a later dated update
explicitly records otherwise.

## Finding index

| ID | Priority | Finding | Status |
| --- | --- | --- | --- |
| RN-001 | P1 | History changes hook order when records arrive | Implemented - verification pending |
| RN-002 | P1 | Starting another routine overwrites an active workout | Implemented - verification pending |
| RN-003 | P1 | Missing storage metadata authorizes database destruction | Needs revalidation |
| RN-004 | P1 | Legacy migrations discard custom definitions/mappings | Needs revalidation |
| RN-005 | P1 | Exercise deletion damages historical references | Implemented - verification pending |
| RN-006 | P1 | Profile drafts capture defaults and overwrite saved fields | Implemented - verification pending |
| RN-007 | P1 | Shared write lock covers only some writers | Needs revalidation |
| RN-008 | P1 | Data dereferences initially null workout frequency | Implemented - verification pending |
| RN-009 | P2 | Routine changes orphan sets and mishandle repetitions | Needs revalidation |
| RN-010 | P2 | Save/delete interfaces finish before persistence succeeds | Needs revalidation |
| RN-011 | P2 | Your Routines does not supply the selected edit target | Needs revalidation |
| RN-012 | P2 | Split UI uses stale snapshots and fabricated IDs | Needs revalidation |
| RN-013 | P2 | Rest days assume routine ID 1 | Needs revalidation |
| RN-014 | P2 | Split advancement lacks guards and consistent invalidation | Needs revalidation |
| RN-015 | P2 | Workout changes leave dashboard aggregates stale | Needs revalidation |
| RN-016 | P2 | Refresh APIs do not await work or reject stale results | Needs revalidation |
| RN-017 | P2 | Chart renderers ignore the selected metric | Needs revalidation |
| RN-018 | P2 | Analysis results are not associated with their request | Needs revalidation |
| RN-019 | P2 | Statistics view multiplies volume through a join | Needs revalidation |
| RN-020 | P2 | Best-set statistics combine different records | Needs revalidation |
| RN-021 | P2 | Calendar selection shifts historical dates | Needs revalidation |
| RN-022 | P2 | Date queries and labels use incompatible boundaries | Needs revalidation |
| RN-023 | P2 | Fresh installs can skip onboarding | Needs revalidation |
| RN-024 | P2 | Muscle-intensity drafts leak across cancellation/exercises | Needs revalidation |
| RN-025 | P2 | Exercise occurrences lack reliable identity | Needs revalidation |
| RN-026 | P2 | Accepted weight text fails calculation parsing | Needs revalidation |
| RN-027 | P2 | Timer updates the entire workout screen while blurred | Needs revalidation |
| RN-028 | P2 | Root hydration performs serial N+1 reads | Needs revalidation |
| RN-029 | P2 | Soreness refreshes replay full history under the write lock | Needs revalidation |
| RN-030 | P2 | Favorite graphs duplicate reads and eagerly mount charts | Needs revalidation |
| RN-031 | P3 | Anatomy diagram ignores app appearance preference | Needs revalidation |

## A. Crashes and data-safety hazards

### RN-001 - P1 - History changes hook order when records arrive

**Locations:** `components\History\HistoryInfo.tsx:55-70` (`HistoryInfo`);
caller `screens\history\HistoryScreen.tsx:20-31`.

**Evidence/impact:** The empty-history branch returns before `useState(false)`.
Loading records into an initially empty array calls an additional hook; deleting
the final workout removes it. Ordinary loading/deletion transitions can trigger
React's more/fewer-hooks error on iOS, Android, and web.

**Confidence:** High; direct hook-order violation.

**Suggested cleanup:** Declare all hooks before the early return. Preserve the
existing empty state and `SectionList`.

**Acceptance:** Mount empty, load records asynchronously, then delete the last
record without remounting. No hook error; grouping and empty-state appearance
remain unchanged. The audit expected lint to identify this, but did not run it.

**2026-11-11 revalidation and implementation — Implemented - verification pending**

- Confirmed against current source: `HistoryInfo` called `useState` after its
  empty return. Running the HEAD version through ESLint reproduced
  `react-hooks/rules-of-hooks` at the former line 70. This is static reproduction,
  not a claimed native crash reproduction.
- Moved the refreshing hook above the empty return; grouping, empty-state markup,
  keys, and `SectionList` remain unchanged. The refresh handler now awaits the
  provider's promise and clears its spinner in `finally` (coupled RN-008 refresh
  contract). No additional history/statistics semantics were changed.
- Checks: current `HistoryInfo` passes applicable lint; `npm run typecheck`
  passes. The shared bounded validation commands/results for this four-item batch
  are recorded below. No hook-transition component harness was introduced.
- Pending: on iOS, Android, and web, mount with no records, resolve an async read
  with records, delete the last record without remounting, and repeat. Confirm no
  hook error, identical grouping/empty appearance, and pull-to-refresh behavior.
  These interactive/device checks and independent reviewer approval were not run.

**Shared batch validation (2026-11-11; RN-001/RN-005/RN-006/RN-008 only)**

```powershell
node --test __tests__\reactNativeRemediation.test.cjs __tests__\muscleLoad.test.cjs
npm run typecheck
npx eslint components\History\HistoryInfo.tsx components\modals\ExerciseModal\ExerciseModal.tsx components\modals\AboutModal.tsx components\Profile\ProfileInsights\ProfileInsightsCard.tsx contexts\ExerciseContext.tsx contexts\UserContext.tsx contexts\WorkoutContext.tsx db\general\Exercises.js db\user\Profile.js db\data\WorkoutFrequency.js hooks\profile\useHookProfileInfo.ts hooks\profile\useHookData.ts screens\profile\ProfileInfoScreen.tsx screens\profile\DataScreen.tsx utils\workoutUtils.js __tests__\reactNativeRemediation.test.cjs
git --no-pager diff --check
```

- Tests: **31 passed, 0 failed**: 17 new behavioral regressions plus 14 existing
  muscle-load/persistence cases. Fixtures use in-memory `node:sqlite` with the
  real table/index creation functions, never a personal database. Expected
  injected read failures log errors; Node also prints experimental SQLite and
  typeless-ES-module warnings. No installs or dependency/config changes.
- Typecheck: passes. Affected-file ESLint: **1 pre-existing error, 5 pre-existing
  warnings**, with no added lint findings. The error is
  `react-hooks/set-state-in-effect` for `ExerciseModal`'s existing
  `setSelectedTab('Muscles')` on visibility. Warnings are unused `grayText` in
  `ProfileInsightsCard` and four existing unused favorite-modal bindings in
  `DataScreen`. Baselines were checked using
  `git show HEAD:<repository-relative-path> | npx eslint --stdin --stdin-filename <path>`;
  the HEAD conditional-hook error in `HistoryInfo` is fixed. Unrelated baseline
  lint issues were not suppressed or repaired.
- Final diff whitespace check passes. Production source diff and new SQL/tests
  were inspected. No commits, pushes, PRs, schema migrations, production services,
  database resets, or device builds. Existing `docs\README.md` edits and the
  untracked agent/backlog documents were preserved.
- Remaining shared limitation: no native/simulator/browser interaction session or
  mounted hook lifecycle harness was available/executed. SSR tests substitute
  native presentation only; they do not prove mounted effects or interactions.
  Parent is to request the single independent Cleanup Reviewer review only after
  all four implementations; the implementer has not invoked a reviewer.

### RN-002 - P1 - Starting another routine overwrites the active workout

**Locations:** `hooks\home\useHomeActions.ts:48-57` and
`hooks\home\useHookRoutines.ts:45-55` (`onStart`); consumers
`screens\home\HomeScreen.tsx:62-88` and
`components\modals\RoutineModal\RoutineModal.tsx:86-89`; state owner
`contexts\ActiveWorkoutContext.tsx:84-99`.

**Evidence/impact:** Both handlers call `setRoutine(routine)` before checking
`isActiveWorkout`. Starting B while A is active replaces A's exercises, entered
values, and completion flags, then redirects with A's original start time.

**Confidence:** High.

**Suggested cleanup:** Check active status before mutation; share the guard
between handlers. Preserve warning and navigation behavior.

**Acceptance:** Begin A, enter/complete sets, leave the screen, then attempt B
from Home and Your Routines. A's complete state and start time must survive.

**2026-11-12 implementation — Implemented - verification pending**

`ActiveWorkoutContext` now owns a guarded routine-selection method, and both
routine-start handlers use it. The existing active-workout alert, modal close,
and navigation behavior are preserved. Typecheck and lint passed; the Home and
Your Routines acceptance scenario still needs behavioral verification.

### RN-003 - P1 - Missing metadata authorizes destruction of an existing database

**Locations:** `api\startup.js:10-16,19-44,301-323`
(`setupDatabase`/`initializeDatabase`); `utils\debugTools.js:6-12`;
caller `hooks\home\useHomeActions.ts:59-94`.

**Evidence/impact:** `firstLaunch === null` invokes setup that drops workout,
routine, profile, and other tables without checking existing SQLite contents.
An existing database with absent/reset AsyncStorage metadata is treated as new.
Clear Data also relies on this coupling; its storage helper catches failure.

**Confidence:** High for the destructive branch; divergence frequency unknown.

**Suggested cleanup:** Establish database/schema state before destructive
initialization. Separate explicit confirmed reset from metadata recovery.
Propagate `clearAllStorage` failure instead of reporting success.

**Acceptance:** Remove only metadata from a backed-up synthetic populated
database; preserve all rows and IDs on startup. Separately verify confirmed
reset and failure reporting.

### RN-004 - P1 - Legacy migrations discard custom definitions and mappings

**Locations:** `api\startup.js:325-340,365-408` (V2 repopulation);
`api\migrateExercises.js:17-75,120-164`
(`migrateToNewExercises`/`recreateMusclesTable`); references in
`api\createTables.js:71-90,158-181`.

**Evidence/impact:** V2 drops/rebuilds Exercises from the catalog without
remapping persisted references; custom definitions disappear and old references
can become dangling or incorrect. V3 drops all ExerciseMuscles, restoring only
catalog matches, so custom/nonmatching exercises lose mappings. V3 has no
encompassing transaction. These paths remain reachable when migration flags are
absent.

**Confidence:** High.

**Suggested cleanup:** Preserve identities and update catalog definitions in
place. Explicitly preserve/remap custom mappings, including unmatched-muscle
policy. Make migrations atomic and mark completion after success. Do not
silently reinterpret historical maximum-table muscle IDs.

**Acceptance:** Upgrade backed-up synthetic legacy data with custom exercises,
routine/session references, and mappings. Check identities/associations; inject
failures during preparation/insertion and retry. The original reviewer found
existing migration tests largely expectation-based rather than executing this
SQL behavior; recheck current coverage.

### RN-005 - P1 - Exercise deletion damages historical references

**Locations:** `contexts\ExerciseContext.tsx:67-82`
(`deleteExerciseFromDB`);
`components\modals\ExerciseModal\ExerciseModal.tsx:34-37,101-105`;
`db\general\Exercises.js:63-69`; consumers
`db\workout\SessionExercises.js:48-76` and `db\data\MuscleLoad.js:11-20`.

**Evidence/impact:** Deletion removes definitions/mappings without preserving
session, routine, record, or graph references. With foreign keys off, history
loses titles/equipment and soreness associations. With enforcement on,
parent-first deletion fails and the provider swallows failure. Runtime FK
configuration was not measured.

**Confidence:** High for unsafe reference handling.

**Suggested cleanup:** Refuse deletion of referenced definitions unless an
explicit preservation policy exists. Delete unused definitions atomically,
children first; propagate failures and refresh only after success. Do not
cascade-delete workouts.

**Acceptance:** Delete an unused exercise; attempt deletion with routine,
session, and favorite references. Preserve history/calculations and clearly
report refusal/failure.

**2026-11-11 revalidation and implementation — Implemented - verification pending**

- Source-confirmed: provider deleted `Exercises` before its mappings, then
  deleted template sets; errors were swallowed and the modal closed immediately.
  `createTables` declares exercise FKs without cascade in `RoutineExercises`,
  `SessionExercises`, `ExerciseMaxHistory`, `FavoriteGraphs`, and
  `ExerciseMuscles`. All four blocking reference predicates already have
  exercise-ID indexes. No index/schema/migration change was needed. Runtime FK
  enforcement was not assumed or measured.
- `db\general\Exercises.js:deleteExercise` now acquires the existing
  connection-keyed `withWorkoutDataLock`, opens `BEGIN IMMEDIATE`, checks all
  four reference tables across users, and rejects referenced definitions.
  For unused definitions only, it deletes mappings before the definition and
  commits atomically. Missing definitions/DB, constraints, and storage failures
  reject; rollback preserves the original error. It never deletes historical,
  routine, graph, record, or set rows.
- `contexts\ExerciseContext.tsx` awaits that operation, propagates failure, and
  filters its catalog only after commit. `ExerciseModal.tsx` awaits the promise,
  prevents duplicate submission and closing while pending, leaves the modal open
  with an inline error on failure, and closes only on success.
- Automated evidence: shared command above passes. Real SQLite fixtures exercise
  unused deletion and each routine/session/record/graph refusal with FKs **on
  and off**, comparing every table's rows/IDs after refusal. A parent-delete
  trigger failure restores mappings; retry succeeds; absent DB/definition reject.
  The existing muscle-load suite remains green.
- Transaction investigation: installed Expo SQLite 58.0.15 documents that
  `withTransactionAsync` can include unrelated shared-connection queries, while
  `withExclusiveTransactionAsync` uses a separate native connection and is
  unsupported on web. This fix follows the app's cross-platform lock/manual
  transaction pattern without nested lock acquisition. It does **not** solve
  RN-007's unrelated writers that bypass that lock; interleaving with those
  writers remains a known risk for independent review, not a concurrency claim.
- Pending device checks: delete a synthetic unused custom exercise, verify the
  catalog refresh and reopen; try each reference category and confirm visible
  refusal plus unchanged history titles/equipment, routines, favorite charts,
  sets, and muscle-load calculations. Inject a DB failure and double-tap Delete;
  verify the dialog remains retryable and never announces success. Exercise
  concurrent unrelated writers on native/web; no actual Expo runtime/FK/device
  verification was performed.

### RN-006 - P1 - Profile drafts capture defaults and overwrite saved fields

**Locations:** `hooks\profile\useHookProfileInfo.ts:38-56,58-89`;
`contexts\UserContext.tsx:51-65,77-92`;
`screens\profile\ProfileInfoScreen.tsx:16-24,36-39`.

**Evidence/impact:** A one-time draft initializer reads asynchronously populated
providers and never synchronizes on arrival. Saving one edit writes the entire
stale stats object, potentially erasing unrelated values. Readonly workout
statistics captured there also become stale.

**Confidence:** High.

**Suggested cleanup:** Initialize from ready data when editing begins; synchronize
nonediting display without replacing active drafts. Derive readonly statistics
from current providers; leave editing only after successful persistence.

**Acceptance:** Delay provider reads, open immediately, edit only username or
height, and preserve untouched stored fields. Provider updates during editing
must not replace draft input.

**2026-11-11 revalidation and implementation — Implemented - verification pending**

- Source-confirmed: the hook copied default provider values once, retained
  workout summaries in that snapshot, wrote every stats column, and left editing
  before either parallel write completed. User stats were also re-read whenever
  the entire `user` object changed. The About modal had a separate local editing
  toggle with no persistence boundary.
- `contexts\UserContext.tsx` now publishes load-aware profile status/error,
  supports retry, and publishes user and stats only after both initial reads
  succeed. Reads have effect-lifetime cancellation; hydration no longer depends
  on username/object updates. Editing is unavailable until profile readiness.
- `hooks\profile\useHookProfileInfo.ts` now keeps only explicitly edited fields
  in an active draft, overlays them on current providers, and derives readonly
  workout counts/sets/top exercise on every render. Provider updates do not
  replace edited input, and untouched fields are not written. Save is guarded
  against duplicate submission; failures preserve the draft/editing state and
  show a retry/cancel error. Successful persistence clears the draft.
- New `db\user\Profile.js:saveProfileChanges` validates a fixed stats-field
  allowlist, writes only the requested columns and optional username inside one
  locked transaction, reads the resulting row values within that transaction before
  commit, and rejects missing rows or failures. The provider publishes those
  values only after commit, avoiding partial parallel saves and stale full-object
  writes. No change to historical body-mass snapshots or units.
- `ProfileInfoScreen.tsx` exposes loading/error/retry and Cancel changes;
  main back/cancel discard unsaved drafts and are disabled during saving.
  The initial shared About cancellation/save boundary was corrected after
  independent review in BATCH-01 below; About no longer discards or commits
  unrelated main-screen edits. About and exercise modal hardware-close handlers
  honor their pending-save/deletion guards.
- Automated evidence: shared tests/typecheck pass. SQLite regressions prove a
  username-only patch preserves stats, a height-only patch preserves fields
  updated after draft creation, explicit empty-string edits remain supported,
  combined-save failure rolls username back, retry succeeds, invalid fields and
  missing profile rows reject, and failed transactions do not poison the shared
  queue. No mounted React draft/provider timing test was claimed.
- Pending: delay/reject provider reads while opening Profile; verify Edit is
  disabled, retry populates saved values, username-only/height-only saves leave
  unrelated fields intact, and workout/provider refreshes during editing retain
  input while readonly summaries update. Verify Save failure/duplicate taps,
  retry, main Cancel/back, About Save/close/cancel/reopening, and provider values
  after success on iOS/Android/web. Keyboard/focus/presentation and native
  transaction behavior remain unexecuted. Independent reviewer should inspect
  shared-draft cancellation and remaining RN-007 uncoordinated-writer risk.

**2026-11-11 independent review follow-up — BATCH-01 (P2) implemented; verification pending**

- Parent reported completion of the independent Cleanup Reviewer's full
  RN-001/RN-005/RN-006/RN-008 review. It found two directly coupled P2 blockers:
  BATCH-01's global About cancellation and BATCH-02's uncaught background refresh
  rejections (recorded under RN-008). No additional RN-001/RN-005 source blockers
  were reported. RN-007's unlocked-writer risk remains acknowledged and outside
  this batch. No additional agent/reviewer or review loop was invoked.
- Revalidated BATCH-01 in `useHookProfileInfo`: `closeAboutModal` called the main
  `handleCancel`, clearing username/height and retained failed-save input as well
  as Goals. `AboutModal` hardware dismissal called that same handler.
- `hooks\profile\useHookProfileInfo.ts` now snapshots the entry draft and
  save-error state when opening About; a null draft records prior nonediting.
  Cancel/hardware close restores that snapshot and its edit mode, discarding
  only modal changes. About-only Edit/Cancel returns to prior nonediting.
  Immutable draft updates preserve pre-modal Goals and unrelated fields.
- About has a separate editing toggle and **Save persists Goals only** through
  the existing partial-save provider. This avoids silently committing main-screen
  username/height edits. Success keeps About open, restores the prior main edit
  mode and unrelated draft/error, and removes any older Goals override from the
  restored draft so a later main Save cannot revert the newly saved Goals.
  Failure retains the modal input for retry; cancel returns to the entry
  draft/error. Explicit main Cancel/back still discards the whole main draft.
- `screens\profile\ProfileInfoScreen.tsx` connects the modal-specific handlers;
  `components\modals\AboutModal.tsx` explains the Goals-only Save behavior and
  labels Cancel as discarding only unsaved Goals changes. Pending saves continue
  guarding duplicate actions, cancellation, and hardware close.
- New `__tests__\reactNativeReviewFollowup.test.cjs` uses the existing real-React
  SSR/TypeScript-transpile facilities, without dependency installs or a DOM/UI
  harness. Scripted synchronous render-phase rerenders exercise the actual hook:
  main username/height/pre-modal Goals survive cancellation/reopening; changed
  context values update untouched fields/readonly summaries; About-only cancel
  returns to nonediting; injected synchronous main/Goals save failures preserve
  input, and modal cancel restores the original main error/draft. An actual
  asynchronous About handler call verifies its write contains **only Goals**.
  These are not mounted event/effect or post-await state-publication tests.
- Validation commands and results for both corrections:

```powershell
node --test __tests__\reactNativeReviewFollowup.test.cjs __tests__\reactNativeRemediation.test.cjs
npm run typecheck
npx eslint hooks\profile\useHookProfileInfo.ts screens\profile\ProfileInfoScreen.tsx components\modals\AboutModal.tsx hooks\useHookFinishWorkout.ts screens\FinishWorkoutScreen.tsx __tests__\reactNativeReviewFollowup.test.cjs
git show HEAD:screens/FinishWorkoutScreen.tsx | npx eslint --stdin --stdin-filename screens\FinishWorkoutScreen.tsx
git --no-pager diff --check
```

- Results: **22 passed, 0 failed** (five new follow-up cases plus the 17 original
  remediation cases); typecheck and diff whitespace check pass. Applicable lint
  has **one pre-existing error and one pre-existing warning**, both reproduced
  against HEAD: `react/no-unescaped-entities` for the Finish screen's existing
  apostrophe and its unused `finalWorkout` binding. All other follow-up files
  pass lint; no baseline issue was fixed/suppressed. Original batch lint
  limitations remain as previously recorded. No production SQL/schema changes,
  dependency installs, commits, or broader remediation.
- Still pending on mounted iOS/Android/web: actual main/Goals save rejection
  timing, successful post-await draft/provider publication, Cancel/hardware close
  and reopen after failed/successful Saves, duplicate taps and keyboard/focus.
  Specifically verify Goals-only Save leaves username/height drafts editable,
  subsequent modal cancel preserves them, and later main Save does not revert
  saved Goals. Existing provider-loading/device criteria above remain pending.
  No mounted React renderer/DOM test package was available; none was installed.

### RN-007 - P1 - Shared write lock covers only some writers

**Locations:** `utils\workoutDataLock.js:4-11`; locked transactions in
`contexts\ActiveWorkoutContext.tsx:181-225` and
`contexts\WorkoutContext.tsx:64-106`; unlocked paths in
`contexts\RoutineContext.tsx:106-174`,
`contexts\SplitContext.tsx:77-134`,
`contexts\ExerciseContext.tsx:36-82`; `db\user\Splits.js:44-46`.

**Evidence/impact:** Providers share one SQLite connection, but only some writers
serialize through `withWorkoutDataLock`. Awaited operations can interleave with
another transaction, risking conflicts or unintended commit/rollback membership.
Split edits separately clear/reinsert days without a transaction; failure can
leave a partial split.

**Confidence:** High for missing atomicity; medium for cross-flow interleaving
likelihood.

**Suggested cleanup:** Consistent connection-level serialization and atomic
multistatement changes; publish state after commit. Avoid nested lock acquisition
and do not weaken FK integrity.

**Acceptance:** Pause writes in a synthetic adapter and overlap workout saves
with routine/split/profile changes. Independent success/rollback; injected split
insertion failure must retain the old split.

### RN-008 - P1 - Data dereferences initially null workout frequency

**Locations:** `contexts\WorkoutContext.tsx:46-47`;
`hooks\profile\useHookData.ts:24-25`; `utils\workoutUtils.js:33-45`.

**Evidence/impact:** Frequency initially equals null; the Data hook immediately
calls builders using `rawFrequency.map`. Opening/deep-linking before loading
completes can crash before DataHeader's fallback renders.

**Confidence:** High.

**Suggested cleanup:** Consistent array contract and defensive builder input.
Keep loading/error distinct from a genuinely empty result.

**Acceptance:** Open with unresolved, empty, and rejected reads; render safely
and show data once available.

**2026-11-11 revalidation and implementation — Implemented - verification pending**

- Source-confirmed: `WorkoutContext` initialized frequency to `null`, and both
  builders called `.map` before any Data fallback. The DB reader already rejected
  SQL errors, but the provider attached no rejection handler or explicit status.
- `WorkoutContext.tsx` now exposes a typed array plus independent
  `frequencyStatus`/`frequencyError`, with awaited retry/refresh. Frequency reads
  are connection/user keyed and request-version guarded; obsolete completions
  cannot publish over a later request. Read failure publishes an error state,
  never a successful zero result. Removed the unused public frequency setter.
  Post-commit workout refresh failures are handled separately from save success.
  History refresh is awaitable for its existing consumers; broader history
  generation/invalidation changes in RN-015/RN-016 remain outside this batch.
- `utils\workoutUtils.js` builders return an empty array for unavailable/nonarray
  input, but pad a successful empty array with genuine zero days.
  `db\data\WorkoutFrequency.js` rejects invalid nonarray read responses.
  `useHookData.ts` only builds chart series from ready data and awaits frequency
  refresh. `DataScreen.tsx` shows loading/error/retry instead of frequency charts
  until ready; `ProfileInsightsCard.tsx` shows unavailable frequency placeholders
  and the load/error message rather than a fabricated zero streak.
- Automated evidence: shared tests pass. Builders cover null/undefined/nonarray,
  empty success, and populated counts; real SQLite reads distinguish empty from
  failed/malformed responses. Existing React SSR/transpile testing conventions
  exercise the actual Data screen and hook with loading/null, error, empty ready,
  and populated ready context values, checking that failure/loading never render
  zero-filled charts. Native presentation/other Data widgets are substituted;
  SSR does not execute provider effects or mounted state transitions.
- Pending: deep-link immediately on cold start with unresolved reads; resolve
  empty/populated data, reject then retry, overlap refreshes with reversed
  completion order, and check Profile Insights and Data on iOS/Android/web.
  Confirm no crash, no success-shaped zero chart on error, visible retry,
  appropriate loading state, and latest-request results. No native chart linking,
  timezone calculation semantics, or general aggregate refresh correctness was
  verified or changed.

**2026-11-11 independent review follow-up — BATCH-02 (P2) implemented; verification pending**

- Parent-reported independent review identified two callers left incompatible
  with `refreshHistory`'s rejecting promise:
  `hooks\useHookFinishWorkout.ts:handleDone` and the mismatch continuation in
  `screens\FinishWorkoutScreen.tsx`. Their calls were neither awaited nor caught.
  This was revalidated against current source after the full four-item review.
- Both now use explicit nonblocking
  `void refreshHistory().catch(error => console.error(...))`, matching the
  provider's existing pattern. Refresh is deliberately **not awaited** inside
  workout-save/split error handling: a committed workout remains saved, split
  completion/navigation proceed, and read rejection is logged separately.
  Existing provider error/status and Data retry handling are unchanged. No
  additional save, split-policy, or broader refresh/invalidation changes.
- The new follow-up tests execute the actual Finish hook callbacks and screen
  mismatch continuation captured through SSR, with deferred refresh promises.
  Both paths complete save/split/navigation while reads are still unresolved;
  rejecting all those reads afterward produces handled background error logs,
  exactly one workout save, one split completion, and no "Workout not saved"
  alert or unhandled rejection. Native presentation/animation effects and context
  persistence are substituted, not device-tested.
- Commands/results are the exact shared follow-up commands under RN-006:
  **22 tests passed**, typecheck/diff check pass; applicable lint retains only
  the Finish screen's independently confirmed baseline error/warning.
- Pending mounted/native checks: reject history/frequency reads after actual
  successful Finish Done and mismatch continuation; confirm one persisted
  workout, intended split advancement/navigation, no false unsaved alert, and a
  visible retryable frequency error on Data. Also exercise reversed request
  completion/retry in the mounted provider and cold-start loading/error/ready
  transitions from the original RN-008 acceptance. The suite does not mount
  provider effects or prove post-await React publication/native behavior.
  All four batch statuses remain **Implemented - verification pending**.

## B. Persistence, state, and interaction correctness

### RN-009 - P2 - Routine changes orphan sets and mishandle repeated exercises

**Locations:** `contexts\RoutineContext.tsx:87-104,128-161`;
`db\user\ExerciseSets.js:80-101,130-141`;
`db\user\RoutineExercises.js:14-35,109-115`.

**Evidence/impact:** Deletion/replacement removes associations before locating
their sets, leaving orphan sets. Newly inserted association IDs are discarded
and looked up by catalog identity; repeated occurrences can resolve to the
first association and clear/replace the wrong sets. Storage growth,
FK-sensitive failures, and incorrect templates result.

**Confidence:** High.

**Suggested cleanup:** Delete sets through old association IDs first. Use
`insertRoutineExercise` return IDs directly; hydrate/publish after commit.

**Acceptance:** Repeated edit/delete cycles add no orphans. Duplicate movements
with different sets/order survive restart. Any existing-orphan repair needs a
carefully scoped migration and backed-up test copy.

### RN-010 - P2 - Interfaces report completion before persistence succeeds

**Locations:** `screens\home\EditRoutineScreen.tsx:51-58`;
`hooks\home\useRoutineOptionsHandler.ts:32-39`;
`hooks\exercises\useHookExercises.ts:54-66`;
`components\modals\AddRoutineModal\AddRoutineModal.tsx:22-25`;
`components\modals\Splits\CreateSplitModal.tsx:55-60`;
`components\modals\Splits\EditSplitModal.tsx:84-87`; swallowed failures in
`contexts\RoutineContext.tsx:79-82,101-103` and
`contexts\ExerciseContext.tsx:59-62,80-82`.

**Evidence/impact:** Editing navigates away before awaiting writes; creation
clears drafts early; providers catch errors and resolve. Constraint/disk/write
failure can look successful and discard recoverable input.

**Confidence:** High.

**Suggested cleanup:** Promise-based mutation contracts, awaited success,
retained drafts on failure, visible retryable errors, duplicate-submit guards.
Reuse existing history-editor await/alert conventions.

**Acceptance:** Inject routine/exercise/split create/edit/delete failures.
Preserve drafts; no success indication on failure or duplicate rows on retry.

### RN-011 - P2 - Your Routines omits the selected edit target

**Locations:** `screens\home\RoutinesScreen.tsx:62-67,130-136`;
`hooks\home\useRoutineOptionsHandler.ts:28-31`;
`screens\home\EditRoutineScreen.tsx:19-21`;
`contexts\HomeContext.tsx:27-31`.

**Evidence/impact:** Edit is exposed without supplying `setRoutineToEdit`.
Navigation opens HomeContext's default/previous selection, potentially editing
the wrong template.

**Confidence:** High.

**Suggested cleanup:** Pass the setter and require it wherever Edit is exposed.

**Acceptance:** Edit A from Home then B from Your Routines; B alone is displayed
and saved. Also test with no previous Home selection.

### RN-012 - P2 - Split UI uses stale snapshots and fabricated IDs

**Locations:** `hooks\home\useHookSplits.ts:12-44`;
`contexts\SplitContext.tsx:137-147,199-212`;
`screens\home\SplitScreen.tsx:37-39,65-71,89-94`.

**Evidence/impact:** Mount-time context copies do not track async loading or
refresh. Creation fabricates `displayed.length + 1` rather than SQLite's ID,
allowing collisions after deletion and operations against wrong rows.
`refreshSplits` does not clear active state when no active split remains.

**Confidence:** High.

**Suggested cleanup:** Context-owned hydrated collection, selection by actual ID,
returned insertion IDs, and `find(...) ?? null` active-state derivation.

**Acceptance:** Delayed load, middle deletion, new creation, edit/delete/primary,
restart. UI/storage IDs agree; deleting active split clears all active displays.

### RN-013 - P2 - Rest days assume routine ID 1

**Locations:** `screens\home\SplitScreen.tsx:42`;
`components\modals\Splits\CreateSplitModal.tsx:24-28,38-40,57-59`;
`components\modals\Splits\EditSplitModal.tsx:65-73`;
`db\user\SplitRoutines.js:15-31`; `api\sync.js:147-161`.

**Evidence/impact:** Creation/editing hardcodes Rest as ID 1, but seeding resolves
by title. Inner joins hide missing references or interpret ID 1 as another
workout.

**Confidence:** High.

**Suggested cleanup:** Resolve seeded Rest's actual identity. Do not repurpose
ID 1 or indiscriminately migrate ID-1 references.

**Acceptance:** Rest has a non-1 ID; ID 1 is a normal routine. Rest persists,
displays correctly, and advances without starting the normal routine.

### RN-014 - P2 - Split completion lacks guards and consistent invalidation

**Locations:** `hooks\useHookFinishWorkout.ts:85-113,115-146`;
`contexts\SplitContext.tsx:189-196`;
`screens\FinishWorkoutScreen.tsx:94-100`;
`components\modals\FinishWorkout\RoutineMismatchModal.tsx:90-102`;
`hooks\home\useHookHome.ts:29-39`.

**Evidence/impact:** Workout saving is guarded, but mismatch Continue advances
without equivalent pending/completed protection or error handling. Repeated
presses can skip cycle days. Successful completion does not consistently refresh
mounted Home state.

**Confidence:** High for guards/invalidation; duplicate-press incidence unmeasured.

**Suggested cleanup:** Separate guarded split advancement, refresh/completion
revision, retryable modal failure; remove duplicated continuation navigation.

**Acceptance:** Double-tap with delayed persistence stores one completion. Split
failure after workout save must not duplicate the workout on retry. Home shows
the next day without restarting.

### RN-015 - P2 - Workout changes leave dashboard aggregates stale

**Locations:** `contexts\DataContext.tsx:200-205,216-310,403-409`;
`contexts\WorkoutContext.tsx:87-88,104-105`;
`contexts\ActiveWorkoutContext.tsx:222-224`;
`components\Profile\ProfileInsights\ProfileInsightsCard.tsx:30-38`.

**Evidence/impact:** Workout notifications update soreness, not counts, calories,
weekly sets, routine usage, favorite graph stats, or insights. Mounted dashboards
can disagree with edited/saved/deleted History until manual refresh/restart.

**Confidence:** High.

**Suggested cleanup:** Invalidate affected aggregates/insights after committed
changes and relevant focus transitions. Separate clock-only soreness work.

**Acceptance:** Visit Profile, save, return, edit, then delete a workout. Counts,
totals, graphs, weekly weight, and average duration reflect storage automatically.

### RN-016 - P2 - Refresh APIs neither await all work nor reject stale results

**Locations:** `contexts\WorkoutContext.tsx:49-61`;
`contexts\DataContext.tsx:216-310`;
`components\History\HistoryInfo.tsx:72-76`;
`hooks\profile\useHookData.ts:53-57`.

**Evidence/impact:** History launches reads and returns void. Data detaches
aggregate promise chains, so awaiting it mostly awaits soreness. Refresh
indicators immediately stop. Older overlapping results can overwrite newer
snapshots; unlocked history hydration can observe partial writes.

**Confidence:** High for contracts/race exposure; occurrence not reproduced.

**Suggested cleanup:** Complete promises, coherent snapshots, generation guards
or coalescing, and hydration serialized against writes without nested locking.
Keep previous data on failure and expose retry.

**Acceptance:** Resolve refreshes out of order and pause workout replacement.
Only the newest complete snapshot publishes; indicators track completion/errors.

### RN-017 - P2 - Chart renderers ignore the selected metric

**Locations:** `components\Data\ExerciseAnalysis.tsx:28-34,70-98,174-185`;
`components\Data\Graphs\ExerciseAnalysisGraph.tsx:70-90`;
`components\Data\Graphs\FavoriteExerciseAnalysisGraph.tsx:67-86`;
`db\data\ExerciseStatSets.js:91-136`.

**Evidence/impact:** Queries produce `total_volume`, `avg_weight`, or `reps`,
but renderers plot `points.weight`. Volume/average series are missing and
repetition graphs show weight. Picker `"Repetitions"` mismatches mapping
`"Most Repetitions"`; a cast hides the invalid option.

**Confidence:** High.

**Suggested cleanup:** Normalize into a typed chart value with explicit metric
and unit; share typed options. Preserve chart library, appearance, animation,
and missing-day connection behavior.

**Acceptance:** All five selections show expected synthetic values in both
consumers; every picker option reaches a valid query. Remove the contract hole
that current asserted types do not catch.

### RN-018 - P2 - Analysis results are not tied to their request

**Location:** `components\Data\ExerciseAnalysis.tsx:54-98,128-166`.

**Evidence/impact:** Sequential queries lack request-generation/identity guards.
Controls can change while old results publish beneath new labels. No-data
returns retain previous graphs/statistics.

**Confidence:** High.

**Suggested cleanup:** Immutable exercise/type/range request descriptor,
current-result publication guard, labels tied to result identity, explicit empty
state for the latest request.

**Acceptance:** Resolve A after B without replacing B. Change controls while
loading and request an empty range; old values never masquerade as new results.

### RN-019 - P2 - Statistics view multiplies volume through a many-to-many join

**Locations:** `api\createViews.js:120-150`; duplicate
`api\startup.js:267-297`; consumer
`db\data\ExerciseSessionStatDetails.js:38-54`.

**Evidence/impact:** SessionSets and RankedSets both contain all occurrence sets
but join only on `session_exercise_id`. N sets produce N-squared intermediate
rows, multiplying summed volume by N and increasing query work.

**Confidence:** High.

**Suggested cleanup:** Independent volume aggregation or correctly keyed
rank/aggregate relation. Centralize definitions and deploy corrected views via
a new non-destructive migration, not an already-completed flag.

**Acceptance:** Volumes 100, 200, 300 total 600, not 1,800. Cover unequal counts,
repeated exercise occurrences, and upgrade preservation of underlying rows.

### RN-020 - P2 - Best-set statistics combine different saved records

**Locations:** `db\data\ExerciseSessionStatDetails.js:38-54`;
`components\modals\ExerciseModal\DataTab.tsx:43-108`.

**Evidence/impact:** Independent maximum weight/repetition aggregates are shown
as one pair. Saved 200 x 3 and 150 x 10 can display a fictional 200 x 10; top-set
and most-reps pairs share the issue.

**Confidence:** High.

**Suggested cleanup:** Return paired values from a single deterministically
ranked record, preserving intended tie-breaking.

**Acceptance:** Opposing maxima never create fictional pairs; cover ties and
null estimated values.

### RN-021 - P2 - Calendar selection shifts historical dates

**Locations:** `components\modals\DatePickerModal.tsx:22-30,47-56`;
`components\History\EditHistory\EditHistoryCard.tsx:34-42`;
`components\Data\DateRangeSelector.tsx:69-85`; related stale draft in
`components\modals\TimePickerModal.tsx:19-20`.

**Evidence/impact:** Calendar timestamps become Dates and then local date fields.
UTC midnight is the previous day in negative offsets, so a selected November 8
can save November 7. Mount-only draft initialization also retains canceled or
outdated selections.

**Confidence:** High for calendar/timestamp mixing.

**Suggested cleanup:** Construct the intended local calendar date explicitly,
preserve time, and reset date/time draft selection on opening.

**Acceptance:** Eastern/Pacific, UTC, positive offsets, DST boundaries, and
cancel/reopen all preserve the selected calendar day and committed selection.

### RN-022 - P2 - Date queries and labels use incompatible boundaries

**Locations:** `contexts\DataContext.tsx:225-245`;
`db\data\ExerciseStatSets.js:12-21,93-104,123-134`;
`db\workout\SessionSets.js:66-79`; `api\createViews.js:3-9`;
`utils\workoutUtils.js:1-49`; `utils\dataCalculations.ts:30-40`;
`components\Data\Graphs\WeeklyWorkoutFrequency.tsx:45-53`.

**Evidence/impact:** Date-only end bounds exclude same-day ISO timestamps;
progress queries using `< DATE('now','0 days')` exclude today; UTC frequency
buckets meet local display arrays; labels add a weekday unconditionally;
Today/Yesterday derives elapsed-hour ceilings from UTC midnight rather than
calendar differences.

**Confidence:** High for inconsistencies; intended rolling-period convention
requires confirmation.

**Suggested cleanup:** Explicit calendar versus elapsed-time semantics and
full-timestamp ranges, using exclusive next-day upper bounds where appropriate.
Remove timezone compensation arithmetic; do not rewrite stored timestamps.

**Acceptance:** Early/late end-day sessions, multiple zones, midnight, and DST.
Queries, bars, weekday labels, streaks, and last-workout descriptions agree.

### RN-023 - P2 - Fresh installations can skip onboarding

**Locations:** `api\startup.js:315-323`; `hooks\useOnboarding.ts:15-31`;
mounting `app\_layout.tsx:62-70`.

**Evidence/impact:** Startup sets `firstLaunch = 'false'` before Home. Onboarding
interprets that plus missing completion metadata as an existing user and marks
completion, including fresh installs.

**Confidence:** High.

**Suggested cleanup:** Separate new-install onboarding eligibility from database
setup completion; retain legacy-user skip behavior.

**Acceptance:** Fresh synthetic install shows onboarding; completed/legacy users
are not forced through it. Never clear real user data to test.

### RN-024 - P2 - Muscle-intensity drafts leak across cancellation/exercises

**Locations:** `components\modals\AddExerciseModal\MuscleIntensityModal.tsx:23-25,68-70,141-150`;
parent `components\modals\AddExerciseModal\AddExerciseModal.tsx:31-51,64-70`.

**Evidence/impact:** `selectedMuscles` copies initial selection only at mount.
Parent resets leave retained child state; canceled child edits also survive.
Another draft can inherit the previous exercise's mappings.

**Confidence:** High.

**Suggested cleanup:** Reset child draft from committed parent selection on open;
cancel discards draft rather than committing.

**Acceptance:** Create A with mappings, begin B: B starts empty. Modify/cancel/
reopen: only committed selections appear.

### RN-025 - P2 - Exercise occurrences lack reliable identity

**Locations:** `components\Workout\ActiveWorkout\Workout.tsx:37-49`;
local state `components\Workout\ActiveWorkout\WorkoutInfo.tsx:34-35`;
`components\modals\AddRoutineModal\AddRoutineModal.tsx:46-52,110-123`.

**Evidence/impact:** Index-keyed workout rows own local edit/modal state, which
can transfer after removal/reordering. Routine creation uses catalog IDs as
duplicate keys and removes by title, potentially removing multiple occurrences
or same-title equipment variants.

**Confidence:** High.

**Suggested cleanup:** Stable occurrence identity separate from catalog identity;
preserve association IDs where available and remove by occurrence ID.

**Acceptance:** Duplicate movements with distinct sets, same-title variants,
reordering/removing earlier rows, and removal of one occurrence preserve all
other values and local UI state.

### RN-026 - P2 - Accepted weight text fails calculation parsing

**Locations:** `components\modals\OnboardingModal.tsx:120-130`;
`hooks\profile\useHookProfileInfo.ts:106-125`;
`contexts\ActiveWorkoutContext.tsx:187-197`.

**Evidence/impact:** UI accepts "180 lbs" and "82 kg", but saving uses
`Number(userStats.weight)`, rejecting both. Mass/calorie snapshots become null,
affecting subsequent bodyweight-resistance/record calculations.

**Confidence:** High.

**Suggested cleanup:** One explicit supported-format parser at the calculation
boundary, retaining pounds internally. Do not guess unsupported units or infer
historical mass.

**Acceptance:** Numeric/labeled pounds and kilograms give correct new-workout
mass. Unknown input remains explicitly unavailable; historical mass/null stays
unchanged.

## C. Scaling mechanisms requiring profiling

These four entries describe code-backed scaling/update mechanisms, not measured
slowdowns. Revalidate and profile before committing to an optimization design.

### RN-027 - P2 - Timer updates the whole workout screen while blurred

**Locations:** `hooks\workout\useWorkoutTimer.ts:7-15`;
`screens\workout\ActiveWorkoutScreen.tsx:40-43,112-130`;
`components\Workout\ActiveWorkout\Workout.tsx:37-49`.

**Evidence/impact:** Screen-owned timer state enters the full render path every
second, recounting completion and regenerating row props. No focus gate prevents
ticks on retained tabs. Elapsed time correctly uses Date.now; this is not drift.

**Confidence:** High for placement/lifetime; medium for visible cost.

**Suggested cleanup:** Small timer-display child; suspend ticks while
blurred/backgrounded and recompute from timestamps on return.

**Acceptance/profiling:** Older-iPhone traces with large synthetic routines.
Ticks should not update inputs or continue while blurred; background/foreground
duration and finish behavior remain correct.

### RN-028 - P2 - Root hydration performs serial N+1 reads

**Locations:** `utils\historyHelpers.js:5-55`;
`utils\exerciseHelpers.js:4-31`; `utils\routineHelpers.js:5-55`;
`utils\splitHelpers.js:4-35`; `app\_layout.tsx:65-74`;
`contexts\WorkoutContext.tsx:108-111`.

**Evidence/impact:** H sessions and X exercise occurrences require approximately
1 + H + X serial history reads and all sets, even before History is visited.
Catalog/routine/split hydration also queries children serially. Indexing does
not remove round trips.

**Confidence:** High for scaling; startup impact unmeasured.

**Suggested cleanup:** Batch child reads and assemble by parent ID; retain
section virtualization. Separate summary/detail loading later only if justified.

**Acceptance/profiling:** Equivalent output/order, duplicate occurrences, empty
children, legacy fields; increasing-history cold-start/refresh traces. Query
count should not grow once per child row.

### RN-029 - P2 - Soreness refreshes replay full history inside the write lock

**Locations:** `contexts\DataContext.tsx:175-214`;
`components\Profile\MuscleSoreness\MuscleSoreness.tsx:29`;
`db\data\MuscleLoad.js:5-23`; `utils\sorenessModel.js:89-159`.

**Evidence/impact:** Minute/focus/foreground and initialization requests reread
all sets/mappings, sort events, and reconstruct historical adaptation. Generation
checks prevent stale publication, not duplicate computation. The save lock is
held during this history-growing work.

**Confidence:** High for work/serialization; medium for noticeable blocking.

**Suggested cleanup:** Coalesce in-flight requests and cache unchanged event/input
preparation until workout/catalog changes. Recompute time-dependent output only
where equivalence holds. Do not truncate historical adaptation arbitrarily.
Reconcile implementation with the current soreness algorithm plan.

**Acceptance/profiling:** Preserve model outputs, provenance, forecasts, and
edit/delete invalidation. Measure overlapping requests and save latency with
growing synthetic histories; overlapping requests share coherent computation.

### RN-030 - P2 - Favorite graphs duplicate reads and eagerly mount all charts

**Locations:** `contexts\DataContext.tsx:220-286,377-389`;
`components\Data\FavoriteGraphs.tsx:32-82`.

**Evidence/impact:** Each favorite repeats metric/current-max/progress reads;
multiple metric favorites repeat common exercise queries. Horizontal ScrollView
mounts all charts, including offscreen. Successful insertion also fails to
publish favorites immediately.

**Confidence:** High for duplication/missing invalidation; medium for device cost.

**Suggested cleanup:** Share common reads per exercise and publish after insert.
Use horizontal virtualization only if measured offscreen cost warrants it;
preserve card appearance.

**Acceptance/profiling:** Immediate addition, correct values/order/duplicates,
multiple metrics for one exercise; increasing-count mount/scroll traces.

## D. Lower-impact cleanup

### RN-031 - P3 - Anatomy diagram ignores app appearance preference

**Locations:** `components\Profile\MuscleSoreness\BodyDiagram.tsx:3,15-18,35`;
authoritative `hooks\useThemeColor.ts:14-18`;
`components\modals\Home\ApperanceSettingsModal.tsx:31-38`.

**Evidence/impact:** Diagram reads device scheme while its surroundings use the
app's explicit light/dark/system preference, producing mismatched palettes.

**Confidence:** High.

**Suggested cleanup:** Use the existing effective-app-theme mechanism; preserve
SVG geometry and palettes.

**Acceptance:** Explicit light/dark opposite the system, plus system mode, keep
diagram and surroundings consistent on supported platforms.

## Separate verification questions

These are not six additional confirmed defects. Initial status for each is
**Needs revalidation**.

### VERIFY-01 - Muscle-focus arithmetic

`api\createViews.js:27-37` uses `COUNT(*) * em.intensity` while grouping mapping
rows without aggregating intensity. The pie-chart path consumes it.
Establish intended exercise/set weighting using synthetic mappings before
changing calculation semantics.

### VERIFY-02 - Full Body chart and legend agreement

`components\Data\MuscleGroupStats.tsx:8-33` includes Full Body in legend/
denominator; `components\Data\Graphs\MuscleGroupPieChart.tsx:11-26` excludes it.
Check whether current catalog data makes the mismatch reachable and define the
intended denominator.

### VERIFY-03 - Telemetry/replay overhead

`app\_layout.tsx:23-34` enables replay sampling. Measure release typing,
transitions, and memory while retaining useful diagnostics. Neither package
presence nor sampling declarations establish a performance defect.

### VERIFY-04 - Native compatibility

Dependency declarations and focused chart tests do not establish native linking,
gestures, keyboard behavior, or release compatibility. Verify active chart
tooltips/gestures and Lottie on devices. Do not replace/upgrade dependencies
solely on this audit.

### VERIFY-05 - Production web hosting

Metro isolation headers do not establish exported-host responses. Verify
COOP/COEP and CanvasKit/SQLite WASM delivery. The original audit found delayed
Router import correctly preserved CanvasKit initialization ordering.

### VERIFY-06 - Active-workout process recovery

The original review found in-memory draft state without a recovery-storage path.
Confirm intended behavior and actual process-death handling before classifying
draft persistence as cleanup versus a feature addition.

## Negative findings and audit limits worth retaining

The reviewer did not establish an unbounded animation loop or missing subscription
cleanup in reviewed active animation/soreness paths. Unreachable template
animations and legacy soreness helpers were not classified as active performance
problems. This is not a guarantee about unreviewed code or future changes.

## Suggested implementation sequence

This is a risk-based sequence, not a declaration that every item depends on the
previous item.

1. Prevent loss/crashes: RN-001 through RN-008. Startup recovery and catalog
   migration work should be coordinated, but loading/hook guards can be isolated.
2. Repair mutation contracts and identities: RN-009 through RN-014,
   RN-024, RN-025. Review lock/transaction contracts before changing callers.
3. Make reads coherent: RN-015 through RN-018. Coordinate write publication,
   invalidation, and stale-result protection.
4. Correct derived statistics/input/calendar semantics: RN-019 through RN-023,
   RN-026. Agree date/unit conventions first; use additive view migrations and
   do not infer historical mass or rewrite stored timestamps.
5. Profile and optimize: RN-027 through RN-030. Establish baseline traces before
   batching/caching/render changes. RN-030's missing insertion invalidation is
   separable from its profiling-dependent work.
6. Finish theme consistency: RN-031.

## Validation reference

The original audit suggested these existing commands, all **not run** by the
audit. Confirm current `package.json` before use:

```text
npm run typecheck
npm run lint
npm run test:soreness
npm run test:muscle-load
npm run test:web-bootstrap
npm run test:chart-compat
npm run export:web
```

Use the smallest relevant checks for each change, plus its acceptance scenarios.
Do not assume historical lint counts are current. Add targeted regression cases
that fail before the fix rather than relying on expectation-only/manual files.

Focused SQL/model tests do not establish React lifecycle/provider integration,
safe legacy upgrades, native interaction, or performance. Record applicable
iOS/Android smoke tests, interrupted-migration/rollback checks, and release
profiling separately, with actual outcomes. Keep unresolved device checks open.
