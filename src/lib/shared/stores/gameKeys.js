//@ts-nocheck

export const keys = [
    //TEAM INFO
    "teamNumber",
    "matchNumber",
    "arenaPosNumber",
    "red/blue",

    //AUTO
    "autoFuelNumber",
    "autoCollectsFromGround",
    "autoCollectsFromOutpost",
    "autoCollectsFromNeutral",
    "autoCollectsFromDepot",
    "autoClimb",
    "autoClimbTime",

    //TELEOP
    "teleopFuelNumber",
    "teleopCollectsFromGround",
    "teleopCollectsFromOutpost",
    "teleopCollectsFromNeutral",
    "teleopCollectsFromDepot",
    "teleopClimb",
    "teleopClimbTime",
    "passesByBump",
    "passesByLowBar",
    "feedingFuelNumber",

    //INFO
    "robotFunction",
    "robotStatus",
];

const booleanKeys = [
    //AUTO
    "autoCollectsFromGround",
    "autoCollectsFromOutpost",
    "autoCollectsFromNeutral",
    "autoCollectsFromDepot",
    "autoClimb",

    //TELEOP
    "teleopCollectsFromGround",
    "teleopCollectsFromOutpost",
    "teleopCollectsFromNeutral",
    "teleopCollectsFromDepot",
    "teleopClimb",
    "passesByBump",
    "passesByLowBar",
];

const selectKeys = [
    "robotFunction",
    "robotStatus",
    "teleopClimb",
    "arenaPosNumber",
    "red/blue",
];

export function getFieldType(key) {
    if (selectKeys.includes(key)) {
        return 'select';
    }

    // Boolean fields
    if (booleanKeys.includes(key)) {
        return 'boolean';
    }

    if (key.includes('Number') || key.includes('Time')) {
        return 'number';
    }

    // Default to text
    return 'text';
}

export default keys;
