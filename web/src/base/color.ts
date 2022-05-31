export default class linearGradient {
    block: number = 0;
    minColor: string = '';
    maxColor: string = '';
    middleColor: string = '';
    minColorArea: Array<string> = [];
    maxColorArea: Array<string> = [];

    constructor(minColor: string, middleColor: string, maxColor: string, block: number = 100) {
        this.middleColor = middleColor;
        this.minColor = minColor;
        this.maxColor = maxColor;
        this.block = block;
        this.minColorArea = this.gradientColors(minColor, middleColor, block);
        this.maxColorArea = this.gradientColors(middleColor, maxColor, block);
    }

    // convert #hex notation to rgb array
    parseColor(hexStr) {
        return hexStr.length === 4
            ? hexStr
                  .substr(1)
                  .split('')
                  .map(function (s) {
                      return 0x11 * parseInt(s, 16);
                  })
            : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
                  return parseInt(s, 16);
              });
    }

    // zero-pad 1 digit to 2
    pad(s) {
        return s.length === 1 ? '0' + s : s;
    }

    //  计算两色之间的线性渐变
    gradientColors(start, end, steps, gamma = 1) {
        let i,
            j,
            ms,
            me,
            output = [],
            so = [];
        const normalize = function (channel) {
            return Math.pow(channel / 255, gamma);
        };
        start = this.parseColor(start).map(normalize);
        end = this.parseColor(end).map(normalize);
        for (i = 0; i < steps; i++) {
            ms = i / (steps - 1);
            me = 1 - ms;
            for (j = 0; j < 3; j++) {
                so[j] = this.pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
            }
            output.push('#' + so.join(''));
        }
        return output;
    }

    //  根据值判断所处颜色 两颜色 (原色) 渐变对冲
    valToColorGradient = (val: number = 0, min: number = 0, max: number = 1): string => {
        let percent = Number(((val - min) / (max - min)).toFixed(2));
        //  小于50%的 则往minColor取
        if (percent < 0.5) {
            return percent === min ? this.minColor : this.minColorArea[(percent * this.block * 2).toFixed(0)];
        } else if (percent === 0.5) {
            return this.minColorArea[this.middleColor];
        } else if (percent > 0.5) {
            return percent === max ? this.maxColor : this.maxColorArea[((percent - 0.5) * this.block * 2).toFixed(0)];
        }
    };

    //  分段显示颜色
    blockToColorGradient = (blockIndex: number): string => {
        return this.maxColorArea[blockIndex];
    };
}
