define([
    'app',
    'views/popup/confirm',
], function(App, confirmView) {
    App.module('Behaviors', function (Behaviors, App, Backbone, Marionette, $, _) {
        Behaviors.ConfirmationPopup = Marionette.Behavior.extend({
            defaults: {
                'title':        i18n.t("ui.confirm-title"),
                'body':         i18n.t("ui.confirm-body"),
                'actionName':   "submit"
            },

            onConfirmCreate: function (options) {
                var title = options.title ? options.title : this.options.title;
                var body = options.body ? options.body : this.options.body;

                var confirmationView = new confirmView({
                    message: body
                });

                App.trigger('popup:show', {
                    header: {
                        title: title
                    },
                    class: 'confirm-form',
                    contentView: confirmationView
                });

                var self = this;
                this.view.listenTo(
                    confirmationView,
                    'form:submit',
                    function () {
                        self.view.triggerMethod(
                            self.options.actionName
                        );

                        App.trigger('popup:close');
                    }
                )
            }
        });
    });

    return App.Behaviors.ConfirmationPopup;
});