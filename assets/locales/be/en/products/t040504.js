var g = require(_s_config.paths.locales + 'en/products/clothing.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Calvin Klein, Perry Ellis, Tommy Hilfiger, Burberry, K. Alexander, Ralph Lauren, Geoffrey Beene, Kenneth Cole, H2H',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Pattern',
                placeholder : 'Reaction, Patterned, Solid, Micro Solid, Striped, Set, Patterned Set'
                help : 'This should reflect the collection or pattern that the ties are marketed under. For example, for "Kenneth Cole Reaction Men\'s Polyester Solid Tie", this would be "Reaction", since this describes the collection the tie is marketed under. Notice that the pattern is not included here. If there is no collection, please then use the wide-ranging design pattern for the tie. For example, for "Calvin Klein Men\'s Steel Micro Solid B Tie", this would be simply "Micro Solid". For "H2H Mens Comfortable Zipper Various Patterned Neck Tie", this would be "Patterned". If this is a set of ties that are of different patterns, just make this "Set".'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection or design pattern. Explain what the collection/pattern represents, along with any general influences and quality specifications applicable to all ties categorized under this particular collection/pattern.'
                }
            },
        variation : {
            name : {
                label : 'Style + Material',
                placeholder : 'Skinny Tie, Regular Microfiber Tie, Regular Woven Tie, Regular Polyester Tie',
                help : 'This should simply reflect what kind of a tie it is, or if available, its name. For example, for "Kenneth Cole Reaction Men\'s Polyester Solid Tie", this would be "Regular Polyester Tie". For "Calvin Klein Men\'s Steel Micro Solid B Tie", this would be simply "Regular Cotton Tie", even though both the words "Regular" and "Cotton" are not in the name. For "H2H Mens Comfortable Zipper Various Patterned Neck Tie", this would simply be "Regular Polyester Tie". Do not use any other descriptors in the title, such as color.'
                },
            description : {
                placeholder : 'Describe this particular style and material of ties in comparison to other styles found under this collection/pattern. Explain the material, washing instructions, etc.'
                }
            },
        combo : {
            color : 'all',
            included : {
                label : 'Number Included',
                placeholder : 'The number of ties included',
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