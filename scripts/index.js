function showDetails(id) {
    var x = document.getElementById(id);
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
}

function showJobs(id, thisItem) {
  var steps = document.querySelectorAll(".step");
  var workflow = document.querySelectorAll(".workflow");

  document.getElementById("job-file-name").innerHTML = thisItem;

  for(var i = 0; i < workflow.length; i++){
    if (workflow[i].id  === thisItem) {
      workflow[i].querySelector(".active").style.backgroundColor = "#5c2da8";
      workflow[i].querySelector(".active").style.visibility = "visible";
    } else {
      workflow[i].querySelector(".active").style.visibility = "hidden";
    }
  }

  for(var i = 0; i < steps.length; i++){
    if (steps[i].id  === id) {
      steps[i].style.display = "grid";
    } else {
      steps[i].style.display = "none";
    }
  }
}

function checkApi(){
  $.ajax({
    type: "GET",
    url: "http://localhost:7867/heartbeat",
    dataType: "json",
    statusCode: {
      200: function(data) {
        $("#githubStatus").html("Running");
      }
    },
    success: function (result, status, xhr) {
      $("#githubStatus").html("Running");
    },
    error: function (xhr, status, error) {
      $("#githubStatus").html("Not Running");
    }
  });
}