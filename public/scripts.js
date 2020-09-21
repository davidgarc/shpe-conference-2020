var API_ENDPOINT = "https://wz4hek1qz8.execute-api.us-east-1.amazonaws.com/dev";

$(document).ready(function () {
  $.ajax({
    url: API_ENDPOINT + '/educations',
    type: 'GET',
    success: function (response) {
      $.each(response, function (i, data) {
        var startDate = new Date(data['startDate']);
        var endDate = new Date();
        if (data['endDate']) {
          endDate = new Date(data['endDate']);
        }
  
        $("#education").append(`
          <div class="entry">
            <h6>${startDate.getFullYear()} - ${endDate.getFullYear()}</h6>
            <h4>${data['name']}</h4>
            <p>${data['description']}</p>
          </div>
        `);
      });
    },
    error: function () {
      alert("error");
    }
  });

  $.ajax({
    url: API_ENDPOINT + '/experiences',
    type: 'GET',
    success: function (response) {
      $.each(response, function (i, data) {
        var startDate = new Date(data['startDate']);
        var endDate = new Date();
        if (data['endDate']) {
          endDate = new Date(data['endDate']);
        }

        $("#experience").append(`
          <div class="entry">
            <h6>${startDate.getFullYear()} - ${endDate.getFullYear()}</h6>
            <h4>${data['name']}</h4>
            <p>${data['description']}</p>
          </div>
        `);
      });
    },
    error: function () {
      alert("error");
    }
  });

  $.ajax({
    url: API_ENDPOINT + '/endorsements',
    type: 'GET',
    success: function (response) {
      $.each(response, function (i, data) {
        $(".endorsement-row").append(`
          <div class="endorsement">
            <p>${data['description']}</p>
            <h6>${data['name']}</h6>
          </div>
        `);
      });
    },
    error: function () {
      alert("error");
    }
  });
});