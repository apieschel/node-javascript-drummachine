$(document).ready(function() {
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
            document.querySelector("#wavContainer").append(select);
          }
        }
      });
    }
  } 
  
  $('#clearDirectory').submit(function(e){
    const url = "/music/delete";
    $.ajax({
      type: "DELETE",
      url: url,
      data: $(this).serialize(),
      success: function(data) {
        alert("All files deleted from the music directory.");
        location.reload();
      }
    });
    e.preventDefault();
  });
  
});