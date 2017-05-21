import {setUserPreference} from '../data';

export const set = (req, res, next) => {
    setUserPreference(req.user, req.body)
        .then(() => {
            res.json(req.body);
        })
        .catch((err) => {
            req.log.error({err, changed: req.body}, 'Error in preference set');
            next(err);
        });
};

// Unused
// export const get = (req, res, next) => {
//
//     const key = req.params.key;
//
//     dataRepository.User.getPreference(key)
//         .then((value) => {
//             res.json({key, value});
//         })
//         .catch((err) => {
//             req.log.error({err, key}, 'Error in preference get');
//             next(err);
//         });
//
// };
