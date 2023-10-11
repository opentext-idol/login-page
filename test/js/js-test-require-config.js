/*
 * Copyright 2013-2015 Open Text.
 *
 * Licensed under the MIT License (the "License"); you may not use this file
 * except in compliance with the License.
 *
 * The only warranties for products and services of Open Text and its affiliates
 * and licensors ("Open Text") are as may be set forth in the express warranty
 * statements accompanying such products and services. Nothing herein should be
 * construed as constituting an additional warranty. Open Text shall not be
 * liable for technical or editorial errors or omissions contained herein. The
 * information contained herein is subject to change without notice.
 */

define(function() {
    require.config({
        baseUrl: '.',
        paths: {
            // lib
            backbone: 'node_modules/backbone/backbone',
            bootstrap: 'node_modules/bootstrap/dist/js/bootstrap',
            'jasmine-ajax': 'node_modules/jasmine-ajax/lib/mock-ajax',
            'jasmine-jquery': 'node_modules/jasmine-jquery/lib/jasmine-jquery',
            jquery: 'node_modules/jquery/dist/jquery',
            'js-testing': 'node_modules/hp-autonomy-js-testing-utils/src/js',
            'js-whatever': 'node_modules/hp-autonomy-js-whatever/src',
            text: 'node_modules/requirejs-text/text',
            underscore: 'node_modules/underscore/underscore',

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
