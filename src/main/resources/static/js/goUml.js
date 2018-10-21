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
    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate =
        gojs(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides
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
            console.log(jsonObj)

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
    // this simple template does not have any buttons to permit adding or
    // removing properties or methods, but it could!
    myDiagram.nodeTemplate =
        gojs(go.Node, "Auto",
            {
                locationSpot: go.Spot.Center,
                fromSpot: go.Spot.AllSides,
                toSpot: go.Spot.AllSides
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
}


