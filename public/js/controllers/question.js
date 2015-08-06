define(['app',
    'views/question/collection',
    'views/question/single',
    'views/question/add',
    'views/folder/select',
    'views/answer/composite',
    'views/tag/select',
    'models/question',
    'models/answer',
    'models/folder',
    'models/tag'
], function (App, CollectionView, SingleView, AddView, SelectFolderView, AnswersCompositeView, Answer, SelectTagView) {
    App.module('Question', function (Question, App, Backbone, Marionette, $, _) {
        var Controller = Marionette.Controller.extend({
            questions: function () {
                $.when(App.request('question:collection')).done(function (questions) {
                    var questionsView = new CollectionView({collection: questions});
                    App.Main.Layout.getRegion('content').show(questionsView);

                    // Updating for search
                    Question.Controller.listenTo(questionsView, 'form:submit', function (searchQuery) {
                        $.when(App.request('question:collection', searchQuery))
                            .done(function (questions) {
                                // If any results
                                if (questions.length) {
                                    questionsView.collection = questions;
                                    questionsView.render();
                                } else {
                                    questionsView.triggerMethod('not:found');
                                }
                        });
                    });
                });
            },

            question: function (id) {
                require(['models/question'], function () {
                    $.when(
                        App.request('question:model', id),
                        App.request('answer:collection', id)
                    ).done(function (question, answers) {
                            // New question layout
                            var questionView = new SingleView({model: question});
                            App.Main.Layout.getRegion('content').show(questionView);

                            // New answer model for saving a new answer
                            var model = new  Answer.Model({
                                question_id: id,
                                count: answers.length
                            });

                            // New answers view
                            var answersView = new AnswersCompositeView({model: model, collection: answers});
                            questionView.answersRegion.show(answersView);

                            Question.Controller.listenTo(answersView, 'form:submit', function (model) {
                                $.when(App.request('answer:add', model))
                                    .done(function (savedModel) {
                                        answers.push(savedModel);

                                        // Add model and form clearing
                                        var freshModel = new  Answer.Model({
                                            question_id: id,
                                            count: answers.length
                                        });

                                        answersView.triggerMethod('model:refresh', freshModel);
                                    }).fail(function (errors) {
                                        answersView.triggerMethod('data:invalid', errors);
                                    });
                            });
                        });
                });
            },

            add: function () {
                $.when(App.request('folder:collection')).done(function (folders) {
                    $.when(App.request('tag:collection')).done(function (tags) {
                        var folder_view = new SelectFolderView({ collection: folders });
                        var tag_view = new SelectTagView({ collection: tags });
                        var view = new AddView({
                            folder_view: folder_view,
                            tag_view: tag_view
                        });
                        App.trigger('popup:show', {
                            header: {
                                title: 'Add new question'
                            },
                            class: 'question-add',
                            contentView: view
                        });

                        var self = this;

                        Question.Controller.listenTo(view, 'form:submit', function (data) {
                            $.when(App.request('question:add', data)).done(function (model) {
                                App.trigger('popup:close');
                                if (Backbone.history.navigate('/', { trigger: true })) {
                                    self.questions();
                                }
                            }).fail(function (errors) {
                                view.triggerMethod('data:invalid', errors);
                            });
                        });
                    });
                });
            }
        });

        Question.Controller = new Controller();
    });
    return App.Question.Controller;
});
