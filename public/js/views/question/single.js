define([
    'app',
    'tpl!views/templates/question/question-layout.tpl',
    'views/answer/collection',
    'views/tag/view',
    'views/views-mixins',
    'views/popup/confirm',
    'stickit',
    'highlight',
    'ckeditor',
    'ckeditor.adapter'
], function (App, QuestionLayoutTpl, AnswersCompositeView, TagView, ViewsMixins,
             confirmView) {
    App.module('Question.Views', function (View, App, Backbone, Marionette, $, _) {
        View.QuestionLayout = Marionette.LayoutView.extend(
            _.extend({},
                ViewsMixins.ContainsVotes,
                ViewsMixins.Editable,
                {
                    tagname: 'div',
                    id: 'question-view',
                    template: QuestionLayoutTpl,
                    regions: {
                        answersRegion: '#answers-region',
                        commentsRegion: '#comments-region',
                        tag: '.tags',
                        votes: '.question-votes'
                    },
                    ui: {
                        itemArea: '.question_view *',
                        commentButton: '.add-comment',
                        answerButton: '.add-answer',
                        entryControls: '.actions .entry-controls',
                        deleteButton:  '.actions .entry-controls .delete'
                    },
                    events: {
                        'click @ui.commentButton': 'showCommentForm',
                        'click @ui.answerButton': 'toAnswerForm',
                        'mouseup p': 'selectText',
                        'mouseover @ui.itemArea': 'showControls',
                        'mouseout @ui.itemArea': 'hideControls',
                        'click @ui.deleteButton': 'onDelete'
                    },

                    selectText: function() {
                        var text = App.helper.getSelected();
                        if (
                            text && (
                                text = new String(text).replace(/^\s+|\s+$/g,''))
                        ) {
                            text = '<blockquote><span class="author">' +
                                '<time class="relative" data-abs-time="' +
                                this.model.get('created_at') + '">' +
                                this.model.get('created_relative') + '</time>' +
                                ' by ' + this.model.attributes.user.first_name+
                                ' ' + this.model.attributes.user.last_name +
                                ':</span><br/>' + text + ' </blockquote>';
                            this.newAnswerEditor.focus();
                            App.helper.moveFocus(this.newAnswerEditor, text);
                            $('html, body').scrollTop(
                                $('#new-answer-form').offset().top
                            );
                        }
                    },

                    showCommentForm: function (e) {
                        e.stopPropagation();
                        var el = $(e.target)
                            .parents('.question_view')
                            .siblings('#comments-region')
                            .find('section .comment-form');
                        el.toggle();
                        $(e.target).toggleClass('form-open');
                        el.find('textarea').focus();
                    },

                    toAnswerForm: function () {
                        $('html, body').scrollTop(
                            $('#new-answer-form').offset().top
                        );
                        this.newAnswerEditor.focus();
                    },

                    onDelete: function () {
                        var popupConfirm = new confirmView({
                            message: i18n.t("questions.confirm-del-body")
                        });

                        App.trigger('popup:show', {
                            header: {
                                title: i18n.t('questions.confirm-del-title')
                            },
                            class: 'confirm-form',
                            contentView: popupConfirm
                        });

                        this.listenTo(
                            popupConfirm,
                            'form:submit',
                            function () {
                                this.trigger('submit:delete', this.model);
                            }
                        )
                    },

                    onShow: function () {
                        var self = this;
                        $.when(App.request('tag:reset', this.model.get('tags')))
                            .done(function (tags) {
                                self.getRegion('tag')
                                    .show(new TagView({
                                        collection: tags
                                    }));
                        });

                        // Highligting code-snippets
                        $('pre code').each(function(i, block) {
                            hljs.highlightBlock(block);
                        });

                        this.showVotes();
                    },

                    initialize: function (options) {
                        var self = this;
                        this.listenTo(this.model, 'change:vote_value', function() {
                            self.showVotes();
                        });
                    }
                }
            )
        );
    });
    return App.Question.Views.QuestionLayout;
});