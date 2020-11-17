'use strict';

module.exports = {
    themeSelection: function (theme) {
        if (theme === undefined)
            return (undefined);
        if (isNaN(theme) || theme < 1 || theme > 6)
            return (theme);
        switch (theme) {
            case '1':
                return ('Mode');
            case '2':
                return ('Cosmétique');
            case '3':
                return ('High tech');
            case '4':
                return ('Nourriture');
            case '5':
                return ('Jeux Vidéo');
            case '6':
                return ('Sport/Fitness');

        }
    }
};