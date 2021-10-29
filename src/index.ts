export class ProstoTree<NodeType = unknown> {
    private readonly options: TProstoTreeOptions<NodeType>

    constructor(options?: Partial<TProstoTreeOptions<NodeType>>) {
        const label = options?.label || 'label'
        const children = options?.children || 'children'
        const branchWidth = typeof options?.branchWidth === 'number' ? options?.branchWidth : 2
        const hLine = (options?.branches?.hLine || '─').repeat(branchWidth - 1)
        const branches: TProstoTreeOptionsBranches = {
            end: options?.branches?.end || '<dye.dim>' + '└',
            middle: options?.branches?.middle || '<dye.dim>' + '├',
            vLine: options?.branches?.vLine || '<dye.dim>' + '│',
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

    private _render(root: NodeType): string {
        const { children, renderLabel } = this.options
        let s = `${ renderLabel(root, '') }\n`
        const { end, middle, vLine, hLine } = this.options.branches as TProstoTreeOptionsBranches
        const endBranch = end + hLine + '<dye.reset> '
        const middleBranch = middle + hLine + '<dye.reset> '
        const { branchWidth } = this.options
        if (root) {
            treeNode(root)
        }
        
        function treeNode(node: unknown, behind = '') {
            const c = (node && (node as Record<string | number, unknown>)[children]) as unknown[]
            const l = c && c.length || 0
            if (c) {
                c.forEach((childNode, i) => {
                    const last = i + 1 === l
                    const branch = last ? endBranch : middleBranch
                    const nextBehind = behind + (last ? ' ' : vLine) + ' '.repeat(branchWidth)
                    s += behind + branch + renderLabel(childNode as NodeType, nextBehind) + '\n'
                    if (typeof childNode === 'object') {
                        treeNode(childNode, nextBehind)
                    }
                })
            }
        }

        return s
    }

    render(root: NodeType): string {
        return this._render(root)
    }

    print(root: NodeType): string {
        const s = this.render(root)
        console.log(s)
        return s
    }
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
