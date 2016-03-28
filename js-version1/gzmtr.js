Array.prototype.uniq = function() {
    var res = []; //一个新的临时数组
    for (var i = 0, l = this.length; i < l; i++) //遍历当前数组
    {
        //如果当前数组的第i已经保存进了临时数组，那么跳过，
        //否则把当前项push到临时数组里面
        if (!~res.indexOf(this[i])) {
            res.push(this[i]);
        }
    }
    return res;
}
var Terminal = function(name) {
    this.name = name;
    this.neighbours = [];
    this.lines = [];
};
var Line = function(terminals, name) {
    this.terminals = terminals;
    this.name = name;
};
Line.prototype.init = function() {
    this.terminals.forEach(function(terminal, i, terminals) {
        terminal.lines.push(name);
        if (terminals[i + 1]) {
            terminal.neighbours.push(terminals[i + 1]);
        }
        if (terminals[i - 1]) {
            terminal.neighbours.push(terminals[i - 1]);
        }
    });
    return this;
};
var MTR = function(name) {
    this.name = name;
    this.lines = [];
    this.stack = [];
};
MTR.prototype.addLine = function(line) {
    this.lines.push(line.init());
    return this;
};
MTR.prototype.addLines = function(lines) {
    lines.forEach(function(line) {
        this.addLine(line);
    }.bind(this));
    return this;
};
// MTR.prototype.intersectWith = function(terminal1, terminal2) {
//     terminal1.lines = terminal1.lines.concat(terminal2.lines);
//     terminal1.lines = terminal1.lines.uniq();
//     terminal1.neighbours = terminal1.neighbours.concat(terminal2.neighbours);
//     terminal1.neighbours = terminal1.neighbours.uniq();
//     terminal2.neighbours.forEach(function(terminal) {
//         var index = terminal.neighbours.indexOf(terminal2);
//         terminal.neighbours[index] = terminal1;
//     });
//     terminal2 = terminal1;
//     console.log(line3_T6, terminal2);
//     return this;
// };
MTR.prototype.search = function(terminal1, terminal2) {
    this.stack.push(terminal1);
    if (terminal1 == terminal2) {
        this.stack.pop();
        return [terminal1];
    } else {
        var resolutions = [];
        terminal1.neighbours.forEach(function(neighbour) {
            if (!~this.stack.indexOf(neighbour)) {
                var result = this.search(neighbour, terminal2);
                if (result.length) {
                    result.forEach(function(resolution) {
                        resolutions.push([terminal1].concat(resolution));
                    }.bind(this));
                }
            }
        }.bind(this));
        this.stack.pop();
        return resolutions.sort(function(a, b) {
            return a.length - b.length;
        });
    }
};
//一号线
var line1_T1 = new Terminal('广州东站');
var line1_T2 = new Terminal('体育中心');
var line1_T3 = new Terminal('体育西路');
var line1_T4 = new Terminal('杨箕');
var line1_T5 = new Terminal('东山口');
var line1_T6 = new Terminal('烈士陵园');
var line1_T7 = new Terminal('农讲所');
var line1_T8 = new Terminal('公园前');
var line1_T9 = new Terminal('西门口');
var line1_T10 = new Terminal('陈家祠');
var line1_T11 = new Terminal('长寿路');
var line1_T12 = new Terminal('黄沙');
var line1_T13 = new Terminal('芳村');
var line1_T14 = new Terminal('花地湾');
var line1_T15 = new Terminal('坑口');
var line1_T16 = new Terminal('西朗');
//二号线
var line2_T1 = new Terminal('嘉禾望岗');
var line2_T2 = new Terminal('黄边');
var line2_T3 = new Terminal('江夏');
var line2_T4 = new Terminal('萧岗');
var line2_T5 = new Terminal('白云文化公园');
var line2_T6 = new Terminal('白云公园');
var line2_T7 = new Terminal('飞翔公园');
var line2_T8 = new Terminal('三元里');
var line2_T9 = new Terminal('广州火车站');
var line2_T10 = new Terminal('越秀公园');
var line2_T11 = new Terminal('纪念堂');
var line2_T12 = new Terminal('公园前');
var line2_T13 = new Terminal('海珠广场');
var line2_T14 = new Terminal('市二宫');
var line2_T15 = new Terminal('江南西');
var line2_T16 = new Terminal('昌岗');
var line2_T17 = new Terminal('江泰路');
var line2_T18 = new Terminal('东晓南');
var line2_T19 = new Terminal('南洲');
var line2_T20 = new Terminal('洛溪');
var line2_T21 = new Terminal('南浦');
var line2_T22 = new Terminal('会江');
var line2_T23 = new Terminal('石壁');
var line2_T24 = new Terminal('广州南站');
//三号线
var line3_T1 = new Terminal('天河客运站');
var line3_T2 = new Terminal('五山');
var line3_T3 = new Terminal('华师');
var line3_T4 = new Terminal('岗顶');
var line3_T5 = new Terminal('石牌桥');
var line3_T6 = new Terminal('体育西路');
var line3_T7 = new Terminal('珠江新城');
var line3_T8 = new Terminal('广州塔');
var line3_T9 = new Terminal('客村');
var line3_T10 = new Terminal('大塘');
var line3_T11 = new Terminal('沥滘');
var line3_T12 = new Terminal('厦滘');
var line3_T13 = new Terminal('大石');
var line3_T14 = new Terminal('汉溪长隆');
var line3_T15 = new Terminal('市桥');
var line3_T16 = new Terminal('番禺广场');
//三号线（北延段）
var line3plus_T1 = new Terminal('机场南');
var line3plus_T2 = new Terminal('人和');
var line3plus_T3 = new Terminal('龙归');
var line3plus_T4 = new Terminal('嘉禾望岗');
var line3plus_T5 = new Terminal('白云大道北');
var line3plus_T6 = new Terminal('永泰');
var line3plus_T7 = new Terminal('同和');
var line3plus_T8 = new Terminal('京溪南方医院');
var line3plus_T9 = new Terminal('梅花园');
var line3plus_T10 = new Terminal('燕塘');
var line3plus_T11 = new Terminal('广州东站');
var line3plus_T12 = new Terminal('林和西');
var line3plus_T13 = new Terminal('体育西路');
//四号线
var line4_T1 = new Terminal('黄村');
var line4_T2 = new Terminal('车陂');
var line4_T3 = new Terminal('车陂南');
var line4_T4 = new Terminal('万胜围');
var line4_T5 = new Terminal('官洲');
var line4_T6 = new Terminal('大学城北');
var line4_T7 = new Terminal('大学城南');
var line4_T8 = new Terminal('新造');
var line4_T9 = new Terminal('石碁');
var line4_T10 = new Terminal('海傍');
var line4_T11 = new Terminal('低涌');
var line4_T12 = new Terminal('东涌');
var line4_T13 = new Terminal('黄阁汽车城');
var line4_T14 = new Terminal('黄阁');
var line4_T15 = new Terminal('蕉门');
var line4_T16 = new Terminal('金洲');
//五号线
var line5_T1 = new Terminal('滘口');
var line5_T2 = new Terminal('坦尾');
var line5_T3 = new Terminal('中山八');
var line5_T4 = new Terminal('西场');
var line5_T5 = new Terminal('西村');
var line5_T6 = new Terminal('广州火车站');
var line5_T7 = new Terminal('小北');
var line5_T8 = new Terminal('淘金');
var line5_T9 = new Terminal('区庄');
var line5_T10 = new Terminal('动物园');
var line5_T11 = new Terminal('杨箕');
var line5_T12 = new Terminal('五羊邨');
var line5_T13 = new Terminal('珠江新城');
var line5_T14 = new Terminal('猎德');
var line5_T15 = new Terminal('潭村');
var line5_T16 = new Terminal('员村');
var line5_T17 = new Terminal('科韵路');
var line5_T18 = new Terminal('车陂南');
var line5_T19 = new Terminal('东圃');
var line5_T20 = new Terminal('三溪');
var line5_T21 = new Terminal('鱼珠');
var line5_T22 = new Terminal('大沙地');
var line5_T23 = new Terminal('大沙东');
var line5_T24 = new Terminal('文冲');
//六号线
var line6_T1 = new Terminal('浔峰岗');
var line6_T2 = new Terminal('横沙');
var line6_T3 = new Terminal('沙贝');
var line6_T4 = new Terminal('河沙');
var line6_T5 = new Terminal('坦尾');
var line6_T6 = new Terminal('如意坊');
var line6_T7 = new Terminal('黄沙');
var line6_T8 = new Terminal('文化公园');
var line6_T9 = new Terminal('一德路');
var line6_T10 = new Terminal('海珠广场');
var line6_T11 = new Terminal('北京路');
var line6_T12 = new Terminal('团一大广场');
var line6_T13 = new Terminal('东湖');
var line6_T14 = new Terminal('东山口');
var line6_T15 = new Terminal('区庄');
var line6_T16 = new Terminal('黄花岗');
var line6_T17 = new Terminal('沙河顶');
var line6_T18 = new Terminal('沙河');
var line6_T19 = new Terminal('天平架');
var line6_T20 = new Terminal('燕塘');
var line6_T21 = new Terminal('天河客运站');
var line6_T22 = new Terminal('长湴');
//八号线
var line8_T1 = new Terminal('凤凰新村');
var line8_T2 = new Terminal('沙园');
var line8_T3 = new Terminal('宝岗大道');
var line8_T4 = new Terminal('昌岗');
var line8_T5 = new Terminal('晓港');
var line8_T6 = new Terminal('中大');
var line8_T7 = new Terminal('鹭江');
var line8_T8 = new Terminal('客村');
var line8_T9 = new Terminal('赤岗');
var line8_T10 = new Terminal('磨碟沙');
var line8_T11 = new Terminal('新港东');
var line8_T12 = new Terminal('琶洲');
var line8_T13 = new Terminal('万胜围');


var line1Terminals = [line1_T1, line1_T2, line1_T3, line1_T4, line1_T5, line1_T6, line1_T7, line1_T8, line1_T9, line1_T10, line1_T11, line1_T12, line1_T13, line1_T14, line1_T15, line1_T16];

var line2Terminals = [line2_T1, line2_T2, line2_T3, line2_T4, line2_T5, line2_T6, line2_T7, line2_T8, line2_T9, line2_T10, line2_T11, line1_T8, line2_T13, line2_T14, line2_T15, line2_T16, line2_T17, line2_T18, line2_T19, line2_T20, line2_T21, line2_T22, line2_T23, line2_T24];

var line3Terminals = [line3_T1, line3_T2, line3_T3, line3_T4, line3_T5, line1_T3, line3_T7, line3_T8, line3_T9, line3_T10, line3_T11, line3_T12, line3_T13, line3_T14, line3_T15, line3_T16];

var line3plusTerminals = [line3plus_T1, line3plus_T2, line3plus_T3, line2_T1, line3plus_T5, line3plus_T6, line3plus_T7, line3plus_T8, line3plus_T9, line3plus_T10, line1_T1, line3plus_T12, line1_T3];

var line4Terminals = [line4_T1, line4_T2, line4_T3, line4_T4, line4_T5, line4_T6, line4_T7, line4_T8, line4_T9, line4_T10, line4_T11, line4_T12, line4_T13, line4_T14, line4_T15, line4_T16];

var line5Terminals = [line5_T1, line5_T2, line5_T3, line5_T4, line5_T5, line2_T9, line5_T7, line5_T8, line5_T9, line5_T10, line1_T4, line5_T12, line3_T7, line5_T14, line5_T15, line5_T16, line5_T17, line4_T3, line5_T19, line5_T20, line5_T21, line5_T22, line5_T23, line5_T24];

var line6Terminals = [line6_T1, line6_T2, line6_T3, line6_T4, line5_T2, line6_T6, line1_T12, line6_T8, line6_T9, line2_T13, line6_T11, line6_T12, line6_T13, line1_T5, line5_T9, line6_T16, line6_T17, line6_T18, line6_T19, line3plus_T10, line3_T1, line6_T22];

var line8Terminals = [line8_T1, line8_T2, line8_T3, line2_T16, line8_T5, line8_T6, line8_T7, line3_T9, line8_T9, line8_T10, line8_T11, line8_T12, line4_T4];

var line1 = new Line(line1Terminals, 'Line1');
var line2 = new Line(line2Terminals, 'Line2');
var line3 = new Line(line3Terminals, 'Line3');
var line3plus = new Line(line3plusTerminals, 'Line3plus');
var line4 = new Line(line4Terminals, 'Line4');
var line5 = new Line(line5Terminals, 'Line5');
var line6 = new Line(line6Terminals, 'Line6');
var line8 = new Line(line8Terminals, 'Line8');

var gzmtr = new MTR('广州地铁');
gzmtr.addLines([line1, line2, line3, line3plus, line4, line5, line6, line8]);
// //一号线换乘
// gzmtr.intersectWith(line1_T12, line6_T7); //黄沙
// gzmtr.intersectWith(line1_T8, line2_T12); //公园前
// gzmtr.intersectWith(line1_T5, line6_T14); //东山口
// gzmtr.intersectWith(line1_T4, line5_T11); //杨箕
// gzmtr.intersectWith(line1_T3, line3_T6); //体育西路
// gzmtr.intersectWith(line1_T3, line3plus_T13); //体育西路
// gzmtr.intersectWith(line1_T1, line3plus_T11); //广州东站
// //二号线换乘
// gzmtr.intersectWith(line2_T1, line3plus_T4); //嘉禾望岗
// gzmtr.intersectWith(line2_T9, line5_T6); //广州火车站
// gzmtr.intersectWith(line2_T13, line6_T10); //海珠广场
// gzmtr.intersectWith(line2_T16, line8_T4); //昌岗
// //三号线换乘
// gzmtr.intersectWith(line3_T1, line6_T21); //天河客运站
// gzmtr.intersectWith(line3_T6, line3plus_T13); //体育西路
// gzmtr.intersectWith(line3_T7, line5_T13); //珠江新城
// gzmtr.intersectWith(line3_T9, line8_T8); //客村
// //三号线（北延线）
// gzmtr.intersectWith(line3plus_T10, line6_T20); //燕塘
// //四号线换乘
// gzmtr.intersectWith(line4_T3, line5_T18); //车陂南
// gzmtr.intersectWith(line4_T4, line8_T13); //万胜围
// //五号线换乘
// gzmtr.intersectWith(line5_T2, line6_T5); //坦尾
// gzmtr.intersectWith(line5_T9, line6_T15); //区庄

console.log(gzmtr.search(line1_T13, line2_T8));