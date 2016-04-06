var Terminal = function(name) {
    this.name = name;
    this.neighbours = [];
    this.lines = [];
    this.d = 0;
    this.prev = null;
};
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
Terminal.prototype.reset = function() {
    this.d = 0;
    this.prev = null;
    return this;
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
var Route = function(terminals) {
    this.terminals = terminals;
    this.time = _.last(terminals).d;
    this.nodes = [];
    this.desc = '';
    this.transferCount = 0;
    this.init();
};
Route.prototype.init = function() {
    var currentLine, currentTerminalName, endTerminalName, count = 0,
        transferCount = 0;
    var tmp = [];
    for (var i = 1, l = this.terminals.length; i < l; i++) {
        tmp[i - 1] = {
            name: this.terminals[i].name,
            line: MTR.calculateLine(this.terminals[i - 1], this.terminals[i])
        };
    }
    if (tmp.length) {
        currentLine = _.first(tmp).line;
        currentTerminalName = _.first(this.terminals).name;
        this.desc += '从' + currentTerminalName + '出发乘坐' + currentLine + '，';
        tmp.forEach(function(terminal, i) {
            if (terminal.line == currentLine) {
                count++;
            } else {
                transferCount++;
                endTerminalName = tmp[i - 1].name;
                this.nodes.push({
                    start: currentTerminalName,
                    end: endTerminalName,
                    line: currentLine,
                    count: count
                });
                this.desc += '乘坐' + count + '个站到达' + endTerminalName + '，换乘' + terminal.line + '，';
                currentLine = terminal.line;
                currentTerminalName = endTerminalName;
                count = 1;
            }
        }.bind(this));
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
Route.prototype.toString = function() {
    return this.terminals.map(function(terminal) {
        return terminal.name;
    }).join('>');
};
var MTR = function(name) {
    this.name = name;
    this.lines = [];
    this.stack = [];
    this.terminals = [];
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
    this.terminals = this.terminals.concat(line.getTerminals());
    return this;
};
MTR.prototype.addLines = function(lines) {
    lines.forEach(function(line) {
        this.addLine(line);
    }.bind(this));
    return this;
};
MTR.prototype.calculateDistance = function(terminal1, terminal2) {
    return 2;
};
MTR.prototype.reset = function() {
    this.terminals.forEach(function(terminal) {
        terminal.reset();
    });
    return this;
};
MTR.prototype.search = function(terminal1, terminal2) {
    var route, mtrRate = 60,
        transferTime = 3,
        transferTimeSum, shortestT;
    this.stack.push(terminal1);
    while (this.stack.length) {
        var terminal = this.stack.shift();
        if (terminal.name == terminal2.name) {
            if (!shortestT || terminal.d < shortestT) {
                var tmp = [];
                shortestT = terminal.d;
                while (terminal) {
                    tmp.push(terminal);
                    terminal = terminal.prev;
                }
                tmp.reverse();
                route = new Route(tmp);
            }
        } else {
            var neighbours = terminal.neighbours.filter(function(neighbour) {
                return neighbour != terminal.prev;
            });
            neighbours.forEach(function(neighbour) {
                var d = terminal.d + this.calculateDistance(terminal, neighbour) / mtrRate * 60 + 0.5;
                if (terminal.prev) {
                    var line1 = MTR.calculateLine(terminal.prev, terminal);
                    var line2 = MTR.calculateLine(terminal, neighbour);
                    transferTimeSum = (line1 == line2 ? 0 : transferTime);
                } else {
                    transferTimeSum = 0;
                }
                d += transferTimeSum;
                if (!shortestT || d < shortestT) {
                    if (!neighbour.d) {
                        neighbour.d = d;
                        neighbour.prev = terminal;
                        this.stack.push(neighbour);
                        console.log(terminal.name, neighbour.name, d, shortestT, 'push new');
                    } else {
                        if (d < neighbour.d) {
                            var clone = neighbour.clone();
                            clone.d = d;
                            clone.prev = terminal;
                            this.stack.push(clone);
                            console.log(terminal.name, neighbour.name, d, shortestT, 'push old');
                        } else {
                            console.log(terminal.name, neighbour.name, d, shortestT, 'ignore greater than old time');
                        }
                    }
                } else {
                    console.log(terminal.name, neighbour.name, d, shortestT, 'ignore greater than shortestT');
                }
            }.bind(this));
        }
    }
    return route;
};
MTR.calculateLine = function(terminal1, terminal2) {
    return _.intersection(terminal1.lines, terminal2.lines).toString();
};