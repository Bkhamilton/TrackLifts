# Muscle Soreness Algorithm: Source-of-Truth Plan

**Status:** Estimated-soreness v1 implemented for review after the user explicitly reaffirmed the soreness-indicator purpose. Section 16 is the current decision and implementation; Section 15 records the superseded workload-only approach. The estimate is physiology-informed, not clinically validated.
**Created:** 2026-11-06
**Scope:** Muscle load, soreness estimation, and related training guidance.

## 1. Purpose and document authority

This document is the authoritative planning reference for the next TrackLifts Muscle Soreness algorithm. It captures the existing implementation, what should be retained, confirmed correctness problems, proposed modeling changes, unanswered questions, and the evidence required before release.

The primary objective is **accuracy and usefulness**, while preserving existing work wherever it remains sound. Large changes are acceptable when necessary to meet that objective.

This document supersedes older documents for **future algorithm strategy**, including:

- `MUSCLE_SORENESS_RECALCULATION.md`
- `IMPLEMENTATION_SUMMARY.md`
- `USER_GUIDE_WEIGHTED_SORENESS.md`
- Algorithm assumptions in `ROUTINE_MUSCLE_SORENESS_INTEGRATION.md` and `CARDIOVASCULAR_ACTIVITIES.md`

Those documents remain historical implementation or feature references. They are not evidence that the existing model accurately predicts soreness or recovery.

The running code remains the authority for current behavior. Section 16 describes the implementation now proposed for merge. This plan describes the repository inspected on 2026-11-06; the exact App Store build and installed database state have not been verified.

### Decision labels

| Label | Meaning |
|---|---|
| Accepted constraint | A requirement established for this planning effort |
| Confirmed finding | Behavior established from the current repository |
| Proposed | A candidate design, not an approved implementation |
| Open | A decision or research question that must be resolved |
| Approved | A design decision explicitly accepted and recorded here |

Earlier implementation phases below are historical proposals. The user subsequently authorized the estimated-soreness implementation in Section 16, which takes precedence wherever earlier candidate-selection or workload-only decisions conflict. Training-clearance and validated personalized prediction remain outside this implementation.

### Maintaining this document

Record substantive decisions in Section 13 with their rationale, evidence, and consequences. Update affected sections when a decision changes; do not leave contradictory requirements in different sections. Distinguish observed behavior from intended behavior.

Keep model versions, calibration assumptions, release criteria, and unresolved questions here. Detailed implementation documents may be added later, but must reference this plan and must not independently redefine the algorithm.

## 2. Accepted constraints and success definition

**Accepted constraints**

- Accuracy is the highest priority.
- Retain useful existing architecture and algorithm components where justified.
- Replace substantial portions when retaining them would compromise accuracy.
- The initial planning stage produced this revisable plan. The subsequent user request authorizes implementation; the first deliverable is corrected recorded exposure, with predictive release gates retained.

**Proposed success definition**

The feature should help users understand recent muscle-specific training exposure, anticipate ordinary post-exercise soreness, and make better-informed decisions about their planned workouts.

It must not claim that:

- Logged workload directly measures pain, muscle damage, or complete recovery.
- A green muscle is guaranteed safe to train.
- Little soreness means inadequate training or no training benefit.
- High soreness means a productive workout.
- A precise percentage is a clinically established measurement.

An accurate workload calculation is a prerequisite, not proof of accurate soreness prediction. Predictive and recommendation quality must be assessed against observations outside the algorithm itself.

## 3. Historical implementation baseline (before recorded-load v1)

### 3.1 Data flow

```text
Saved workout sessions and sets
    -> ExerciseMuscles exposure coefficients
    -> SQLite raw muscle and muscle-group scores
    -> Historical individual-muscle score maxima
    -> Normalized individual-muscle scores
    -> MuscleRatio weighted group summary
    -> Display transformation, colors, and percentage
```

### 3.2 Raw score

For each stored set and associated muscle:

```text
raw contribution =
    entered weight
    * repetitions
    * exercise-to-muscle coefficient
    * (entered weight / all-time exercise estimated 1RM)
    * age multiplier
```

Contributions are summed across included workouts.

The estimated 1RM is the highest value in `ExerciseMaxHistory`, not necessarily current strength. Normal saving estimates it as `weight * (1 + reps / 30)`, except a one-repetition set uses its weight directly.

| Age from workout start | Multiplier |
|---|---:|
| Up to 12 hours | 1.00 |
| Over 12 through 24 hours | 0.80 |
| Over 24 through 36 hours | 0.65 |
| Over 36 through 48 hours | 0.55 |
| Over 48 through 60 hours | 0.45 |
| Over 60 through 84 hours | 0.30 |
| Older, while inside the query window | 0.10 |

The inclusion condition uses `date('now', '-7 days')`: a UTC calendar boundary, not exactly 168 elapsed hours. There is no explicit upper bound excluding future sessions.

### 3.3 Normalization and display

```text
individual score = min(current raw score / saved historical maximum, 1)

group score = sum(individual score * configured group weight)

display value =
    0.8 * group score
    + 0.2 * (1 - exp(-0.8 * group score))
```

Historical maxima are sampled by the soreness updater during workout saving and only increase. Missing muscles contribute zero to a group; remaining weights are not rescaled. The active read path substitutes `1` for missing or zero individual maxima.

The raw group score and group maximum still exist, but the active profile visualization uses the weighted individual-muscle path. `MuscleSorenessNEW.tsx` is not the component imported by the profile screen.

### 3.4 Relevant implementation locations

| Area | Repository reference |
|---|---|
| Raw SQL calculation | `api\createViews.js:178-255` |
| Replacement views for existing installations | `api\startup.js:115-200` |
| Workout resistance and 1RM handling | `contexts\ActiveWorkoutContext.tsx:247-304` |
| Soreness maxima and history updates | `db\data\MuscleGroupSoreness.js:14-92` |
| Normalization and weighted aggregation | `utils\muscleSorenessCalculations.js:24-76` |
| Data loading and aggregation | `contexts\DataContext.tsx:268-313` |
| Active visualization and transform | `components\Profile\MuscleSoreness\MuscleSoreness.tsx:77-108` |
| Detail colors | `components\Profile\MuscleSoreness\MuscleInfoPanel.tsx:88-95,129-131` |
| Exercise and group coefficients | `data\NewExercises.json`, `data\MuscleRatio.json` |
| Muscle definitions | `data\NewMuscles.json` |
| Exercise explanation query | `db\data\MuscleGroupBreakdown.js` |
| Workout editing and deletion | `contexts\WorkoutContext.tsx` |
| Muscle-ID migration | `api\migrateExercises.js` |

Line numbers are investigation references and may move. Update the baseline when relevant behavior changes.

## 4. Preservation strategy

| Existing investment | Proposed disposition | Conditions |
|---|---|---|
| Workout sessions, exercises, and set history | Retain | Preserve original inputs and historical meaning |
| Exercise-to-muscle mapping mechanism | Retain | Audit coverage, anatomy, roles, and coefficient interpretation |
| Per-muscle intermediate scores | Retain | Make them the primary unit of modeling and explanation |
| Accumulation across recent workouts | Retain concept | Calibrate dose accumulation and recovery behavior |
| Time-dependent reduction of workload impact | Retain concept | Separate fatigue from delayed soreness; evaluate smooth curves |
| Personalization using training history | Retain concept | Replace lifetime maxima as biological calibration |
| Weighted muscle-group summary | Retain conditionally | Use for overview, not muscle-specific training clearance |
| Body diagram, selection, legend, and detail panel | Retain where practical | Use one consistent scale and explicit uncertainty |
| Batched data loading | Retain where practical | Ensure consistent results and timely refresh |
| Current raw equation | Keep as comparison baseline | Do not assume it deserves retention as the production predictor |
| Existing maximum/history tables | Preserve during transition | Do not treat their contents as observed soreness |
| Existing helper tests | Retain or adapt | Add coverage for changed behavior and end-to-end consistency |

Preservation should be judged by valid behavior and useful structure, not by maintaining every constant or formula.

## 5. Confirmed problems to address

These are independent of which replacement prediction model is selected.

| ID | Finding | Consequence | Required outcome |
|---|---|---|---|
| C1 | The soreness numerator uses entered weight, while bodyweight/assisted 1RM saving uses effective resistance | Zero-added-weight work scores zero; assistance can be treated as increasing workload | Define consistent, exercise-appropriate resistance semantics |
| C2 | Completion checkboxes are not carried into the saved routine; supplied sets are saved as completed | Unchecked planned sets can count as work performed | Distinguish planned, completed, and historically ambiguous work |
| C3 | Detail colors divide raw muscle scores by a default maximum of 1 | Detail dots can saturate red while the overview is low | Share validated display values across views |
| C4 | A group score of 1 transforms to approximately 0.91 | Display endpoints do not match the apparent scale | Define scale meaning and apply it consistently |
| C5 | Middle traps, teres, abductors, deep core, and serratus have no mappings in the current 136-exercise catalog | Fixed weights make several group endpoints unreachable | Resolve coverage or explicitly represent unsupported compartments |
| C6 | Breakdown uses latest-session volume, not the complete soreness calculation; muscle joins can duplicate sets | Explanations can misstate sets and contribution percentages | Explain actual dose and residual contributions without duplicated sets |
| C7 | No soreness-specific foreground/focus/time refresh; saving does not explicitly refresh its data context | Display may remain stale after workouts or elapsed time | Define and implement refresh and invalidation behavior |
| C8 | Edits/deletions do not consistently rebuild score maxima and exercise records | Corrected mistakes can continue influencing the model | Derived state must remain coherent with surviving workout data |
| C9 | Missing 1RM uses a denominator of 1; missing maxima use 1 in the active path | Unknown data can generate extreme or saturated results | Return explicit uncertainty or use a documented, justified estimate |
| C10 | Calendar cutoff, abrupt decay steps, and unbounded future sessions | Nonphysiological discontinuities and date-dependent inclusion | Use valid elapsed-time semantics and explicit input handling |
| C11 | Muscle migration recreates IDs without explicitly remapping/resetting existing individual maxima | Existing-installation baselines may refer to different muscles | Audit migration compatibility and rebuild affected derived state |

### Model limitations, not merely implementation defects

- First recorded exposure can normalize to 100% regardless of workout severity.
- An outlier lifetime maximum can suppress later scores indefinitely.
- Normalization can cancel the intended secondary-muscle coefficient, especially on first exposure.
- A group average can conceal high load in a constituent muscle.
- A later 1RM record changes the score of earlier included workouts.
- Raw load squared over 1RM strongly favors heavier work without directly measuring effort.
- Immediate monotonic decay does not represent delayed-onset soreness timing.
- No actual soreness, proximity-to-failure, or functional observations calibrate the result.

### Regression examples to preserve in the eventual specification

| Scenario | Current behavior or concern | Future invariant |
|---|---|---|
| Unweighted pull-ups entered with weight 0 | Raw soreness is 0 | Known completed work must not disappear solely because added weight is 0 |
| More assistance on assisted pull-ups | Entered assistance can increase the score | Assistance must not be interpreted as added resistance |
| First easy versus first demanding workout | Both can reach each muscle's recorded maximum | Cold-start output must acknowledge uncertainty and retain meaningful dose differences |
| Quads at their maximum, other leg scores 0 | Leg display is approximately 23.6% | A low group summary must not conceal the quad-specific state |
| All group constituents at normalized 1 | Display is approximately 91% | A claimed bounded scale must have intentional, consistent endpoints |
| Back exercises from the current catalog | Weighted ceiling is 80% before other limitations | Unsupported muscle mappings must not masquerade as recovery |
| Correct or delete an accidental high-load workout | Historical references may remain inflated | Corrections must remove the erroneous workout's derived influence |
| One set mapped to several muscles in one group | Breakdown can multiply the set count | Explanation counts each performed set once |

## 6. Scientific interpretation and model targets

### 6.1 Distinguish related but different concepts

| Target | Interpretation | Candidate observation |
|---|---|---|
| Recent muscle load | Estimated training exposure from recorded work | Completed sets, effort, exercise participation |
| Soreness | Felt tenderness/discomfort following exercise | Timestamped muscle-specific symptom report |
| Local functional fatigue | Temporary reduction in ability to perform work | Perceived recovery and optional standardized submaximal performance observation |
| Training guidance | Suitability of the planned session in context | Symptoms, planned dose, recent exposure, goals, and functional observations |

Soreness is not a direct measurement of muscle damage or complete recovery. A decrease in soreness does not prove restored performance.

### 6.2 Evidence-informed assumptions

- DOMS commonly starts 12-24 hours after unfamiliar exercise, peaks around 24-72 hours, and subsides over subsequent days. These are population observations, not a fixed personal schedule.
- Familiarity and the repeated-bout effect can reduce subsequent soreness from similar work.
- Eccentric exposure and muscle length under load can affect the response.
- Training near or to failure affects acute fatigue; relative external weight alone does not measure effort.
- Subjective reports are valuable monitoring inputs, but are noisy and do not independently establish training safety.

### 6.3 Unvalidated candidate choices

Challenging-set-based doses, exponential fatigue decay, delayed DOMS curves, recent robust workload references, and personalized response parameters are **proposals**. The research below does not establish their coefficients or validate a TrackLifts-specific equation.

Do not assign a universal recovery duration to each muscle or claim that adding more variables necessarily improves prediction.

## 7. Proposed model architecture

### 7.1 Separate calculation from presentation

```text
Recorded inputs
    -> validated canonical training events
    -> exercise-to-muscle exposure
    -> per-muscle dose
    -> load/fatigue/soreness estimates
    -> confidence and explanation
    -> group summaries and planned-workout guidance
    -> presentation
```

Choose one canonical calculation implementation. If SQL and application code both participate, give each a distinct responsibility rather than maintaining independent versions of the same formula.

### 7.2 Input semantics and provenance

Define before selecting coefficients:

- Original entered weight, canonical units, and what the entry represents.
- Added load versus assistance versus total external load.
- Per-dumbbell versus combined-dumbbell conventions.
- Body mass at the workout, if it is needed and available.
- Completed status and its provenance.
- Working set versus warm-up, where known.
- Repetitions versus duration for timed/isometric work.
- Valid workout timestamps; per-set timestamps only if their benefit justifies collection.
- Optional effort/RIR, with clear missing-data handling.
- Exercise/equipment identity and mapping version.

Preserve source inputs separately from derived resistance. Do not retroactively apply today's body mass to old workouts as if it were observed then. Unknown historical completion, body mass, and effort must remain unknown rather than being invented.

Machine load, band resistance, and bodyweight mechanics are not interchangeable measurements. If meaningful effective resistance cannot be established, consider an effort/set-based path with lower confidence rather than fake precision.

### 7.3 Exercise-to-muscle exposure

Retain the current mapping mechanism, but audit:

- Anatomical definitions and non-overlapping compartments.
- Prime movers, secondary movers, and stabilizers.
- Missing participation in compound movements.
- Equipment variants and technique-dependent assumptions.
- Catalog coverage and unsupported muscles.
- Whether coefficients describe mechanical participation, fatigue dose, or another quantity.

`NewMuscles.json` currently labels pectoralis minor as "Lower Chest." Resolve this anatomy issue before expanding regional predictions.

Independent muscle coefficients need not sum to one. Do not equate EMG activation percentages with soreness percentages or assume a universal coefficient applies to every user's technique.

### 7.4 Per-set dose candidates

Evaluate both the corrected existing equation and a challenging-set/effort-based alternative.

An illustrative alternative is:

```text
muscle dose =
    completed-set base dose
    * effort adjustment
    * exercise-to-muscle exposure
    * movement/novelty adjustment
```

Relative load, repetitions, and duration may inform the base dose or effort estimate, but should not be added redundantly without evidence. Keep warm-ups distinct from demanding sets where the data supports it.

Compare candidates on heavy low-repetition work, moderate-repetition work, high-repetition near-failure work, easy sets, and holds. Do not assume one hard-set constant accurately covers every case.

Use the simplest candidate that meets the evaluation criteria. Additional complexity requires demonstrated incremental value.

### 7.5 Time response candidates

Model immediate fatigue separately from delayed soreness.

```text
fatigue(muscle, time) =
    sum(fatigue dose(event) * fatigue response(elapsed time))

predicted soreness(muscle, time) =
    sum(soreness dose(event) * delayed soreness response(elapsed time))
```

A smooth decreasing fatigue response and a delayed-rise-and-fall soreness response are starting candidates, not approved formulas.

Define:

- How repeated sessions interact and whether simple addition is adequate.
- How familiarity changes amplitude or recovery duration.
- How old contributions become negligible without abrupt arbitrary disappearance.
- How uncertainty grows outside supported observation ranges.
- How invalid or future-dated events are surfaced or excluded.

Use genuine timestamps. The current finish flow puts a formatted duration in `endTime`; that must be corrected before treating it as the time training ended.

### 7.6 Personalization and cold start

Replace lifetime peak normalization as the default interpretation of biological response.

Candidate approach:

- Start with documented population-informed assumptions and low confidence.
- Use a robust recent reference for workload context, if needed.
- Collect a small number of actual symptom and recovery observations.
- Adjust a limited set of identifiable personal parameters gradually.
- Require sufficient observations before presenting a model as personalized.
- Bound parameter updates and preserve a fallback when evidence is sparse.

Do not force a new user's first event to maximum predicted soreness. Distinguish workload reference values from observed symptom severity.

If 1RM remains an input, define how it is estimated from trustworthy sets, how it changes with time, and whether historical dose uses the reference available at that event. Later records must not silently rewrite history without a documented recalculation policy.

### 7.7 Feedback and uncertainty

Proposed low-friction feedback:

- Muscle-specific soreness: none, mild, moderate, severe.
- Movement: normal versus restricted/uncomfortable.
- Optional perceived recovery and set effort.

Keep reported symptoms, model predictions, and their timestamps separate. A missing report is not "no soreness." A missed check-in is not evidence of recovery.

Display confidence or a learning/limited-data state. Distinguish:

- No recent recorded exposure.
- Incomplete workout history.
- Unsupported exercise or muscle mapping.
- Missing effort or resistance information.
- Data loading or calculation error.

Do not silently convert failures or unknowns into green, zero, or "ready."

### 7.8 Aggregation and guidance

Retain group-level graphics as summaries, with constituent muscles visible.

Define the group summary's meaning before retaining `MuscleRatio.json`. It must not imply that every muscle in the group has the average state.

Planned-workout guidance should consider the participating muscles, their roles, intended dose, symptoms, recent training exposure, and the user's split/goals. Neither a broad average nor an unconditional maximum over every mapped stabilizer is sufficient by itself.

Do not prescribe extra work just because a muscle is least sore. Consider recent muscle-specific challenging sets and intended training exposure.

Recommendations must remain advisory, not guarantees of safety. Separate ordinary soreness from concerning pain/symptoms; such reports should bypass normal reassuring guidance.

## 8. Data, compatibility, and delivery design

**Proposed requirements**

- Preserve existing workout history; avoid destructive resets.
- Prefer additive schema changes until a replacement is proven.
- Preserve raw inputs, timestamped reports, and necessary provenance.
- Treat old soreness maxima/history as legacy derived workload, not symptom labels.
- Use stable muscle identities and explicitly migrate renamed/redefined compartments.
- Rebuild affected derived state after corrections, deletions, mapping changes, and model changes.
- Version the model, mappings, and calibration so results can be explained and compared.
- Make save/update failures explicit; avoid committing apparently successful but incomplete derived state.
- Refresh after saves, edits, deletions, app foregrounding, and relevant screen access. Choose any additional time refresh according to responsiveness and battery cost.
- Define whether cached estimates use a shared evaluation timestamp to keep views consistent.
- Keep all views and explanation panels on the same scale and calculation version.
- Keep explanations faithful to actual event contributions and residual effects.

Health-related feedback requires privacy review before collection. Decide retention, local versus remote processing, consent for any research/analytics, and deletion behavior. Prefer local-first operation unless a justified need for another architecture is approved.

No user symptom data should be collected or exported solely because this plan proposes it.

## 9. Evaluation and release gates

### 9.1 Correctness

The future test plan must cover:

- Bodyweight, added-weight, assistance, unit, and dumbbell conventions.
- Actual versus planned sets and unknown historical completion.
- Timed/isometric exercises and missing effort.
- Valid elapsed time, boundaries, future timestamps, and invalid dates.
- Cold start, missing records, outliers, and non-finite inputs.
- Multi-muscle exposure without duplicated performed sets.
- Edits/deletions and replay of surviving history.
- Existing-installation migrations and stable muscle identity.
- Overview/detail/explanation agreement.
- Explicit unsupported/unknown/error states.
- Model and mapping version changes.

### 9.2 Predictive evaluation

Compare candidates against simple baselines, including time since relevant training and recent challenging-set exposure. Also compare against the corrected current model.

Collect timestamped observations across familiar and unfamiliar exercises, different efforts, repeated sessions, and return from breaks. Define the symptom scale and reporting context consistently.

Measure:

- Soreness prediction error appropriate to the chosen scale.
- Error in timing of onset, peak, and resolution where observations support it.
- Performance across cold-start and established users.
- Confidence calibration and behavior with sparse/missing reports.
- Failure patterns by exercise category and training context.
- Incremental value of each added input.

Use later observations for evaluation, not for fitting the same predictions. Include held-out users to evaluate generalization and chronological held-out data for personalization. Avoid leakage from future 1RM records, later feedback, or final history-derived maxima.

Account for reporting bias: users who feel sore may answer more often. Model-generated training suggestions can also change future exposure and reported outcomes.

### 9.3 Guidance evaluation

Soreness accuracy alone does not validate recommendations. Use separately defined symptom and optional functional observations.

Track both:

- **False reassurance:** low-concern guidance despite substantial symptoms or impaired function.
- **Unnecessary restriction:** discouraging appropriate training without sufficient evidence.

Agree on what counts as each outcome, observation windows, and acceptable tradeoffs before release. Do not demand maximal-effort testing from sore users to label readiness.

### 9.4 Release gate checklist

- [ ] Confirmed calculation/display defects are resolved.
- [ ] Output meanings, units, confidence states, and guidance language are approved.
- [ ] Muscle mapping and anatomy audit is complete for supported scope.
- [ ] Migration preserves history and rebuilds incompatible derived state.
- [ ] Candidate is compared against simple baselines on held-out observations.
- [ ] Numeric acceptance thresholds and minimum evidence are agreed before final evaluation.
- [ ] Accuracy gains justify any added complexity and logging burden.
- [ ] False reassurance and unnecessary restriction are assessed.
- [ ] Privacy, offline behavior, performance, and rollback are reviewed.
- [ ] User-facing documentation matches the implemented interpretation.

No universal coefficient values, sample-size target, or predictive acceptance thresholds have been approved yet.

## 10. Proposed implementation phases

| Phase | Scope | Deliverable and exit condition | Prerequisites |
|---|---|---|---|
| 0. Agree on targets | Define outputs, user burden, supported exercises, and acceptance measures | Approved target/measurement specification and decision log entries | None |
| 1. Correct inputs and presentation | Address C1-C11; audit compatibility; unify scale/explanation | Reliable recorded-work calculation and regression coverage, without unsupported accuracy claims | Phase 0 where input/output semantics are required |
| 2. Audit mappings | Resolve anatomy, roles, coverage, and coefficient meaning | Versioned mapping specification with known limitations | Phase 0; can overlap Phase 1 |
| 3. Establish observations | Design optional symptom/effort feedback and provenance | Privacy-approved collection specification and usable evaluation observations | Phase 0; corrected event semantics from Phase 1 |
| 4. Compare model candidates | Corrected legacy baseline versus simpler and richer alternatives | Held-out comparison, selected candidate, approved parameters and limitations | Phases 1-3 and sufficient observations |
| 5. Add personal response and guidance | Calibrate individual response; evaluate planned workouts | Separately evaluated personalization and advisory guidance | Phase 4; sufficient personal observations |
| 6. Controlled release | Migrate, explain changes, monitor, and preserve rollback | Release gates satisfied and documentation synchronized | Approved candidate and relevant guidance gates |

Phase 1 is valuable even if later modeling takes longer. Do not make users wait for speculative personalization before correcting known input/display problems.

A deterministic recent-load overview can ship separately from a predicted-soreness or recommendation feature, provided its label and limitations are clear. Do not ship the latter simply because the former works.

## 11. Open decisions

| ID | Question | Proposed starting position | Required before |
|---|---|---|---|
| D1 | What should the feature call its outputs? | Distinguish recent load, reported/predicted soreness, and training guidance | Phase 0 approval |
| D2 | How much extra logging is acceptable? | Optional brief effort and muscle-soreness reports | Feedback implementation |
| D3 | What symptom scale and reporting context should be used? | Simple anchored categories; keep observations timestamped | Data collection |
| D4 | Should numerical percentages remain? | Only with an explicit interpretation; categories may be more honest | UI specification |
| D5 | Which bodyweight, band, machine, and hold categories are initially supported? | Explicit scope with lower confidence or unsupported states elsewhere | Input specification |
| D6 | What should fixed group weights represent? | Overview only; reassess whether existing weights add value | Aggregation implementation |
| D7 | Does a corrected volume/relative-load model outperform set/effort alternatives? | Decide empirically, not by formula complexity | Candidate selection |
| D8 | How should familiarity be measured? | Recent exposure to the same movement, with conservative assumptions | Novelty model |
| D9 | What personal parameters are learnable from sparse feedback? | Start with few bounded parameters; require evidence | Personalization |
| D10 | Where do calculation and feedback storage belong? | Local-first; one canonical model implementation | Architecture approval |
| D11 | How are past doses treated after strength or mapping changes? | Preserve provenance and define explicit replay/version policy | Migration/model implementation |
| D12 | What observations validate functional guidance? | Optional low-burden perceived recovery/submaximal observations | Guidance evaluation |
| D13 | What improvement and error rates justify release? | Predeclare criteria after selecting measurement protocol | Final evaluation |
| D14 | How should legacy ambiguous workouts affect confidence? | Retain history without inventing completion, effort, or body mass | Migration specification |

## 12. Evidence references

1. Hody et al. (2019), *Eccentric Muscle Contractions: Risks and Benefits*. Supports DOMS timing, repeated-bout adaptation, eccentric/length-related considerations, and the distinction between soreness and other damage/function markers.  
   https://pmc.ncbi.nlm.nih.gov/articles/PMC6510035/

2. Vieira et al. (2022), *Effects of Resistance Training to Muscle Failure on Acute Fatigue: A Systematic Review and Meta-Analysis*. Supports considering effort/failure when estimating acute fatigue; does not establish a universal RIR-to-soreness multiplier.  
   https://doi.org/10.1007/s40279-021-01602-x

3. Saw, Main, and Gastin (2016), *Monitoring the athlete training response: subjective self-reported measures trump commonly used objective measures: a systematic review*. Supports using subjective observations in monitoring; does not independently validate training-clearance decisions.  
   https://pmc.ncbi.nlm.nih.gov/articles/PMC4789708/

Research informs hypotheses and limitations. TrackLifts-specific predictive claims require TrackLifts-specific evaluation. Add evidence as new decisions require it, and record whether the evidence supports a mechanism, a measurement, or the exact chosen model.

## 13. Decision and revision log

| Date | Decision or revision | Status | Rationale / consequences |
|---|---|---|---|
| 2026-11-06 | Accuracy takes priority; preserve sound existing work but allow substantial changes | Accepted constraint | Establishes the preservation and evaluation approach |
| 2026-11-06 | Create this document as the source of truth for future algorithm strategy | Accepted constraint | Older guides remain historical references |
| 2026-11-06 | Record current behavior, defects, candidate architecture, phases, and open decisions | Draft revision | No replacement formula, coefficients, or implementation approved |

## 14. Next milestone

Review the recorded-load implementation in Section 15 and test it on an installed native app with a copy of existing workout history. Predictive work still needs the optional observation/privacy protocol, candidate comparisons, and predeclared acceptance criteria. Implementation authorization does not supply missing observations or establish predictive accuracy.


## 15. Superseded: recorded-load v1 implementation (2026-11-06)

### Scope and decision log extension

The user explicitly requested implementation after pushing this plan. This supersedes the initial planning-only restriction. The following are implementation choices for a reviewable PR, not evidence of biological validation or blanket approval of the predictive release gates.

| Decision | Implementation and rationale |
|---|---|
| D1 / D4 | Label the active indicator **Recent Muscle Load**; show time-weighted set units instead of a soreness percentage. Recorded sets do not measure symptoms. |
| D2 / D3 | No new symptom collection, analytics, or mandatory effort logging. Missing effort is not inferred from weight or repetitions. |
| D5 | Any valid performed set with a known mapping contributes exposure, including zero-added bodyweight, assisted, band, machine and hold sets. A hold counts as one exposure, not as a known duration or an equivalent hard set. |
| D6 | Existing group weights summarize supported catalog muscles, renormalized over that supported scope. Unsupported muscles are explicitly named and gray in details. The highest constituent and all individual values remain visible. |
| D7 | Do not select a soreness predictor without observations. Use a deterministic exposure baseline now; retain old SQL/helper code as legacy comparison code, disconnected from the active visualization. |
| D8 / D9 | No invented novelty, repeated-bout or personalized recovery coefficients. |
| D10 | One pure JavaScript model, local SQLite inputs, one shared timestamp/snapshot for diagram, details and breakdown. No network or symptom-data export is introduced. |
| D11 | Recompute exposure from surviving saved sets and current mappings. Later strength records cannot rewrite exposure. Mapping changes intentionally replay history under the identified mapping version. |
| D14 | Historical completion is `legacy-unknown`; original rows and IDs stay intact. New checked sets are `confirmed`. Unknown body mass stays null. |

### Exact arithmetic and interpretation

For each valid stored performed set, per-muscle exposure is:

`catalog coefficient × 2^(-elapsed hours / 48)`

A completed set contributes one unit before mapping/time weighting. This **does not distinguish easy and hard sets with identical counts**, infer proximity to failure, measure tonnage, or claim that machine loads are interchangeable. More completed sets produce more exposure; secondary coefficients are preserved even at cold start. More assistance never increases dose. Weight/repetitions are validated but do not set exposure magnitude. This deliberately avoids fake precision when effort and mechanics are unknown.

The 48-hour half-life is a **recency display convention**, not a muscle recovery duration. It is exposed in the legend. Contributions accumulate without a seven-day or midnight cliff. Only numerical tails below `1e-8` per set are ignored. Both timestamps must not be future-dated; invalid starts are excluded. Old duration-only finish fields fall back to start time with an explicit limitation. Time zones in ISO values are respected; zone-less SQLite timestamps are treated as UTC.

Group units are the weighted mean of supported constituent units. The common color/bar scale is `clamp(units / 10, 0, 1)`, with 0, 5 and 10+ unit anchors. The numeric units are **not capped**. Ten units is a visualization endpoint, not a danger or soreness threshold. A low group average is accompanied by the highest constituent. Unsupported compartments are excluded from the denominator rather than represented as recovered.

The explanation lists all contributing sessions, sorted by residual contribution. Its percentages are shares of **uncapped weighted group units**, not pain probabilities or shares of the saturated color scale. A set joined to several muscles is counted once per session-exercise.

Versions: `recorded-load-v1`, `catalog-v3-audited-scope-v1`. Mapping coefficients remain catalog assumptions, not validated soreness fractions. Any changed coefficient/model convention requires a version bump and regression review.

### Input, persistence and compatibility changes

- Completion is stored in active workout state, including navigation between screens. Finish is available after at least one checked set; only checked sets enter workout history. Unchecked sets remain in the routine template. Creating a named routine on the finish screen preserves the completed-work snapshot.
- Finish saves an ISO timestamp. Duration cards, weekly averages and duration editing accept both old duration fields and new timestamps.
- Saves, edits and deletes use transactions. The full session and sets succeed or roll back together. Save/edit/delete failures stay visible to the user; repeated finish taps are guarded.
- Additive, idempotent migration adds `completion_source` and `body_mass_lbs` to SessionSets. No existing history, muscle IDs or legacy maxima are deleted by migration. Migration failures propagate instead of exposing a half-ready database.
- Body mass is snapshotted when available for new work. Added bodyweight and assistance use consistent resistance for estimated records, without a guessed 180 lb body mass. Dumbbell entries retain their existing per-dumbbell convention. Bands, catalog holds, unknown mass and sets above 12 reps do not generate new estimated 1RM values. This record policy does not affect exposure.
- Edits retain historical body mass and provenance. Newly added history sets default to unverified completion. Exercise records rebuild from surviving stored set estimates after writes; old estimates are preserved unless their sets are edited/deleted. No lifetime maxima are used in the new indicator, so stale or remapped legacy muscle maxima cannot influence it.
- Refresh on successful save/edit/delete, screen focus, app foreground and once per active minute. Request generations discard stale async results. Errors clear the active visualization to unavailable/gray with Retry, rather than a recovered/green result.

### Catalog audit and supported scope

All current catalog coefficients must be finite and in `(0, 1]`; duplicate exercise/muscle rows use their largest coefficient once and do not double-count work. The audit found duplicate Upper Traps entries in Shrug and Dumbbell Shrug; these are removed from the catalog, and existing databases are safely deduplicated by the model without changing IDs. Current unsupported compartments are **Teres, Middle Traps, Abductors, Deep Core and Serratus**. They are explicitly displayed as unmapped. No speculative coefficients were added to make colors reach an endpoint.

Correct the `Lower Chest` anatomical metadata from pectoralis minor to the inferior sternocostal region of pectoralis major. Keep the display key and IDs stable. Chest regions and other catalog compartments remain approximate exercise labels, not validated non-overlapping biological models. A broader anatomical/technique/participation audit remains a predictive-release prerequisite.

### Defect disposition

| Finding | Result |
|---|---|
| C1 | No zero-added-weight disappearance or assistance-as-added-load in the indicator; consistent record resistance and snapshot provenance. |
| C2 | Checked work alone enters new session history; legacy ambiguity retained and labeled. |
| C3 / C4 | Shared units, colors and intentional endpoints; no raw-score/default-max division or extra display transform. |
| C5 | Explicit unsupported compartments, supported-scope normalization, metadata correction; expanded biological mapping audit remains open. |
| C6 | Actual residual group contributions across all sessions, no multiplied set counts. |
| C7 | Mutation/focus/foreground/active-minute refresh and explicit errors. |
| C8 | Read-time replay removes corrected/deleted exposure; record rebuild within writes. Legacy muscle maxima are retained but never consulted. |
| C9 | No denominator-of-one fallback; no fabricated body mass or effort. |
| C10 | Continuous elapsed-time weighting; invalid/future event exclusions and legacy timestamp limitations. |
| C11 | New calculation uses current mappings and surviving events, never migrated muscle-ID maxima. Migration does not recreate muscle IDs. |

### Validation and remaining gates

Automated coverage is in `__tests__/muscleLoad.test.cjs` (`npm run test:muscle-load`), including real SQLite migration/save/read/edit/delete/rollback, user isolation, bodyweight/assistance, unsupported data, date behavior, duplicate mappings, uncapped explanations and shared display arithmetic. TypeScript and export checks cover integration. Existing graphics regression checks remain applicable.

These tests establish calculation behavior, **not predictive accuracy**. No held-out soreness observations exist in this implementation, so no predictive error, calibration score, recovery recommendation, or validated DOMS curve is claimed. Manual native-device checks, existing-user database QA, empirical candidate comparison, personalization and guidance evaluation remain outstanding. Preserve the release gates in Section 9 for those later features.


## 16. Current decision: preserve estimated soreness (supersedes Section 15)

The user explicitly clarified that this component must estimate how sore muscle groups and their individual muscles are expected to be, including bodyweight and assisted work and soreness fading over time. A workload-only replacement does not meet that purpose. This decision supersedes D7–D9 and the predictive-release deferral **for an explicitly labeled heuristic estimate**. It does not claim measured symptoms, validated individual prediction or clearance to train. The transaction, completion, provenance, replay, mapping audit and refresh fixes from Section 15 remain.

### Evidence and boundaries

- [Hody et al., 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6510035/): delayed soreness commonly develops 12–24 hours after unfamiliar eccentric exercise, peaks around 24–72 hours and subsides over roughly 5–7 days. Repeated exposure attenuates responses; soreness is not a direct measure of muscle damage or recovered performance.
- [Proximity-to-failure experiment, 2023](https://pubmed.ncbi.nlm.nih.gov/36752989/): in 24 resistance-trained participants performing six bench-press sets, failure produced more soreness than stopping three repetitions short at 24 and 48 hours. This supports considering effort; it does not provide a universal dose equation.
- [Chen et al., 2019](https://pubmed.ncbi.nlm.nih.gov/30663816/): repeated eccentric bouts across arm, leg and trunk exercises attenuated responses. This supports familiarity as a directional factor, not a validated coefficient for every exercise or person.

These sources inform **direction and time-course shape**. Every numeric coefficient below, including the 0–100 scale and labels, is an engineering heuristic requiring future comparison against reported soreness. There is no evidence-derived conversion from logged sets to an individual's pain score. We do not infer eccentric tempo, range of motion, sleep, injury, nutrition or muscle-specific recovery rates from data the app does not collect. Exercise participation coefficients remain catalog assumptions.

### Inputs and effort

Only performed sets enter the estimate. New saved sets must be checked complete. Legacy completion remains explicitly unverified; migration never invents old effort, duration or body mass. Nullable `rir`, `is_warmup`, and `duration_seconds` columns are added idempotently. The workout/edit screens offer optional effort and warm-up controls. Dynamic effort choices correspond to 5, 3, 1 or 0 repetitions left; holds use Easy/Moderate/Hard/At limit as an ordinal proxy stored in the same field, **not literal repetitions**. Copied routines clear effort and warm-up status for the next workout.

For each dynamic set, explicit RIR (0–8) takes priority. Otherwise, use the median capacity of earlier comparable sessions within 42 days when possible. Capacity is resistance × (1 + (reps + RIR)/30), only for non-warm-up dynamic sets of at most 12 reps; missing historical RIR uses 3. Current inferred RIR is clamped to 0–8 from 30 × (reference/resistance − 1) − current reps, only through 30 current reps. With no reference, assume RIR 3 and label the assumption. This is an approximate within-exercise difficulty index, not a measured 1RM or reliable effort detector. No lifetime muscle maximum enters the score. Later/same-session records cannot influence earlier effort estimates.

Bodyweight resistance index = saved historical body mass + added load. Assisted index = saved mass − absolute assistance. Both signed legacy assistance and positive entries are understood; new assistance is stored as a positive magnitude. The index is comparable only within the same exercise, not actual force on a muscle. Missing historical mass, mechanically invalid assisted indices, and bands use effort/volume fallback; **they still contribute soreness**. Today's profile mass never rewrites old workouts. At the same reported effort/reps, more assistance need not mean less soreness: a less strong person may work equally hard. Without reported effort, increased assistance reduces inferred difficulty when a comparable reference exists.

Plank, Side Plank, Hollow Body Hold and Wall Sit use seconds. New holds require a positive finite duration; legacy unknown durations remain unknown and use a labeled typical-hold assumption. Existing repetitions are never silently converted to seconds. Holds and bands do not produce estimated strength records.

### Exact model conventions (`utils/sorenessModel.js`)

1. Effort weight = 0.3 + 0.9 × exp(−RIR/3). Dynamic volume = clamp(sqrt(reps/8), 0.35, 1.5). Hold volume = clamp(sqrt(seconds/30), 0.25, 1.5), or 1 if old duration is missing. Dose = effort × volume × warm-up factor (0.15 or 1) × hold factor (0.6 or 1).
2. Familiarity uses only earlier sessions of the same exercise within 84 days. Each contributes min(non-warm-up dose/2, 1) × exp(−age/42 days). Familiarity = 1 − exp(−sum/2). Adaptation multiplier = 1 − 0.35 × familiarity. This modest, bounded attenuation avoids assuming familiar movements can no longer cause soreness. No transfer between different exercises is invented.
3. Multiply dose by adaptation and the exercise/muscle participation coefficient. Deduplicate mappings by their maximum valid coefficient. Apply diminishing returns to total dose D **per session and muscle**: 6 × log(1 + D/6), allocating the result proportionally among sets.
4. Each event's peak hour P = 42 − 10 × familiarity + min(6, unadapted event dose/3). With elapsed hours t, delayed response is zero through hour 4, then exp(3 × (ln(x) + 1 − x)), x = (t − 4)/(P − 4). A distinct small acute term 0.12 × exp(−t/8) keeps immediate postexercise discomfort visible. Their sum weights dose. The early acute term may fall before delayed soreness rises; this is intentional. Response tails fade continuously; only negligible contributions older than 21 days are dropped. Earlier history is still used for familiarity/reference.
5. Sum residual doses across sessions for each muscle; display score = 100 × (1 − exp(−sum/6)). Labels: Minimal <10, Mild <30, Moderate <60, High otherwise. These are display bands, not clinical pain cutoffs or readiness thresholds.
6. Group score = 70% weighted mean over supported muscles + 30% highest currently involved muscle with participation coefficient at least 0.5. If no such muscle contributes, use the weighted mean alone. This keeps a sore major muscle from disappearing in a large group's average. Existing importance weights are renormalized over supported scope. Individual values and the highest constituent remain visible.
7. Forecast the same score at six-hour intervals through the next 48 hours; show the maximum when meaningfully higher than now. This is a forecast assuming no new workouts, not an additional current score. The forecast makes delayed onset visible immediately after a workout.
8. Explanation shares allocate each muscle's nonlinear score proportionally to residual doses, then apply the same group weights. Contributions sum to the displayed group score; joined muscle rows never multiply completed-set counts.

Version: `estimated-soreness-v1`; mapping version: `catalog-v3-deduplicated-v1`. Changes to conventions require version/test/doc updates. `muscleLoadModel.js` remains a disconnected comparison baseline and supplies shared timestamp/color/resistance helpers. The active SQLite snapshot calls `calculateEstimatedSoreness`, despite its compatibility name `getMuscleLoadSnapshot`.

### Uncertainty, compatibility and verification

Missing effort, old completion, unknown duration/mass, missing finish times and first-exposure uncertainty are visible reasons, not fabricated observations. Confidence describes input completeness (limited/moderate), not statistically validated prediction accuracy. Unmapped muscles remain gray/unavailable. Invalid performed data makes affected muscles unavailable rather than falsely recovered; future records are excluded with a visible issue. Reads and mutations remain serialized; save/edit/delete transaction failures roll back and surface errors. The indicator refreshes on writes, focus, foreground and active-minute ticks.

Existing lifetime muscle maxima are preserved for compatibility and ignored. Old session IDs, muscle IDs and stored history are preserved. This new PR includes the necessary foundations from the prior unmerged PR and targets main independently; the old workload-only PR is superseded, not a merge prerequisite.

Automated tests cover curve shape, effort, bodyweight/assistance, holds, familiarity, historical causality, robust references, nonlinear explanation totals, incomplete/invalid data, and real SQLite migration/save/edit/read behavior. Existing transaction/deletion/user-isolation tests are retained. See `ESTIMATED_SORENESS_TESTING.md` for commands and device scenarios. These checks establish implementation consistency, **not physiological predictive accuracy**. Native-device QA and prospective comparisons against users' actual soreness remain necessary before claiming calibrated accuracy. Optional future self-reports could validate and personalize the model; no new symptom collection is introduced here.
