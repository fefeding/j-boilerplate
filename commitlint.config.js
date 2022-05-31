module.exports = {
    parserPreset: 'conventional-changelog-conventionalcommits',
    rules: {
        'body-leading-blank': [1, 'always'],
        'body-max-line-length': [2, 'always', 100],
        'footer-leading-blank': [1, 'always'],
        'footer-max-line-length': [2, 'always', 100],
        'header-max-length': [2, 'always', 100],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [
            2,
            'always',
            ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        ],
    },
    types: [
        {
            value: 'feat',
            name: '✨  特性【feat】:     A new feature',
        },
        {
            value: 'fix',
            name: '🐞  修复【fix】:      A bug fix',
        },
        {
            value: 'style',
            name:
                '💅  代码格式【style】:    Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
        },
        {
            value: 'refactor',
            name: '🛠  重构【refactor】: A code change that neither fixes a bug nor adds a feature',
        },
        {
            value: 'perf',
            name: '性能优化【perf】:     A code change that improves performance',
        },
        {
            value: 'docs',
            name: '📚  文档【docs】:     Documentation only changes',
        },
        {
            value: 'test',
            name: '🏁  测试【test】:     Add missing tests or correcting existing tests',
        },
        {
            value: 'chore',
            name:
                '🗯  辅助工具【chore】:    Changes that dont modify src or test files. Such as updating build tasks, package manager',
        },
        {
            value: 'revert',
            name: '⏪  回退【revert】:   Revert to a commit',
        },
    ],
    scopes: [
        { value: 'package' },
        { name: 'doc' },
        { name: 'domain' },
        { name: 'base' },
        { name: 'adaptor' },
        { name: 'ui' },
        { name: 'api' },
    ],
    allowCustomScopes: true,
    allowBreakingChanges: ['feat', 'fix'],
};
