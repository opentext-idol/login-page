/*
 * (c) Copyright 2013-2015 Micro Focus or one of its affiliates.
 *
 * Licensed under the MIT License (the "License"); you may not use this file
 * except in compliance with the License.
 *
 * The only warranties for products and services of Micro Focus and its affiliates
 * and licensors ("Micro Focus") are as may be set forth in the express warranty
 * statements accompanying such products and services. Nothing herein should be
 * construed as constituting an additional warranty. Micro Focus shall not be
 * liable for technical or editorial errors or omissions contained herein. The
 * information contained herein is subject to change without notice.
 */

define([
    'login-page/js/login',
    'js-whatever/js/location',
    'jasmine-jquery',
    'jasmine-ajax'
], function(LoginPage, location) {

    var TestableLoginPage = LoginPage.extend({
        el: undefined
    });

    describe('Login Page', function() {
        describe('without parameters', function() {
            beforeEach(function() {
                spyOn(location, 'search').and.returnValue('');

                this.submissionSpy = jasmine.createSpy().and.callFake(function(e) {
                    e.preventDefault();
                });

                this.loginPage = new TestableLoginPage({
                    strings: {
                        title: 'Login to My Super Awesome Application'
                    }
                });

                this.loginPage.$('form').submit(this.submissionSpy)
            });

            it('should allow submission when the form is filled in', function() {
                this.loginPage.$('[name="username"]').val('arthur.dent');
                this.loginPage.$('[name="password"]').val('42');
                this.loginPage.$('button').click();

                expect(this.submissionSpy).toHaveCallCount(1);
            });

            it('should prevent submission when the username is not filled in', function() {
                this.loginPage.$('[name="password"]').val('42');
                this.loginPage.$('button').click();

                expect(this.submissionSpy).not.toHaveBeenCalled();
            });

            it('should prevent submission when the password is not filled in', function() {
                this.loginPage.$('[name="username"]').val('arthur.dent');
                this.loginPage.$('button').click();

                expect(this.submissionSpy).not.toHaveBeenCalled();
            });

            it('should prevent submission when no fields are filled in', function() {
                this.loginPage.$('button').click();

                expect(this.submissionSpy).not.toHaveBeenCalled();
            });

            it('should not display an error message', function() {
                expect(this.loginPage.$('.alert-error')).toHaveLength(0)
            });
        });

        describe('with error and username parameters', function() {
            beforeEach(function() {
                spyOn(location, 'search').and.returnValue('?error=authentication&username=arthur.dent');

                this.loginPage = new TestableLoginPage({
                    strings: {
                        title: 'Login to My Super Awesome Application',
                        error: {
                            authentication: 'Failure to authenticate'
                        }
                    }
                })
            });

            it('should display an error message in the presence of an error parameter', function() {
                expect(this.loginPage.$('.alert-error')).toHaveLength(1);
                expect(this.loginPage.$('.alert-error').text().trim()).toBe('Failure to authenticate');
            });

            it('should pre-populate the username field', function() {
                expect(this.loginPage.$('[name="username"]').val()).toBe('arthur.dent');
            });

            it('should remove an error when a user types in the box', function() {
                expect(this.loginPage.$('.alert-error')).toHaveLength(1);

                this.loginPage.$('input').keypress();

                expect(this.loginPage.$('.alert-error')).toHaveLength(0);
            });
        });

        describe('with a defaultLogin parameter', function() {
            beforeEach(function() {
                spyOn(location, 'search').and.returnValue('?defaultLogin=admin');

                this.loginPage = new TestableLoginPage({
                    strings: {
                        less: 'Less',
                        more: 'More',
                        title: 'Login to My Super Awesome Application',
                        error: {
                            authentication: 'Failure to authenticate'
                        }
                    }
                })
            });

            it('should display additional info', function() {
                expect(this.loginPage.$('.config-info')).toHaveLength(1);
            });

            it('should allow further info to be shown and hidden', function() {
                expect(this.loginPage.$('.config-info a')).toHaveText('More');

                this.loginPage.$('.config-info a').click();

                expect(this.loginPage.$('.config-info a')).toHaveText('Less');

                _.each(this.loginPage.$('.more-info'), function($el) {
                    expect($el).not.toHaveClass('hide')
                });

                this.loginPage.$('.config-info a').click();

                _.each(this.loginPage.$('.more-info'), function($el) {
                    expect($el).toHaveClass('hide')
                });

                expect(this.loginPage.$('.config-info a')).toHaveText('More');
            });

            it('should pre-populate the username field', function() {
                expect(this.loginPage.$('[name="username"]')).toHaveValue('admin');
            });

            it('should make the username field read only', function() {
                expect(this.loginPage.$('[name="username"]')).toHaveProp('readonly', true);
            })
        });

        describe('with a zkConfig=true parameter', function() {
            beforeEach(function() {
                spyOn(location, 'search').and.returnValue('?isZkConfig=true');

                this.templateSpy = jasmine.createSpy();

                this.loginPage = new (TestableLoginPage.extend({
                    template: this.templateSpy
                }))({
                    strings: {}
                })
            });

            it('should pass the parameter through to the template', function() {
                expect(this.templateSpy).toHaveCallCount(1);
                expect(this.templateSpy.calls.argsFor(0)[0].isZkConfig).toBe(true);
            });
        });

        describe('with CSRF parameters', function() {
            beforeEach(function() {
                jasmine.Ajax.install();

                this.submissionSpy = jasmine.createSpy().and.callFake(function(e) {
                    e.preventDefault();
                });

                this.loginPage = new TestableLoginPage({
                    csrfParameterName: 'csrf-token',
                    csrfUrl: '/csrf-token',
                    strings: {
                        title: 'Login to My Super Awesome Application'
                    }
                });

                this.loginPage.$('form').submit(this.submissionSpy);
            });

            afterEach(function() {
                jasmine.Ajax.uninstall();
            });

            it('should render a CSRF input with the given name', function() {
                expect(this.loginPage.$('[name="csrf-token"]')).toHaveLength(1);
            });

            describe('when the login button is clicked', function() {
                beforeEach(function() {
                    this.loginPage.$('[name="username"]').val('arthur.dent');
                    this.loginPage.$('[name="password"]').val('42');
                    this.loginPage.$('button').click();

                    jasmine.Ajax.requests.mostRecent().respondWith({
                        status: 200,
                        contentType: 'application/json',
                        responseText: '{"token": "super-secret-token"}'
                    });
                });

                it('should request the CSRF token from the server', function() {
                    var request = jasmine.Ajax.requests.mostRecent();

                    expect(request.url).toBe('/csrf-token');
                    expect(this.loginPage.$('[name="csrf-token"]')).toHaveValue('super-secret-token');
                });

                it('should submit the token with the form', function() {
                    expect(this.loginPage.$('form').serialize()).toContain('csrf-token=super-secret-token')
                });
            })
        });

    });

});
