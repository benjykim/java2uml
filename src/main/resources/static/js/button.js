
$(function () {
    $("#addRectangle").click(function () {
        // myDiagram.div = null
        var pd = {
                         key: nodedata[nodedata.length-1].key+1,
                         name: "Untitled",
                         properties: [

                         ],
                         methods: [
                         ]
                     };
        nodedata.push(pd);
        replaceDiagram()

    })
});

