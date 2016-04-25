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
Terminal.prototype.getName = function() {
    return this.name;
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
 * [MTR 地铁]
 * @param {[type]} name [地铁名称]
 */
var MTR = function(name) {
    this.name = name;
    //路线集合
    this.lines = [];
    //遍历队列
    this.stack = [];
};
MTR.prototype.getName = function() {
    return this.name;
};
MTR.prototype.getLine = function(i) {
    return this.lines[i];
};
MTR.prototype.getLines = function() {
    return this.lines;
};
/**
 * [addLine 添加路线]
 * @param {[type]} line [description]
 */
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
/**
 * [search 广度优先搜索站点1到站点2的最短路径]
 * @param  {[type]} terminal1 [站点1]
 * @param  {[type]} terminal2 [站点2]
 * @return {[type]}           [description]
 */
MTR.prototype.search = function(terminal1, terminal2) {
    var route;
    //从站点1出发遍历
    this.stack.push(terminal1);
    //有站点需要出发
    while (this.stack.length) {
        //出栈
        var terminal = this.stack.shift();
        //如果已经找到站点2，则返回线路，反向遍历链表
        if (terminal == terminal2) {
            route = [];
            while (terminal) {
                route.splice(0, 0, terminal);
                terminal = terminal.prev;
            }
            break;
        } else {
            //否则获取子节点，过滤掉当前节点的父节点
            var neighbours = terminal.neighbours.filter(function(neighbour) {
                return neighbour != terminal.prev;
            });
            //设置这些子节点的深度和父节点，并放进队列待遍历
            neighbours.forEach(function(neighbour) {
                if (!neighbour.d) {
                    neighbour.d = terminal.d + 1;
                    neighbour.prev = terminal;
                    //可以查看每个站点的名称和搜索深度，即离起点的站点数
                    // console.log(neighbour.name, neighbour.d);
                    this.stack.push(neighbour);
                }
            }.bind(this));
        }
    }
    return route;
};
/**
 * [printRoute 返回路线的描述]
 * @param  {[type]} route [路线]
 * @return {[type]}       [description]
 */
MTR.prototype.printRoute = function(route) {
    var desc = '',
        currentLine, currentTerminalName, count = 0,
        descArr = [];
    //先计算出路线的每个站和属于几号线
    var terminals = [];
    for (var i = 1, l = route.length; i < l; i++) {
        terminals[i - 1] = {
            name: route[i].name,
            line: _.intersection(route[i - 1].lines, route[i].lines).toString()
        };
    }
    //如果有最短路径
    if (terminals.length) {
        //第一条路线和站点
        currentLine = _.first(terminals).line;
        currentTerminalName = _.first(route).name;
        desc += '从' + currentTerminalName + '出发乘坐' + currentLine + '，';
        terminals.forEach(function(terminal, i) {
            //下一个站点还是再同一条路线上，则计数+1
            if (terminal.line == currentLine) {
                count++;
            } else {
                //开始换乘，记下换乘站点
                var endTerminalName = terminals[i - 1].name;
                //数据结构为出发站点，换乘站点，搭乘路线，途径站点数
                descArr.push({
                    start: currentTerminalName,
                    end: endTerminalName,
                    line: currentLine,
                    count: count
                });
                desc += '乘坐' + count + '个站到达' + endTerminalName + '，换乘' + terminal.line + '，';
                //把换乘后的路线和站点设置为当前路线和当前站点
                currentLine = terminal.line;
                currentTerminalName = endTerminalName;
                //重置计数
                count = 1;
            }
        });
        //最后终点站
        var endTerminalName = _.last(terminals).name;
        desc += '乘坐' + count + '个站到达终点站' + endTerminalName;
        descArr.push({
            start: currentTerminalName,
            end: endTerminalName,
            line: currentLine,
            count: count
        });
        return {
            descArr: descArr,
            desc: desc
        };
    } else {
        return {
            descArr: descArr,
            desc: desc
        };
    }
};