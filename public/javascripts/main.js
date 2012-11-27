require.config({
    paths: {
        /*    Libraries    */
        jquery: '/javascripts/lib/jquery-1.8.2',
        lib: '/javascripts/lib',

        /*    Application    */
        app: '/javascripts/app/app',
        modules: '/javascripts/app/modules',
        config: '/javascripts/app/config',
        eventEmitter: '/javascripts/lib/eventEmitter'
    },
    shim: {
        app : {
            deps : [
                'jquery',
                'eventEmitter'
            ]
        },
        eventEmitter: {
            deps: [
                'jquery'
            ]
        }
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
require(['app']);
