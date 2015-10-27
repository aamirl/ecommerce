module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Protector Line',
                placeholder : 'Ultra-Clear HD-Glass, TechSkin, amFilm'
                },
            description : {
                placeholder : 'Give details on what this particular product line of protectors has in common, from the way they are tempered, to their clarity and display'
                }
            },
        variation : {
            name : {
                label : 'Compatible Phone',
                placeholder : 'iPhone 6, Samsung Galaxy S6'
                },
            description : {
                placeholder : ''
                }
            },
        combo : {
            color : 'all'
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
            help : 'The phone brand which this screen protector is to be used with',
            defaults  : {
                "1":"iPhone","2":"Samsung","3":"LG","4":"Motorola","5":"Nokia","6":"BlackBerry","7":"Kyocera","8":"Palm","9":"Sony","10":"HTC","11":"Dell","12":"HP","13":"Pantech","14":"Nextel","15":"Huawel"
                }
            }
        }
    }