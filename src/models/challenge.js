const logger = require('../logger');

module.exports = function (mongoDB) {

    const challengeSchema = new mongoDB.Schema({
            player: [mongoDB.Schema.Types.ObjectId],
            results: mongoDB.Schema.Types.Mixed,
            currentPuzzle: mongoDB.Schema.Types.ObjectId

        },
        {
            timestamps: true
        });

    challengeSchema.index({player: 1, createdAt: 1});


    challengeSchema.statics.getByUser = (userId) => {

        return ChallengeModel.find({player: userId}).exec().catch((err)=> {
            if (err) {
                logger.error({player: userId}, 'mongoDB Error in challengeSchema.statics.getByUser');
            }
        }).then((data)=> {
            return data.map((obj) => {
                return obj.toObject({virtuals: true});
            });
        });

    };

    challengeSchema.virtual('state').get(function () {
        return 'ready';
    });


    challengeSchema.statics.getOpponentsOfUserInActiveChallenges = (userId) => {
        return ChallengeModel.find({player: userId}).exec().then((models) => {

            const users = new Set();

            models.forEach((model) => {
                model.player.forEach((player)=> {
                    if (player.toString() !== userId.toString()) {
                        users.add(player.toString());
                    }
                });
            });

            return Array.from(users);
        });
    };

    
    challengeSchema.statics.add = (userId, opponentId) => {
        return new ChallengeModel({player: [userId, opponentId], results: {}}).save().catch((err)=> {
            if (err) {
                logger.error({userId, opponentId}, 'challengeSchema.statics.add ');
            }
        }).then((data) => {
            return data.toObject({virtuals: true});
        });
    };

    //build model based on scheme
    const ChallengeModel = mongoDB.model('Challenge', challengeSchema);

    return ChallengeModel;

};
