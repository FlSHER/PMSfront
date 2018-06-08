export const fields = [
  {
    "id": 407,
    "key": "description",
    "name": "描述",
    "description": "报销描述",
    "type": "text",
    "min": "",
    "max": "100",
    "scale": 0,
    "default_value": "{{year}}-{{month}}-{{day}}+2{<15>}32{<16>}3{?remark?}{?description?}",
    "is_editable": 0,
    "form_id": 41,
    "form_grid_id": null,
    "sort": 1,
    "created_at": "2018-04-21 17:25:22",
    "updated_at": "2018-05-04 10:10:17",
    "deleted_at": null,
    "validator_id": [],
    "validator": []
  },
  {
    "id": 408,
    "key": "remark",
    "name": "备注",
    "description": "报销备注",
    "type": "text",
    "min": "",
    "max": "200",
    "scale": 0,
    "default_value": "备注默认值{{year}}",
    "is_editable": 1,
    "form_id": 41,
    "form_grid_id": null,
    "sort": 2,
    "created_at": "2018-04-21 17:25:22",
    "updated_at": "2018-05-04 10:10:17",
    "deleted_at": null,
    "validator_id": [
      1,
      2
    ],
    "validator": [
      {
        "id": 1,
        "name": "手机",
        "description": "验证手机",
        "type": "regex",
        "params": "/^1[3456789]\\d{9}$/",
        "is_locked": 0,
        "created_at": "2018-04-19 17:20:40",
        "updated_at": "2018-04-19 17:22:43",
        "deleted_at": null,
        "pivot": {
          "field_id": 408,
          "validator_id": 1
        }
      },
      {
        "id": 2,
        "name": "邮箱",
        "description": "验证邮箱",
        "type": "regex",
        "params": "/^\\w+@(qq|126|163|139)(.com)?(.cn)?$/",
        "is_locked": 0,
        "created_at": "2018-04-21 15:04:14",
        "updated_at": "2018-04-21 15:04:14",
        "deleted_at": null,
        "pivot": {
          "field_id": 408,
          "validator_id": 2
        }
      }
    ]
  }
]
export const grids = [
  {
    "id": 76,
    "key": "expense",
    "form_id": 41,
    "created_at": "2018-04-21 17:23:41",
    "updated_at": "2018-04-24 17:24:03",
    "deleted_at": null,
    "fields": [
      {
        "id": 398,
        "key": "description",
        "name": "明细描述",
        "description": "明细描述",
        "type": "text",
        "min": "",
        "max": "100",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 0,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-06 10:18:19",
        "deleted_at": null,
        "validator_id": [
          1
        ],
        "validator": [
          {
            "id": 1,
            "name": "手机",
            "description": "验证手机",
            "type": "regex",
            "params": "/^1[3456789]\\d{9}$/",
            "is_locked": 0,
            "created_at": "2018-04-19 17:20:40",
            "updated_at": "2018-04-19 17:22:43",
            "deleted_at": null,
            "pivot": {
              "field_id": 398,
              "validator_id": 1
            }
          }
        ]
      },
      {
        "id": 399,
        "key": "date",
        "name": "明细日期",
        "description": "明细日期",
        "type": "date",
        "min": "",
        "max": "",
        "scale": 0,
        "default_value": "{{year}}-{{month}}-{{day}}",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 2,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 400,
        "key": "type",
        "name": "明细分类",
        "description": "明细分类",
        "type": "int",
        "min": "",
        "max": "2",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 3,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 401,
        "key": "send_cost",
        "name": "提交金额",
        "description": "申请提交金额",
        "type": "int",
        "min": "",
        "max": "10",
        "scale": 2,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 4,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 402,
        "key": "audited_cost",
        "name": "审核金额",
        "description": "审核金额",
        "type": "int",
        "min": "",
        "max": "10",
        "scale": 2,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 5,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 403,
        "key": "is_approverd",
        "name": "是否审批",
        "description": "是否审批",
        "type": "int",
        "min": "",
        "max": "2",
        "scale": 0,
        "default_value": "0",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 6,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 404,
        "key": "is_audited",
        "name": "是否审核",
        "description": "是否审核",
        "type": "int",
        "min": "",
        "max": "2",
        "scale": 0,
        "default_value": "0",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 76,
        "sort": 7,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      }
    ]
  },
  {
    "id": 77,
    "key": "department",
    "form_id": 41,
    "created_at": "2018-04-21 17:23:41",
    "updated_at": "2018-04-24 17:24:03",
    "deleted_at": null,
    "fields": [
      {
        "id": 405,
        "key": "name",
        "name": "部门",
        "description": "部门名称",
        "type": "text",
        "min": "",
        "max": "100",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 77,
        "sort": 1,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 406,
        "key": "department_id",
        "name": "部门id",
        "description": "部门id",
        "type": "int",
        "min": "",
        "max": "11",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 77,
        "sort": 2,
        "created_at": "2018-04-21 17:25:22",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      }
    ]
  },
  {
    "id": 88,
    "key": "bills",
    "form_id": 41,
    "created_at": "2018-04-26 16:01:08",
    "updated_at": "2018-04-26 16:01:08",
    "deleted_at": null,
    "fields": [
      {
        "id": 439,
        "key": "path",
        "name": "发票路径",
        "description": "发票路径",
        "type": "text",
        "min": "",
        "max": "200",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 88,
        "sort": 1,
        "created_at": "2018-04-26 16:01:08",
        "updated_at": "2018-05-04 10:11:00",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      },
      {
        "id": 438,
        "key": "name",
        "name": "发票",
        "description": "发票",
        "type": "text",
        "min": "",
        "max": "100",
        "scale": 0,
        "default_value": "",
        "is_editable": 0,
        "form_id": 41,
        "form_grid_id": 88,
        "sort": 2,
        "created_at": "2018-04-26 16:01:08",
        "updated_at": "2018-05-04 10:10:17",
        "deleted_at": null,
        "validator_id": [],
        "validator": []
      }
    ]
  }
]
export const steps = [
  {
    "id": 17,
    "name": "步骤1",
    "description": "这是步骤1",
    "flow_id": 1,
    "step_key": 1,
    "prev_step_key": [],
    "next_step_key": [
      2
    ],
    "hidden_fields": [
      "expense.*.is_audited",
      "description"
    ],
    "editable_fields": [
      "expense.*.is_approverd",
      "remark"
    ],
    "required_fields": [
      "expense.*.is_approverd",
      "remark"
    ],
    "approvers": {
      "staff": [
        110103
      ],
      "roles": [],
      "departments": []
    },
    "allow_condition": "",
    "skip_condition": "",
    "send_back_type": 0,
    "concurrent_type": 0,
    "merge_type": 0,
    "start_callback_uri": "",
    "check_callback_uri": "",
    "approve_callback_uri": "",
    "send_back_callback_uri": "",
    "transfer_callback_uri": "",
    "end_callback_uri": ""
  },
  {
    "id": 18,
    "name": "步骤2",
    "description": "这是步骤2",
    "flow_id": 1,
    "step_key": 2,
    "prev_step_key": [
      1
    ],
    "next_step_key": [
      3
    ],
    "hidden_fields": [
      "expense.*.audited_cost"
    ],
    "editable_fields": [
      "expense.*.is_approverd",
      "remark"
    ],
    "required_fields": [],
    "approvers": {
      "staff": [
        110105
      ],
      "roles": [],
      "departments": []
    },
    "allow_condition": "",
    "skip_condition": "",
    "send_back_type": 0,
    "concurrent_type": 0,
    "merge_type": 0,
    "start_callback_uri": "",
    "check_callback_uri": "",
    "approve_callback_uri": "",
    "send_back_callback_uri": "",
    "transfer_callback_uri": "",
    "end_callback_uri": ""
  },
  {
    "id": 19,
    "name": "步骤3",
    "description": "这是步骤3",
    "flow_id": 1,
    "step_key": 3,
    "prev_step_key": [
      2
    ],
    "next_step_key": [],
    "hidden_fields": [
      "expense.*.audited_cost"
    ],
    "editable_fields": [
      "expense.*.is_approverd",
      "remark"
    ],
    "required_fields": [],
    "approvers": {
      "staff": [],
      "roles": [],
      "departments": []
    },
    "allow_condition": "",
    "skip_condition": "",
    "send_back_type": 0,
    "concurrent_type": 0,
    "merge_type": 0,
    "start_callback_uri": "",
    "check_callback_uri": "",
    "approve_callback_uri": "",
    "send_back_callback_uri": "",
    "transfer_callback_uri": "",
    "end_callback_uri": ""
  }
]