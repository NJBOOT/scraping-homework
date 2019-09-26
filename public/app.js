$(document).ready(function () {

    // $.getJSON("/articles", function(data) {
    //     // For each one
    //     for (var i = 0; i < data.length; i++) {
    //       // Display the apropos information on the page
    //       $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    //     }
    //   });

    $("#saved").on("click", function(){
        console.log("button clicked")
        var id = $(this).attr("data-id")
        // console.log(id)
        $.ajax({
            method: "GET",
            url: "/articles/saved/" + id

        }).then(function(result){
            console.log(result)
        })
    })

})