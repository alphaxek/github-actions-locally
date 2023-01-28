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
  $("#gitRefresh").addClass("rotate");

  $.ajax({
    type: "GET",
    url: "http://localhost:7867/heartbeat",
    dataType: "json",
    statusCode: {
      200: function(data) {
        $("#githubStatus").html("Running");
        $("#gitRefresh").removeClass("rotate");
      }
    },
    success: function (result, status, xhr) {
      $("#githubStatus").html("Running");
      $("#gitRefresh").removeClass("rotate");
    },
    error: function (xhr, status, error) {
      $("#githubStatus").html("Not Running");
      $("#gitRefresh").removeClass("rotate");
    }
  });
}

function checkDocker(){
  $("#dockerRefresh").addClass("rotate");

  $.ajax({
    type: "GET",
    url: "http://localhost:7867/isdocker",
    dataType: "json",
    statusCode: {
      200: function(data) {
        $("#dockerStatus").html("Running");
        $("#dockerRefresh").removeClass("rotate");
      }
    },
    success: function (result, status, xhr) {
      $("#dockerStatus").html("Running");
      $("#dockerRefresh").removeClass("rotate");
    },
    error: function (xhr, status, error) {
      $("#dockerStatus").html("Not Running");
      $("#dockerRefresh").removeClass("rotate");
    }
  });
}

function runJobInWorkflow(job, workflow, path, jobNum, imgLoading, imgSuccess, imgRemove, bunnyCute){
    let start = Date.now();
    $(`#img${jobNum}`).attr("src", `${imgLoading}`);
    $(`#response${jobNum}`).html(`<div class="hr"></div><p><i>Running</i></p>`);
    $(`#jobStatus`).html(`<i>Running</i>`);
    $(`#timeTakenStatus`).html(`<img src="${bunnyCute}" class="symbol-md"/>`);
    $.ajax({
      type: "POST",
      url: `http://localhost:7867/runjobinworkflow?job=${job}&workflow=${encodeURI(workflow)}&path=${path+'\\.github\\workflows\\'}`,
      dataType: "json",
      statusCode: {
      200: function(result) {
          let end = Date.now();
          let elapsed = (end - start)/1000;
          $(`#response${jobNum}`).html(`<div class="hr"></div><p><b>This job took ${elapsed}s</b> <br><br>${JSON.stringify(result.response)}</p>`);
          $(`#img${jobNum}`).attr("src", `${imgSuccess}`);
          $(`#jobStatus`).html("Successful");
          $(`#timeTakenStatus`).html(`${elapsed}s`);
        }
      },
      success: function (result, status, xhr) {
        let end = Date.now();
        let elapsed = (end - start)/1000;
        $(`#response${jobNum}`).html(`<div class="hr"></div><p><b>This job took ${elapsed}s</b> <br><br>${JSON.stringify(result.response)}</p>`);
        $(`#img${jobNum}`).attr("src", `${imgSuccess}`);
        $(`#jobStatus`).html("Successful");
        $(`#timeTakenStatus`).html(`${elapsed}s`);
      },
      error: function (error, xhr, status) {
        let end = Date.now();
        let elapsed = (end - start)/1000;
        $(`#response${jobNum}`).html(`<div class="hr"></div><p><b>This job took ${elapsed}s</b> <br><br>${JSON.stringify(error.response)}</p>`);
        $(`#img${jobNum}`).attr("src", `${imgRemove}`);
        $(`#jobStatus`).html("Failed");
        $(`#timeTakenStatus`).html(`${elapsed}s`);
      }
    });
}