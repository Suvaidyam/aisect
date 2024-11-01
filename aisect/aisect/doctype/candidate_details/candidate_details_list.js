frappe.listview_settings['Candidate Details'] = {
    onload: function (listview) {
        if(!frappe.user_roles.includes('Administrator')){
            action_items(listview, ['Export', 'Delete'])
        }
        $('.layout-side-section').hide();
        $('.sidebar-section.filter-section').hide();
        $('.sidebar-section.save-filter-section').hide();
        $(".custom-actions").hide();
    },
    refresh: function (listview) {
        listview.clear_checked_items()
        $(".list-row-activity").hide();
        $("use.like-icon").hide();
        function applyStyles(status, bgColor, textColor) {
            var elements = document.querySelectorAll(`.list-row-col.ellipsis.hidden-xs [data-filter="current_status,=,${status}"]`);
            elements.forEach(function (element) {
                element.style.backgroundColor = bgColor;
                element.style.color = textColor;
            });
        }

        // Apply styles for different statuses
        applyStyles("Certified", "#E4F5E9", "#4C8266");
        applyStyles("Placed", "#c2ead5", "#4C8266");
        applyStyles("Not Certified", "#e2ccba", "#CB2929");
        applyStyles("Not Placed", "#f0dfdf", "#CB2929");
        applyStyles("Assessed", "#f0e6d5", "#db8904");
    }
};
