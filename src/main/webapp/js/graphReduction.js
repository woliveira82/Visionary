function graphReduction(graph) {
    var maxDegree = calcDegree(graph);      
    graph = reduceGraph(graph, maxDegree);
    return graph;
}

function reduceGraph(graph, maxDegree) {
    var types = ["Activity", "Entity", "Agent"];
    for (var degree = 0; degree <= maxDegree; degree++) {
        types.forEach(function (type) {
            graph = groupByDegree(graph, type, degree);
        });
    }
    return graph;
}

function groupByDegree(graph, type, degree) {
    var sameDegree = new Array();
    var groupFounded;
    do {
        groupFounded = false;
        //select all nodes from the same type and degree
        graph.nodes.forEach(function (node, index) {
            if (node.type == type && node.degree == degree) {
                sameDegree.push(index);
            }
        });
        //select the nodes with the same links
        for (var i = 0; i < sameDegree.length && !groupFounded; i++) {
            var group = [sameDegree[i]];
            var pattern = getPaths(graph.paths, sameDegree[i]);
            for (var j = i + 1; j < sameDegree.length; j++) {
                var newPattern = getPaths(graph.paths, sameDegree[j]);
                if (testSimilarity(pattern, newPattern)) {
                    group.push(sameDegree[j]);
                }
            }
            if (group.length > 1) {
                graph = groupNodes(graph, group);
                sameDegree = [];
                groupFounded = true;
            }
        }
    } while (groupFounded);
    return graph;
}

function getPaths(paths, index) {
    var connections = new Array();
    paths.forEach(function (path) {
        if (path.source == index) {
            connections.push(path.target);
        } else if (path.target == index) {
            connections.push(path.source);
        }
    });
    connections.sort(compare);
    return connections;
}

function compare(a, b) {
    return a - b;
}

function testSimilarity(pattern, newPattern) {
    var test = true;
    if (pattern.length == newPattern.length) {
        for (var i = 0; i < pattern.length; i++) {
            if (pattern[i] != newPattern[i]) {
                test = false;
            }
        }
    } else {
        test = false;
    }
    return test;
}

//create a new node for a given group of node index
function groupNodes(graph, group) {
    //Save all the json nodes in a the nodeGroup var
    var nodeGroup = new Array();
    group.forEach(function (index) {
        nodeGroup.push(graph.nodes[index]);
    });
    
    //The group recive new type and name
    var newGroup = JSON.parse('{"name":"", "type":"", "degree":0, "specificType":"", "id":0, "nodes":[], "size":0}');
    newGroup.degree = graph.nodes[group[0]].degree;
    newGroup.nodes = nodeGroup;
    newGroup.size = newGroup.nodes[0].size * newGroup.nodes.length;
    newGroup.name = "x " + newGroup.nodes.length;
    switch (graph.nodes[group[0]].type) {
        case "Activity":
            newGroup.type = "GroupOfActivities";
            newGroup.specificType = "Activities";
            break;
        case "Entity":
            newGroup.type = "GroupOfEntities";
            newGroup.specificType = "Entities";
            break;
        default:
            newGroup.type = "GroupOfAgents";
            newGroup.specificType = "Agents";
            break;
    }
    var groupIndex = graph.nodes.length - 1;
    newGroup.id = groupIndex;
    graph.nodes.push(newGroup);

    //Slice the first node and get its links to the group
    var erase = group[0];
    graph.paths.forEach(function (path, pathIndex) {
        if (path.target > erase) {
            path.target--;
        } else if (path.target == erase) {
            path.target = groupIndex;
        }
        if (path.source > erase) {
            path.source--;
        } else if (path.source == erase) {
            path.source = groupIndex;
        }
    });
    graph.nodes.splice(erase, 1);
    for (var i = 0; i < group.length; i++) {
        if (group[i] > erase) {
            group[i]--;
        } else if (group[i] == erase) {
            group[i] = -1;
        }
    }

    //Slice the other nodes from the group
    for (var i = 1; i < group.length; i++) {
        erase = group[i];
        graph.nodes.splice(erase, 1);

        var newPaths = new Array();

        graph.paths.forEach(function (path) {
            if (path.source != erase && path.target != erase) {
                if (path.source > erase)
                    path.source--;
                if (path.target > erase)
                    path.target--;
                newPaths.push(path);
            }

        });
        graph.paths = newPaths;

        for (var j = 0; j < group.length; j++) {
            if (group[j] > erase) {
                group[j]--;
            } else if (group[j] == erase) {
                group[j] = -1;
            }
        }
    }

    return graph;
}