/*
 * Copyright 2013-2015 Hewlett-Packard Development Company, L.P.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 */

define(function() {
    require.config({
        baseUrl: '.',
        paths: {
            // lib
            backbone: 'bower_components/backbone/backbone',
            bootstrap: 'bower_components/bootstrap/js/bootstrap',
            'jasmine-ajax': 'bower_components/jasmine-ajax/lib/mock-ajax',
            'jasmine-jquery': 'bower_components/jasmine-jquery/lib/jasmine-jquery',
            jquery: 'bower_components/jquery/jquery',
            'js-testing': 'bower_components/hp-autonomy-js-testing-utils/src/js',
            'js-whatever': 'bower_components/hp-autonomy-js-whatever/src',
            text: 'bower_components/requirejs-text/text',
            underscore: 'bower_components/underscore/underscore',

            //dir
            test: 'test/js'
        },
        shim: {
            backbone: {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            bootstrap: {
                deps: ['jquery']
            },
            'jasmine-sinon': {
                deps:['sinon']
            },
            'jquery-steps': {
                deps: ['jquery']
            },
            sinon: {
                exports: 'sinon'
            },
            underscore: {
                exports: '_'
            }
        },
        // the jasmine grunt plugin loads all files based on their paths on disk
        // this breaks imports beginning in real or login-page
        // map here fixes it
        // list mocks here, not above
        map: {
            '*': {
                'login-page': 'src',
                'real': 'src'
            }
        }
    });
});