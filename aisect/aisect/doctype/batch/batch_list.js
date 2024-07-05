frappe.listview_settings['Batch'] = {
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
            var elements = document.querySelectorAll(`.list-row-col.ellipsis.hidden-xs [data-filter="status,=,${status}"]`);
            elements.forEach(function (element) {
                element.style.backgroundColor = bgColor;
                element.style.color = textColor;
            });
        }
        applyStyles("In Progress", "rgb(238 220 192)", "rgb(218 146 30)");

    }

};
function action_items(listview, action) {
    // console.log(listview.actions_menu_items.filter((item) => item))
    listview.page.clear_actions_menu()
    action.map((e) => {
        const actionItem = listview.actions_menu_items.find((item) => item?.label == e);
        if (actionItem) {
            listview.page.add_actions_menu_item(
                actionItem.label,
                actionItem.action,
                actionItem.standard
            );
        }
    })
}