import _ from "lodash";

export const generateStepHtml = (data, template) => {
    let action = data.actions[0];

    let replace = {
        __name__: _.get(data, 'name', ''),
        __description__: _.get(data, 'description', ''),
        __department__: _.get(action, 'department_name') ?? (_.get(data, 'not_part_of_department') ? 'Không thuộc phòng ban nào' : 'Lấy phòng ban của người tạo tài liệu'),
        __position__: _.get(action, 'position_name', 'Bất kỳ'),
        __action__: action.action_name,
        __current_process_user_is_target__: data.current_process_user_is_target ? '<p>Chọn người đang tạo tài liệu làm đối tượng cho bước này</p>' : '',
        __same_department_on_step__: data.same_department_on_step ? `<p>Đối tượng có liên hệ tới bước: ${data.same_department_on_step.name}</p>` : '',
        __same_target_on_step__: data.same_target_on_step ? `<p>Đối tượng lấy từ bước: ${data.same_target_on_step.name} </p>` : '',
        __required_to_select_specific_target__: data.required_to_select_specific_target ? `<p>Bắt buộc chọn đối tượng cụ thể</p>` : ''
    };

    return Object.keys(replace).reduce((result, key) => {
        return result.replaceAll(key, replace[key]);
    }, template)
}