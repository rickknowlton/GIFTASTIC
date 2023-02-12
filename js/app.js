$(document).ready(async function () {

  const topics = [
    "Tim and Eric",
    "Eric Andre",
    "On Cinema",
    "Superjail!",
    "Dr. Steve Brule",
    "Joe Pera",
    "Harvey Birdman",
    "Venture Bros.",
  ];

  let offset = 0;
  let gif;

  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  function populateButtons() {
    const buttonsContainer = $("#buttons");
    buttonsContainer.empty();

    for (let g = 0; g < topics.length; g++) {
      const topic = topics[g];
      const button = $(
        `<button class='gifBtn topicBtn btn btn-sm me-2 btn-outline-secondary' data-gif='${topic}'>${topic}</button>`
      );
      buttonsContainer.append(button);
    }
  }

  $("#addBtn").click((event) => {
    event.preventDefault();
    const newGif = $("#add").val().trim();
    if (!newGif) return;
    topics.push(newGif);
    populateButtons();
  });

  populateButtons();

  $(".buttons").on("click", ".topicBtn", function () {
    gif = $(this).data("gif");
    offset = 0;
    console.log(gif);
    $("#gifs").empty();
  });

  $(".buttons").on("click", ".gifBtn", function () {
    console.log(offset);
    let queryURL = `https://api.giphy.com/v1/gifs/search?q=${gif}&api_key=${apiKey}&limit=12`;

    if ($(this).hasClass("loadMore")) {
      offset += 12;
      console.log(`LOADING MORE: Querying "${gif}" at count #${offset}`);
      queryURL = `https://api.giphy.com/v1/gifs/search?q=${gif}&api_key=${apiKey}&limit=12&offset=${offset}`;
    }

    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      let results = response.data;
      console.log(results);
      $("#gifs");

      for (let i = 0; i < results.length; i++) {
        let gifContainer = $("<div>", {
          class:
            "gifContainer gx-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2",
        });
        let gifDiv = $("<div>", { class: "p-4 gif item" });
        let gifImg = $("<img>", {
          src: results[i].images.fixed_height_still.url,
          "data-state": "still",
          "data-still": results[i].images.fixed_height_still.url,
          "data-animate": results[i].images.fixed_height.url,
          "data-full": results[i].images.original.url,
          "data-embed": results[i].embed_url,
          "data-bs-toggle": "modal",
          "data-bs-target": "#gif-modal",
          title: gif,
        });
        let p = $("<p>", {
          class: "rating",
          text: "rated: " + results[i].rating,
        });

        gifDiv.append(gifImg).append(p);
        gifContainer.append(gifDiv);
        $("#gifs").append(gifContainer);

        const lastGif = document.querySelector(".gifContainer:last-child");
        lastGif.scrollIntoView({ behavior: "smooth" });
      }
    });

    $(".portal").hide();
    $(".loading").show();
  });

  $("#gifs").on("mouseenter", ".item img", function () {
    const $img = $(this);
    const still = $img.data("still");
    const animate = $img.data("animate");

    if ($img.data("state") === "still") {
      $img.attr("src", animate);
      $img.data("state", "animate");
    } else {
      $img.attr("src", still);
      $img.data("state", "still");
    }
  });

  $(".close").click(() => {
    $("#gif-modal").modal("hide");
  });

  $("#gifs").on("click", ".item", function () {
    const $img = $(this).find("img");
    const src = $img.attr("data-full");
    const embed = $img.attr("data-embed");
    const title = $img.attr("title");
    const modalImg = $("<img>", { src: src });
    const modalTitle = $("<h5>", { class: "modal-title" }).text(title);
    $(".modal-body").empty().append(modalImg);
    $("#gif-modal").modal();
    $(".modal-title").empty().text(title);
    $("#copy-link-field").val(src);
    $("#copy-embed-field").val(embed);
  });

  $("#copy-link-button").click(() => {
    navigator.clipboard.writeText($("#copy-link-field").val()).then(
      () => {
        console.log("GIF link code copied!");
      },
      (err) => {
        console.error("Failed to copy link: ", err);
      }
    );
  });

  $("#copy-embed-button").click(() => {
    navigator.clipboard.writeText($("#copy-embed-field").val()).then(
      () => {
        console.log("Embed code copied!");
      },
      (err) => {
        console.error("Failed to copy embed: ", err);
      }
    );
  });

  $(window).scroll(function () {
    if ($(this).scrollTop() > 800) {
      $("#topBtn").fadeIn();
    } else {
      $("#topBtn").fadeOut();
    }
  });

  $("#topBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 100);
    return false;
  });
});
