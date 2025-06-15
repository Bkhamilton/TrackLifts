import { View } from '@/components/Themed';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Pie, PolarChart } from "victory-native";

export default function GraphInfo() {

    function randomNumber() {
        return Math.floor(Math.random() * 26) + 125;
    }
    function generateRandomColor(): string {
        // Generating a random number between 0 and 0xFFFFFF
        const randomColor = Math.floor(Math.random() * 0xffffff);
        // Converting the number to a hexadecimal string and padding with zeros
        return `#${randomColor.toString(16).padStart(6, "0")}`;
    }
    const DATA = (numberPoints = 5) =>
        Array.from({ length: numberPoints }, (_, index) => ({
            value: randomNumber(),
            color: generateRandomColor(),
            label: `Label ${index + 1}`,
    }));

    const data = DATA();

    return (
        <View>
            <PolarChart
                data={data} // 👈 specify your data
                labelKey={"label"} // 👈 specify data key for labels
                valueKey={"value"} // 👈 specify data key for values
                colorKey={"color"} // 👈 specify data key for color
            >
                <Pie.Chart />
            </PolarChart>
        </View>
    );
}

const styles = StyleSheet.create({

});
