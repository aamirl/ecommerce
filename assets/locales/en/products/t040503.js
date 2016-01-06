var g = require(_s_config.paths.locales + 'en/products/clothing.js');
var j = require(_s_config.paths.locales + 'en/products/jewelry.js');
var s = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand',
            placeholder : 'Ray-Ban, Oakley, Nike, Maui Jim, Costa Del Mar',
            verb : 'Designed'
            },
        line : {
            name : {
                label : 'Collection/Style',
                placeholder : 'New Wayfarer, Original Wayfarer, Classic Clubmaster, Aviator, Holbrook, GasCan, Fuel Cell, Aviator II'
                help : 'This should reflect the collection that the sunglasses are marketed under. For example, for "Ray-Ban RB2132 New Wayfarer Sunglasses", this would be simply "New Wayfarer". If there is no collection, please use a wide-ranging style for the sunglasses. For example, for "Wayfarer Sunglasses Classic 80\'s Vintage Style Design" use "Wayfarer".'
                },
            description : {
                placeholder : 'This is like an "About" section for the collection or style. Explain what the collection/style represents, along with any general influences and quality specifications applicable to all designs and models found under this collection/style.'
                }
            },
        variation : {
            name : {
                label : 'Design/Model',
                placeholder : 'Cockpit Polarized Sunglasses, RB4171, ',
                help : 'This should reflect the model or design of these particular sunglasses in the collection/style that the sunglasses are marketed under. For example, for "Ray-Ban RB2132 New Wayfarer Sunglasses", this would be simply "RB2132". For "Wayfarer Sunglasses Classic 80\'s Vintage Style Design", this would be "Classic 80\'s Vintage Style Design".'
                },
            description : {
                placeholder : 'Describe this particular design in comparison to other designs found under this collection/style. Explain the frame material, the UV of the glass, any warranties, etc.'
                }
            },
        combo : {
            color : { label : 'Color' }
            },
        identifiers : {
            options : ['upc','model','sku'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        metal_dd_ : j.properties.metals,
        warranty_dd_ : s.properties.warranty.standard,
        },
    booleans : ['uv_protection_attr_'],
    reviews : g.reviews
    }