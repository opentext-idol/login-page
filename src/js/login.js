define([
    'backbone',
    'js-whatever/js/location',
    'text!login-page/templates/login.html',
    'underscore',
    'jquery'
], function(Backbone, location, template, _) {

    var expandTemplate = _.template('<i class="<%-icon%>"></i> <%-string%>');

    var more = function() {
        return expandTemplate({
            icon: this.iconPlusClass,
            string: this.options.strings.more
        })
    };

    var less = function() {
        return expandTemplate({
            icon: this.iconMinusClass,
            string: this.options.strings.less
        })
    };

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
            var usernameParam = /[&?]username=([^&]+)/.exec(location.search());
            var errorParam = /[&?]error=([^&]+)/.exec(location.search());
            var isDefaultLogin = /[&?]defaultLogin=([^&]+)/.exec(location.search());
            var isZkConfig = /[&?]isZkConfig=([^&]+)/.exec(location.search()) && /[&?]isZkConfig=([^&]+)/.exec(location.search())[1] === 'true';
            var defaultUsername = isDefaultLogin ? isDefaultLogin[1] : '';
            var previousUrl = document.referrer;
            var isConfigUrl = previousUrl.indexOf(this.options.configURL) !== -1;

            this.$el.html(this.template({
                defaultUsername: defaultUsername,
                error: errorParam && this.options.strings.error[errorParam[1]],
                expandTemplate: more.call(this),
                isDefaultLogin: isDefaultLogin,
                isNewLogin: isConfigUrl,
                isZkConfig: isZkConfig,
                strings: this.options.strings,
                url: this.options.url,
                username: usernameParam && decodeURIComponent(usernameParam[1])
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

                var html;

                if(this.expand) {
                    html = less.call(this)
                }
                else {
                    html = more.call(this)
                }

                this.$('.config-info a').html(html);
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