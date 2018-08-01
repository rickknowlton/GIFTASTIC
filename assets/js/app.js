$(document).ready(function () {

    //------------------------------------------//
    //                Gif Array                 //
    //------------------------------------------//
    // We start by loading up our array of gifs //
    // which we'll use to query the giphy API.  //  
    //------------------------------------------//

    var topics = ["Tim and Eric", "Eric Andre", "Rick and Morty", "Superjail!", "Dr. Steve Brule", "Sealab 2021"];


    //------------------------------------------//
    //           Populate/Add Buttons           //
    //------------------------------------------//
    // Here we popluate our buttons when the    //
    // the user initially loads our page. We    //
    // also allow the user to create their own  //
    // buttons.                                 //
    //------------------------------------------//

    function populateButtons() {
        $("#buttons").empty();
        for (var g = 0; g < topics.length; g++) {
            $("#buttons").append("<button class='gifBtn btn btn-sm btn-outline-secondary' dataGif='" + topics[g] + "'>" + topics[g] + "</button>");
        }
    }

    $("#addBtn").on("click", function (event) {
        event.preventDefault();
        var newGif = $("#add").val();
        topics.push(newGif);
        populateButtons();
    })

    populateButtons();

    //------------------------------------------//
    //                Load Gifs                 //
    //------------------------------------------//
    // If this was an episode of MTV Cribs then //
    // this is where I'd say the "magic"        //
    // happens. When the user clicks a button   //
    // it fires out an API call to giphy and it //
    // retrieves the data we've queried. We     //
    // then take that data and use it to create //
    // our image gallery.                       //
    //------------------------------------------//


    $("#buttons").on("click", ".gifBtn", function () {
        var gif = $(this).attr("dataGif");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&api_key=dc6zaTOxFJmzC&limit=12";

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function (response) {
                var results = response.data;
                $("#gifs").empty();

                for (var i = 0; i < results.length; i++) {
                    var gifDiv = $("<div class='item col-md-4 col-lg-4'>");
                    var gifImg = $("<img>");
                    var p = $("<p class='rating'>").text("rated: " + results[i].rating);

                    var dataState = gifImg.attr("data-state", "still");
                    var dataStill = gifImg.attr("data-still", results[i].images.fixed_height_still.url);
                    var dataAnimate = gifImg.attr("data-animate", results[i].images.fixed_height.url);

                    gifImg.attr("src", results[i].images.fixed_height_still.url);
                    gifDiv.prepend(p);
                    gifDiv.prepend(gifImg);
                    $("#gifs").prepend(gifDiv);
                }
            });

        $(".portal").hide();

    });
    
    //------------------------------------------//
    //           Animate Gif Function           //
    //------------------------------------------//
    // Here we create a function that animates  //
    // our gifs by changing the data state,     //
    // which we do by manipulating the image    //
    // source that we pull from via a simple if //  
    // statement.                               //
    //------------------------------------------//

    $("#gifs").on("click", ".item img", function () {
        var state = $(this).attr("data-state");
        var move = $(this).attr("data-animate");
        var still = $(this).attr("data-still");

        if (state === "still") {
            $(this).attr("src", move);
            $(this).attr("data-state", "animate");
        } else if (state === "animate") {
            $(this).attr("src", still);
            $(this).attr("data-state", "still");
        }
    })
});