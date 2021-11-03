const dim = __DYE_DIM__
const reset = __DYE_RESET__

export class ProstoTree<NodeType = unknown> {
    private readonly options: TProstoTreeOptions<NodeType>

    constructor(options?: Partial<TProstoTreeOptions<NodeType>>) {
        const label = options?.label || 'label'
        const children = options?.children || 'children'
        const branchWidth = typeof options?.branchWidth === 'number' ? options?.branchWidth : 2
        const hLine = (options?.branches?.hLine || '─').repeat(branchWidth - 1)
        const branches: TProstoTreeOptionsBranches = {
            end: options?.branches?.end || dim + '└',
            middle: options?.branches?.middle || dim + '├',
            vLine: options?.branches?.vLine || dim + '│',
            hLine,
        }
        this.options = {
            label: label,
            children: children,
            renderLabel: options?.renderLabel || (n => typeof n === 'string' ? n : (n as Record<string, unknown>)[label] as string),
            branches,
            branchWidth,
        }
    }

    private _render(root: NodeType, opts?: TProstoTreeRenderOptions): string {
        const { children, renderLabel } = this.options
        let s = `${ renderLabel(root, '') }\n`
        const { end, middle, vLine, hLine } = this.options.branches as TProstoTreeOptionsBranches
        const endBranch = end + hLine + reset + ' '
        const middleBranch = middle + hLine + reset + ' '
        const { branchWidth } = this.options
        if (root) {
            treeNode(root)
        }
        
        function treeNode(node: unknown, behind = '', level = 1) {
            const items = (node && (node as Record<string | number, unknown>)[children]) as unknown[]
            const count = items && items.length || 0
            if (items) {
                if (opts?.level && opts.level < level) {
                    s += behind + endBranch + renderCollapsedChildren(items.length) + '\n'
                } else {
                    let itemsToRender = items
                    const collapsedCount = Math.max(0, count - (opts?.childrenLimit || count))
                    if (opts?.childrenLimit && count > opts.childrenLimit) {
                        itemsToRender = opts.showLast ? items.slice(count - opts.childrenLimit) : items.slice(0, opts.childrenLimit)
                    }
                    if (collapsedCount && opts?.showLast) s += behind + middleBranch + renderCollapsedChildren(collapsedCount) + '\n'
                    itemsToRender.forEach((childNode, i) => {
                        const last = i + 1 === count
                        const branch = last ? endBranch : middleBranch
                        const nextBehind = behind + (last ? ' ' : vLine) + ' '.repeat(branchWidth)
                        s += behind + branch + renderLabel(childNode as NodeType, nextBehind) + '\n'
                        if (typeof childNode === 'object') {
                            treeNode(childNode, nextBehind, level + 1)
                        }
                    })
                    if (collapsedCount && !opts?.showLast) s += behind + endBranch + renderCollapsedChildren(collapsedCount) + '\n'
                }
            }
        }

        return s
    }

    render(root: NodeType, opts?: TProstoTreeRenderOptions): string {
        return this._render(root, opts)
    }

    print(root: NodeType, opts?: TProstoTreeRenderOptions): string {
        const s = this.render(root, opts)
        console.log(s)
        return s
    }
}

function renderCollapsedChildren(count: number): string {
    return dim + '+ ' + __DYE_ITALIC__ + count.toString() + ` item${ count === 1 ? '' : 's' }` + reset
}

export interface TProstoTreeOptionsBranches {
    vLine: string
    hLine: string
    end: string
    middle: string
}

export interface TProstoTreeOptions<NodeType = unknown> {
    label: string
    children: string
    renderLabel: (node: NodeType, behind: string) => string
    branchWidth: number
    branches: Partial<TProstoTreeOptionsBranches>
}

export interface TProstoTreeRenderOptions {
    level?: number
    childrenLimit?: number
    showLast?: boolean
}
