var g = require(_s_config.paths.locales + 'en/products/clothing.js');


module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'TheLees, Zicac, Calvin Klein, Gioberti, H2H, Perry Ellis, Dockers, IDARBI',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Buttons/Style',
                placeholder : '2-Button Dress Vest, 2-Button Suit Vest, 3-Button Tailored, 5-Button Tuxedo, 4-Button Herringbone',
                help : 'This should reflect something about the style that is universal to all the fits and variations that are categorized under it. For example, for the "TheLees Men\'s Business Slim Fit 3 Button Vest", this would be simply "3-Button Business Vest".'
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history.'
                }
            },
        variation : {
            name : {
                label : 'Fabric/Texture/Fit',
                placeholder : 'Stripe Texture, Slim Fit, Textured Vest/Bow Set'
                help : 'This should describe the final fit and design of the style and branding. For example, for the "TheLees Men\'s Business Slim Fit 3 Button Vest", this would be simply "Slim Fit".'
                },
            description : {
                placeholder : 'Describe how this particular fit, design or fabric differs from other variations under the same style/branding. Please specify if there are additional things included as part of the set, such as bows, ties, cufflinks, etc.'
                }
            },
        combo : {
            color : 'all',
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
        pattern_dd_: g.properties.pattern,
        pocket_dd_: g.properties.pocket,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }