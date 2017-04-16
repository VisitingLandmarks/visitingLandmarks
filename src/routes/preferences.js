import {routes} from '../modules/routes';
import {postFactory} from '../modules/validation';
import preferencesSet from '../modules/validation/schema/preferencesSet';

import {restrictLoginUser} from '../controller/user';
import * as controller from '../controller/preferences';


export default (app) => {

    app.post(
        routes.preferences,
        restrictLoginUser,
        postFactory(preferencesSet),
        controller.set
    );

//unused
//     app.get(
//         routes.preferences,
//         restrictLoginUser,
//         controller.get
//     );

};