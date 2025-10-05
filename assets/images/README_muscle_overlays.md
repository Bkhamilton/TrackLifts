# Muscle Group SVG Overlays - Front View

This directory contains separate SVG overlay files for each major muscle group shown in the front view of a human body. These overlays are designed to work with `Muscles_front.svg` as the base anatomical image.

## Files

### Base Image
- **Muscles_front.svg** - Complete anatomical illustration of the human body (front view)
  - ViewBox: `0 0 185 335`
  - Contains detailed muscle anatomy

### Muscle Group Overlays

1. **chest_front.svg**
   - Contains: Left and right pectoralis major
   - Paths: 2 (one for each pec)
   - Coverage: Upper chest area

2. **shoulders_front.svg**
   - Contains: Left and right deltoid muscles
   - Paths: 2 (one for each shoulder)
   - Coverage: Shoulder caps and upper arm attachment

3. **arms_front.svg**
   - Contains: Left and right arms (biceps, triceps, forearms)
   - Paths: 2 (one for each arm)
   - Coverage: Upper arms from shoulder to elbow region

4. **core_front.svg**
   - Contains: Abdominal muscles (rectus abdominis, obliques)
   - Paths: 1 (unified core region)
   - Coverage: Torso from chest to pelvis

5. **legs_front.svg**
   - Contains: Left and right legs (quadriceps, hamstrings)
   - Paths: 2 (one for each leg)
   - Coverage: Thighs and upper legs

## Usage

These overlay SVG files are designed to be used in the Muscle Soreness Visualizer component. They can be:

1. **Layered over the base image** - Position each overlay SVG on top of Muscles_front.svg
2. **Color-coded for data visualization** - Change the fill color to represent different soreness levels
3. **Interactive** - Make each muscle group clickable/selectable for detailed information

### Example Usage (React Native SVG)

```jsx
import { Svg, Path } from 'react-native-svg';

// Import or define muscle paths
const chestPaths = [
  "M 62,90 C 72,85 82,85 88,89 C 92,92 93,105 90,113...",
  "M 123,90 C 113,85 103,85 97,89 C 93,92 92,105 95,113..."
];

// Render with dynamic color
<Svg width={185} height={335} viewBox="0 0 185 335">
  {/* Base body image */}
  <Image href={Muscles_front} />
  
  {/* Overlay muscle groups with color representing soreness */}
  {chestPaths.map((path, i) => (
    <Path 
      key={i}
      d={path} 
      fill={getColorForSoreness(sorenessLevel)} 
      opacity={0.6}
    />
  ))}
</Svg>
```

### Color Mapping

Suggested color gradient for muscle soreness:
- **Green (Low soreness)**: RGB(50, 205, 50)
- **Yellow (Medium soreness)**: RGB(255, 205, 50)
- **Red (High soreness)**: RGB(255, 50, 50)

## Technical Specifications

- **Format**: SVG 1.1
- **ViewBox**: 0 0 185 335 (matching base image)
- **Units**: millimeters (mm)
- **Coordinate System**: 
  - X-axis: 0 (left) to 185 (right)
  - Y-axis: 0 (top) to 335 (bottom)
  - Center: approximately x=92.5

## Anatomical Positioning

Approximate Y-coordinates for body regions:
- Head: 0-70
- Shoulders: 70-90
- Chest: 90-130
- Arms: 85-185
- Core: 120-195
- Legs: 195-320

## Notes

- All overlay SVGs use the same coordinate system as the base image
- Paths are designed to cover the major muscle groups without overlapping
- Fill opacity can be adjusted for better visibility when overlaying
- Stroke properties can be customized for highlighting selected muscles

## Future Enhancements

Potential improvements for these overlay files:
- [ ] Add back view muscle group overlays
- [ ] Include more detailed sub-muscle group paths
- [ ] Add side view (lateral) muscle overlays
- [ ] Create animation-ready versions
- [ ] Add muscle group metadata/labels
