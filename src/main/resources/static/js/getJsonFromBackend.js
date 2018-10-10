/*
let nodedata = [getJson()]
*/

/*function makeNodeData() {
    console.log(JSON.stringify(nodedata))
}*/

$(document).ready(function () {
    $('#submit').click(function () {
        let nodedata = []

        $.getJSON("/", function (data) {
            if (data != null) {
                /*let decoded = decodeURIComponent($.param(data))
                console.log(decoded)*/
                let m = 0
                let n = 0
                let name = []
                let properties = []
                let methods = []
                let tmpdata = {}
                let numOfClasses = data.numOfClasses
                let numOfVariables = []
                let numOfMethods = []

                $.each(data.classes, function () {
                    name.push(this.name)
                    numOfVariables.push(this.numOfVariables)
                    numOfMethods.push(this.numOfMethods)
                })

                $.each(data.classes, function() {
                    $.each(this.variables, function () {
                        properties.push(
                            {
                                name : this.name,
                                type : this.type,
                                visibility : this.accessModifier
                            }
                        )
                    })
                })

                console.log(properties)

                $.each(data.classes, function() {
                    $.each(this.methods, function () {
                        methods.push(
                            {
                                name : this.name,
                                parameters : this.formalParameters,
                                visibility : this.accessModifier
                            }
                        )
                    })
                })

                for (let i = 0; i < numOfClasses; i++) {
                    let tmp = []

                    console.log(numOfVariables)
                    console.log(numOfMethods)

                    tmpdata['key'] = i;
                    tmpdata['name']= name[i];
                    for (let j = 0; j < numOfVariables[i]; j++) {
                        tmp.push(properties[m++]);
                    }
                    tmpdata['properties'] = tmp
                    tmp = []

                    for (let k = 0; k < numOfMethods[i]; k++) {
                        console.log(k)
                        tmp.push(methods[n++]);
                    }
                    tmpdata['methods'] = tmp
                    tmp = []

                    nodedata.push(tmpdata)
                    console.log(tmpdata)
                    tmpdata = {}
                }

            }
            init(nodedata)
        })
    })
})
