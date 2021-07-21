import _ from "lodash";
import {COOP_APPROVAL_TYPE} from './constants'

const resolveCoApprovalType = (key, co_approval_type) => {
    let tmp = coopApprovalType[key].find(item => item.value === co_approval_type);
    if (tmp) return '<strong>Loại đồng duyệt: </strong>' + tmp.label;
    return null;
}

export const generateStepHtml = (data, template) => {
    let action = data.actions[0];
    let departmentName = action.department_name ?? (data.use_document_creator_department_for_position ? 'Lấy phòng ban của người tạo tài liệu làm phòng ban cho chức vụ' : 'Không thuộc phòng ban nào')
    let positionName =action.position_name;
    let actionName = action.action_name;
    let coApprovalType = '';
    let approvalTargetNums = '';
    let useDocumentCreatorAsStepTarget = '';
    let requiredToSelectSpecificTarget = '';

    if(data.co_approval.enable){
        coApprovalType = `<p><strong>- Loại đồng duyệt:</strong> ${data.co_approval.type.label}</p>`
    }

    if(data.co_approval.enable && data.co_approval.type.value === 'sufficient_quantity_target_of_position_department'){
        approvalTargetNums = `<p><strong>- Số lương đối tượng đồng duyệt:</strong> ${data.co_approval.type.approval_target_nums}</p>`
    }

    if(data.use_document_creator_as_step_target){
        useDocumentCreatorAsStepTarget = `<p>- Chọn người đang tạo tài liệu làm đối tượng cho bước này</p>`
    }

    if(data.required_to_select_specific_target){
        requiredToSelectSpecificTarget = `<p>- Bắt buộc chọn đối tượng cụ thể</p>`;
    }

    let replace = {
        __name__: data.name,
        __description__: data.description,
        __department__: departmentName,
        __position__: positionName,
        __approval_type__: data?.co_approval?.enable ? 'Đồng duyệt' : 'Đơn duyệt',
        __co_approval_type__: coApprovalType,
        __approval_target_nums__: approvalTargetNums,
        __use_document_creator_as_step_target__: useDocumentCreatorAsStepTarget,
        __required_to_select_specific_target__: requiredToSelectSpecificTarget,
        __action__: actionName,
    };

    return Object.keys(replace).reduce((result, key) => {
        return result.replaceAll(key, replace[key]);
    }, template)
}