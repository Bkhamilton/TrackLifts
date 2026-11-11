const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToString } = require('react-dom/server');
const { setImmediate: nextTurn } = require('node:timers/promises');

function load(parts, imports, logger = console) {
    const code = ts.transpileModule(fs.readFileSync(require.resolve(path.join('..', ...parts)), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true },
    }).outputText;
    const exports = {};
    vm.runInNewContext(code, {
        exports,
        console: logger,
        require(id) {
            if (id === 'react') return React;
            if (id in imports) return imports[id];
            throw new Error(`Unexpected import: ${id}`);
        },
    });
    return exports;
}

function profileScenario(steps, saveProfile = () => Promise.resolve()) {
    const UserContext = React.createContext({});
    const DataContext = React.createContext({});
    const user = {
        user: { username: 'stored name', createdAt: '2020' },
        userStats: { height: '70', weight: '180', goals: 'Stored Goals' },
        profileStatus: 'ready',
        profileError: null,
        saveProfile,
    };
    const data = { workoutCount: { total: 1, weekly: 1 }, weeklySetsCount: 3, topExercise: null };
    const useProfile = load(['hooks', 'profile', 'useHookProfileInfo.ts'], {
        '@/contexts/UserContext': { UserContext },
        '@/contexts/DataContext': { DataContext },
    }).default;
    let index = 0;
    let current;
    function Probe() {
        current = useProfile();
        const step = steps[index++];
        if (step) step(current, user, data);
        return null;
    }
    // Real React server hook state supports these synchronous render-phase updates.
    // This does not mount effects or simulate post-await React event updates.
    renderToString(React.createElement(UserContext.Provider, { value: user },
        React.createElement(DataContext.Provider, { value: data }, React.createElement(Probe))));
    assert.ok(index >= steps.length, `Only ${index} of ${steps.length} steps ran`);
    return current;
}

test('About cancel restores main edits and pre-modal Goals while provider summaries stay current', () => {
    profileScenario([
        profile => { void profile.handleEditToggle(); },
        profile => profile.handleChange('username', 'draft name'),
        profile => profile.handleChange('stats.height', '72'),
        profile => profile.handleChange('stats.goals', 'Pre-modal pending Goals'),
        profile => profile.openAboutModal(),
        profile => profile.handleChange('stats.goals', 'Unwanted modal Goals'),
        (profile, user, data) => {
            assert.equal(profile.profile.stats.goals, 'Unwanted modal Goals');
            user.userStats = { ...user.userStats, weight: '185' };
            data.weeklySetsCount = 8;
            profile.closeAboutModal();
        },
        profile => {
            assert.equal(profile.aboutModalVisible, false);
            assert.equal(profile.isEditing, true);
            assert.equal(profile.profile.username, 'draft name');
            assert.equal(profile.profile.stats.height, '72');
            assert.equal(profile.profile.stats.goals, 'Pre-modal pending Goals');
            assert.equal(profile.profile.stats.weight, '185');
            assert.equal(profile.profile.workoutStats.weeklySets, 8);
            profile.openAboutModal();
        },
        profile => profile.handleChange('stats.goals', 'Another modal edit'),
        profile => profile.closeAboutModal(),
        profile => {
            assert.equal(profile.profile.stats.goals, 'Pre-modal pending Goals');
            assert.equal(profile.profile.username, 'draft name');
            profile.handleCancel();
        },
        profile => {
            assert.equal(profile.isEditing, false);
            assert.equal(profile.profile.username, 'stored name');
        },
    ]);
});

test('About-only cancel returns to nonediting; failed main-save input and error survive modal cancel', () => {
    profileScenario([
        profile => profile.openAboutModal(),
        profile => { void profile.handleAboutEditToggle(); },
        profile => profile.handleChange('stats.goals', 'Cancelled Goals'),
        profile => profile.closeAboutModal(),
        profile => {
            assert.equal(profile.isEditing, false);
            assert.equal(profile.profile.stats.goals, 'Stored Goals');
            void profile.handleEditToggle();
        },
        profile => profile.handleChange('username', 'Retained failed draft'),
        profile => { void profile.handleEditToggle(); },
        profile => {
            assert.match(profile.error, /Unable to save your profile/);
            assert.equal(profile.isEditing, true);
            profile.openAboutModal();
        },
        profile => profile.handleChange('stats.goals', 'Modal Goals'),
        profile => { void profile.handleAboutEditToggle(); },
        profile => {
            assert.equal(profile.isEditing, true);
            assert.equal(profile.profile.stats.goals, 'Modal Goals');
            assert.match(profile.error, /Unable to save Goals/);
            profile.closeAboutModal();
        },
        profile => {
            assert.equal(profile.isEditing, true);
            assert.equal(profile.profile.username, 'Retained failed draft');
            assert.equal(profile.profile.stats.goals, 'Stored Goals');
            assert.match(profile.error, /Unable to save your profile/);
        },
    ], () => { throw new Error('Injected synchronous persistence failure'); });
});

test('About Save sends only Goals, leaving unrelated main edits out of persistence', async () => {
    const writes = [];
    const profile = profileScenario([
        current => { void current.handleEditToggle(); },
        current => current.handleChange('username', 'Pending main name'),
        current => current.handleChange('stats.height', '72'),
        current => current.openAboutModal(),
        current => current.handleChange('stats.goals', 'Save these Goals'),
        current => { assert.equal(current.aboutIsEditing, true); },
    ], async changes => { writes.push(JSON.parse(JSON.stringify(changes))); });
    await profile.handleAboutEditToggle();
    assert.deepEqual(writes, [{ stats: { goals: 'Save these Goals' } }]);
});

function finishScenario(mismatch) {
    const contexts = Object.fromEntries(['ActiveWorkout', 'Routine', 'Split', 'Workout']
        .map(name => [name, React.createContext({})]));
    const calls = { saves: 0, split: 0, clear: 0, navigations: [], alerts: [], errors: [], refreshes: [] };
    const routine = { id: 1, title: 'Completed', exercises: [] };
    const active = {
        routine, finalTime: '00:30:00', finalWorkout: { routine, notes: '' },
        saveWorkoutToDatabase: async () => { calls.saves++; },
        clearRoutine: () => { calls.clear++; },
    };
    const workout = {
        workoutHistory: [],
        refreshHistory: () => new Promise((resolve, reject) => calls.refreshes.push({ resolve, reject })),
    };
    const split = {
        activeSplit: { routines: [{ day: 0, routine_id: mismatch ? 2 : 1 }] },
        getCurrentSplitDay: async () => 0,
        completeCurrentSplitDay: async () => { calls.split++; },
    };
    const router = { replace: route => calls.navigations.push(route) };
    const native = {
        Alert: { alert: (...args) => calls.alerts.push(args) },
        Animated: { Value: class {} }, Easing: {},
        StyleSheet: { create: styles => styles },
        TouchableOpacity: ({ children }) => React.createElement('div', null, children),
    };
    const imports = {
        ...Object.fromEntries(Object.entries(contexts).map(([name, context]) => [
            `@/contexts/${name}Context`, { [`${name}Context`]: context },
        ])),
        'expo-router': { useRouter: () => router },
        'react-native': native,
    };
    const logger = { error: (...args) => calls.errors.push(args) };
    const useFinish = load(['hooks', 'useHookFinishWorkout.ts'], imports, logger).default;
    let finish;
    let continuation;
    function useFinishCapture() {
        finish = useFinish();
        return finish;
    }
    const Screen = load(['screens', 'FinishWorkoutScreen.tsx'], {
        ...imports,
        '@/hooks/useHookFinishWorkout': useFinishCapture,
        '@/components/Themed': Object.fromEntries(['ScrollView', 'Text', 'View'].map(name => [name, native.TouchableOpacity])),
        '@/components/modals/FinishWorkout/RoutineMismatchModal': props => {
            continuation = props.onContinue;
            return null;
        },
        ...Object.fromEntries([
            '@/components/FinishWorkout/CelebrationSection', '@/components/FinishWorkout/ExerciseBreakdownSection',
            '@/components/FinishWorkout/NotesInput', '@/components/FinishWorkout/SummaryStatsSection',
            '@/components/modals/FinishWorkout/SaveRoutineModal',
        ].map(id => [id, () => null])),
    }, logger).default;
    let tree = React.createElement(Screen);
    for (const [name, value] of Object.entries({ ActiveWorkout: active, Routine: {}, Split: split, Workout: workout })) {
        tree = React.createElement(contexts[name].Provider, { value }, tree);
    }
    renderToString(tree);
    return { calls, finish, continuation };
}

for (const mismatch of [false, true]) {
    test(`finish ${mismatch ? 'mismatch continuation' : 'Done'} keeps committed save/navigation despite background refresh rejection`,
        { timeout: 3000 }, async () => {
            const { calls, finish, continuation } = finishScenario(mismatch);
            await finish.handleDone();
            assert.equal(calls.saves, 1);
            assert.equal(calls.refreshes.length, 1);
            if (mismatch) await continuation();
            assert.equal(calls.split, 1);
            assert.ok(calls.clear >= 1);
            assert.equal(calls.navigations.at(-1), '/(tabs)/(index)');
            // Both caller promises have finished even though reads are still pending.
            for (const refresh of calls.refreshes) refresh.reject(new Error('Injected read failure'));
            await nextTurn();
            assert.equal(calls.saves, 1);
            assert.equal(calls.alerts.length, 0);
            assert.equal(calls.errors.length, mismatch ? 2 : 1);
            assert.ok(calls.errors.every(([message]) => message === 'Error refreshing workout history:'));
        });
}
