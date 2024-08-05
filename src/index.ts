const dim = __DYE_DIM__
const reset = __DYE_RESET__

export class ProstoTree<NodeType = unknown> {
    private readonly options: Required<
        Omit<TProstoTreeOptions<NodeType>, 'branches'> & {
            chars: TProstoTreeOptionsCharacters;
        }
    >;

    constructor(options?: Partial<TProstoTreeOptions<NodeType>>) {
        const label = options?.label || 'label'
        const children = options?.children || 'children'
        const branchWidth =
            typeof options?.branchWidth === 'number' ? options?.branchWidth : 2
        const hLine = (options?.chars?.hLine || '─').repeat(branchWidth)
        const chars: TProstoTreeOptionsCharacters = {
            end: options?.chars?.end || dim + '└',
            middle: options?.chars?.middle || dim + '├',
            vLine: options?.chars?.vLine || dim + '│',
            hLine,
            node: options?.chars?.node || '•',
        }
        this.options = {
            label: label,
            children,
            renderLabel:
                options?.renderLabel ||
                ((n) =>
                    typeof n === 'string'
                        ? n
                        : ((n as Record<string, unknown>)[label] as string)),
            chars,
            branchWidth,
        }
    }

    private _render(root: NodeType, opts?: TProstoTreeRenderOptions): string {
        const { children, renderLabel, branchWidth: w, chars: c } = this.options
        let count = 0
        function renderNode(
            node: Record<string, unknown>,
            before = '',
            level = 0,
            openLevels: boolean[] = [],
        ) {
            count++

            let s = ''
            let pref = ''

            for (let i = 0; i < level-1; i++) {
                const isOpen = openLevels[i]
                pref += `${isOpen ? c.vLine : ' '}${' '.repeat(w)}`
            }
            const labels = [renderLabel(node as NodeType, level)].flat()

            const items = (node[children] || []) as Record<string, unknown>[]
            openLevels[level] = !!items.length

            let pref2 = ''
            for (let i = 0; i <= level; i++) {
                const isOpen = openLevels[i]
                pref2 += `${isOpen ? c.vLine : ' '}${' '.repeat(w)}`
            }
            pref2 = pref2.slice(0, -w) + ' '
            for (let i = 0; i < labels.length; i++) {
                const l = labels[i]
                if (i === 0) {
                    s += `${pref}${before}${c.node} ${l}\n`
                } else {                  
                    s += `${pref2}${l}\n`
                }
            }
            if (items.length && opts?.level && level >= opts.level - 1) {
                s += pref2 + renderCollapsedChildren(items.length) + '\n'
                openLevels[level] = false
            } else {           
                for (let i = 0; i < items.length; i++) {
                    const last = i === items.length - 1
                    if (opts?.childrenLimit && i === opts.childrenLimit && (!opts.showLast || !last)) {
                        s += pref2 + renderCollapsedChildren(items.length - i) + '\n'
                        openLevels[level] = false
                        if (opts.showLast) {
                            s += `${renderNode(
                                items[items.length - 1],
                                `${c.end}${c.hLine}`,
                                level + 1,
                                openLevels,
                            )}`
                        }
                        break
                    }
                    openLevels[level] = !last
                    s += `${renderNode(
                        items[i],
                        `${last ? c.end : c.middle}${c.hLine}`,
                        level + 1,
                        openLevels,
                    )}`
                }
            }
            return s
        }
        return renderNode(root as Record<string, unknown>)
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

export interface TProstoTreeOptionsCharacters {
    vLine: string
    hLine: string
    end: string
    middle: string
    node: string
}

export interface TProstoTreeOptions<NodeType = unknown> {
    label: string
    children: string
    renderLabel: (node: NodeType, level: number) => string | string[]
    branchWidth: number
    chars: Partial<TProstoTreeOptionsCharacters>
}

export interface TProstoTreeRenderOptions {
    level?: number
    childrenLimit?: number
    showLast?: boolean
}
