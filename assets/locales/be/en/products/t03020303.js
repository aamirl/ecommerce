module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Charger Line',
                placeholder : ''
                },
            description : {
                placeholder : 'Give details on what this particular product line of chargers has in common'
                }
            },
        variation : {
            name : {
                label : 'Case',
                placeholder : 'Lightning Car Charger, Rapid USB Charger, 2-Port USB Car Charger, 4-Port USB Car Charger'
                },
            description : {
                placeholder : 'Describe the charger, any specifications, and any details about what it can be used with, exceptions, cooling fans, inverters, etc.'
                }
            },
        combo : {
            color : 'all',
            length : {
                label : 'Length',
                placeholder : 'Length',
                range : {
                    s: 1,
                    f: 15,
                    a : '',
                    i : 0.5
                    }   
                },
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
            help : 'The phone brand which this charger is to be used with',
            defaults  : {
                "1":"iPhone","2":"Samsung","3":"LG","4":"Motorola","5":"Nokia","6":"BlackBerry","7":"Kyocera","8":"Palm","9":"Sony","10":"HTC","11":"Dell","12":"HP","13":"Pantech","14":"Nextel","15":"Huawel"
                }
            },
        connection_dd_ : {
            label : 'Connection',
            help : 'The type of connection at the head of the charger',
            defaults : {
                "1":"Adapter","2":"Combo","3":"Lightning","4":"Micro USB","5":"Mini USB","6":"Transmitters"
                }
            },
        amps_nr_dd_ : {
            label : 'Amps',
            help : 'The amps rating for the charger',
            validate : 'decimal'
            },
        watts_nr_dd_ : {
            label : 'Wattage',
            help : 'The power/wattage for the charger',
            validate : 'decimal'
            }
        }
    }