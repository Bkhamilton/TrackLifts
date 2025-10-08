# User Guide: Weighted Muscle Soreness Feature

## What Changed?

The app now uses a more accurate method to calculate muscle group soreness. Instead of simply adding up all soreness in a muscle group, it uses **weighted contributions** based on how important each muscle is within that group.

## How It Works Now

### Before (Old Method)
Muscle group soreness was calculated by simply summing all soreness scores.

### After (New Weighted Method)
Muscle group soreness uses a weighted formula based on muscle importance:

**Example: Chest Muscle Group**
- Main Chest contributes **60%** to chest soreness
- Upper Chest contributes **30%** to chest soreness  
- Lower Chest contributes **10%** to chest soreness

So if your:
- Main Chest is 80% sore
- Upper Chest is 75% sore
- Lower Chest is 80% sore

Your overall **Chest soreness = 78.5%** (instead of averaging to ~78.3%)

This is more realistic because the main chest is weighted more heavily!

## What You'll See

### In the App
When you view your muscle soreness visualization:
1. Muscle groups will show **weighted soreness percentages**
2. The color gradient (green → yellow → orange → red) reflects the weighted soreness
3. More accurate recovery recommendations

### Muscle Group Ratios
The following ratios are used for each muscle group:

**Chest**
- Main Chest: 60%
- Upper Chest: 30%
- Lower Chest: 10%

**Back**
- Lats: 30%
- Upper Traps: 15%
- Middle Traps: 15%
- Lower Traps: 10%
- Rhomboids: 15%
- Teres: 5%
- Lower Back: 10%

**Shoulders**
- Front Delts: 35%
- Side Delts: 35%
- Rear Delts: 30%

**Arms**
- Biceps: 35%
- Triceps: 40%
- Brachialis: 15%
- Forearms: 10%

**Legs**
- Quads: 25%
- Hamstrings: 25%
- Glutes: 25%
- Calves: 10%
- Adductors: 7%
- Abductors: 5%
- Hip Flexors: 3%

**Core**
- Abs: 40%
- Obliques: 30%
- Deep Core: 20%
- Serratus: 10%

## Benefits

✅ **More Accurate**: Reflects the reality that some muscles contribute more to a muscle group's function
✅ **Better Recovery Insights**: Know exactly which muscle groups need more rest
✅ **Personalized**: Tracks your individual maximum soreness for each muscle
✅ **Seamless**: No action required - works automatically with your existing data

## How to Verify It's Working

1. **After a workout**: Complete a workout that targets specific muscles
2. **Check muscle soreness**: Go to the Profile → Muscle Soreness section
3. **View the visualization**: You should see colored muscle groups based on weighted soreness
4. **Compare over time**: As you train, individual muscles will track separately and contribute to group soreness

## Technical Details

- The calculation happens automatically when you view your muscle soreness
- Your historical data is preserved and still contributes to the calculations
- The system tracks maximum soreness for each individual muscle, not just muscle groups
- No data is lost - this is purely an enhancement to how soreness is displayed

## Need Help?

If you notice anything unusual or have questions about the weighted soreness calculation, check the `IMPLEMENTATION_SUMMARY.md` file for technical details or refer to `docs/MUSCLE_SORENESS_RECALCULATION.md` for the complete specification.

## Future Enhancements

Potential future improvements:
- Personalized ratios based on your training style
- Adaptive ratios that learn from your recovery patterns
- More detailed breakdowns in the UI showing individual muscle contributions
