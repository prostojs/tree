import { ProstoTree } from './'

describe('ProstoTree', () => {
    it('must build tree', () => {
        const tree = new ProstoTree()
        const result = tree.render({
            label: 'root',
            children: [
                {
                    label: 'c1',
                },
                'some node;',
                {
                    label: 'big',
                    children: [
                        'more',
                        'nodes',
                        { label: 'nested', children: ['deeep'] },
                    ],
                },
                'end',
            ],
        })
        console.log(result)
        expect(result).toMatchInlineSnapshot(`
"root
[2m├─[0m c1
[2m├─[0m some node;
[2m├─[0m big
[2m│  [2m├─[0m more
[2m│  [2m├─[0m nodes
[2m│  [2m└─[0m nested
[2m│     [2m└─[0m deeep
[2m└─[0m end
"
`)
    })
    it('must build replace branch symbols', () => {
        const tree = new ProstoTree({
            branches: {
                end: '╚',
                middle: '╠',
                vLine: '║',
                hLine: '═',
            },
        })
        const result = tree.render({
            label: 'root',
            children: [
                {
                    label: 'c1',
                },
                'some node;',
                {
                    label: 'big',
                    children: [
                        'more',
                        'nodes',
                        { label: 'nested', children: ['deeep'] },
                    ],
                },
                'end',
            ],
        })
        console.log(result)
        expect(result).toMatchInlineSnapshot(`
"root
╠═[0m c1
╠═[0m some node;
╠═[0m big
║  ╠═[0m more
║  ╠═[0m nodes
║  ╚═[0m nested
║     ╚═[0m deeep
╚═[0m end
"
`)
    })
})
