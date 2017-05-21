import {routes} from '../modules/routes';
import {postFactory} from '../modules/validation';
import preferencesSet from '../modules/validation/schema/preferencesSet';

import {restrictLoggedInUser} from '../controller/restrict';
import * as controller from '../controller/preferences';

export default (app) => {
    app.post(
        routes.preferences,
        restrictLoggedInUser,
        postFactory(preferencesSet),
        controller.set
    );

// unused
//     app.get(
//         routes.preferences,
//         restrictLoggedInUser,
//         controller.get
//     );
};
