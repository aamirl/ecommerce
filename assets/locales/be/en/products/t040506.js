var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Columbia, Saloman, N-Rit, SilverHooks, Hugo Boss, b.m.c, Tapp Collections, Mato, Original Penguin',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Material',
                placeholder : 'Cashmere, Cotton, Wool, Tartan Wrap, Bohemiam Soft, 100% Silk',
                help : 'This is the material this particular scarf is made out of. For example for a "Veronz™ Military Shemagh Tactical Desert Scarf 100% Cotton Keffiyeh Head Wrap", this would be simply "100% Cotton", or even "Cotton".'
                },
            description : {
                placeholder : 'This is like an "About" section for the material. Explain the material and describe qualities that are similar to all the items sold under this material.'
                }
            },
        variation : {
            name : {
                label : 'Scarf Type',
                placeholder : 'Reversible Scarf, Scarf and Beenie Pack, Aviator Scarf, Keffiyeh, Fashion Scarf, Tactical Shemagh',
                help : 'This is the type of scarf. For example for a "Veronz™ Military Shemagh Tactical Desert Scarf 100% Cotton Keffiyeh Head Wrap", this would be simply "Keffiyeh", or "Keffiyeh Desert Scarf".'
                },
            description : {
                placeholder : 'Describe how this particular type of scarf differs from other types of scarves made with the same material.'
                }
            },
        combo : {
            color : 'all',
            casual_size : g.properties.size,
            included : {
                label : 'Included',
                placeholder : 'The number of scarves included',
                defaults : {
                    1 : '1',
                    2 : '2',
                    3 : '3',
                    4 : '4',
                    5 : '5',
                    6 : '6',
                    7 : '7',
                    8 : '8',
                    9 : '9',
                    10 : '10',
                    11 : '11',
                    12 : '12',
                    13 : '13',
                    14 : '14',
                    15 : '15',
                    16 : '16',
                    17 : '17',
                    18 : '18',
                    19 : '19',
                    20 : '20',
                    }
                }
            },
        identifiers : {
            options : ['upc','style','sku'],
            required : ['style']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        pattern_dd_: g.properties.pattern,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }