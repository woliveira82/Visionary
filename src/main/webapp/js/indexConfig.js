function calcBrightness(index) {
    var connections = 0;
    d3.selectAll(".s" + index).each(function () {
        connections++;
    });
    d3.selectAll(".t" + index).each(function () {
        connections++;
    });
    if (connections >= 4) {
        return "3.png";
    } else if (connections >= 2) {
        return "2.png";
    } else {
        return "1.png";
    }
}

$(document).ready(function () {

    //---------- Creating the jQuery-UI widgets
    $("#radioset").buttonset();
    $("#radiosize").buttonset();
    $("#radioSimilarity").buttonset();
    $("button").button();
    $("#nodeA").combobox();
    $("#nodeB").combobox();
    $("#allFilter").buttonset();
    $("#agentFilter").buttonset();
    $("#activityFilter").buttonset();
    $("#entityFilter").buttonset();
    $("#visOptions").buttonset();
    //---------- Loading the Path
    $.post("FrontController?action=ReadOWLPath", function (string) {
        $("#owlPath").html(string);
    }, "text");
    //---------- Function of Visualization Option
    $("input[type=radio][name=visOptions]").change(function () {
        if (this.value === "sourceLayout") {
            $("#chartVis").hide();
            $("#graphVis").hide();
            $("#sourceVis").show();
        } else if (this.value === "chartsLayout") {
            $("#sourceVis").hide();
            $("#graphVis").hide();
            $("#chartVis").show();
        } else if (this.value === "graphLayout") {
            $("#sourceVis").hide();
            $("#chartVis").hide();
            $(window).resize();
            $("#graphVis").show();
        }
    });
    //---------- Function of Display Options widget
    $("input[type=radio][name=icon]").change(function () {
        var images = d3.selectAll("image");
        if (this.value === "prov") {
            images.attr("xlink:href", function (node) {
                $("#taskImage").attr("src", "images/Activity.png");
                $("#actorImage").attr("src", "images/Agent.png");
                $("#entityImage").attr("src", "images/Entity.png");
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("Ac<u>t</u>ivities");
                } else if (node.type === "Agent") {
                    $("#actorNameLabel").html("<u>A</u>gents");
                } else if (node.type === "Entity") {
                    $("#entityNameLabel").html("<u>E</u>ntities");
                    $("#entityImage").attr("width", "24px");
                    $("#entityImage").attr("height", "");
                }
                return "./images/" + node.type + ".png";
            });
        } else if (this.value === "bpmn") {
            $("#taskImage").attr("src", "images/Task.png");
            $("#actorImage").attr("src", "images/Actor.png");
            $("#entityImage").attr("src", "images/Data.png");
            images.attr("xlink:href", function (node) {
                if (node.type === "Activity") {
                    $("#taskNameLabel").html("<u>T</u>ask");
                    return "./images/Task.png";
                } else if (node.type === "Agent") {
                    $("#actorNameLabel").html("<u>A</u>ctor");
                    return "./images/Actor.png";
                } else if (node.type === "Entity") {
                    $("#entityNameLabel").html("Data Obj<u>e</u>cts");
                    $("#entityImage").attr("height", "24px");
                    $("#entityImage").attr("width", "");
                    return "./images/Data.png";
                } else if (node.type === "GroupOfActivities") {
                    return "./images/GroupOfTasks.png";
                } else if (node.type === "GroupOfEntities") {
                    return "./images/GroupOfDatas.png";
                } else if (node.type === "GroupOfAgents") {
                    return "./images/GroupOfActors.png";
                }
            });
        }
    });
    //---------- Function of Display Options widget
    $("input[type=radio][name=size]").change(function () {
        var nodes = d3.selectAll("image");
        if (this.value === "on") {
            nodes.attr("width", function (n) {
                return (n.size + n.size + 0.5) * 50;
            })
                    .attr("height", function (n) {
                        return (n.size + n.size + 0.5) * 50;
                    });
        } else {
            nodes.attr("width", function () {
                return "24";
            })
                    .attr("height", function () {
                        return "24";
                    });
        }
    });
    //---------- Function of Filter Options widget
    $("#allNames").change(function () {
        if ($("#allNames").prop("checked")) {
            $("#agentName").prop("checked", true);
            $("#agentName+label").addClass("ui-state-active");
            $("#activityName").prop("checked", true);
            $("#activityName+label").addClass("ui-state-active");
            $("#entityName").prop("checked", true);
            $("#entityName+label").addClass("ui-state-active");
            $("text").fadeIn();
        } else {
            $("#agentName").prop("checked", false);
            $("#agentName+label").removeClass("ui-state-active");
            $("#activityName").prop("checked", false);
            $("#activityName+label").removeClass("ui-state-active");
            $("#entityName").prop("checked", false);
            $("#entityName+label").removeClass("ui-state-active");
            $("text").fadeOut();
        }
    });

    $("#agentName").change(function () {
        if ($("#agentName").prop("checked")) {
            $("text.Agent").fadeIn();
        } else {
            $("text.Agent").fadeOut();
        }
    });

    $("#activityName").change(function () {
        if ($("#activityName").prop("checked")) {
            $("text.Activity").fadeIn();
        } else {
            $("text.Activity").fadeOut();
        }
    });

    $("#entityName").change(function () {
        if ($("#entityName").prop("checked")) {
            $("text.Entity").fadeIn();
        } else {
            $("text.Entity").fadeOut();
        }
    });

    $("#allIcons").change(function () {
        if ($("#allIcons").prop("checked")) {
            $("#agentIcon").prop("checked", true);
            $("#agentIcon+label").addClass("ui-state-active");
            $("#activityIcon").prop("checked", true);
            $("#activityIcon+label").addClass("ui-state-active");
            $("#entityIcon").prop("checked", true);
            $("#entityIcon+label").addClass("ui-state-active");
            $("text").fadeIn();
        } else {
            $("#agentIcon").prop("checked", false);
            $("#agentIcon+label").removeClass("ui-state-active");
            $("#activityIcon").prop("checked", false);
            $("#activityIcon+label").removeClass("ui-state-active");
            $("#entityIcon").prop("checked", false);
            $("#entityIcon+label").removeClass("ui-state-active");
            $("text").fadeOut();
        }
    });

    $("#showAll")
            .click(function (event) {
                event.preventDefault();
                setOpacity(1.0);
                $("#hideFilterNodeActive").val("false");
                $("span input").val("");
            });

    function setOpacity(value) {
        d3.selectAll("image").style("opacity", value);
        d3.selectAll(".path").style("opacity", value);
        d3.selectAll("text").style("opacity", value);
    }
});