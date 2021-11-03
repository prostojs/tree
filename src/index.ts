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
            const c = (node && (node as Record<string | number, unknown>)[children]) as unknown[]
            const l = c && c.length || 0
            if (c) {
                if (opts?.level && opts.level < level) {
                    s += behind + endBranch + renderCollapsedChildren(c.length) + '\n'
                } else {
                    c.slice(0, opts?.childrenLimit || undefined).forEach((childNode, i) => {
                        const last = i + 1 === l
                        const branch = last ? endBranch : middleBranch
                        const nextBehind = behind + (last ? ' ' : vLine) + ' '.repeat(branchWidth)
                        s += behind + branch + renderLabel(childNode as NodeType, nextBehind) + '\n'
                        if (typeof childNode === 'object') {
                            treeNode(childNode, nextBehind, level + 1)
                        }
                    })
                    if (opts?.childrenLimit && c.length > opts.childrenLimit) {
                        s += behind + endBranch + renderCollapsedChildren(c.length - opts.childrenLimit) + '\n'
                    }
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
    return dim + '⁝(' + __DYE_ITALIC__ + count.toString() + ' more...)' + reset
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
}
