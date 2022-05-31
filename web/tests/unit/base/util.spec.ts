import * as util from '@/base/util';

describe('util', () => {
    it('bytelen', () => {
        expect(util.bytelen('1xxx')).toEqual(4);
        expect(util.bytelen('1xxx字符长度')).toEqual(16);
    });
});
