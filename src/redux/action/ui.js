import builder from './builder';

// @todo: like reducer -> control
export const NAVIGATE_TO = 'NAVIGATE_TO';
export const navigateTo = (value) => {
    return {
        type: NAVIGATE_TO,
        value,
    };
};

export const FOLLOW_USER_SET = 'FOLLOW_USER_SET';
export const followUserSet = (value) => {
    return {
        type: FOLLOW_USER_SET,
        value,
    };
};

export const CONVERSION_LOCATION_VISIT_SHOW = 'CONVERSION_LOCATION_VISIT_SHOW';
export const conversionLocationVisitShow = builder(CONVERSION_LOCATION_VISIT_SHOW);
export const CONVERSION_LOCATION_VISIT_HIDE = 'CONVERSION_LOCATION_VISIT_HIDE';
export const conversionLocationVisitHide = builder(CONVERSION_LOCATION_VISIT_HIDE);
