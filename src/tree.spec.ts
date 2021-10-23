import { ProstoTree } from './';

describe('ProstoTree', () => {
    it('must build tree', () => {
        const tree = new ProstoTree();
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
            ],
        })
        expect(result).toMatch(`root
├── c1
├── some node;
└── big
    ├── more
    ├── nodes
    └── nested
        └── deeep\n`);
    });
});
