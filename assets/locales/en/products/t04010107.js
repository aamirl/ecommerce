var g = require(_s_config.paths.locales + 'en/products/clothing.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Levi\'s, Dockers, Lee, Hurley, Columbia, Nike, Adidas',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Style/Branding',
                placeholder : '505, Cargo, Classic, Twill, D3, Cordova, Crossfire X, 569, Powerflex, Brewha'
                help : 'This should reflect something about the style/branding that is universal to all the fits and variations that are categorized under it. This categorization allows you to add multiple variations under this style. For example, for "Levi\'s 505 Regular Fit Shorts", this would simply be "505". In the future, when adding the style "Levi\'s 505 Loose Fit Shorts", you would simply add a new Fit/Design for the 505 style, instead of adding the entire style all over again.'
                },
            description : {
                placeholder : 'This is like an "About" section for this particular style of shorts. Explain what the style represents, any influences, and/or it\'s history. Let consumers know what makes this particular style so influential compared to other styles.'
                }
            },
        variation : {
            name : {
                label : 'Fit/Design/Fabric',
                placeholder : 'Regular Fit, Belted Messenger, Water Shorts, Compression, Loose Straight, Chino Shorts, Cotton Rip, Slim Fit, Canvas Shorts, Mesh Shorts',
                help : 'This should describe the actual fit or design of this particular pair of shorts. For example, for "Levi\'s 505 Regular Fit Shorts", this would simply be "Regular Fit".'
                },
            description : {
                placeholder : 'Describe this particular fit/design in contrast to other fit/design under this style/brand.'
                }
            },
        combo : {
            color : { label : 'Color' },
            casual_size : g.properties.size,
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
        style_dd_: g.properties.pants.style
        },
    booleans : g.booleans,
    reviews : g.reviews
    }