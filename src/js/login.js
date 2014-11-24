define([
    'backbone',
    'text!login-page/templates/login.html',
    'underscore',
    'jquery'
], function(Backbone, template, _) {

    var expandTemplate = _.template('<i class="<%-icon%>"></i> <%-string%>');

    return Backbone.View.extend({

        el: 'body',

        template: _.template(template),

        iconMinusClass: 'icon-minus',
        iconPlusClass: 'icon-plus',
        controlGroupClass: 'control-group',
        errorClass: 'error',

        initialize: function(options) {
            _.bindAll(this, 'login');

            this.options = options;

            this.render();
        },

        render: function() {
            var usernameParam = /[&?]username=([^&]+)/.exec(window.location.search);
            var errorParam = /[&?]error=([^&]+)/.exec(window.location.search);
            var isDefaultLogin = /[&?]defaultLogin=([^&]+)/.exec(window.location.search);
            var isZkConfig = /[&?]isZkConfig=([^&]+)/.exec(window.location.search) && /[&?]isZkConfig=([^&]+)/.exec(window.location.search)[1] === 'true';
            var defaultUsername = isDefaultLogin ? isDefaultLogin[1] : '';
            var previousUrl = document.referrer;
            var isConfigUrl = previousUrl.indexOf(this.options.configURL) !== -1;

            this.$el.html(this.template({
                error: errorParam && this.options.strings.error[errorParam[1]],
                strings: this.options.strings,
                url: this.options.url,
                username: usernameParam && decodeURIComponent(usernameParam[1]),
                isNewLogin: isConfigUrl,
                isDefaultLogin: isDefaultLogin,
                isZkConfig: isZkConfig,
                defaultUsername: defaultUsername
            }));

            this.$('input').on('keypress change', _.bind(function(e) {
                var element = $(e.currentTarget);

                if(element.val()) {
                    element.closest('.' + this.controlGroupClass).removeClass(this.errorClass)
                           .closest('form').find('.alert-' + this.errorClass).remove();
                }
            }, this));

            this.$('button').on('click', this.login);

            if (isDefaultLogin) {
                this.$('#password').focus();
            } else {
                this.$('#username').focus();
            }

            //for expanding more info on config.json
            this.$('.config-info a[href="#"]').click(_.bind(function (e) {
                e.preventDefault();
                this.expand = !this.expand;

                var templateParameters;

                if(this.expand) {
                    templateParameters = {
                        icon: this.iconMinusClass,
                        string: this.options.strings.less
                    };
                }
                else {
                    templateParameters = {
                        icon: this.iconPlusClass,
                        string: this.options.strings.more
                    };
                }

                this.$('.config-info a').html(expandTemplate(templateParameters));
                this.$('.config-info .more-info').toggleClass('hide');
            }, this));
        },

        login: function(e) {
            e.preventDefault();

            var element = $(e.currentTarget);
            var valid = true;

            _.each(this.$('input'), function(input) {
                input = $(input);

                if(!input.val()) {
                    input.closest('.' + this.controlGroupClass).addClass(this.errorClass);
                    valid = false;
                }
            }, this);

            if(valid) {
                element.closest('form').submit();
            }
        }

    });

});