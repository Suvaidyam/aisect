const getRole = async () => {
    frappe.call({
        method: 'aisect.api.get_user_role',
        callback: function(response) {
            if (response.message!=='Administrator') {
                $('.standard-actions').hide()
                $('.custom-actions').hide()
            } else {
                console.error("Failed to fetch user roles");
            }
        }
    });
    
}
getRole()
