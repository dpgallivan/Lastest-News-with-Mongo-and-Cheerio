function getResults() {
  $("#results").empty();
  $.getJSON("/all", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#results").prepend("<p class='dataentry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
        data[i]._id + ">" + data[i].title + "</span><span class=deleter>X</span></p>");
    }
  });
}

getResults();

// When the make new button is clicked
$(document).on("click", "#makenew", function() {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/submit",
    data: {
      title: $("#title").val(),
      note: $("#note").val(),
      created: Date.now()
    }
  })
  // Add the title and a delete button for the note to the page
  .done(function(data) {
    $("#results").prepend("<p class='dataentry' data-id=" + data._id + "><span class='dataTitle' data-id=" +
      data._id + ">" + data.title + "</span><span class=deleter>X</span></p>");
    $("#note").val("");
    $("#title").val("");
  }
  );
});

// When the clear all button is pressed
$("#clearall").on("click", function() {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: "/clearall",
    success: function(response) {
      $("#results").empty();
    }
  });
});


// When user clicks the deleter button for a note
$(document).on("click", ".deleter", function() {
  var selected = $(this).parent();
  $.ajax({
    type: "GET",
    url: "/delete/" + selected.attr("data-id"),
    success: function(response) {
      selected.remove();
      $("#note").val("");
      $("#title").val("");
      $("#actionbutton").html("<button id='makenew'>Submit</button>");
    }
  });
});

// Shows the note and updates
$(document).on("click", ".dataTitle", function() {
  var selected = $(this);
  $.ajax({
    type: "GET",
    url: "/find/" + selected.attr("data-id"),
    success: function(data) {
      $("#note").val(data.note);
      $("#title").val(data.title);
      $("#actionbutton").html("<button id='updater' data-id='" + data._id + "'>Update</button>");
    }
  });
});

// Updates the specific note
$(document).on("click", "#updater", function() {
  var selected = $(this);
  $.ajax({
    type: "POST",
    url: "/update/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    success: function(data) {
      $("#note").val("");
      $("#title").val("");
      $("#actionbutton").html("<button id='makenew'>Submit</button>");
      getResults();
    }
  });
});