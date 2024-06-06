frappe.listview_settings['Candiate Placement Details'] = {
    onload: function (listview) {
        $('.layout-side-section').hide();
    },
    refresh: function (listview) {
        // console.log(listview)
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
        function applyStyles(status, bgColor, textColor) {
            var elements = document.querySelectorAll(`.list-row-col.ellipsis.hidden-xs [data-filter="placement_status,=,${status}"]`);
            elements.forEach(function (element) {
                element.style.backgroundColor = bgColor;
                element.style.color = textColor;
                console.log(element);
            });
        }

        // Apply styles for different statuses
        applyStyles("Certified", "#E4F5E9", "#4C8266");
        applyStyles("Placed", "#ccdceb", "#3186d6");


    }
};