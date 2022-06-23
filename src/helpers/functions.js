export const replaceHtml = (data, template) => {
    let replace = {
        __name__: data.name,
        __description__: data.description,
        __targets_count__: data.targets.length,
        __data_step__: JSON.stringify(data),
        __targets__: data.targets.reduce((acc, curr) => {
            return acc + `<div class="alert alert-secondary" role="alert">
                            ${curr.department_name ? (curr.department_name + ' - ') : ' ' }${curr.position_name}
                            </div>`
        },''),
        __assign_targets__: data.assign_targets.length ? data.assign_targets.reduce((acc, curr) => {
            return acc + `<div class="alert alert-secondary" role="alert">
                            ${curr.department_name ? (curr.department_name + ' - ') : ' ' }${curr.position_name}
                            </div>`
        },'<h5>Đối tượng phân công:</h5>') : '',
        __info__: (data.use_creator_department ? `<p>Dùng phòng ban của người tạo tài liệu cho chức vụ</p>` : '') + (data?.assign_targets?.length ? `<p><strong>Mô tả phân công</strong>: ${data.assign_description}</p>` : '')
    };

    return Object.keys(replace).reduce((result, key) => {
        return result.replaceAll(key, replace[key]);
    }, template)
}
