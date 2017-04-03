import password from '../properties/password';
import {buildBaseSchema, combineSchema} from '../../validation';

export default module.exports = combineSchema(buildBaseSchema('change password fields'), password);
