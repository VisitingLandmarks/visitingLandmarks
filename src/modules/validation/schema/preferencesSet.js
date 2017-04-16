import locale from '../properties/preferences/locale';
import {buildBaseSchema, combineSchema} from '../../validation';

export default module.exports = combineSchema(buildBaseSchema('preference set'), locale);
