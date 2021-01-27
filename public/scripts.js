var API_ENDPOINT = "https://8kjgipfzq5.execute-api.us-east-1.amazonaws.com/test";

$(document).ready(function () {
  $.ajax({
    url: API_ENDPOINT + '/educations',
    type: 'GET',
    success: function (response) {
      $.each(response, function (i, data) {
        var startDate = new Date(data['startDate']);
        var endDate = 'Current';
        if (data['endDate']) {
          endDate = new Date(data['endDate']).getFullYear();
        }
  
        $("#education").append(`
          <div class="entry">
            <h6>${startDate.getFullYear()} - ${endDate}</h6>
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
        var endDate = 'Current';
        if (data['endDate']) {
          endDate = new Date(data['endDate']).getFullYear();
        }

        $("#experience").append(`
          <div class="entry">
            <h6>${startDate.getFullYear()} - ${endDate}</h6>
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