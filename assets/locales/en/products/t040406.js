var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var e = require(_s_config.paths.locales + 'en/products/electronics.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'BMC, Nelson, Mad Men, Kenneth Cole',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Material',
                placeholder : 'Metal Alloy, Plastic, Reaction',
                help : 'This should reflect the primary material that this tie clip is made of; however, if there is a certain branding/collection that this tie clip is marketed under, use that branding instead. For example, for "Kenneth Cole Reaction All Tied Up Tie Clip", this would be simply "Reaction". Likewise, for the "BMC Fashion Alloy Metal Skinny Tie Bar Clips", this would be "Alloy Metal".'
                },
            description : {
                placeholder : 'Describe in detail the collection/material, what it consists of, and any history for this material/collection that pertains to this particular designer (if applicable).'
                }
            },
        variation : {
            name : {
                label : 'Piece',
                placeholder : 'Tie Clip, Tie Clip w/Adaptive Tie Hold Technology, Skinny Tie Clip, Enamel Tie Clip'
                help : 'This should reflect the type of clip and any little details that may help the consumer pick this particular piece compared to others. Do not include colors, or how many sets are included.'
                },
            description : {
                placeholder : 'Describe this particular clip in detail, along with the materials used in its composition, the finish, and any extras that are included as part of a set. Do not mention any details about color, length or how many are included.'
                }
            },
        combo : {
            color : { label : 'Color' },
            length : {
                label : 'Length (in)',
                placeholder : 'Length (in)',
                range : {
                    s: 0.1,
                    f: 4,
                    a : '',
                    i : 0.1
                    }  
                },
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
        warranty_dd_ : e.properties.warranty.standard,
        },
    reviews : g.reviews
    }