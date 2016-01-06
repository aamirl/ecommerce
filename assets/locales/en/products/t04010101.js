var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Tommy Hilfiger, Nike, Hanes, Columbia, Lacoste, Burberry, Ralph Lauren, Geoffrey Beene',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Style/Branding',
                placeholder : 'Tamiami II, Pique Polo Rugby Stripe Polo, Island Polo, Athletic Polo, Original New York Style',
                help : 'This should reflect something about the style that is universal to all the fits and variations that are categorized under it. For example, for the "Lacoste Long Sleeve Original Cotton Pique Polo", this would be simply "Pique Polo".'
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history.'
                }
            },
        variation : {
            name : {
                label : 'Fit/Design',
                placeholder : 'Long Sleeve Original Cotton, Regular Fit Stretch, Short Sleeve Stretch, Live Slim Fit',
                help : 'This should describe the final fit and design of the style and branding. For example, for the "Lacoste Long Sleeve Original Cotton Pique Polo", this would be simply "Long Sleeve Original Cotton".'
                },
            description : {
                placeholder : 'Describe how this particular fit, design or fabric differs from other variations under the same style/branding. '
                }
            },
        combo : {
            color : { label : 'Color' },
            casual_size : g.properties.size,
            chest : {
                label : 'Chest (in)',
                placeholder : 'The size of the chest in the given units',
                range : {
                    s: 20,
                    f: 60,
                    a: '',
                    i: 0.5
                    }   
                },
            sleeve : {
                label : 'Sleeve (in)',
                placeholder : 'Length of the sleeves',
                range : {
                    s: 5,
                    f: 15,
                    a : '',
                    i : 0.5
                    }   
                },
            neck : {
                label : 'Neck (in)',
                placeholder : 'Length around the neck',
                range : {
                    s: 7,
                    f: 20,
                    a : '',
                    i : 0.5
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
        fit_dd_: g.properties.fit,
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        sleeve_dd_: g.properties.sleeve,
        pattern_dd_: g.properties.pattern,
        collar_dd_: g.properties.collar,
        pocket_dd_: g.properties.pocket,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }