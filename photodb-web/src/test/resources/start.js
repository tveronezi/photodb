require.config({
    baseUrl:'/src/main/webapp/app/js/',
    paths:{
        'test':'/src/test/javascript/test/',
        'text':'../lib/require/text',
        'lib/d3':'../lib/d3/d3.v2.min',
        'lib/less':'../lib/less/less-1.3.0.min',
        'lib/jquery':'../lib/jquery/jquery-1.7.2.min',
        'lib/bootstrap':'../lib/bootstrap/2.1.1/js/bootstrap.min',
        'lib/handlebars':'../lib/handlebars/handlebars-1.0.rc.1'
    },
    shim:{
        'lib/bootstrap':{
            deps:['lib/jquery']
        }
    }
});

(function () {
    var REQUIREMENTS = (function () {
        // We should list all our modules...
        var app = ['ApplicationChannel', 'ApplicationController', 'ApplicationModel', 'ApplicationTemplates',
            'util/DelayedTask', 'util/I18N', 'util/Log', 'util/Obj', 'util/Sequence',
            'view/ApplicationView', 'view/GrowlNotification'];

        // ... and libraries dependencies.
        var lib = ['lib/less', 'lib/jquery', 'lib/bootstrap', 'lib/handlebars'];

        // These are the test files under the "photodb/photodb-web/src/test/javascript/test" directory.
        var tests = ['test/I18N'];

        return app.concat(lib).concat(tests);
    })();

    /**
     * Load all the modules before starting.
     */
    require(REQUIREMENTS,
        function () {
            $(document).ready(function () {
                jasmine.getEnv().addReporter(
                    new jasmine.HtmlReporter()
                );
                jasmine.getEnv().execute();
            })

        }
    );
})();
