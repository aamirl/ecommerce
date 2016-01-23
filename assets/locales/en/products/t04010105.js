var g = require(_s_config.paths.locales + 'en/products/clothing.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Levi\'s, Seven, Red Monkeys, True Religion, Dockers',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Branding/Style/Collection',
                placeholder : '501, Cowboy Cut, Big and Tall Classic, Custom Straight',
                help : 'This should reflect something about the style/branding that is universal to all the fits and variations that are categorized under it. This categorization allows you to add multiple variations under this style. For example, for "Levi\'s 501 Original Fit Jeans", this would simply be "501". In the future, when adding the style "Levi\'s 501 Loose Fit Jeans", you would simply add a new \'Fit/Design\' for the 501 style, instead of adding the entire 501 style all over again.'
                },
            description : {
                placeholder : 'This is like an "About" section for the style. Explain what the style represents, any influences, and/or it\'s history. Let consumers know what makes this particular style so influential compared to other styles'
                }
            },
        variation : {
            name : {
                label : 'Fit/Design',
                placeholder : 'Original Fit, Slim Fit, Regular Fit, Low Rise Regular Fit',
                help : 'This should describe the actual fit or design of this particular pair of pants. For example, for "Levi\'s 501 Original Fit Jeans", this would simply be "Original Fit".'
                },
            description : {
                placeholder : 'Describe this particular fit/design in contrast to other fit/design under this style/brand.'
                }
            },
        combo : {
            color : { label : 'Color' },
            length : {
                label : 'Length',
                placeholder : 'Length',
                range : {
                    s: 20,
                    f: 50,
                    a : '',
                    i : 1
                    }   
                },
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
        fit_dd_: g.properties.fit,
        material_dd_: g.properties.material,
        technics_dd_: g.properties.technics,
        wash_dd_: g.properties.wash,
        style_dd_: g.properties.pants.style,
        rise_style_dd_: g.properties.pants.rise,
        },
    booleans : g.booleans,
    reviews : g.reviews
    }