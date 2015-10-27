var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Carhartt, Tommy Hilfiger, Fossil, Kenneth Cole, True Religion, Dockers',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Material',
                placeholder : 'Leather, Jean, Elastic, Elastic Braided, Joe, Reaction, Anvil'
                help : 'This should reflect either the material this item is made of, or a collection that the item is marketed under. For example, for "Kenneth Cole Reaction Reversible Feather-Edge Belt", this would be simply "Reaction". On the other hand, for "Tommy Hilfiger Leather Reversible Belt", this will be simply "Leather".'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection or material. Explain what the collection/material represents, any influences and quality.'
                }
            },
        variation : {
            name : {
                label : 'Design',
                placeholder : 'Reversible Feather-Edge Belt, Reversible Belt',
                help : 'This should reflect this particular version of the material/collection. For example, for "Kenneth Cole Reaction Reversible Feather-Edge Belt", this would be simply "Reversible Feather-Edge Belt". On the other hand, for "Tommy Hilfiger Leather Reversible Belt", this will be simply "Reversible Belt".'
                },
            description : {
                placeholder : 'Describe this particular design in comparison to other designs under this collection/material. For example, if it is reversible, explain the reverse colors, mechanism for reversing, etc.'
                }
            },
        combo : {
            color : 'all',
            waist : {
                label : 'Waist',
                placeholder : 'Waist',
                range : {
                    s: 20,
                    f: 60,
                    a : '',
                    i : 1
                    },
                }
            },
        identifiers : {
            options : ['upc','style','sku'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        material_dd_: g.properties.material,
        buckle_dd_ : {
            label : 'Buckle',
            placeholder : 'The type of buckle that is used for this item',
            defaults : {
                1 : 'Heel Roller Buckle',
                2 : 'Loop and Hook Buckle',
                3 : 'Clamp Buckle',
                }
            }
        },
    booleans : g.booleans,
    reviews : g.reviews
    }