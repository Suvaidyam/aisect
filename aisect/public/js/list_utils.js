function action_items(listview, action) {
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