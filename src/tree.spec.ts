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
[2mââ[0m c1
[2mââ[0m some node;
[2mââ[0m big
[2mâ  [2mââ[0m more
[2mâ  [2mââ[0m nodes
[2mâ  [2mââ[0m nested
[2mâ     [2mââ[0m deeep
[2mââ[0m end
"
`)
    })
    it('must build replace branch symbols', () => {
        const tree = new ProstoTree({
            branches: {
                end: 'â',
                middle: 'â ',
                vLine: 'â',
                hLine: 'â',
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
â â[0m c1
â â[0m some node;
â â[0m big
â  â â[0m more
â  â â[0m nodes
â  ââ[0m nested
â     ââ[0m deeep
ââ[0m end
"
`)
    })
})
