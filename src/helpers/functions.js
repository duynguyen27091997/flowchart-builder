import _ from "lodash";
import {COOP_APPROVAL_TYPE} from './constants'

const resolveCoApprovalType = (key, co_approval_type) => {
    let tmp = coopApprovalType[key].find(item => item.value === co_approval_type);
    if (tmp) return '<strong>Loại đồng duyệt: </strong>' + tmp.label;
    return null;
}

export const generateStepHtml = (data, template) => {
    let action = data.actions[0];
    let co_approval_type_key = data?.department?.name ? 'department_position' : 'position';

    let replace = {
        __name__: _.get(data, 'name', ''),
        __description__: _.get(data, 'description', ''),
        __department__: _.get(action, 'department_name') ?? (_.get(data, 'not_part_of_department') ? 'Không thuộc phòng ban nào' : 'Lấy phòng ban của người tạo tài liệu'),
        __position__: _.get(action, 'position_name', 'Bất kỳ'),
        __action__: action.action_name,
        __current_process_user_is_target__: data.current_process_user_is_target ? '<p>Chọn người đang tạo tài liệu làm đối tượng cho bước này</p>' : '',
        __same_department_on_step__: data.same_department_on_step ? `<p>Đối tượng có liên hệ tới bước: ${data.same_department_on_step.name}</p>` : '',
        __same_target_on_step__: data.same_target_on_step ? `<p>Đối tượng lấy từ bước: ${data.same_target_on_step.name} </p>` : '',
        __required_to_select_specific_target__: data.required_to_select_specific_target ? `<p>Bắt buộc chọn đối tượng cụ thể</p>` : '',
        __approval_type__: data?.co_approval?.enable ? 'Đồng duyệt' : 'Đơn duyệt',
        __co_approval_type__: data?.co_approval?.enable ? resolveCoApprovalType(co_approval_type_key, data.co_approval.type) : '',
        __co_approval_type_extra_data__: data?.co_approval?.enable && data?.co_approval?.type === 'sufficient_quantity_target_of_position_department' ? `<strong>Số lương đối tượng đồng duyệt:</strong> ${data?.co_approval?.number_targets}` : ''
    };

    return Object.keys(replace).reduce((result, key) => {
        return result.replaceAll(key, replace[key]);
    }, template)
}