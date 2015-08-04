<form action="/questions">
    <div class="form-horizontal">
        <div class="error all"></div>
        <div class="control-group title">
            <label for="email" class="control-label col-sm-2">Title</label>
            <div class="col-sm-10">
                <input type="text" name="title" class="title form-control" placeholder="Title">
            </div>
            <div class="error title"></div>
        </div>

        <div class="control-group folder">
            <label for="folder" class="control-label col-sm-2">Folder</label>
            <div class="col-sm-10">
                <select name="folder" id="folder" class="folder-select form-control">
                    <option value="test">test</option>
                    <option value="folder">older</option>
                </select>
            </div>
            <div class="error folder"></div>
        </div>

        <div class="control-group description">
            <label for="description" class="control-label col-sm-2">Description</label>
            <div class="col-sm-10">
                <textarea name="description" class="description form-control" placeholder="description"></textarea>
            </div>
            <div class="error description"></div>
        </div>
    </div>
    <div class="control-group">
        <div class="controls">
            <button type="submit" class="btn btn-info">Save</button>
        </div>
    </div>
</form>