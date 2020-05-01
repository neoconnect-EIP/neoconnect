'use strict';

module.exports = {
    themeSelection: function (theme) {
        if (theme === undefined)
            return (undefined);
        if (isNaN(theme) || theme < 1 || theme > 6)
            return (theme);
        switch (theme) {
            case '1':
                return ('mode');
            case '2':
                return ('cosmetique');
            case '3':
                return ('high tech');
            case '4':
                return ('food');
            case '5':
                return ('jeux video');
            case '6':
                return ('sport/fitness');

        }
    }
};