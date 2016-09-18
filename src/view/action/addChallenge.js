export const type = 'ADD_CHALLENGE';
export default (challenges) => {

    if (!Array.isArray(challenges)) {
        challenges = [challenges];
    }

    return {
        type,
        challenges
    };
    
};