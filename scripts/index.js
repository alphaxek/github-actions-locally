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
  $("body").css("cursor","wait");
  $(".run").addClass("disable-job-run");
  
  $.ajax({
    type: "GET",
    url: "http://localhost:7867/heartbeat",
    dataType: "json",
    statusCode: {
      200: function(data) {
        $("#githubStatus").html("GAL API <i>Running</i>");
        $("#gitRefresh").removeClass("rotate");
        $(".error-bar-gal-api").css("display", "none");
        $("body").css("cursor","default");
        $("#runJob").removeClass("disable-job-run");
      }
    },
    error: function (xhr, status, error) {
      $("#githubStatus").html("GAL API <i>Not Running</i>");
      $("#gitRefresh").removeClass("rotate");
      $(".error-bar-gal-api").css("display", "block");
      $("#runJob").addClass("disable-job-run");
      $("body").css("cursor","default");
    }
  });
}

function checkDocker(){
  $("#dockerRefresh").addClass("rotate");
  $("body").css("cursor","wait");
  $(".run").addClass("disable-job-run");

  $.ajax({
    type: "GET",
    url: "http://localhost:7867/isdocker",
    dataType: "json",
    statusCode: {
      200: function(data) {
        $("#dockerStatus").html("Docker <i>Running</i>");
        $("#dockerRefresh").removeClass("rotate");
        $(".error-bar-docker").css("display", "none");
        $(".run").removeClass("disable-job-run");
        $("body").css("cursor","default");
      }
    },
    error: function (xhr, status, error) {
      $("#dockerStatus").html("Docker <i>Not Running</i>");
      $("#dockerRefresh").removeClass("rotate");
      $(".error-bar-docker").css("display", "block");
      $(".run").addClass("disable-job-run");
      $("body").css("cursor","default");
    }
  });
}

function stopApi(){
  $.ajax({
    type: "GET",
    url: "http://localhost:7867/stopApi",
    dataType: "json",
    statusCode: {
      200: function(data) {
        setTimeout(function () {
          checkApi();
        }, 2000);
      }
    },
    error: function (xhr, status, error) {
      setTimeout(function () {
        checkApi();
      }, 2000);
    }
  });
}

function runJobInWorkflow(job, workflow, path, jobNum, imgLoading, imgSuccess, imgRemove, bunnyCute){
  let start = Date.now();
  let ApiResponse = ``;

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

        for (var i=0; i < result.response.length; i++) {
          ApiResponse += `<p><b>${i}</b>. ${JSON.stringify(result.response[i])}</p>`;
        }

        $(`#response${jobNum}`).html(`<div class="hr"></div><p><b>This job took ${elapsed}s</b> <br><br>${ApiResponse}</p>`);
        $(`#img${jobNum}`).attr("src", `${imgSuccess}`);
        $(`#jobStatus`).html("Successful");
        $(`#timeTakenStatus`).html(`${elapsed}s`);
      }
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