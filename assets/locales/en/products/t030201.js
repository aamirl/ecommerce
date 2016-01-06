module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Phone Line',
                placeholder : 'iPhone, S, Lumia'
                },
            description : {
                placeholder : 'Give a history/background of this group of phones'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : '5S, 6, 4, 625'
                },
            description : {
                placeholder : 'Describe this particular model, how it differentiates from its predecessors and ancestors and any details, specifications and/or important features'
                }
            },
        combo : {
            color : { label : 'Color' },
            memory_dd_ : {
                label : 'Memory (GB)',
                placeholder : 'The amount of usable memory included with the phone',
                defaults : {
                    "1":"8GB","2":"16GB","3":"32GB","4":"64GB","5":"128GB","6":"256GB","7":"512GB"
                    }
                }
            },
        identifiers : {
            options : ['upc','sku'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        network_type_ddm_: {
            label: 'Network Type',
            help: 'The network types acccesible by the phone',
            defaults: {
                "1":"3G","2":"4G","3":"HSPA","4":"4G LTE","5":"5G"
                }
            },
        mobile_screen_length_dd_: {
            label: 'Mobile Screen Length (in)',
            help: "The length of the mobile screen measured diagonally",
            defaults: {
                "1":"3.0 and below","2":"3.1","3":"3.2","4":"3.2","5":"3.4","6":"3.5","7":"3.6","8":"3.7","9":"3.8","10":"3.9","11":"4.0","12":"4.1","13":"4.2","14":"4.3","15":"4.4","16":"4.5","17":"4.6","18":"4.7","19":"4.8","20":"4.9","21":"5.0","22":"5.1","23":"5.2","24":"5.3 and higher"
                }
            },
        camera_megapixels_dd_ : {
            label : 'Megapixels (MP)',
            help : 'The amount of megapixels included with the phone camera',
            defaults : {
                1 : '< 5',
                2 : '5.1-6',
                3 : '6.1-7',
                4 : '7.1-8',
                5 : '8.1-9',
                6 : '9.1-10',
                7 : '10.1-11',
                8 : '11.1-12',
                9 : '12.1-13',
                10 : '13+'
                }
            }
        }
    }