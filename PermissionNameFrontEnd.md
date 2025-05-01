function normalizePermissionName(permission) {
    return (
        permission
            .split('/')
            .reduce((ac, el, i) => {
                if (i < 4) return ac
                return `${ac}${el
                    .replace(/[A-Z]/g, (match, index) => (index === 0 ? match : ` ${match}`))
                    .replace(/_id/g, 'ID')
                    .replace(/:/g, 'BY ')
                    .replace(/-/g, ' ')
                    } `
            }, '')
            .trim()
            .replace(/\s+/g, '_')
            .replace(/\s+/g, '_')
            .toUpperCase()
    )
}

db.getCollection('systemOptions').find({ route: { $ne: '' } }).forEach(doc => {
    var name = normalizePermissionName(doc.route)
    var permission = `${doc.method}_${name}`
    print(`${permission}: '${permission.toLowerCase()}',`)
})