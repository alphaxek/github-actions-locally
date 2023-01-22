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


  for(var i = 0; i < workflow.length; i++){
    if (workflow[i].id  === thisItem) {
      workflow[i].querySelector(".active").style.backgroundColor = "#69A4FD";
      workflow[i].querySelector(".active").style.visibility = "visible";
    } else {
      workflow[i].querySelector(".active").style.visibility = "hidden";
    }
  }

  for(var i = 0; i < steps.length; i++){
    if (steps[i].id  === id) {
      steps[i].style.display = "inline";
    } else {
      steps[i].style.display = "none";
    }
  }

}