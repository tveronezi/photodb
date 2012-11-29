require.config({
    baseUrl:'app/js',
    paths:{
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

requirejs(['Application', 'lib/less', 'lib/bootstrap'],
    function (app) {
        app.start();
    }
);
