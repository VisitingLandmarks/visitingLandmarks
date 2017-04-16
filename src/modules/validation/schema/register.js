import username from '../properties/username';
import password from '../properties/password';
import {buildBaseSchema, combineSchema} from '../../validation';

export default module.exports = combineSchema(buildBaseSchema('register'), username, password);
