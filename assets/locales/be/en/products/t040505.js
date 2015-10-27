var g = require(_s_config.paths.locales + 'en/products/clothing.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'PenSee, Bundle Monster, Electric Styles, HDE, Tommy Hilfiger, Moda Di Raza, Flora&Fred, TheTieBar',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Pattern',
                placeholder : 'Patterned, Solid, Micro Solid, Striped, Checkered, Patterned Set, Cumberbund Set, Cumberbund Patterned Set, '
                help : 'This should reflect the pattern that the bowties (or bowtie and cumberbund set) are marketed under. For example, for "CNACCASU Men Formal Satin Banded Bow Tie Tuxedo Ties", this would be "Solid", since this describes that the actual bow ties are of a solid color.  If this is a set of bow ties or a set of bow ties that are of different patterns, just make this "Set". If this is a set of a bow tie and a cumberbund, this would be "Cumberbund Set"'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection or design pattern. Explain what the collection/pattern represents, along with any general influences and quality specifications applicable to all ties categorized under this particular collection/pattern.'
                }
            },
        variation : {
            name : {
                label : 'Usage + Material + Tied',
                placeholder : 'Formal Silk Pre-Tied, Fashion Polyester Pre-Tied, Designer Woven Self-Tie, Designer Handmade Self-Tie, Designer Handmade Self-Tie Set',
                help : 'This should reflect the usage of the bow tie + the material of the bow tie + whether this comes tied or untied. For a set, please include the word "Set" at the end of this. For example, for "CNACCASU Men Formal Satin Banded Bow Tie Tuxedo Ties", this would be "Formal Satin Self-Tie". For "HDE Men\'s Wedding Party 5-Pack of Solid Color Formal Adjustable Pre-Tied Bow Tie", this would be simply "Formal Polyester Adjustable Pre-Tied"'
                },
            description : {
                placeholder : 'Describe this particular combination of usage + material + tied in comparison to other similar combinations found under this pattern. Explain the material used, sizing of the bow, washing instructions, and the neck and cumberbund sizes (if applicable), etc. Do not include colors here.'
                }
            },
        combo : {
            color : 'all',
            included : {
                label : 'Number Included',
                placeholder : 'The number of bow ties included',
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
        },
    booleans : g.booleans,
    reviews : g.reviews
    }