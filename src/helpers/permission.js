export const canDo = (action, permissions) => {
    if (!permissions || !permissions.length) {
        return true;
    }
    return permissions.find(permission => permission.action.toLowerCase() === action) !== undefined
}
