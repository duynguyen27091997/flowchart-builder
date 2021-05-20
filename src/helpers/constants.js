export const ACTION_CLASS_PREFIX = 'action-';
export const COOP_APPROVAL_TYPE = {
    department_position: {
        all_target_of_position_department: {
            label: 'Tất cả đối tượng đều phải duyệt (thuộc phòng ban - chức vụ ở trên)',
            value: 'all_target_of_position_department',
            default: true
        },
        sufficient_quantity_target_of_position_department: {
            label: 'Duyệt đủ theo số lượng cho trước (đối tượng bất kỳ thuộc phòng ban - chức vụ ở trên)',
            value: 'sufficient_quantity_target_of_position_department',
            approval_target_nums: 2,
            default: false
        },
        some_specific_target_of_position_department: {
            label: 'Chọn một số đối tượng cụ thể (thuộc phòng ban - chức vụ ở trên)',
            value: 'some_specific_target_of_position_department',
            default: false
        }
    },
    position: {
        sufficient_quantity_target_of_position_department: {
            label: 'Duyệt đủ theo số lượng cho trước (đối tượng bất kỳ thuộc phòng ban - chức vụ ở trên)',
            value: 'sufficient_quantity_target_of_position_department',
            approval_target_nums: 2,
            default: true
        },
        some_specific_target_of_position_department: {
            label: 'Chọn một số đối tượng cụ thể (thuộc phòng ban - chức vụ ở trên)',
            value: 'some_specific_target_of_position_department',
            default: false
        }
    }
}