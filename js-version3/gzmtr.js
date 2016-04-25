/**
 * [Terminal 站点]
 * @param {[type]} name [站点名称]
 */
var Terminal = function(name) {
    this.name = name;
    //邻接站点
    this.neighbours = [];
    //路线
    this.lines = [];
    //站点权重
    this.d = 0;
    //上一个站点
    this.prev = null;
};
/**
 * [clone 克隆当前站点的数据]
 * @return {[type]} [description]
 */
Terminal.prototype.clone = function() {
    var clone = new Terminal(this.name);
    clone.neighbours = this.neighbours;
    clone.lines = this.lines;
    clone.d = 0;
    clone.prev = null;
    return clone;
};
Terminal.prototype.getName = function() {
    return this.name;
};
/**
 * [reset 重置数据]
 * @return {[type]} [description]
 */
Terminal.prototype.reset = function() {
    this.d = 0;
    this.prev = null;
    return this;
};
/**
 * [Line 路线]
 * @param {[type]} terminals [途径站点]
 * @param {[type]} name      [路线名称]
 */
var Line = function(terminals, name) {
    this.terminals = terminals;
    this.name = name;
};
/**
 * [init 初始化路线，设置站点的邻接站点]
 * @return {[type]} [description]
 */
Line.prototype.init = function() {
    this.terminals.forEach(function(terminal, i, terminals) {
        terminal.lines.push(this.name);
        if (terminals[i + 1]) {
            terminal.neighbours.push(terminals[i + 1]);
        }
        if (terminals[i - 1]) {
            terminal.neighbours.push(terminals[i - 1]);
        }
    }.bind(this));
    return this;
};
Line.prototype.getName = function() {
    return this.name;
};
Line.prototype.getTerminal = function(i) {
    return this.terminals[i];
};
Line.prototype.getTerminals = function() {
    return this.terminals;
};
/**
 * [Route 最短路径]
 * @param {[type]} terminals [路径途径站点]
 */
var Route = function(terminals) {
    //途径站点
    this.terminals = terminals;
    //终点的权重即为耗时
    this.time = _.last(terminals).d;
    //每一段路途
    this.nodes = [];
    //描述文本
    this.desc = '';
    //换乘次数
    this.transferCount = 0;
    this.init();
};
Route.prototype.init = function() {
    var currentLine, currentTerminalName, endTerminalName, count = 0,
        transferCount = 0;
    //记录下个站和到达下个站的路线
    var tmp = [];
    for (var i = 1, l = this.terminals.length; i < l; i++) {
        tmp[i - 1] = {
            name: this.terminals[i].name,
            line: MTR.calculateLine(this.terminals[i - 1], this.terminals[i])
        };
    }
    if (tmp.length) {
        //当前路线和站点
        currentLine = _.first(tmp).line;
        currentTerminalName = _.first(this.terminals).name;
        this.desc += '从' + currentTerminalName + '出发乘坐' + currentLine + '，';
        tmp.forEach(function(terminal, i) {
            //下一个站点还是再同一条路线上，则计数+1
            if (terminal.line == currentLine) {
                count++;
            } else {
                //换乘
                transferCount++;
                //换乘站点
                endTerminalName = tmp[i - 1].name;
                //记录下出发站点，换乘站点，搭乘路线，途径站点数
                this.nodes.push({
                    start: currentTerminalName,
                    end: endTerminalName,
                    line: currentLine,
                    count: count
                });
                //添加描述
                this.desc += '乘坐' + count + '个站到达' + endTerminalName + '，换乘' + terminal.line + '，';
                ////把换乘后的路线和站点设置为当前路线和当前站点
                currentLine = terminal.line;
                currentTerminalName = endTerminalName;
                //重置计数
                count = 1;
            }
        }.bind(this));
        //最后终点站
        endTerminalName = _.last(tmp).name;
        this.transferCount = transferCount;
        this.desc += '乘坐' + count + '个站到达终点站' + endTerminalName + '，总换乘' + transferCount + '次，耗时' + this.time + '分钟';
        this.nodes.push({
            start: currentTerminalName,
            end: endTerminalName,
            line: currentLine,
            count: count
        });
    }
};
/**
 * [toString 输出线路途径的站点名称]
 * @return {[type]} [description]
 */
Route.prototype.toString = function() {
    return this.terminals.map(function(terminal) {
        return terminal.name;
    }).join('>');
};
/**
 * [MTR 地铁]
 * @param {[type]} name [地铁名称]
 */
var MTR = function(name) {
    this.name = name;
    //路线集合
    this.lines = [];
    //遍历队列
    this.stack = [];
    //所有地铁站点
    this.terminals = [];
};
MTR.prototype.getName = function() {
    return this.name;
};
/**
 * [addLine 添加路线]
 * @param {[type]} line [description]
 */
MTR.prototype.getLine = function(i) {
    return this.lines[i];
};
MTR.prototype.getLines = function() {
    return this.lines;
};
MTR.prototype.addLine = function(line) {
    this.lines.push(line.init());
    this.terminals = this.terminals.concat(line.getTerminals());
    return this;
};
MTR.prototype.addLines = function(lines) {
    lines.forEach(function(line) {
        this.addLine(line);
    }.bind(this));
    return this;
};
/**
 * [calculateDistance 计算站点1到站点2的距离，这里由于调用一定是相邻两个站点，所以假设都是2km]
 * @param  {[type]} terminal1 [站点1]
 * @param  {[type]} terminal2 [站点2]
 * @return {[type]}           [description]
 */
MTR.prototype.calculateDistance = function(terminal1, terminal2) {
    return 2;
};
/**
 * [reset 重置地铁的站点权重和父节点指针]
 * @return {[type]} [description]
 */
MTR.prototype.reset = function() {
    this.terminals.forEach(function(terminal) {
        terminal.reset();
    });
    return this;
};
/**
 * [search 广度优先搜索站点1到站点2的最短路径]
 * @param  {[type]} terminal1 [站点1]
 * @param  {[type]} terminal2 [站点2]
 * @return {[type]}           [description]
 */
MTR.prototype.search = function(terminal1, terminal2) {
    //最短路径，地铁时速，换乘耗时分钟数，换乘总时间，最短耗时
    var route, mtrRate = 60,
        transferTime = 3,
        transferTimeSum, shortestT;
    //站点1开始遍历
    this.stack.push(terminal1);
    while (this.stack.length) {
        //出栈
        var terminal = this.stack.shift();
        //找到终点站
        if (terminal.name == terminal2.name) {
            //如果第一个找到终点的路线，或者这条路线比之前找到的路线耗时要少
            if (!shortestT || terminal.d < shortestT) {
                var tmp = [];
                //记录最短耗时
                shortestT = terminal.d;
                //反向遍历链表，记录当前最短路径
                while (terminal) {
                    tmp.push(terminal);
                    terminal = terminal.prev;
                }
                tmp.reverse();
                route = new Route(tmp);
            }
        } else {
            //获取子节点
            var neighbours = terminal.neighbours.filter(function(neighbour) {
                return neighbour != terminal.prev;
            });
            neighbours.forEach(function(neighbour) {
                //站点耗时等于上一个站点的耗时加上两个相邻站点之间的行驶耗时
                var d = terminal.d + this.calculateDistance(terminal, neighbour) / mtrRate * 60 + 0.5;
                //如果有上一个站点
                if (terminal.prev) {
                    //计算当前路线和下一个站点的路线，不一样说明需要换乘
                    var line1 = MTR.calculateLine(terminal.prev, terminal);
                    var line2 = MTR.calculateLine(terminal, neighbour);
                    transferTimeSum = (line1 == line2 ? 0 : transferTime);
                } else {
                    transferTimeSum = 0;
                }
                //耗时加上换乘耗时
                d += transferTimeSum;
                //如果第一次记录最短耗时或者这条路线深度比当前最短路径要深，但是耗时要少
                if (!shortestT || d < shortestT) {
                    //如果第一次搜索到这个站点，则记录耗时、父节点和放进队列
                    if (!neighbour.d) {
                        neighbour.d = d;
                        neighbour.prev = terminal;
                        this.stack.push(neighbour);
                    } else {
                        //如果比之前的耗时要少，则克隆耗时和父节点放进队列
                        if (d < neighbour.d) {
                            var clone = neighbour.clone();
                            clone.d = d;
                            clone.prev = terminal;
                            this.stack.push(clone);
                        }
                    }
                }
            }.bind(this));
            this.stack.sort(function(a, b) {
                return a.d - b.d;
            });
        }
    }
    return route;
};
/**
 * [calculateLine 计算两个站点属于哪条路线]
 * @param  {[type]} terminal1 [站点1]
 * @param  {[type]} terminal2 [站点2]
 * @return {[type]}           [description]
 */
MTR.calculateLine = function(terminal1, terminal2) {
    return _.intersection(terminal1.lines, terminal2.lines).toString();
};