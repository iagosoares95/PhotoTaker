(($) => {
    const loadPhotos = function() {
        $.get('/get_photos', (resp) => {
            for (let i in resp) {
                $("#takedPhotos").find("tbody").append("");
                $("#takedPhotos").find("tbody").append(
                    "<tr>" +
                    "  <td>" + resp[i] + "</td>" +
                    "  <td>" +
                    "    <a href='/download_photo/" + resp[i] + "' download='" + resp[i] + "' class='btn'>" +
                    "       <span>Download</span>" +
                    "    </a>" +
                    "  </td>" +
                    "</tr>"
                )
            }
        });
    }
    $(document).ready(() => {
        loadPhotos();
    });
})(window.jQuery);