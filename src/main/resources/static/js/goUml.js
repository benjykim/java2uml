window.onload = function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var gojs = go.GraphObject.make;

    myDiagram =
        gojs(go.Diagram, "myDiagramDiv",
            {
                initialContentAlignment: go.Spot.Center,
                "undoManager.isEnabled": true,
                layout: gojs(go.TreeLayout,
                    { // this only lays out in trees nodes connected by "generalization" links
                        angle: 90,
                        path: go.TreeLayout.PathSource,  // links go from child to parent
                        setsPortSpot: false,  // keep Spot.AllSides for link connection spot
                        setsChildPortSpot: false,  // keep Spot.AllSides
                        // nodes not connected by "generalization" links are laid out horizontally
                        arrangement: go.TreeLayout.ArrangementHorizontal
                    })
            });

    var cxElement = document.getElementById("contextMenu");
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    var myContextMenu = gojs(go.HTMLInfo, {
        show: showContextMenu,
        mainElement: cxElement
    });
    // show visibility or access as a single character at the beginning of each property or method
    function convertVisibility(v) {
        switch (v) {
            case "public": return "+";
            case "private": return "-";
            case "protected": return "#";
            case "package": return "~";
            default: return v;
        }
    }
    // the item template for properties
    var propertyTemplate =
        gojs(go.Panel, "Horizontal",
            // property visibility/access
            gojs(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // property name, underlined if scope=="class" to indicate static property
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // property type, if known
            gojs(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay()),
            // property default value, if any
            gojs(go.TextBlock,
                { isMultiline: false, editable: false },
                new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; }))
        );
    // the item template for methods
    var methodTemplate =
        gojs(go.Panel, "Horizontal",
            // method visibility/access
            gojs(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // method name, underlined if scope=="class" to indicate static method
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // method parameters
            gojs(go.TextBlock, "()",
                // this does not permit adding/editing/removing of parameters via inplace edits
                new go.Binding("text", "parameters", function (parr) {
                    var s = "(";
                    for (var i = 0; i < parr.length; i++) {
                        var param = parr[i];
                        if (i > 0) s += ", ";
                        s += param.name + ": " + param.type;
                    }
                    return s + ")";
                })),
            // method return type, if any
            gojs(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay())
        );


  // myDiagram.contextMenu = myContextMenu;
    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        }, false);

    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate =
        gojs(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides
            },
            {
                contextMenu: myContextMenu
            },

            gojs(go.Shape, { fill: "lightyellow" }),
            gojs(go.Panel, "Table",
                { defaultRowSeparatorStroke: "black" },
                // header
                gojs(go.TextBlock,
                    {
                        row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                        font: "bold 12pt sans-serif",
                        isMultiline: false, editable: true
                    },

                    new go.Binding("text", "name").makeTwoWay()),
                // properties
                gojs(go.TextBlock, "Properties",
                    { row: 1, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                gojs(go.Panel, "Vertical", { name: "PROPERTIES" },
                    new go.Binding("itemArray", "properties"),
                    {
                        row: 1, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: propertyTemplate
                    }
                ),
                gojs("PanelExpanderButton", "PROPERTIES",
                    { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
                // methods
                gojs(go.TextBlock, "Methods",
                    { row: 2, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                gojs(go.Panel, "Vertical", { name: "METHODS" },
                    new go.Binding("itemArray", "methods"),
                    {
                        row: 2, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: methodTemplate
                    }
                ),
                gojs("PanelExpanderButton", "METHODS",
                    { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
            )
        );
    function convertIsTreeLink(r) {
        return r === "generalization";
    }
    function convertFromArrow(r) {
        switch (r) {
            case "generalization": return "";
            default: return "";
        }
    }
    function convertToArrow(r) {
        switch (r) {
            case "generalization": return "Triangle";
            case "aggregation": return "StretchedDiamond";
            default: return "";
        }
    }
    myDiagram.linkTemplate =
        gojs(go.Link,
            { routing: go.Link.Orthogonal },
            new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
            gojs(go.Shape),
            gojs(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("fromArrow", "relationship", convertFromArrow)),
            gojs(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("toArrow", "relationship", convertToArrow))
        );

    myDiagram.model = gojs(go.GraphLinksModel,
        {
            copiesArrays: true,
            copiesArrayObjects: true,
            nodeDataArray: nodedata,
            linkDataArray: linkdata
        });

    myDiagram.addDiagramListener("ObjectSingleClicked",
        function(e) {
            let part = e.subject.part
            let newLine = "\n"
            let tab = "    ";
            let fileText = "";

            //JSON obj로 만들기
            var jsonObj = part.data

            fileText += "public class " + jsonObj.name + " {" + "\n";
            $(jsonObj.properties).each(function (index, property) {
                fileText += " " + property.visibility + " " + property.type + " " + property.name + ';' + newLine;
            });

            $(jsonObj.methods).each(function (index, method) {
                fileText += " " + method.visibility + " " +"void" + " " + method.name + " ( ";
                // If there are no parameters
                if (this.parameters.length === 0)
                    fileText += "(";

                $(this.parameters).each(function (index, parameter) {
                    fileText += parameter.type + " " + parameter.name + ", ";
                });
                fileText = fileText.substring(0, fileText.length - 2);
                fileText += " )" + "{" + newLine;
                fileText += tab + "// TO DO implement here" + newLine;
                fileText += " " + "}" + newLine;
            });
            fileText += "}";

            $('#inputTextToSave').empty()
            $('#inputTextToSave').append(fileText)
        });

  function showContextMenu(obj, diagram, tool) {
        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;
        document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
        document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
        document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
        document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";


        // Now show the whole context menu element
        cxElement.style.display = "block";
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 350.0 + "px";
        cxElement.style.top = mousePt.y + 50.0 + "px";
    }
}

function replaceDiagram() {
    var gojs = go.GraphObject.make;

    myDiagram.div = null

    myDiagram =
        gojs(go.Diagram, "myDiagramDiv",
            {
                initialContentAlignment: go.Spot.Center,
                "undoManager.isEnabled": true,
                layout: gojs(go.TreeLayout,
                    { // this only lays out in trees nodes connected by "generalization" links
                        angle: 90,
                        path: go.TreeLayout.PathSource,  // links go from child to parent
                        setsPortSpot: false,  // keep Spot.AllSides for link connection spot
                        setsChildPortSpot: false,  // keep Spot.AllSides
                        // nodes not connected by "generalization" links are laid out horizontally
                        arrangement: go.TreeLayout.ArrangementHorizontal
                    })
            });
var cxElement = document.getElementById("contextMenu");
    // Since we have only one main element, we don't have to declare a hide method,
    // we can set mainElement and GoJS will hide it automatically
    var myContextMenu = gojs(go.HTMLInfo, {
        show: showContextMenu,
        mainElement: cxElement
    });

    // show visibility or access as a single character at the beginning of each property or method
    function convertVisibility(v) {
        switch (v) {
            case "public": return "+";
            case "private": return "-";
            case "protected": return "#";
            case "package": return "~";
            default: return v;
        }
    }
    // the item template for properties
    var propertyTemplate =
        gojs(go.Panel, "Horizontal",
            // property visibility/access
            gojs(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // property name, underlined if scope=="class" to indicate static property
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // property type, if known
            gojs(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay()),
            // property default value, if any
            gojs(go.TextBlock,
                { isMultiline: false, editable: false },
                new go.Binding("text", "default", function (s) { return s ? " = " + s : ""; }))
        );
    // the item template for methods
    var methodTemplate =
        gojs(go.Panel, "Horizontal",
            // method visibility/access
            gojs(go.TextBlock,
                { isMultiline: false, editable: false, width: 12 },
                new go.Binding("text", "visibility", convertVisibility)),
            // method name, underlined if scope=="class" to indicate static method
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "name").makeTwoWay(),
                new go.Binding("isUnderline", "scope", function (s) { return s[0] === 'c' })),
            // method parameters
            gojs(go.TextBlock, "()",
                // this does not permit adding/editing/removing of parameters via inplace edits
                new go.Binding("text", "parameters", function (parr) {
                    var s = "(";
                    for (var i = 0; i < parr.length; i++) {
                        var param = parr[i];
                        if (i > 0) s += ", ";
                        s += param.name + ": " + param.type;
                    }
                    return s + ")";
                })),
            // method return type, if any
            gojs(go.TextBlock, "",
                new go.Binding("text", "type", function (t) { return (t ? ": " : ""); })),
            gojs(go.TextBlock,
                { isMultiline: false, editable: true },
                new go.Binding("text", "type").makeTwoWay())
        );

  // myDiagram.contextMenu = myContextMenu;
    // We don't want the div acting as a context menu to have a (browser) context menu!
    cxElement.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        }, false);

    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate =
        gojs(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides
            },
            {
                contextMenu: myContextMenu
             },

            gojs(go.Shape, { fill: "lightyellow" }),
            gojs(go.Panel, "Table",
                { defaultRowSeparatorStroke: "black" },
                // header
                gojs(go.TextBlock,
                    {
                        row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                        font: "bold 12pt sans-serif",
                        isMultiline: false, editable: true
                    },
                    new go.Binding("text", "name").makeTwoWay()),
                // properties
                gojs(go.TextBlock, "Properties",
                    { row: 1, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("PROPERTIES")),
                gojs(go.Panel, "Vertical", { name: "PROPERTIES" },
                    new go.Binding("itemArray", "properties"),
                    {
                        row: 1, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: propertyTemplate
                    }
                ),
                gojs("PanelExpanderButton", "PROPERTIES",
                    { row: 1, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "properties", function (arr) { return arr.length > 0; })),
                // methods
                gojs(go.TextBlock, "Methods",
                    { row: 2, font: "italic 10pt sans-serif" },
                    new go.Binding("visible", "visible", function (v) { return !v; }).ofObject("METHODS")),
                gojs(go.Panel, "Vertical", { name: "METHODS" },
                    new go.Binding("itemArray", "methods"),
                    {
                        row: 2, margin: 3, stretch: go.GraphObject.Fill,
                        defaultAlignment: go.Spot.Left, background: "lightyellow",
                        itemTemplate: methodTemplate
                    }
                ),
                gojs("PanelExpanderButton", "METHODS",
                    { row: 2, column: 1, alignment: go.Spot.TopRight, visible: false },
                    new go.Binding("visible", "methods", function (arr) { return arr.length > 0; }))
            )
        );
    function convertIsTreeLink(r) {
        return r === "generalization";
    }
    function convertFromArrow(r) {
        switch (r) {
            case "generalization": return "";
            default: return "";
        }
    }
    function convertToArrow(r) {
        switch (r) {
            case "generalization": return "Triangle";
            case "aggregation": return "StretchedDiamond";
            default: return "";
        }
    }
    myDiagram.linkTemplate =
        gojs(go.Link,
            { routing: go.Link.Orthogonal },
            new go.Binding("isLayoutPositioned", "relationship", convertIsTreeLink),
            gojs(go.Shape),
            gojs(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("fromArrow", "relationship", convertFromArrow)),
            gojs(go.Shape, { scale: 1.3, fill: "white" },
                new go.Binding("toArrow", "relationship", convertToArrow))
        );
    myDiagram.model = gojs(go.GraphLinksModel,
        {
            copiesArrays: true,
            copiesArrayObjects: true,
            nodeDataArray: nodedata,
            linkDataArray: linkdata
        });
myDiagram.addDiagramListener("ObjectSingleClicked",
        function(e) {
            let part = e.subject.part
            let newLine = "\n"
            let tab = "    ";
            let fileText = "";

            //JSON obj로 만들기
            var jsonObj = part.data

            fileText += "public class " + jsonObj.name + " {" + "\n";
            $(jsonObj.properties).each(function (index, property) {
                fileText += " " + property.visibility + " " + property.type + " " + property.name + ';' + newLine;
            });

            $(jsonObj.methods).each(function (index, method) {
                fileText += " " + method.visibility + " " +"void" + " " + method.name + " ( ";
                // If there are no parameters
                if (this.parameters.length === 0)
                    fileText += "(";

                $(this.parameters).each(function (index, parameter) {
                    fileText += parameter.type + " " + parameter.name + ", ";
                });
                fileText = fileText.substring(0, fileText.length - 2);
                fileText += " )" + "{" + newLine;
                fileText += tab + "// TO DO implement here" + newLine;
                fileText += " " + "}" + newLine;
            });
            fileText += "}";

            $('#inputTextToSave').empty()
            $('#inputTextToSave').append(fileText)
        });

function showContextMenu(obj, diagram, tool) {
        // Show only the relevant buttons given the current state.
        var cmd = diagram.commandHandler;
        document.getElementById("cut").style.display = cmd.canCutSelection() ? "block" : "none";
        document.getElementById("copy").style.display = cmd.canCopySelection() ? "block" : "none";
        document.getElementById("paste").style.display = cmd.canPasteSelection() ? "block" : "none";
        document.getElementById("delete").style.display = cmd.canDeleteSelection() ? "block" : "none";


        // Now show the whole context menu element
        cxElement.style.display = "block";
        // we don't bother overriding positionContextMenu, we just do it here:
        var mousePt = diagram.lastInput.viewPoint;
        cxElement.style.left = mousePt.x + 350 + "px";
        cxElement.style.top = mousePt.y + 50 + "px";
    }
}


var method_flag = true;
// This is the general menu command handler, parameterized by the name of the command.
function cxcommand(event, val) {

    if (val === undefined) val = event.currentTarget.id;

    var diagram = myDiagram;
    let nodeArray = diagram.findPartAt(diagram.toolManager.contextMenuTool.mouseDownPoint, false).Ud;
    switch (val) {
        case "cut": diagram.commandHandler.cutSelection(); break;
        case "copy": diagram.commandHandler.copySelection(); break;
        case "paste": diagram.commandHandler.pasteSelection(diagram.lastInput.documentPoint); break;
        case "delete": diagram.commandHandler.deleteSelection(); break;

        case "av": pd = { name: "None", type: "String", visibility: "public" }

        $("#dialog").dialog("open") //다이얼로그창 오픈
            function sleep(ms) {
              return new Promise(resolve => setTimeout(resolve, ms));
            }

            async function demo() {
              console.log('Taking a break...');
              while(method_flag){
                                     console.log(method_flag);
                                      await sleep(2000);
                                      }
              diagram.model.insertArrayItem(nodeArray.properties, 0, pd);
              method_flag = true;
              console.log('Two seconds later');
            }

            demo();
           break;

        case "am": pd = { name: "None", parameters: [], visibility: "private" }
$("#method_dialog").dialog("open") //다이얼로그창 오픈

                    async function demo2() {
                      console.log('Taking a break...');
                      while(method_flag){
                       console.log(method_flag);
                        await sleep(2000);
                        }
                      diagram.model.insertArrayItem(nodeArray.methods, 0, pd);
                      method_flag = true;
                      console.log('Two seconds later');
                    }

                    demo2();
                   break;

    }
    diagram.currentTool.stopTool();
}
// A custom command, for changing the color of the selected node(s).
function changeColor(diagram, color) {
    // Always make changes in a transaction, except when initializing the diagram.
    diagram.startTransaction("change color");
    diagram.selection.each(function (node) {
        if (node instanceof go.Node) {  // ignore any selected Links and simple Parts
            // Examine and modify the data, not the Node directly.
            var data = node.data;
            // Call setDataProperty to support undo/redo as well as
            // automatically evaluating any relevant bindings.
            diagram.model.setDataProperty(data, "color", color);
        }
    });
    diagram.commitTransaction("change color");
}