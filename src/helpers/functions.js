export const replaceHtml = (data, template) => {
    let replace = {
        __name__: data.name,
        __description__: data.description,
        __targets_count__: data.targets.length,
        __data_step__: JSON.stringify(data)
    };

    return Object.keys(replace).reduce((result, key) => {
        return result.replaceAll(key, replace[key]);
    }, template)
}
