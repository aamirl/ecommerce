module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Stylus Product Line',
                placeholder : 'Intuous, Stylus Pro, Slim-Touch'
                },
            description : {
                placeholder : 'Give details on what this particular product line of protectors has in common, from the way they are tempered, to their clarity and display'
                }
            },
        variation : {
            name : {
                label : 'Compatible Device',
                placeholder : 'iPad, Surface, Most Capacitive Touch-Screen Devices, CS600PK, Stylus Solo'
                },
            description : {
                placeholder : 'Describe any warranty terms, materials used, and any other information pertinent to this stylus'
                }
            },
        combo : {
            color : { label : 'Color' }
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        brand_dd_ : {
            label : 'Compatibility',
            help : 'The phone brand which this stylus can be used with',
            defaults  : {
                "1":"iPhone","2":"Samsung","3":"LG","4":"Motorola","5":"Nokia","6":"BlackBerry","7":"Kyocera","8":"Palm","9":"Sony","10":"HTC","11":"Dell","12":"HP","13":"Pantech","14":"Nextel","15":"Huawel","16":"Universal"
                }
            }
        },
    booleans : [
        '_attr_twist',
        'bluetooth_attr_',
        ],
    }