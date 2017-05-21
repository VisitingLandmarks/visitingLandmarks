import config from '../../config';
import logger from '../modules/logger';
import path from 'path';

import { MongoClient } from 'mongodb';
import Umzug from 'umzug';

// create db connection and execute migrations afterwards
MongoClient.connect(config.mongoDB.connectURI).then((db) => {
    const umzug = new Umzug({
        migrations: {
            path: path.resolve(__dirname, './migrations'),
        },
        storage: 'umzug-mongo',
        storageOptions: {
            storageOptions: { // this doubled storageOptions is needed, because there was a change in umzug and umzug-mongo wasn't updated -> https://github.com/patrickhulce/umzug-mongo/issues/1
                connection: db,
                collectionName: 'Migration',
            },
        },
    });

    // just some logging
    umzug.on('migrating', (name, migration) => logger.info({migration: name}, 'migration start'));
    umzug.on('migrated', (name, migration) => logger.info({migration: name}, 'migration done'));

    // execute migration
    umzug.up().then((migrations) => {
        logger.info({count: migrations.length}, 'migrations executed');
        process.exit();
    });
});
