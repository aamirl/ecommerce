var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Designer',
            placeholder : 'Quicksilver, Flexfit, Columbia, Nike, Sloggers, Tilley, NEFF, Outdoor Research, Under Armour, Brixton',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Brand/Material',
                placeholder : 'Tiller, Straw, Shadow 2.0, Breezer, Warrior, Extreme Condition, Sun Runner, Ventair',
                help : 'If the hat/cap belongs to a collection/brand, then please use this to specify the collection or brand. For example for a "Under Armour Men\'s Warrior Bucket Hat", this would be simply "Warrior". For "Columbia Men\'s Bonehead Straw Hat", this would be "Bonehead", because that is the collection under which is marketed. If the hat/cap has no collection but has a specific usage, use this. For example, for "ADAM\'S HEADWEAR EXTREME CONDITION HAT - UPF 45+ - 6 Colors", this would be simply "Extreme Conditions". (Notice the word hat is not used here) If the hat/cap has no collection/brand and no specific usage, please just use the material the hat/cap is made of. For "Dorfman Pacific Men\'s 1 Piece Brushed Twill Mesh Safari Hat With Genuine Leather Trim", this would be "Twill Mesh". Avoid using "100%" and other percentages. Please do not use sizes or colors.'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection/material. Explain the collection/material and describe qualities that are similar to all the items sold under this collection/material.'
                }
            },
        variation : {
            name : {
                label : 'Hat/Cap Type',
                placeholder : 'Hat, Cap, Sun Hat, 504, Flap Hat, Boater Hat, Bucket Hat, Fedora, Beanie',
                help : 'This is simply the type of hat/cap. For example for a "Under Armour Men\'s Warrior Bucket Hat", this would be simply "Bucket Hat". For "Columbia Men\'s Bonehead Straw Hat", this would be "Straw Hat". For "ADAM\'S HEADWEAR EXTREME CONDITION HAT - UPF 45+ - 6 Colors", this would be simply "Hat". For "Dorfman Pacific Men\'s 1 Piece Brushed Twill Mesh Safari Hat With Genuine Leather Trim", this would be simply "Safari Hat". Do not use sizes or colors.'
                },
            description : {
                placeholder : 'Describe how this particular type of hat/cap differs from other types of hats/caps marketed under this collection/brand or made of the same material.'
                }
            },
        combo : {
            color : 'all',
            casual_size : g.properties.size
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