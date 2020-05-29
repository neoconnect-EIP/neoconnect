'use strict';

module.exports = {
    checkRegex: function(regex, string) {
        const regexTest = RegExp(regex);
        if (regexTest.test(string))
            return (true);
        return (false)

    }
};