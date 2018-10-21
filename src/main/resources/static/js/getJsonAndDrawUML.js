let promise = $.getJSON("/")
let nodedata = []
let linkdata = []
let map = new Map()
let myDiagram = null

promise.done(function () {
    promise.done(function (data) {
        if (data != null) {
            /*let decoded = decodeURIComponent($.param(data))
            console.log(decoded)
    */
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

            // console.log(properties)

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

                tmpdata['key'] = i;
                tmpdata['name']= name[i];
                for (let j = 0; j < numOfVariables[i]; j++) {
                    tmp.push(properties[m++]);
                }
                tmpdata['properties'] = tmp
                tmp = []

                for (let k = 0; k < numOfMethods[i]; k++) {
                    tmp.push(methods[n++]);
                }
                tmpdata['methods'] = tmp
                tmp = []

                nodedata.push(tmpdata)
                tmpdata = {}
            }

        }

        for (let i = 0; i < nodedata.length; i++) {
            map.set(nodedata[i].name ,nodedata[i].key)
        }
        $.each(data.inheritanceRelation.relations, function () {
            linkdata.push({
                from : this.from,
                to : this.to,
                relationship : "generalization"
            })
        })

        linkdata.forEach(function (item, index) {
            item.from = map.get(item.from)
            item.to = map.get(item.to)
        })
    })
    $('#submit').click(function () {
        init()
    })
})
