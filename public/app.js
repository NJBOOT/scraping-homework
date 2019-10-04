$(document).ready(function () {

    $(document).on("click", "#saved-articles", function () {
        console.log("Saved Articles Clicked")
        window.location.href = "saved.html"
    })

    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page
            var newDiv = $("<div class='article'>")

            newDiv.append("<p class='article-title'>" + data[i].title +
                "<span><button data-id=" + data[i]._id + " class='save-article'> Save</button></span><span><button data-id="
                + data[i]._id + " class='note'>Create Note</button></span></p>"
                + "<a class='article-link' href=" + data[i].link + ">" + data[i].link + "</a>"
                + "<p class='article-blurb'>" + data[i].blurb + "</p><br>")
            $("#articles").append(newDiv);
        }
    })

    $(document).on("click", ".save-article", function () {
        console.log(this)
        var id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/articles/saved/" + id

        }).then(function (result) {
            console.log(result)
        })
    })

    $("#scrape").on("click", function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (result) {
            console.log(result)
            window.location.reload(true)
        })
    })

    $.getJSON("/saved", function (data) {
        for (var i = 0; i < data.length; i++) {

            var parentDiv = $("<div id='" + data[i]._id + "'>")

            var title = $("<p class='title'>" + data[i].title + "<span><button data-id=" + data[i]._id + " class='delete-article'> Delete Article</button></span><span><button data-id=" + data[i]._id + " class='view-note'>View Note</button></span></p>")

            var link = $("<p class='link'>" + data[i].link + "</p>")
            var blurb = $("<p class='blurb'>" + data[i].blurb + "</p>")

            parentDiv.append(title, link, blurb)
            $("#saved-articles").append(parentDiv)
        }
    })

    $(document).on("click", ".delete-article", function () {
        console.log(this)
        var id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/articles/delete/" + id
        }).then(function (result) {
            $("#" + id).hide()
        })
    })

    $(document).on("click", ".note", function () {
        var id = $(this).attr("data-id")

        var noteDiv = $("<div class='note-div modal'>")
        var h2 = $("<h2>Add a Note</h2>")
        var title = $("<input class='note-title'></input>")
        var input = $("<textarea class='note-body'></textarea>")
        var submit = $("<button data-id=" + id + " class='submit-note'>Submit</button>")
        noteDiv.append(h2, title, input, submit)
        $(".container").append(noteDiv)
    })

    // ajax call to get the notes
    $(document).on("click", ".view-note", function () {
        var id = $(this).attr("data-id")
        $.ajax({
            method: "GET",
            url: "/savenote/" + id
        }).then(function (data) {
            console.log(data)
        })
    })
    // ajax call to post a note 
    $(document).on("click", ".submit-note", function () {
        var id = $(this).attr("data-id")
        console.log(id)
        $.ajax({
            method: "POST",
            url: "/savenote/" + id,
            data: {
                title: $(".note-title").val(),
                body: $(".note-body").val()
            }
        }).then(function (data) {
            console.log(data)
        })
        $(".note-title").val("");
        $(".note-body").val("")
    })

    $(document).on("click", "#clear", function () {
        $.ajax({
            method: "DELETE",
            url: "/articles"
        }).then(function (data) {
            window.location.reload(true)
            console.log(data)
        })
    })

})