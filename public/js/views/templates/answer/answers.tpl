<div class="answers-list" >
    <header class="section-header">
        <span class="counter answers"><%- count %></span> answers
    </header>
    <ul id="answers" class="list-group"></ul>

    <!-- Adding form -->
    <div class="panel panel-default new-answer">
        <div class="panel-heading">
            <h3 class="panel-title">Your answer:</h3>
        </div>
        <div class="panel-body">
            <form class="form-horisontal" id="new-answer-form">
                <textarea name="description" id="description" rows="6"></textarea>
                <span class="help-block hidden"></span>
            </form>
        </div>
    </div>

    <div class="new-answer-controls">
        <input class="submit-btn btn btn-success" type="submit" form='new-answer-form' value="Save">
    </div>
</div>