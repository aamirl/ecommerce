var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Hanes, Tommy Hilfiger, Nautica, American Essentials, Diesel, Comfort Knit, Hanro, IZOD',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Fit/Collection',
                placeholder : 'Night and Day, Captain\'s, Basics, Classics, Short-Sleeve, Solid, Solid w/Elastic, Micro Modal, Athleizure',
                help : 'This should reflect something about the style that is universal to all the '
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history.'
                }
            },
        variation : {
            name : {
                label : 'Sleepwear Type',
                placeholder : 'Crew Neck Shirt, Knit Pants, Knit Shorts, Pajama Set, PJ Pants, Star-Wars Sleep Pants'
                help : 'This should describe this particular type of branding/fit, along with any other identifiying feature for the sleepwear piece or set.'
                },
            description : {
                placeholder : 'Describe how this particular undergarment compared to other undergarments sold under the same branding/fit.'
                }
            },
        combo : {
            color : { label : 'Color' },
            casual_size : g.properties.size,
            pack : {
                label : 'Pack-Size',
                placeholder : 'The number of undergarments in this particular pack',
                defaults : {
                    1 : 'Single',
                    2 : '2-Pack',
                    3 : '3-Pack',
                    4 : '4-Pack',
                    5 : '5-Pack',
                    6 : '6-Pack',
                    7 : '7-Pack',
                    8 : '8-Pack',
                    9 : '9-Pack',
                    10 : '10-Pack',
                    11 : '11-Pack',
                    12 : '12-Pack',
                    13 : '13-Pack',
                    14 : '14-Pack',
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