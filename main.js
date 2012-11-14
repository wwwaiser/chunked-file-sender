require.config({
    paths: {
        /*    Libraries    */
        jquery     : '/javascript/lib/jquery-1.8.2',

        /*    Application    */
        app    : '/javascript/app/app',
    },

    shim: {
        bootstrap :  {
            deps : ['jquery']
        },
        app : {
            deps : [
                'bootstrap',
                'validator',
                'i18n',
                'less',
                'cookie',
                'block'
            ]
        },
        block : {
            deps : ['jquery']
        },
        validator : {
            deps : ['jquery']
        },
        i18n : {
            deps : ['jquery', 'cookie']
        },
        cookie : {
            deps : ['jquery']
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
require(['app']);
