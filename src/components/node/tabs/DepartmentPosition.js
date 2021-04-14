import React, {useEffect, useState} from 'react';
import {Form} from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import {useAlert} from 'react-alert'

const DepartmentPosition = props => {
    let {
        departments,
        positions,
        url,
        tableId,
        setParentData,
        reset,
        allActions
    } = props;

    let alert = useAlert();

    let [disableSelect, setDisableSelect] = useState({
        position: true,
        action: true
    });

    let [selectedData, setSelectedData] = useState({
        department: null,
        position: null,
        action: null
    });

    let [listActionByPosDep, setListActionByPosDep] = useState([]);

    useEffect(() => {
        setDisableSelect({
            position: true,
            action: true
        });

        setSelectedData({
            department: null,
            position: null,
            action: null
        });

        setListActionByPosDep([]);

    }, [reset])

    const handleChange = (type, value) => {
        setSelectedData({
            ...selectedData,
            [type]: value
        });
        setParentData(type, {id: value.value, name: value.label})
    }


    let a = [
        {
            "id": 1,
            "name": "Nhân sự",
            "slug": "profile-service",
            "description": null,
            "domain": "https://employee.tuoitre.vn",
            "status": 1,
            "created_at": "2021-04-07 16:23:42",
            "updated_at": "2021-04-07 16:23:42",
            "groups": [
                {
                    "id": 1,
                    "service_management_id": 1,
                    "name": "Hồ sơ",
                    "slug": "profile",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 1,
                            "table_management_id": 1,
                            "name": "Tạo hồ sơ",
                            "uri": "api/profiles",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 2,
                            "table_management_id": 1,
                            "name": "Sửa hồ sơ",
                            "uri": "api/profiles/{profile}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 3,
                            "table_management_id": 1,
                            "name": "Xoá hồ sơ",
                            "uri": "api/profiles/{profile}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 4,
                            "table_management_id": 1,
                            "name": "Xem chi tiết hồ sơ bằng user id",
                            "uri": "api/fe/profiles/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 5,
                            "table_management_id": 1,
                            "name": "Xem chi tiết hồ sơ bằng profile id",
                            "uri": "api/fe/profiles/{profile_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 6,
                            "table_management_id": 1,
                            "name": "Xem danh sách hồ sơ",
                            "uri": "api/profiles",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 7,
                            "table_management_id": 1,
                            "name": "Tạo phòng ban",
                            "uri": "api/departments",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 2,
                    "service_management_id": 1,
                    "name": "Phòng ban",
                    "slug": "department",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 8,
                            "table_management_id": 2,
                            "name": "Tạo phòng ban",
                            "uri": "api/departments",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 9,
                            "table_management_id": 2,
                            "name": "Sửa phòng ban",
                            "uri": "api/departments/{department}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 10,
                            "table_management_id": 2,
                            "name": "Xoá phòng ban",
                            "uri": "api/departments/{department}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 11,
                            "table_management_id": 2,
                            "name": "Xem chi tiết phòng ban",
                            "uri": "api/departments/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 12,
                            "table_management_id": 2,
                            "name": "Xem danh sách phòng ban",
                            "uri": "api/departments",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 3,
                    "service_management_id": 1,
                    "name": "Lịch sử cá nhân",
                    "slug": "personal-history",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 26,
                            "table_management_id": 3,
                            "name": "Tạo lịch sử cá nhân",
                            "uri": "api/personal-histories",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 27,
                            "table_management_id": 3,
                            "name": "Sửa lịch sử cá nhân",
                            "uri": "api/personal-histories/{personal_history}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 28,
                            "table_management_id": 3,
                            "name": "Xoá lịch sử cá nhân",
                            "uri": "api/personal-histories/{personal_history}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 29,
                            "table_management_id": 3,
                            "name": "Xem chi tiết lịch sử cá nhân",
                            "uri": "api/personal-histories/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 30,
                            "table_management_id": 3,
                            "name": "Xem danh sách lịch sử cá nhân",
                            "uri": "api/personal-histories",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 4,
                    "service_management_id": 1,
                    "name": "Đối tượng lao động",
                    "slug": "work-object",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 31,
                            "table_management_id": 4,
                            "name": "Tạo đối tượng lao động",
                            "uri": "api/work-objects",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 32,
                            "table_management_id": 4,
                            "name": "Sửa đối tượng lao động",
                            "uri": "api/work-objects/{work_object}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 33,
                            "table_management_id": 4,
                            "name": "Xoá đối tượng lao động",
                            "uri": "api/work-objects/{work_object}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 34,
                            "table_management_id": 4,
                            "name": "Xem chi tiết đối tượng lao động",
                            "uri": "api/work-objects/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 35,
                            "table_management_id": 4,
                            "name": "Xem danh sách đối tượng lao động",
                            "uri": "api/work-objects",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 5,
                    "service_management_id": 1,
                    "name": "Thẻ nhà báo",
                    "slug": "journalist-card",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 13,
                            "table_management_id": 5,
                            "name": "Tạo thẻ nhà báo",
                            "uri": "api/journalist-cards",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 14,
                            "table_management_id": 5,
                            "name": "Sửa thẻ nhà báo",
                            "uri": "api/journalist-cards/{journalist_card}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 15,
                            "table_management_id": 5,
                            "name": "Xoá thẻ nhà báo",
                            "uri": "api/journalist-cards/{journalist_card}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 16,
                            "table_management_id": 5,
                            "name": "Xem chi tiết thẻ nhà báo",
                            "uri": "api/journalist-cards/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 17,
                            "table_management_id": 5,
                            "name": "Xem danh sách thẻ nhà báo",
                            "uri": "api/journalist-cards",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 6,
                    "service_management_id": 1,
                    "name": "Trình độ",
                    "slug": "user-degree",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 36,
                            "table_management_id": 6,
                            "name": "Tạo trình độ của đối tượng",
                            "uri": "api/user-degrees",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 37,
                            "table_management_id": 6,
                            "name": "Sửa trình độ của đối tượng",
                            "uri": "api/user-degrees/{user_degree}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 38,
                            "table_management_id": 6,
                            "name": "Xoá trình độ của đối tượng",
                            "uri": "api/user-degrees/{user_degree}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 39,
                            "table_management_id": 6,
                            "name": "Xem chi tiết trình độ của đối tượng",
                            "uri": "api/user-degrees/users/{user_id}",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 40,
                            "table_management_id": 6,
                            "name": "Xem danh sách trình độ của đối tượng",
                            "uri": "api/user-degrees",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 7,
                    "service_management_id": 1,
                    "name": "Bộ phận làm việc",
                    "slug": "part",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 18,
                            "table_management_id": 7,
                            "name": "Tạo bộ phận làm việc",
                            "uri": "api/parts",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 19,
                            "table_management_id": 7,
                            "name": "Sửa bộ phận làm việc",
                            "uri": "api/parts/{part}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 20,
                            "table_management_id": 7,
                            "name": "Xoá bộ phận làm việc",
                            "uri": "api/parts/{part}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 21,
                            "table_management_id": 7,
                            "name": "Xem danh sách bộ phận làm việc",
                            "uri": "api/parts",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                },
                {
                    "id": 8,
                    "service_management_id": 1,
                    "name": "Vị trí làm việc",
                    "slug": "position",
                    "status": 1,
                    "service_name": "Nhân sự",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:23:42",
                    "permissions": [
                        {
                            "id": 22,
                            "table_management_id": 8,
                            "name": "Tạo vị trí làm việc",
                            "uri": "api/positions",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 23,
                            "table_management_id": 8,
                            "name": "Sửa vị trí làm việc",
                            "uri": "api/positions/{position}",
                            "method": "put",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 24,
                            "table_management_id": 8,
                            "name": "Xoá vị trí làm việc",
                            "uri": "api/positions/{position}",
                            "method": "delete",
                            "action": "delete",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        },
                        {
                            "id": 25,
                            "table_management_id": 8,
                            "name": "Xem danh sách vị trí làm việc",
                            "uri": "api/positions",
                            "method": "get",
                            "action": "list",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-07 14:02:08",
                            "updated_at": "2021-04-07 14:02:08"
                        }
                    ]
                }
            ]
        },
        {
            "id": 4,
            "name": "Quy trình làm việc",
            "slug": "workflow-service",
            "description": null,
            "domain": "https://workflow.tuoitre.vn",
            "status": 1,
            "created_at": "2021-04-07 16:23:42",
            "updated_at": "2021-04-07 16:33:58",
            "groups": [
                {
                    "id": 11,
                    "service_management_id": 4,
                    "name": "Quy trình làm việc",
                    "slug": "workflow",
                    "status": 1,
                    "service_name": "Quy trình làm việc",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:35:11",
                    "permissions": [
                        {
                            "id": 103,
                            "table_management_id": 11,
                            "name": "Tạo quy trình làm việc",
                            "uri": "api/workflow/store",
                            "method": "post",
                            "action": "create",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-13 15:29:20",
                            "updated_at": "2021-04-13 15:29:20"
                        },
                        {
                            "id": 104,
                            "table_management_id": 11,
                            "name": "Cập nhật quy trình làm việc",
                            "uri": "api/workflow/store",
                            "method": "post",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-13 15:29:22",
                            "updated_at": "2021-04-13 15:29:22"
                        },
                        {
                            "id": 106,
                            "table_management_id": 11,
                            "name": "Xem quy trình làm việc",
                            "uri": null,
                            "method": "post",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-13 15:29:28",
                            "updated_at": "2021-04-13 15:29:28"
                        }
                    ]
                }
            ]
        },
        {
            "id": 5,
            "name": "Tài liệu",
            "slug": "document-service",
            "description": null,
            "domain": "https://document.tuoitre.vn",
            "status": 1,
            "created_at": "2021-04-07 16:23:42",
            "updated_at": "2021-04-07 16:34:34",
            "groups": [
                {
                    "id": 16,
                    "service_management_id": 5,
                    "name": "Tài liệu",
                    "slug": "document",
                    "status": 1,
                    "service_name": "Tài liệu",
                    "created_at": "2021-04-13 17:38:30",
                    "updated_at": "2021-04-13 17:38:30",
                    "permissions": [
                        {
                            "id": 108,
                            "table_management_id": 16,
                            "name": "Xác nhận đơn nghỉ phép",
                            "uri": null,
                            "method": "GET",
                            "action": "View",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-14 09:29:04",
                            "updated_at": "2021-04-14 09:29:04"
                        }
                    ]
                },
                {
                    "id": 14,
                    "service_management_id": 5,
                    "name": "Bản mẫu tài liệu",
                    "slug": "document-template",
                    "status": 1,
                    "service_name": "Tài liệu",
                    "created_at": "2021-04-07 16:38:37",
                    "updated_at": "2021-04-08 18:16:02",
                    "permissions": [
                        {
                            "id": 99,
                            "table_management_id": 14,
                            "name": "Cập nhật bản mẫu tài liệu",
                            "uri": "api/document-template/update/{id}",
                            "method": "post",
                            "action": "update",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-12 15:12:06",
                            "updated_at": "2021-04-12 15:12:06"
                        },
                        {
                            "id": 100,
                            "table_management_id": 14,
                            "name": "Xem bản mẫu tài liệu",
                            "uri": "api/document-template/get",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": "{\"type_id\":{\"required\":true}}",
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-12 15:12:08",
                            "updated_at": "2021-04-12 15:12:08"
                        }
                    ]
                },
                {
                    "id": 12,
                    "service_management_id": 5,
                    "name": "Loại tài liệu",
                    "slug": "document-type",
                    "status": 1,
                    "service_name": "Tài liệu",
                    "created_at": "2021-04-07 16:23:42",
                    "updated_at": "2021-04-07 16:35:28",
                    "permissions": [
                        {
                            "id": 97,
                            "table_management_id": 12,
                            "name": "Xem danh sách loại tài liệu",
                            "uri": "api/document-type/get-document-types",
                            "method": "get",
                            "action": "view",
                            "param": null,
                            "body": null,
                            "option": null,
                            "status": 1,
                            "created_at": "2021-04-12 15:12:02",
                            "updated_at": "2021-04-12 15:12:02"
                        }
                    ]
                }
            ]
        }
    ]

    const getActionData = (depart, pos) => {
        axios.get(url, {
            params: {
                dep_id: depart,
                pos_id: pos
            }
        }).then(({data}) => {
            let options = [];
            data = Object.values(data);
            if (data.length) {
                options = data.reduce((result, service) => {
                    let serviceName = service.name;
                    return [
                        ...result,
                        ...service.groups.reduce((final, group) => {
                            let fullName = `${serviceName} - ${group.name}`;
                            return [
                                ...final,
                                {
                                    label: fullName,
                                    options: group.permissions.map(per => ({value: per.id, label: per.name}))
                                }
                            ]
                        }, [])
                    ]
                }, [])
            }
            setListActionByPosDep(options);
        }).catch(err => {
            alert.show('Có lỗi xảy ra');
        });
    }

    const formatGroupLabel = data => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#d2d2d2',
            padding: 10,
            color: 'white',
            margin: 0,
            fontSize: 15,
            fontWeight: 800
        }}>
            <span>{data.label}</span>
            <span style={{
                backgroundColor: '#EBECF0',
                borderRadius: '2em',
                color: '#172B4D',
                display: 'inline-block',
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: '1',
                minWidth: 1,
                padding: '0.16666666666667em 0.5em',
                textAlign: 'center',
            }}>{data.options.length}</span>
        </div>
    );

    return (
        <div className="row">
            <div className="col-12">
                <Form.Group>
                    <Form.Label>Phòng ban <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn phòng ban"
                        options={departments}
                        value={selectedData.department}
                        onChange={option => {
                            setDisableSelect({
                                ...disableSelect,
                                position: false,
                                action: true
                            })
                            handleChange('department', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Chức vụ <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Chọn chức vụ"
                        options={positions}
                        isDisabled={disableSelect.position}
                        value={selectedData.position}
                        onChange={option => {
                            setDisableSelect({
                                ...disableSelect,
                                action: false
                            })
                            getActionData(selectedData.department.value, option.value);
                            handleChange('position', option);
                        }}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Hành động <span className="text-danger" title="Bắt buộc">*</span></Form.Label>
                    <Select
                        formatGroupLabel={formatGroupLabel}
                        menuPortalTarget={document.body}
                        styles={{menuPortal: base => ({...base, zIndex: 9999})}}
                        placeholder="Hành động"
                        value={selectedData.action}
                        options={listActionByPosDep}
                        isDisabled={disableSelect.action}
                        onChange={option => handleChange('action', option)}
                    />
                </Form.Group>
            </div>
        </div>
    )
}

export default DepartmentPosition;