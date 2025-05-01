import { SystemOptionENTITY } from 'logiflowerp-sdk'

export function normalizePermissionName(permission: SystemOptionENTITY) {
    const text = permission.route
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
        .toLowerCase()
    return `${permission.method}_${text}`.toLowerCase()
}