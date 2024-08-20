// Copyright (c) 2024, Rahul Sah and contributors
// For license information, please see license.txt

var filters = [
]
// if (frappe.user_roles.includes('Head Office (PMU)')) {
//   filters.push({
//     "fieldname": "zone",
//     "fieldtype": "Link",
//     "label": "Zone",
//     "options": "Zone",
//     "only_select": 1,
//   })
// }
if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
  filters.push(
    {
      "fieldname": "state",
      "fieldtype": "Link",
      "label": "State",
      "options": "State",
      "only_select": 1,
      //   "get_query": function () {
      //     var zone = frappe.query_report.get_filter_value('zone');
      //     if (!frappe.user_roles.includes('Zonal Head')) {
      //       return {
      //         filters: {
      //           'zone': zone
      //         }
      //       };
      //     }
      //   }
    })
}
filters.push(
  {
    "fieldname": "project",
    "fieldtype": "Link",
    "label": "Project",
    "options": "Project",
    "only_select": 1,
    "get_query": function () {
      var state = frappe.query_report.get_filter_value('state');
      if (frappe.user_roles.includes('Zonal Head') || frappe.user_roles.includes('Head Office (PMU)')) {
        return {
          filters: [
            ['Project', 'state', 'IN', [state, '']]
          ]
        };
      }
    }
  },
)
if (frappe.user_roles.includes('Head Office (PMU)') || frappe.user_roles.includes('State Placement Coordinator') || frappe.user_roles.includes('State Head') || frappe.user_roles.includes('Zonal Head')) {
  filters.push(
    {
      "fieldname": "district",
      "fieldtype": "Link",
      "label": "District",
      "options": "District",
      "only_select": 1,
      "get_query": function () {
        var state = frappe.query_report.get_filter_value('state');
        if (!(frappe.user_roles.includes('State Placement Coordinator') || frappe.user_roles.includes('State Head'))) {
          return {
            filters: {
              'state': state
            }
          };
        }
      }
    },
    {
      "fieldname": "center",
      "fieldtype": "Link",
      "label": "Center",
      "options": "Center",
      "only_select": 1,
      "get_query": function () {
        var district = frappe.query_report.get_filter_value('district');
        return {
          filters: {
            'district': district
          }
        };
      }

    })
}
filters.push({
  "fieldname": "batch_id",
  "fieldtype": "Link",
  "label": "Batch",
  "options": "Batch",
  "only_select": 1,
  "get_query": function () {
    var center = frappe.query_report.get_filter_value('center');
    if (!(frappe.user_roles.includes('Centre Placement Coordinator') || frappe.user_roles.includes('Centre Head'))) {
      return {
        filters: {
          'center_location': center
        }
      };
    }
  }
},

)

filters.push(
  {
    "fieldname": "remaining_day",
    "fieldtype": "Select",
    "label": "Remaining days",
    "options": "\n1-30 days\n30-60 days\n60-90 days\nLess than 0 days"
  })
frappe.query_reports["Placement Target vs Achievement"] = {
  filters: filters,
  formatter: function (value, k, column) {
    if (column.fieldname == "batch_id") {
      return `<a href="/app/candidate-details/view/list?batch_id=${value}">${value}</a>`
    } else {
      return value
    }
  },
  filters: filters,
  formatter: function (value, k, column) {
    if (column.fieldname == "batch_id") {
      return `<a href="/app/candidate-details/view/list?batch_id=${value}">${value}</a>`
    }
    return `<span>${value}</span>`
  }
};

