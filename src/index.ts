import { dye } from '@prostojs/dye'

const dim = dye('dim')

const branch1 = dim('└── ')
const branch2 = dim('├── ')
const branch3 = dim('│')

export class ProstoTree<NodeType = unknown> {
    private readonly options: TProstoTreeOptions<NodeType>

    constructor(options?: Partial<TProstoTreeOptions<NodeType>>) {
        const label = options?.label || 'label'
        const children = options?.children || 'children'
        this.options = {
            label: label,
            children: children,
            renderLabel: options?.renderLabel || (n => typeof n === 'string' ? n : (n as Record<string, unknown>)[label] as string),
        }
    }

    private _render(root: NodeType): string {
        const { children, renderLabel } = this.options
        let s = `${ renderLabel(root) }\n`

        if (root) {
            treeNode(root)
        }
        
        function treeNode(node: unknown, behind = '') {
            const c = (node && (node as Record<string | number, unknown>)[children]) as unknown[]
            const l = c && c.length || 0
            if (c) {
                c.forEach((childNode, i) => {
                    const last = i + 1 === l
                    const branch = last ? branch1 : branch2
                    s += behind + branch + renderLabel(childNode as NodeType) + '\n'
                    if (typeof childNode === 'object') {
                        treeNode(childNode, behind + (last ? ' ' : branch3) + '   ')
                    }
                })
            }
        }

        return s
    }

    render(root: NodeType, colored = false): string {
        return colored ? this._render(root) : dye.strip(this._render(root))
    }

    print(root: NodeType): string {
        const s = this.render(root, true)
        console.log(s)
        return s
    }
}

export interface TProstoTreeOptions<NodeType = unknown> {
    label: string,
    children: string,
    renderLabel: (node: NodeType) => string
}
