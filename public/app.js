$(document).ready(function () {

    $.getJSON("/articles", function(data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
          // Display the apropos information on the page
        var newDiv = $("<div data-id=" + data[i]._id + ">")
        newDiv.append("<p class='article'>" + data[i].title + "<br />" + data[i].link + "</p>"+"<p>" + data[i].blurb +"</p>")
        newDiv.on("click", function(){
            console.log(this)
            var id = $(this).attr("data-id")
            // console.log(id)
            $.ajax({
                method: "GET",
                url: "/articles/saved/" + id
    
            }).then(function(result){
                console.log(result)
            })
        })
        $("#articles").append(newDiv);
        }
        
      });

    $("#save").on("click", function(){
        console.log("button clicked")
 
    })



})