define(['app'], function (App) {
    App.module('Routes', function (Routes, App, Backbone, Marionette, $, _) {
        // routes
        Routes.Router = Marionette.AppRouter.extend({
            appRoutes: {
                '': 'questions',
                'questions': 'questions',
                'login': 'login'
            }
        });

        var API = {
            login: function () {
                require(['controllers/user'], function (controller) {
                    controller.login();
                });
            },
            questions: function () {
                require(['controllers/question'], function (controller) {
                    controller.questions();
                });
            },
            questionsAdd: function () {
                require(['controllers/question'], function (controller) {
                    controller.add();
                });
            },
            popupShow: function (data) {
                require(['controllers/popup'], function (controller) {
                    controller.show(data);
                });
            }
        };

        App.addInitializer(function(){
            new Routes.Router({
                controller: API
            });
        });

        this.listenTo(App, 'popup:show', function (data) {
            API.popupShow(data);
        });

        this.listenTo(App, 'question:add', function () {
            API.questionsAdd();
        });

        $(document).on('click', 'a:not([data-bypass],[target])', function(evt) {
            var href = $(this).attr('href'),
                protocol = this.protocol + '//';

            if (href === '#') {
                evt.preventDefault();
            }

            if (evt.metaKey || evt.ctrlKey) {
                return;
            }

            if (href && href.slice(0, protocol.length) !== protocol &&
                href.indexOf('#') !== 0 &&
                href.indexOf('javascript:') !== 0 &&
                href.indexOf('mailto:') !== 0 &&
                href.indexOf('tel:') !== 0
            ) {
                evt.preventDefault();
                Backbone.history.navigate(href, true);
            }
        });
    });
    return App.Routes.Router;
});
