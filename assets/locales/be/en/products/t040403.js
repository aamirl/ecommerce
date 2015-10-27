var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'JJ Weston, Ox and Bull',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Primary Material',
                placeholder : '14K Yellow Gold, Stainless Steel, Tungsten Carbide, 24K Gold Plated, Titanium 14K Solid Gold, Sterling Silver, Zircon Diamond, Rhodium Plated',
                help : 'This should reflect the primary material that this cuff link is made of.'
                },
            description : {
                placeholder : 'Describe in detail the material, what it consists of, and any history for this material that pertains to this particular designer (if applicable).'
                }
            },
        variation : {
            name : {
                label : 'Piece',
                placeholder : 'Shirt Studs, Tuxedo Studs, Cufflinks and Shirt Studs'
                help : 'This should reflect the type of stud and any little details that may help the consumer pick this particular piece compared to others (such as the cut of a stone used, if applicable). Do not include colors, or how many sets are included.'
                },
            description : {
                placeholder : 'Describe this particular set of cufflinks in detail, along with the materials used in their composition. Mention any influences that played a part in designing this particular piece. Do not mention any details about how many there are in a pack or set.'
                }
            },
        combo : {
            color : 'all',
            pairs : {
                label : 'Pairs',
                placeholder : 'The number of pairs included',
                defaults : {
                    1 : 'Single Set',
                    2 : '2 Pairs',
                    3 : '3 Pairs',
                    4 : '4 Pairs',
                    5 : '5 Pairs',
                    6 : '6 Pairs',
                    7 : '7 Pairs',
                    8 : '8 Pairs',
                    9 : '9 Pairs',
                    10 : '10 Pairs',
                    11 : '11 Pairs',
                    12 : '12 Pairs',
                    13 : '13 Pairs',
                    14 : '14 Pairs',
                    }
                }
            },
        identifiers : {
            options : ['upc','model','sku'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        stones_ddm_ : j.properties.stones,
        karat : j.properties.karat,
        warranty_dd_ : e.properties.warranty.standard,
        },
    reviews : g.reviews
    }