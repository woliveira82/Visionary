function calculus(graph) {

    var maxDegree = calcDegree(graph);
    adjustTypes(graph);
    calcMetrics(graph);
    setCharts(graph);
    return graph;
}

//Create or Refresh all degree property in each node and return the max degree found
function calcDegree(graph) {
    var max = 0;
    graph.nodes.forEach(function (node, index) {
        var degree = 0;
        graph.paths.forEach(function (path) {
            if (path.source === index || path.target === index) {
                degree++;
            }
        });
        node.degree = degree;
        if (degree > max)
            max = degree;
    });
    return max;
}

function calcMetrics(graph) {
    setOriginalId(graph);
    graph.nodes.forEach(function (node, index) {
        var Dga = getSubGraph(graph, node, false);
        var Iga = getSubGraph(graph, node, true);
        insertMetrics(node, Dga, Iga, graph.nodes.length);
    });
}

function setOriginalId(graph) {
    graph.nodes.forEach(function (node, index) {
        node.id = index;
    });
}

function getSubGraph(graph, node, sense) {
    var newGraph = JSON.parse('{"nodes":[], "paths":[]}');
    var indexMap = [];
    //Adicionando nó de origem
    insertNewGraph(newGraph, indexMap, node);
    //Preparando recursividade
    var pointer = 0;
    //Getting nodes
    do {
        graph.paths.forEach(function (path, pathIndex) {
            if (path.source == indexMap[pointer]) {
                path.links.forEach(function (link) {
                    if ((link.sense == sense) && (link.name.localeCompare("influenced") === 0)) {
                        insertNewGraph(newGraph, indexMap, graph.nodes[path.target]);
                    }
                });
            } else if (path.target == indexMap[pointer]) {
                path.links.forEach(function (link) {
                    if ((link.sense != sense) && link.name.localeCompare("influenced") === 0) {
                        insertNewGraph(newGraph, indexMap, graph.nodes[path.source]);
                    }
                });
            }
        });
        pointer++;
    } while (pointer <= indexMap.length);
    //Getting paths
    graph.paths.forEach(function (path, pathIndex) {
        if ((indexMap.indexOf(path.source) !== -1) && (indexMap.indexOf(path.target) !== -1)) {
            var newPath = JSON.parse('{"source":0, "target":0, "type":"", "links":[]}');
            newPath.souce = path.source;
            newPath.target = path.target;
            newPath.type = path.type;
            newPath.links = path.links;
            newGraph.paths.push(newPath);
        }
    });
    correctIndex(newGraph, indexMap);
    return newGraph;
}

function insertNewGraph(newGraph, indexMap, node) {
    if (indexMap.indexOf(node.id) === -1) {
        newGraph.nodes.push(node);
        indexMap.push(node.id);
    }
}

function correctIndex(newGraph, indexMap) {
    newGraph.paths.forEach(function (path) {
        path.target = indexMap.indexOf(path.target);
        path.source = indexMap.indexOf(path.source);
    });
}

function insertMetrics(node, Dga, Iga, numberNodes) {
    node.dependence = JSON.parse('{"nodes":0, "edges":0, "diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
    node.dependence.nodes = Dga.nodes.length;
    node.dependence.edges = sumEdges(Dga.paths);
    var distances = calcDistances(Dga);
    node.dependence.diameter = distances.diameter;
    node.dependence.MFD_EE = distances.MFD_EE;
    node.dependence.MFD_AA = distances.MFD_AA;
    node.dependence.MFD_TT = distances.MFD_TT;
    node.dependence.MFD_EA = distances.MFD_EA;
    node.dependence.MFD_AT = distances.MFD_AT;
    node.dependence.MFD_TE = distances.MFD_TE;
    node.influence = JSON.parse('{"nodes":0, "edges":0, "diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
    node.influence.nodes = Iga.nodes.length;
    node.influence.edges = sumEdges(Iga.paths);
    var distances = calcDistances(Iga);
    node.influence.diameter = distances.diameter;
    node.influence.MFD_EE = distances.MFD_EE;
    node.influence.MFD_AA = distances.MFD_AA;
    node.influence.MFD_TT = distances.MFD_TT;
    node.influence.MFD_EA = distances.MFD_EA;
    node.influence.MFD_AT = distances.MFD_AT;
    node.influence.MFD_TE = distances.MFD_TE;
    distances = calcDistances(Iga);
    var size = calcSize(Iga.nodes.length, Iga.paths.length, distances, numberNodes);
    node.size = size;
}

function sumEdges(paths) {
    var val = 0;
    paths.forEach(function (path) {
        val += path.links.length;
    });
    return val;
}

function calcDistances(graph) {

    var matrix = findMatrix(graph);
    //alert(JSON.stringify(matrix));
    var metrics = JSON.parse('{"diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
    if (typeof matrix !== "undefined") {

        var n = graph.nodes.length;
        var max = matrix[0][0];
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (matrix[i][j] > max) {
                    max = matrix[i][j];
                }
            }
        }
        metrics.diameter = max;
        max = Infinity;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Entity") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Entity") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_EE = max;
        max = graph.paths.length + 1;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Agent") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Agent") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_AA = max;
        max = graph.paths.length + 1;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Activity") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Activity") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_TT = max;
        max = graph.paths.length + 1;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Entity") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Agent") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_EA = max;
        max = graph.paths.length + 1;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Agent") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Activity") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_AT = max;
        max = graph.paths.length + 1;
        for (var i = 0; i < n; i++) {
            if (graph.nodes[i].type === "Activity") {
                for (var j = 0; j < n; j++) {
                    if (graph.nodes[j].type === "Entity") {
                        if (matrix[i][j] > max) {
                            max = matrix[i][j];
                        }
                    }
                }
            }
        }
        metrics.MFD_TE = max;
    }
    return metrics;
}

function findMatrix(graph) {
    var n = graph.nodes.length;
    if (n > 1) {
//creating distance matrix
        var matrix = new Array(n);
        for (var i = 0; i < n; i++) {
            matrix[i] = new Array(n);
        }
//set initial distances = -1
        for (var i = 0; i < n; i++) {
            for (var j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0;
                } else {
                    matrix[i][j] = -1;
                }
            }
        }
//calculating minimal distance for each node
        for (var i = 0; i < n; i++) {
            findNear(matrix, graph, i, 1);
        }
    }
    return matrix;
}

function findNear(matrix, graph, origin, dist) {
    for (var index = 0; index < graph.nodes.length; index++) {
        graph.paths.forEach(function (path) {
            if (path.source == origin && path.target == index) {
                if (matrix[origin][index] == -1 || matrix[origin][index] > dist) {
                    matrix[origin][index] = dist;
                    matrix[index][origin] = dist;
                    findNear(matrix, graph, index, dist + 1);
                }
            } else if (path.target == origin && path.souce == index) {
                if (matrix[origin][index] == -1 || matrix[origin][index] > dist) {
                    matrix[origin][index] = dist;
                    matrix[index][origin] = dist;
                    findNear(matrix, graph, origin, index, dist + 1);
                }
            }
        });
    }
}

function calcSize(Vga, Ega, distances, n) {

    var imp = Vga / n;
    if (Vga === 1)
        return imp / 8;
    var Em = (Vga * (Vga - 1)) / 2;
    var mean = 0;
    if (Em !== 0) {
        mean += Ega / Em;
    }
    if (distances.diameter !== 0) {
        mean += 1 / distances.diameter;
    }
    if (distances.MFD_AA !== 0) {
        mean += 1 / distances.MFD_AA;
    }
    if (distances.MFD_EE !== 0) {
        mean += 1 / distances.MFD_EE;
    }
    if (distances.MFD_TT !== 0) {
        mean += 1 / distances.MFD_TT;
    }
    if (distances.MFD_EA !== 0) {
        mean += 1 / distances.MFD_EA;
    }
    if (distances.MFD_AT !== 0) {
        mean += 1 / distances.MFD_AT;
    }
    if (distances.MFD_TE !== 0) {
        mean += 1 / distances.MFD_TE;
    }
    mean /= 8;
    return imp + imp * mean;
}

function adjustTypes(graph) {
    graph.nodes.forEach(function (node) {
        var specificType = node.type;
        if (node.type == "Entity" || node.type == "Bundle" || node.type == "Collection" || node.type == "EmptyCollection" || node.type == "Plan") {
            node.type = "Entity";
        } else if (node.type == "Agent" || node.type == "Organization" || node.type == "Person" || node.type == "SoftwareAgent") {
            node.type = "Agent";
        } else {
            node.type = "Activity";
        }
        node.specificType = specificType;
    });
}

function setCharts(graph){
    var agentAmaunt = 0;
    var activityAmaunt = 0;
    var entityAmaunt = 0;
    
    graph.nodes.forEach(function (n){
        if(n.type == "Activity"){
            activityAmaunt++;
        }else if(n.type == "Entity"){
            entityAmaunt++;
        }else{
            agentAmaunt++;
        }
    });
    
    $("#agentAmaunt").html(agentAmaunt);
    $("#activityAmaunt").html(activityAmaunt);
    $("#entityAmaunt").html(entityAmaunt);
    $("#totalAmaunt").html(totalAmaunt);
    
    var data = "<tr><th>id</th><th>Name</th><th>Type</th><th>Degree</th><th>Dependence Nodes</th><th>Dependence Edges</th><th>Dependence Diameter</th><th>Influence Nodes</th><th>Influence Edges</th><th>Influence Diameter</th></tr>";
    
    graph.nodes.forEach(function (n){
        data += "<tr>";
        data += "<td>" + n.id + "</td><td>" + n.name + "</td><td>" + n.type + "</td><td>" + n.degree + "</td><td>" + n.dependence.nodes + "</td><td>" + n.dependence.edges + "</td><td>" + n.dependence.diameter + "</td><td>" + n.influence.nodes + "</td><td>" + n.influence.edges + "</td><td>" + n.influence.diameter + "</td>";
        data += "</tr>";
    });
    
    $("#calculus").html(data);
}

function setData(nodes){
    var dataset = [];
    nodes.forEach(function(node){
        var data = [node.id, node.name, node.type, node.specificType, node.degree,
            node.dependence.nodes, node.dependence.edges, node.dependence.diameter,
            node.dependence.MFD_EE, node.dependence.MFD_AA, node.dependence.MFD_TT,
            node.dependence.MFD_EA, node.dependence.MFD_AT, node.dependence.MFD_TE,
            node.size];
        dataset.push(data);
    });
    return dataset;
}