module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Data Cable Line',
                placeholder : 'Apple Certified, iPhone 6, Samsung'
                },
            description : {
                placeholder : 'Give details on what this particular product line of data cables have in common'
                }
            },
        variation : {
            name : {
                label : 'Cable(s)',
                placeholder : '5-Feet Micro-USB 3.0 Charging Cable, 5-Pack Premium Micro USB Cables'
                },
            description : {
                placeholder : 'Describe the cables, their length, their compatibilities, ceritifications, how many are included and any other important information'
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
        connection_1_dd_ : {
            label : 'First Head',
            help : 'The type of connection at one head of the cable',
            defaults : {
                "1":"Adapter","2":"Combo","3":"Lightning","4":"Micro USB","5":"Mini USB","6":"Transmitters","7":"USB"
                }
            },
        connection_2_dd_ : {
            label : 'Second Head',
            help : 'The type of connection at the other head of the cable',
            defaults : {
                "1":"Adapter","2":"Combo","3":"Lightning","4":"Micro USB","5":"Mini USB","6":"Transmitters","7":'USB'
                }
            }
        }
    }