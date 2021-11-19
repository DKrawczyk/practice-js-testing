export default function randomNumber(min, max) {
    if (!typeOfValue(min, 'number') || !typeOfValue(max, 'number')) {
        throw new Error ('Property have to be a number');
    } 
    function typeOfValue(value, type) {
        return typeof value === type;
    }

    if (min > max) {
        throw new Error ('Minimum number cannot be bigger than max(scope)');
    }
}