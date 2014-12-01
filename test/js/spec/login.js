define([
    'login-page/js/login',
    'js-whatever/js/location',
    'jasmine-jquery'
], function(LoginPage, location) {

    var TestableLoginPage = LoginPage.extend({
        el: undefined
    });

    describe('Login Page', function() {
        describe('without parameters', function() {
            beforeEach(function() {
                spyOn(location, 'search').andReturn('');

                this.submissionSpy = jasmine.createSpy().andCallFake(function(e) {
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
                spyOn(location, 'search').andReturn('?error=authentication&username=arthur.dent');

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
                spyOn(location, 'search').andReturn('?defaultLogin=admin');

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
                spyOn(location, 'search').andReturn('?isZkConfig=true');

                this.templateSpy = jasmine.createSpy();

                this.loginPage = new (TestableLoginPage.extend({
                    template: this.templateSpy
                }))({
                    strings: {}
                })
            });

            it('should pass the parameter through to the template', function() {
                expect(this.templateSpy).toHaveCallCount(1);
                expect(this.templateSpy.calls[0].args[0].isZkConfig).toBe(true);
            });
        })

    });

});