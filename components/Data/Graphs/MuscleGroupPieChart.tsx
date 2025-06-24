import { DataContext } from "@/contexts/DataContext";
import React, { useContext } from "react";
import { View } from "react-native";
import { Pie, PolarChart } from "victory-native";

// You can use a fixed color palette for consistency
const COLOR_PALETTE = [
    "#ff8787", "#ffd43b", "#69db7c", "#4dabf7", "#b197fc", "#ffa94d"
];

const MUSCLE_GROUPS = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"];

export default function MuscleGroupPieChart() {
    const { muscleGroupFocusBySet } = useContext(DataContext);

    // Build a map for quick lookup and ensure all groups are present
    const statsMap = Object.fromEntries(
        muscleGroupFocusBySet.map(stat => [stat.muscle_group, stat.total_intensity])
    );

    // Build data array for the chart, always including all muscle groups
    const data = MUSCLE_GROUPS.map((group, idx) => ({
        label: group,
        value: statsMap[group] || 0,
        color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
    })).filter(d => d.value > 0); // Optionally filter out groups with 0 value

    return (
        <View style={{ height: 300 }}>
            <PolarChart
                data={data}
                labelKey={"label"}
                valueKey={"value"}
                colorKey={"color"}
            >
                <Pie.Chart />
            </PolarChart>
        </View>
    );
}