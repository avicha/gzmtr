var Terminal = function(name) {
    this.name = name;
    this.neighbours = [];
    this.lines = [];
    this.d = 0;
    this.prev = null;
};
Terminal.prototype.getName = function() {
    return this.name;
};
var Line = function(terminals, name) {
    this.terminals = terminals;
    this.name = name;
};
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
var MTR = function(name) {
    this.name = name;
    this.lines = [];
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
MTR.prototype.search = function(terminal1, terminal2) {
    var route;
    this.stack.push(terminal1);
    while (this.stack.length) {
        var terminal = this.stack.shift();
        if (terminal == terminal2) {
            route = [];
            while (terminal) {
                route.splice(0, 0, terminal);
                terminal = terminal.prev;
            }
            break;
        } else {
            var neighbours = terminal.neighbours.filter(function(neighbour) {
                return neighbour != terminal.prev;
            });
            neighbours.forEach(function(neighbour) {
                if (!neighbour.d) {
                    neighbour.d = terminal.d + 1;
                    neighbour.prev = terminal;
                    console.log(neighbour.name, neighbour.d);
                    this.stack.push(neighbour);
                }
            }.bind(this));
        }
    }
    return route;
};
MTR.prototype.printRoute = function(route) {
    var desc = '',
        currentLine, currentTerminalName, count = 0,
        descArr = [];
    var terminals = [];
    for (var i = 1, l = route.length; i < l; i++) {
        terminals[i - 1] = {
            name: route[i].name,
            line: _.intersection(route[i - 1].lines, route[i].lines).toString()
        };
    }
    if (terminals.length) {
        currentLine = _.first(terminals).line;
        currentTerminalName = _.first(route).name;
        desc += '从' + currentTerminalName + '出发乘坐' + currentLine + '，';
        terminals.forEach(function(terminal, i) {
            if (terminal.line == currentLine) {
                count++;
            } else {
                var endTerminalName = terminals[i - 1].name;
                descArr.push({
                    start: currentTerminalName,
                    end: endTerminalName,
                    line: currentLine,
                    count: count
                });
                desc += '乘坐' + count + '个站到达' + endTerminalName + '，换乘' + terminal.line + '，';
                currentLine = terminal.line;
                currentTerminalName = endTerminalName;
                count = 1;
            }
        });
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