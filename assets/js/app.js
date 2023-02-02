$(document).ready(async function () {
  //------------------------------------------//
  //                Gif Array                 //
  //------------------------------------------//
  // We start by loading up our array of gifs //
  // which we'll use to query the giphy API.  //
  //------------------------------------------//

  const topics = [
    "Tim and Eric",
    "Eric Andre",
    "Rick and Morty",
    "Superjail!",
    "Dr. Steve Brule",
    "Sealab 2021",
  ];

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
    for (let g = 0; g < topics.length; g++) {
      $("#buttons").append(
        `<button class='gifBtn btn btn-sm btn-outline-secondary' dataGif='${topics[g]}'>${topics[g]}</button>`
      );
    }
  }

  $("#addBtn").on("click", function (event) {
    event.preventDefault();
    const newGif = $("#add").val();
    topics.push(newGif);
    populateButtons();
  });

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

  $("#buttons").on("click", ".gifBtn", async function () {
    const gif = $(this).attr("dataGif");
    const queryURL = `https://api.giphy.com/v1/gifs/search?q=${gif}&api_key=dc6zaTOxFJmzC&limit=12`;

    const response = await $.ajax({
      url: queryURL,
      method: "GET",
    });

    const results = response.data;
    $("#gifs").empty();

    for (let i = 0; i < results.length; i++) {
      const gifDiv = $("<div class='item col-md-4 col-lg-4'>");
      const gifImg = $("<img>");
      const p = $("<p class='rating'>").text(`rated: ${results[i].rating}`);

      gifImg.attr({
        src: results[i].images.fixed_height_still.url,
        "data-state": "still",
        "data-still": results[i].images.fixed_height_still.url,
        "data-animate": results[i].images.fixed_height.url,
      });

      gifDiv.prepend(p);
      gifDiv.prepend(gifImg);
      $("#gifs").prepend(gifDiv);
    }

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
    const state = $(this).attr("data-state");
    const move = $(this).attr("data-animate");
    const still = $(this).attr("data-still");

    if (state === "still") {
      $(this).attr("src", move);
      $(this).attr("data-state", "animate");
    } else if (state === "animate") {
      $(this).attr("src", still);
      $(this).attr("data-state", "still");
    }
  });
});
