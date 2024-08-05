import { ProstoTree } from './'
import { dye } from '@prostojs/dye'

const sharedTree = {
    label: 'root',
    children: [
        {
            label: 'c1',
        },
        {
            label: 'big',
            children: [
                'more',
                'more2',
                { label: 'nested', children: ['deeep', 'deeeep2'] },
                'nodes',
                'nodes2',
            ],
        },
        'some node',
        'some node2',
        'some node3',
        'end',
    ],
}

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
                {
                    label: 'end',
                    children: [
                        {
                            label: 'end2',
                            children: ['end3'],
                        },
                    ],
                },
            ],
        })
        console.log('result\n', result)
        expect(dye.strip(result)).toMatchInlineSnapshot(`
"• root
├──• c1
├──• some node;
├──• big
│  ├──• more
│  ├──• nodes
│  └──• nested
│     └──• deeep
└──• end
   └──• end2
      └──• end3
"
`)
    })
    it('must build replace branch symbols', () => {
        const tree = new ProstoTree({
            chars: {
                end: '╚',
                middle: '╠',
                vLine: '║',
                hLine: '═',
            },
        })
        const result = tree.render(sharedTree)
        console.log(result)
        expect(dye.strip(result)).toMatchInlineSnapshot(`
"• root
╠══• c1
╠══• big
║  ╠══• more
║  ╠══• more2
║  ╠══• nested
║  ║  ╠══• deeep
║  ║  ╚══• deeeep2
║  ╠══• nodes
║  ╚══• nodes2
╠══• some node
╠══• some node2
╠══• some node3
╚══• end
"
`)
    })
    
    it('must support multiline labels', () => {
        const tree = new ProstoTree()
        const s = tree.render({
            label: ['first item', 'line 1', 'line 2', 'line 3'],
            children: [
                {
                    label: ['second item', 'line 1', 'line 2', 'line 3'],
                    children: [
                        {
                            label: ['third item', 'line 1', 'line 2', 'line 3'],
                            children: [
                                {
                                    label: [
                                        'sixth item',
                                        'line 1',
                                        'line 2',
                                        'line 3',
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: ['fourth item', 'line 1', 'line 2', 'line 3'],
                    children: [
                        {
                            label: ['fifth item', 'line 1', 'line 2', 'line 3'],
                        },
                    ],
                },
            ],
        })
        expect(dye.strip(s)).toMatchInlineSnapshot(`
"• first item
│ line 1
│ line 2
│ line 3
├──• second item
│  │ line 1
│  │ line 2
│  │ line 3
│  └──• third item
│     │ line 1
│     │ line 2
│     │ line 3
│     └──• sixth item
│          line 1
│          line 2
│          line 3
└──• fourth item
   │ line 1
   │ line 2
   │ line 3
   └──• fifth item
        line 1
        line 2
        line 3
"
`)
        console.log(s)
    })

    it('must collapse children', () => {
        const s = new ProstoTree().render(sharedTree, {
            childrenLimit: 2,
        })

        expect(dye.strip(s)).toMatchInlineSnapshot(`
"• root
├──• c1
├──• big
│  ├──• more
│  ├──• more2
│  │ + 3 items
│ + 4 items
"
`)
        console.log(s)
    })

    it('must collapse children and show last', () => {
        const s = new ProstoTree().render(sharedTree, {
            childrenLimit: 3,
            showLast: true,
        })

        expect(dye.strip(s)).toMatchInlineSnapshot(`
"• root
├──• c1
├──• big
│  ├──• more
│  ├──• more2
│  ├──• nested
│  │  ├──• deeep
│  │  └──• deeeep2
│  │ + 2 items
│  └──• nodes2
├──• some node
│ + 3 items
└──• end
"
`)
        console.log(s)
    })
    it('must limit level', () => {
        const s = new ProstoTree().render(sharedTree, {
            level: 2,
        })

        expect(dye.strip(s)).toMatchInlineSnapshot(`
"• root
├──• c1
├──• big
│  │ + 5 items
├──• some node
├──• some node2
├──• some node3
└──• end
"
`)
        console.log(s)
    })
})
