$(document).ready(function() {
  
  $('#currentFiles').submit(function(e) {
    $.ajax({
      url: '/music/directory',
      type: 'get',
      data: $('#currentFiles').serialize(),
      success: function(data) {
        $("#jsonResult").empty();
        if(data.files[0]) {
          for(let i = 0; i < data.files[0].length; i++) {
            let audio = document.createElement("audio");
            audio.src = "/public/music/" + data.directory + "/" + data.files[0][i];
            audio.controls = "true";
            $("#jsonResult").append(audio);
          }
        }
      }
    });
    e.preventDefault();
  });

  const http = new XMLHttpRequest();
  const url='/music';
  http.open("GET", url);
  http.send();
  http.onreadystatechange = function() {
    if(this.readyState == 4) {
      $.ajax({
        url: '/music',
        type: 'get',
        data: $('#currentFiles').serialize(),
        success: function(data) {
          if(data.files[0]) {
            let select = document.createElement("select");
            select.required = "true";
            select.name = "directory";
            for(let i = 0; i < data.files[0].length; i++) {
              let option = document.createElement("option");
              option.value = data.files[0][i];
              option.innerText = data.files[0][i];
              select.append(option);
            }
            document.querySelector("#currentFiles").append(select);
          }
        }
      });
    }
  } 
});