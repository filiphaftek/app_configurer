var jsonPath = require('JSONPath')
var flat = require('flat')

function configure(template){
    var envFile = require(process.env.NODEJS_CONFIG_PATH)
    var templateFlat = flat.flatten(template)
    var environmentFlat = flat.flatten(envFile)
    for(obj in templateFlat){
        if(templateFlat[obj].indexOf("{") > -1 && templateFlat[obj].indexOf("}") > -1){
            var mergeField = templateFlat[obj].substring(templateFlat[obj].indexOf("{")+1,templateFlat[obj].indexOf("}"))
            if(environmentFlat[mergeField]){
                templateFlat[obj] = templateFlat[obj].replace("{" + mergeField + "}", environmentFlat[mergeField])
            }else if(jsonPath.eval(envFile, mergeField)[0] instanceof Array) {
                templateFlat[obj] =  jsonPath.eval(envFile, mergeField)[0]
            }
        }
    }

    return flat.unflatten(templateFlat)
}

exports.configure = configure
