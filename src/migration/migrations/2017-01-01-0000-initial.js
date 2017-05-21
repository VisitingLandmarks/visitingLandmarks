import getMongoModel from '../../data/mongoDB';

module.exports = {
    up: () => {
        const IntlModel = getMongoModel('intl');

        return Promise.all([
            new IntlModel({
                'locale': 'de',
                'messages': {
                    'dialog': {
                        'auth': {
                            'facebook': 'Anmelden mit Facebook',
                            'google': 'Anmelden mit Google',
                        },
                        'changePassword': {
                            'title': 'Password ändern',
                        },
                        'login': {
                            'title': 'Anmelden',
                        },
                        'register': {
                            'title': 'Registrieren',
                        },
                        'profile': {
                            'title': 'Dein Profil - {userEmail}',
                            'changePassword': 'Password ändern',
                            'confirmed': 'Account bestätigt',
                            'visitedLocations': 'Deine Besuche',
                            'categories': 'Dein Kategoriefortschritt',
                        },
                        'userPassword': {
                            'email': 'Email',
                            'password': 'Password',
                        },
                        'conversionLocationVisit': {
                            'title': 'Sammel deine erste Sehenswürdigkeit',
                            'intro': 'Du bist in der Nähe von {name} ({constructionYear}).',
                            'callToAction': 'Registriere dich jetzt und starte deine Sammlung!',
                        },
                        'close': 'Schließen',
                        'cancel': 'Abbrechen',
                        'submit': 'Senden',
                    },
                    'language': {
                        'en': 'English',
                        'de': 'Deutsch',
                    },
                    'menu': {
                        'language': 'Sprache',
                        'profile': 'Dein Profil',
                        'logout': 'Abmelden',
                        'login': 'Anmelden',
                        'register': 'Registrieren',
                        'follow': 'Zentrierte Karte',
                        'resetPassword': 'Passwort vergessen?',
                        'title': 'Menü',
                    },
                },
            }).save(),
            new IntlModel({
                'locale': 'en',
                'messages': {
                    'dialog': {
                        'auth': {
                            'facebook': 'Sign in using Facebook',
                            'google': 'Sign in using Google',
                        },
                        'changePassword': {
                            'title': 'Change Password',
                        },
                        'login': {
                            'title': 'Sign In',
                        },
                        'register': {
                            'title': 'Register',
                        },
                        'profile': {
                            'changePassword': 'Change Password',
                            'title': 'Your Profile - {userEmail}',
                            'confirmed': 'Confirmed Account',
                            'visitedLocations': 'Your visited Locations',
                            'categories': 'Your category progress',
                        },
                        'userPassword': {
                            'email': 'Email',
                            'password': 'Password',
                        },
                        'conversionLocationVisit': {
                            'title': 'Claim your first location',
                            'intro': 'You are close to {name} ({constructionYear}).',
                            'callToAction': 'Get now an account and start your collection!',
                        },
                        'close': 'Close',
                        'cancel': 'Cancel',
                        'submit': 'Submit',
                    },
                    'language': {
                        'en': 'English',
                        'de': 'Deutsch',
                    },
                    'menu': {
                        'language': 'Language',
                        'profile': 'Your Profile',
                        'logout': 'Sing out',
                        'login': 'Sign in',
                        'register': 'Register',
                        'follow': 'Auto center map',
                        'resetPassword': 'Forgot Password?',
                        'title': 'Menu',
                    },
                },
            }).save(),
        ]);
    },
};
