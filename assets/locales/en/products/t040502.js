var g = require(_s_config.paths.locales + 'en/products/clothing.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Carhartt, Tommy Hilfiger, Fossil, Kenneth Cole, Dickies, Dockers, John Deere',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Type',
                placeholder : 'Y-Back, X-Back'
                help : 'This should reflect the type of the suspender. For example, for "John Deere Men\'s 2" X-Back Logger Style Suspender", this would simply be "X-Back".'
                },
            description : {
                placeholder : 'Explain what this type of suspender is, and any general qualities that are common for suspenders marketed under this type for this designer.'
                }
            },
        variation : {
            name : {
                label : 'Style',
                placeholder : 'Textured Solid Suspender, Wide Trucker Style Side Clip Suspenders, Perry Suspenders, Logger Style Suspender',
                help : 'This should reflect this particular style of the suspender. For example, for "John Deere Men\'s 2" X-Back Logger Style Suspender", this would simply be "Logger Style Suspender". Do not include the width of the suspenders here.'
                },
            description : {
                placeholder : 'Describe this particular style in comparison to other styles available under this type of suspenders. For example, explain the clips, the elasticity, any patented features, etc.'
                }
            },
        combo : {
            color : { label : 'Color' },
            casual_size : g.properties.size,
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
        suspender_dd_ : {
            label : 'Suspender Type',
            placeholder : 'The type of suspender used for these suspenders',
            defaults : {
                1 : 'Brass Finger Clips',
                2 : 'Nickel Finger Clips',
                3 : 'Brass Construction Clips',
                4 : 'Nickel Construction Clips',
                5 : 'Drop Clips',
                6 : 'Trigger Snaps',
                7 : 'Leather Button',
                8 : 'Fabric Button',
                9 : 'Airport Friendly Clips',
                10 : 'Belt-Clips',
                11 : 'Convertibles',
                12 : 'On-Belt Loop Industrial Button',
                13 : 'Off-Belt Loop Industrial Button',
                }
            }
        },
    booleans : g.booleans,
    reviews : g.reviews
    }