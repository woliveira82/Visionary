$(document).ready(function () {
    var startTime = Date.now();
    $("#sourceVis").hide();
    $("#chartVis").hide();
    var startTime = Date.now();
    var nodeTip = d3.select("#nodeTip")
            .style("opacity", 0);
    var pathTip = d3.select("#pathTip")
            .style("opacity", 0);
    //-------------------------------------------------------Write Tip Functions
    function writeNodeTip(graph, node) {
        graph.nodes.forEach(function (n) {
            $("#t" + n.id).html(n.name);
        });
        if ($("input[name='similarity']:checked").val() === "off") {
            var nameHeader = "<tr><th>Name</th><th>Type</th><th>Specific Type</th></tr>";
            if (node.type.lastIndexOf("GroupOf") == -1) {
                $("#tipNodeName").html(nameHeader + "<tr><td>" + node.name + "</td><td>" + node.type + "</td><td>" + node.specificType + "</td></tr>");
            } else {
                $("#tipNodeName").html(nameHeader);
                node.nodes.forEach(function (nd) {
                    $("#tipNodeName").append("<tr><td>" + nd.name + "</td><td>" + nd.type + "</td><td>" + nd.specificType + "</td></tr>");
                });
            }

            //Calculating the node tip position
            var width = $(window).width();
            var posX = d3.event.pageX;
            if ($("#nodeTip").width() + posX + 40 > width) {
                posX -= ($("#nodeTip").width() + 20);
            } else {
                posX += 20;
            }
            var height = $(window).height();
            var posY = d3.event.pageY;
            if ($("#nodeTip").height() + posY + 80 > height) {
                posY -= $("#nodeTip").height();
            } else {
                posY -= 20;
            }

            var list = "<tr><th>Relation</th><th>Instance</th></tr>";
            for (i = 0; i < graph.paths.length; i++) {

                if (graph.paths[i].source == node) {

                    graph.paths[i].links.forEach(function (link) {
                        if (link.sense) {
                            list += "<tr><td";
                            if (link.inferred) {
                                list += " class=\"inftrue\"";
                            }
                            list += ">" + link.name + "</td><td>" + graph.paths[i].target.name + "</td></tr>";
                        }
                    });
                } else if (graph.paths[i].target == node) {
                    graph.paths[i].links.forEach(function (link) {
                        if (!link.sense) {
                            list += "<tr><td";
                            if (link.inferred) {
                                list += " class=\"inftrue\"";
                            }
                            list += ">" + link.name + "</td><td>" + graph.paths[i].source.name + "</td></tr>";
                        }
                    });
                }
            }
            $("#tipNodeLinks").html(list);
            nodeTip.style("left", posX + "px")
                    .style("top", posY + "px");
        } else {

            //Defining extreme values of each metric
            var minValues = JSON.parse('{"nodes":0, "edges":0, "diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
            var maxValues = JSON.parse('{"nodes":0, "edges":0, "diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
            graph.nodes.forEach(function (n) {
                if (n.dependence.nodes > maxValues.nodes) {
                    maxValues.nodes = n.dependence.nodes;
                } else {
                    n.dependence.nodes = minValues.nodes;
                }
                if (n.dependence.edges > maxValues.edges) {
                    maxValues.edges = n.dependence.edges;
                } else {
                    n.dependence.edges = minValues.edges;
                }
                if (n.dependence.diameter > maxValues.diameter) {
                    maxValues.diameter = n.dependence.diameter;
                } else {
                    n.dependence.diameter = minValues.diameter;
                }
                if (n.dependence.MFD_EE > maxValues.MFD_EE) {
                    maxValues.MFD_EE = n.dependence.MFD_EE;
                } else {
                    n.dependence.MFD_EE = minValues.MFD_EE;
                }
                if (n.dependence.MFD_AA > maxValues.MFD_AA) {
                    maxValues.MFD_AA = n.dependence.MFD_AA;
                } else {
                    n.dependence.MFD_AA = minValues.MFD_AA;
                }
                if (n.dependence.MFD_TT > maxValues.MFD_TT) {
                    maxValues.MFD_TT = n.dependence.MFD_TT;
                } else {
                    n.dependence.MFD_TT = minValues.MFD_TT;
                }
                if (n.dependence.MFD_EA > maxValues.MFD_EA) {
                    maxValues.MFD_EA = n.dependence.MFD_EA;
                } else {
                    n.dependence.MFD_EA = minValues.MFD_EA;
                }
                if (n.dependence.MFD_AT > maxValues.MFD_AT) {
                    maxValues.MFD_AT = n.dependence.MFD_AT;
                } else {
                    n.dependence.MFD_AT = minValues.MFD_AT;
                }
                if (n.dependence.MFD_TE > maxValues.MFD_TE) {
                    maxValues.MFD_TE = n.dependence.MFD_TE;
                } else {
                    n.dependence.MFD_TE = minValues.MFD_TE;
                }
            });
            //Defining metric values of the node
            var values = JSON.parse('{"nodes":0, "edges":0, "diameter":0, "MFD_EE":0, "MFD_AA":0, "MFD_TT":0, "MFD_EA":0, "MFD_AT":0, "MFD_TE":0}');
            values.nodes = (node.dependence.nodes - minValues.nodes) / (maxValues.nodes - minValues.nodes);
            values.edges = (node.dependence.edges - minValues.edges) / (maxValues.edges - minValues.edges);
            values.diameter = (node.dependence.diameter - minValues.diameter) / (maxValues.diameter - minValues.diameter);
            values.MFD_EE = (node.dependence.MFD_EE - minValues.MFD_EE) / (maxValues.MFD_EE - minValues.MFD_EE);
            values.MFD_AA = (node.dependence.MFD_AA - minValues.MFD_AA) / (maxValues.MFD_AA - minValues.MFD_AA);
            values.MFD_TT = (node.dependence.MFD_TT - minValues.MFD_TT) / (maxValues.MFD_TT - minValues.MFD_TT);
            values.MFD_EA = (node.dependence.MFD_EA - minValues.MFD_EA) / (maxValues.MFD_EA - minValues.MFD_EA);
            values.MFD_AT = (node.dependence.MFD_AT - minValues.MFD_AT) / (maxValues.MFD_AT - minValues.MFD_AT);
            values.MFD_TE = (node.dependence.MFD_TE - minValues.MFD_TE) / (maxValues.MFD_TE - minValues.MFD_TE);
            //Comparing metric values and writing % on labels
            graph.nodes.forEach(function (n) {
                if (node.type == n.type) {
                    var metric = values.nodes - (n.dependence.nodes - minValues.nodes) / (maxValues.nodes - minValues.nodes);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.edges - (n.dependence.edges - minValues.edges) / (maxValues.edges - minValues.edges);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.diameter - (n.dependence.diameter - minValues.diameter) / (maxValues.diameter - minValues.diameter);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_EE - (n.dependence.MFD_EE - minValues.MFD_EE) / (maxValues.MFD_EE - minValues.MFD_EE);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_AA - (n.dependence.MFD_AA - minValues.MFD_AA) / (maxValues.MFD_AA - minValues.MFD_AA);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_TT - (n.dependence.MFD_TT - minValues.MFD_TT) / (maxValues.MFD_TT - minValues.MFD_TT);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_EA - (n.dependence.MFD_EA - minValues.MFD_EA) / (maxValues.MFD_EA - minValues.MFD_EA);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_AT - (n.dependence.MFD_AT - minValues.MFD_AT) / (maxValues.MFD_AT - minValues.MFD_AT);
                    if (metric < 0)
                        metric *= -1;
                    metric = values.MFD_TE - (n.dependence.MFD_TE - minValues.MFD_TE) / (maxValues.MFD_TE - minValues.MFD_TE);
                    if (metric < 0)
                        metric *= -1;
                    var similarity = 100 - (metric * 100 / 9);
                    $("#t" + n.id).html(similarity.toString().substr(0, 5) + "% similar");
                } else {
                    $("#t" + n.id).html("");
                }
            });
        }
    }

    function writePathTip(path) {
        pathTip.style("left", "0px")
                .style("top", "0px");
        var list = "<tr><th>Link</th><th>Sense</th><th>Type</th></tr>";
        for (l in path.links) {
            list += "<tr><td>" + path.links[l].name + "</td>";
            if (path.links[l].sense) {
                list += "<td class=\"bigfont\">&#8702;</td>";
            } else {
                list += "<td>&#8701;</td>";
            }
            list += "<td class=\"inf" + path.links[l].inferred + "\">";
            if (path.links[l].inferred) {
                list += "Inferred</td></tr>";
            } else {
                list += "Asserted</td></tr>";
            }
        }
        list += "</table>";
        $("#tipLinkType").html(list);
        $("#tipSourceName").html(path.source.name);
        $("#tipTargetName").html(path.target.name);
        //Calculating the path tip position
        var width = $(window).width();
        var posX = d3.event.pageX;
        if ($("#pathTip").width() + posX + 60 > width) {
            posX -= ($("#pathTip").width() + 30);
        } else {
            posX += 30;
        }
        var height = $(window).height();
        var posY = d3.event.pageY;
        if ($("#pathTip").height() + posY > height) {
            posY -= $("#pathTip").height();
        } else {
            posY -= 30;
        }

        pathTip.style("left", posX + "px")
                .style("top", posY + "px");
    }

    //--------------------------------------------------------------SVG Creation

    var w = window.innerWidth;
    var h = window.innerHeight;
    var keye = true, keyt = true, keya = true, key2 = true, key3 = true, key0 = true;
    var focus_node = null, highlight_node = null;
    var text_center = false;
    var outline = false;
    var min_score = 0;
    var max_score = 1;
    var color = d3.scale.linear()
            .domain([min_score, (min_score + max_score) / 2, max_score])
            .range(["lime", "yellow", "red"]);
    var highlight_color = "blue";
    var highlight_trans = 0.1;
    var size = d3.scale.pow().exponent(1)
            .domain([1, 100])
            .range([8, 24]);
    var force = d3.layout.force()
            .linkDistance(80)
            .linkStrength(0.3)
            .friction(0.9)
            .charge(-300)
            .size([w, h]);
    var default_node_color = "#CCC";
    var nominal_base_node_size = 8;
    var nominal_text_size = 10;
    var max_text_size = 24;
    var nominal_stroke = 1.5;
    var max_stroke = 4.5;
    var max_base_node_size = 36;
    var min_zoom = 0.5;
    var max_zoom = 4;
    var svg = d3.select("#graph").append("svg");
    var zoom = d3.behavior.zoom().scaleExtent([min_zoom, max_zoom])
    var g = svg.append("g");
    svg.style("cursor", "move");

    $.post("FrontController?action=ReadGraph", function (graph) {

        calculus(graph);
        var data = setData(graph.nodes);
        $("#source").html(JSON.stringify(graph, null, 2));

        $("#nodeTable").DataTable({
            data: data,
            columns: [
                {title: "id"},
                {title: "Name"},
                {title: "Type"},
                {title: "Spec. Type"},
                {title: "Degree"},
                {title: "Dep. Nodes"},
                {title: "Dep. Edges"},
                {title: "Dep. Diameter"},
                {title: "Dep. MFD ExE"},
                {title: "Dep. MFD AxA"},
                {title: "Dep. MFD TxT"},
                {title: "Dep. MFD ExA"},
                {title: "Dep. MFD AxT"},
                {title: "Dep. MFD TxE"},
                {title: "Influence"},
            ]
        });

        graph = graphReduction(graph);

        resize();
        var linkedByIndex = {};
        graph.paths.forEach(function (d) {
            linkedByIndex[d.source + "," + d.target] = true;
        });
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }

        function hasConnections(a) {
            for (var property in linkedByIndex) {
                s = property.split(",");
                if ((s[0] == a.index || s[1] == a.index) && linkedByIndex[property])
                    return true;
            }
            return false;
        }

        force.nodes(graph.nodes)
                .links(graph.paths)
                .start();
        var path = g.selectAll(".path")
                .data(graph.paths)
                .enter().append("line")
                .attr("class", function (p) {
                    var pathClass = "path " + p.type;
                    pathClass += " s" + p.source.index + " t" + p.target.index;
                    return pathClass;
                })
                .style("stroke-width", function (p) {
                    return p.links.length * nominal_stroke;
                })
                .style("stroke", function (p) {
                    return pathColor(p);
                });

        var node = g.selectAll(".node")
                .data(graph.nodes)
                .enter().append("g")
                .attr("class", function (n) {
                    return "node " + n.type;
                })
                .attr("id", function (n) {
                    return "n" + n.id;
                })
                .call(force.drag);
        node.on("dblclick.zoom", function (d) {
            d3.event.stopPropagation();
            var dcx = (window.innerWidth / 2 - d.x * zoom.scale());
            var dcy = (window.innerHeight / 2 - d.y * zoom.scale());
            zoom.translate([dcx, dcy]);
            g.attr("transform", "translate(" + dcx + "," + dcy + ")scale(" + zoom.scale() + ")");
        });

        var tocolor = "fill";
        var towhite = "stroke";
        if (outline) {
            tocolor = "stroke";
            towhite = "fill";
        }

        var circle = node.append("image")
                .attr("d", d3.svg.symbol()
                        .type(function (n) {
                            return nodeType(n);
                        })
                        )
                .attr("width", function (n) {
                    if ($("input[type=radio][name=visOptions]").value) {
                        return (n.size + 1) * 24;
                    } else {
                        return 24;
                    }
                })
                .attr("height", function (n) {
                    if ($("input[type=radio][name=visOptions]").value) {
                        circle.attr("transform", function (d) {
                            return "translate(" + (d.x - (d.size * 12)) + "," + (d.y - (d.size * 12)) + ")";
                        });
                        return (n.size + 1) * 24;
                    } else {
                        return 24;
                    }
                })
                .attr("xlink:href", function (n) {
                    return "./images/" + n.type + ".png";
                })
                .style("stroke-width", nominal_stroke)
                .style(towhite, "#666666");

        var text = g.selectAll(".text")
                .data(graph.nodes)
                .enter().append("text")
                .attr("dy", ".35em")
                .attr("class", function (n) {
                    return n.type;
                })
                .attr("id", function (n) {
                    return "t" + n.id;
                })
                .style("font-size", nominal_text_size + "px");
        if (text_center) {
            text.text(function (d) {
                return d.id;
            })
                    .style("text-anchor", "middle");
        } else {
            text.attr("dx", function (d) {
                return (size(d.size) || nominal_base_node_size);
            })
                    .text(function (d) {
                        return '\u2002' + d.name;
                    });
        }
        node.on("mouseover", function (d) {
            set_highlight(d);
            writeNodeTip(graph, d);
            if ($("input[name='similarity']:checked").val() === "off") {
                nodeTip.style("opacity", 0.9);
            }
        })
                .on("mousedown", function (d) {
                    d3.event.stopPropagation();
                    focus_node = d;
                    set_focus(d)
                    if (highlight_node === null)
                        set_highlight(d);
                })
                .on("mouseout", function (d) {
                    exit_highlight();
                    nodeTip.style("opacity", 0);
                })
                .on("click", function (d) {
                    writeNodeTip(graph, d);
                    nodeTip.style("opacity", 0.9);
                });

        path.on("mouseover", function (p) {
            writePathTip(p);
            pathTip.style("opacity", 0.9);
        })
                .on("mouseout", function (p) {
                    pathTip.style("opacity", 0);
                });

        d3.select(window).on("mouseup",
                function () {
                    if (focus_node !== null)
                    {
                        focus_node = null;
                        if (highlight_trans < 1)
                        {
                            circle.style("opacity", 1);
                            text.style("opacity", 1);
                            path.style("opacity", 1);
                        }
                    }

                    if (highlight_node === null)
                        exit_highlight();
                });

        function exit_highlight() {
            highlight_node = null;
            if (focus_node === null) {
                svg.style("cursor", "move");
                if (highlight_color != "#666666") {
                    circle.style(towhite, "#666666");
                    text.style("font-weight", "normal");
                    path.style("stroke", function (p) {
                        return pathColor(p);
                    });
                }
            }
        }

        function set_focus(d) {
            if (highlight_trans < 1) {
                circle.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });
                text.style("opacity", function (o) {
                    return isConnected(d, o) ? 1 : highlight_trans;
                });
                path.style("opacity", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? 1 : highlight_trans;
                });
            }
        }

        function set_highlight(d) {
            svg.style("cursor", "pointer");
            if (focus_node !== null)
                d = focus_node;
            highlight_node = d;
            if (highlight_color != "#666666") {
                circle.style(towhite, function (o) {
                    return isConnected(d, o) ? highlight_color : "#666666";
                });
                text.style("font-weight", function (o) {
                    return isConnected(d, o) ? "bold" : "normal";
                });
                path.style("stroke", function (o) {
                    return o.source.index == d.index || o.target.index == d.index ? highlight_color : function (p) {
                        return pathColor(p);
                    };
                });
            }
        }

        zoom.on("zoom", function () {

            var stroke = nominal_stroke;
            if (nominal_stroke * zoom.scale() > max_stroke)
                stroke = max_stroke / zoom.scale();
            path.style("stroke-width", function (p) {
                return stroke * p.links.length;
            });
            circle.style("stroke-width", stroke);
            var base_radius = nominal_base_node_size;
            if (nominal_base_node_size * zoom.scale() > max_base_node_size)
                base_radius = max_base_node_size / zoom.scale();
            circle.attr("d", d3.svg.symbol()
                    .size(function (n) {
                        return Math.PI * Math.pow(size(n.size) * base_radius / nominal_base_node_size || base_radius, 2);
                    })
                    .type(function (n) {
                        return nodeType(n);
                    }));
            if (!text_center)
                text.attr("dx", function (d) {
                    return (size(d.size) * base_radius / nominal_base_node_size || base_radius);
                });
            var text_size = nominal_text_size;
            if (nominal_text_size * zoom.scale() > max_text_size)
                text_size = max_text_size / zoom.scale();
            text.style("font-size", text_size + "px");
            g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        });
        svg.call(zoom);
        resize();
        d3.select(window).on("resize", resize).on("keydown", keydown);
        force.on("tick", function () {

            circle.attr("transform", function (d) {
                //return "translate(" + (d.x - 12) + "," + (d.y - 12) + ")";
                return "translate(" + (d.x - ((d.size + 1) * 12)) + "," + (d.y - ((d.size + 1) * 12)) + ")";
            });
            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            path.attr("x1", function (d) {
                return d.source.x;
            })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });
            node.attr("cx", function (d) {
                return d.x;
            })
                    .attr("cy", function (d) {
                        return d.y;
                    });
        });
        function resize() {
            var width = $(window).width() - (88 + $("aside").width());
            var height = $(window).height() - ($("header").height() + 54);
            $("#graph").width(width)
                    .height(height);
            $("aside").width(250);
            svg.attr("width", width)
                    .attr("height", height);
            force.size([force.size()[0] + (width - w) / zoom.scale(), force.size()[1] + (height - h) / zoom.scale()]).resume();
            w = width;
            h = height;
        }

        function keydown() {
            if (d3.event.keyCode == 32) {
                force.stop();
            } else if (d3.event.keyCode >= 48 && d3.event.keyCode <= 90 && !d3.event.ctrlKey && !d3.event.altKey && !d3.event.metaKey)
            {
                switch (String.fromCharCode(d3.event.keyCode)) {
                    case "E":
                        $("#entityIcon").click();
                        break;
                    case "T":
                        $("#activityIcon").click();
                        break;
                    case "A":
                        $("#agentIcon").click();
                        break;
                }
                setDisplay(path, node, text);
            }
        }

        function setDisplay(path, node, text) {
            path.style("display", function (d) {
                var flag = vis_by_type(d.source.type) && vis_by_type(d.target.type) && vis_by_node_score(d.source.score) && vis_by_node_score(d.target.score) && vis_by_link_score(d.score);
                linkedByIndex[d.source.index + "," + d.target.index] = flag;
                return flag ? "inline" : "none";
            });
            node.style("display", function (d) {
                return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" : "none";
            });
            text.style("display", function (d) {
                return (key0 || hasConnections(d)) && vis_by_type(d.type) && vis_by_node_score(d.score) ? "inline" :
                        "none";
            });
        }


        for (var n in graph.nodes) {
            $("#nodeA").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
            $("#nodeB").append("<option value=\"" + n + "\" data-class=\"" +
                    graph.nodes[n].type + "\">" + graph.nodes[n].name + "</option>");
        }

        //-------------------------------------------------------Filter Function
        $("#filterNodes")
                .click(function (event) {
                    event.preventDefault();
                    var nA = $("#nodeA").val();
                    var nB = $("#nodeB").val();
                    var nodeA = node.selectAll()
                            .filter(function (d) {
                                return d.name === nA;
                            });
                    //d3.event.stopPropagation();
                    focus_node = nodeA;
                    set_focus(nodeA);
                    if (highlight_node === null)
                        set_highlight(nodeA);
                    d3.selectAll("node").style("opacity", 0.1);
                    d3.selectAll("text").style("opacity", 0.1);
                    d3.selectAll("path").style("opacity", 0.1);
                    var nA = $("#nodeA").val();
                    var nB = $("#nodeB").val();
                    d3.select("g#n" + nA + ">image").style("opacity", 1.0);
                    d3.select("#t" + nA).style("opacity", 1.0);
                    d3.selectAll(".s" + nA).each(function (p) {
                        d3.select(this).style("opacity", 1.0);
                        d3.select("#ne" + p.target.index).style("opacity", 1.0);
                        d3.select("#name" + p.target.index).style("opacity", 1.0);
                    });
                    d3.selectAll(".t" + nA).each(function (p) {
                        d3.select(this).style("opacity", 1.0);
                        d3.select("#n" + p.source.index).style("opacity", 1.0);
                        d3.select("#name" + p.source.index).style("opacity", 1.0);
                    });
                    d3.select("g#n" + nB + ">image").style("opacity", 1.0);
                    d3.select("#t" + nB).style("opacity", 1.0);
                    d3.selectAll(".s" + nB).each(function (p) {
                        d3.select(this).style("opacity", 1.0);
                        d3.select("#ne" + p.target.index).style("opacity", 1.0);
                        d3.select("#name" + p.target.index).style("opacity", 1.0);
                    });
                    d3.selectAll(".t" + nB).each(function (p) {
                        d3.select(this).style("opacity", 1.0);
                        d3.select("#n" + p.source.index).style("opacity", 1.0);
                        d3.select("#name" + p.source.index).style("opacity", 1.0);
                    });
                    $("#hideFilterNodeActive").val("true");
                });
        renderTime(Date.now() - startTime);
        $("#entityIcon").change(function () {
            keye = !keye;
            setDisplay(path, node, text);
        });
        $("#agentIcon").change(function () {
            keya = !keya;
            setDisplay(path, node, text);
        });
        $("#activityIcon").change(function () {
            keyt = !keyt;
            setDisplay(path, node, text);
        });
    }, "json");

    function vis_by_type(type) {
        switch (type) {
            case "Entity":
                return keye;
            case "Activity":
                return keyt;
            case "Agent":
                return keya;
            default:
                return true;
        }
    }

    function vis_by_node_score(score) {
        if (isNumber(score))
        {
            if (score >= 0.666)
                return keyh;
            else if (score >= 0.333)
                return keym;
            else if (score >= 0)
                return keyl;
        }
        return true;
    }

    function vis_by_link_score(score) {
        if (isNumber(score))
        {
            if (score >= 0.666)
                return key3;
            else if (score >= 0.333)
                return key2;
            else if (score >= 0)
                return key1;
        }
        return true;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function nodeType(n) {
        if (n.type == "Activity") {
            return "square";
        } else if (n.type == "Entity") {
            return "circle";
        } else {
            return "triangle-up";
        }
    }

    function pathColor(p) {
        if (p.type == "both") {
            return "#ffff40";
        } else if (p.type == "inferred") {
            return "red";
        } else {
            return "green";
        }
    }

    function renderTime(ms) {
        var s = ms / 1000;
        $("#timeRendering").html(s + " s");
    }
});