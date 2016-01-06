module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Lenses Line',
                placeholder : 'EF, EF-S, AF-S DX Nikkor'
                },
            description : {
                placeholder : 'Give a history/background of this group of lenses, what situations they may be most useful for and other relevant information'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : '55-200mm f/4.5-5.6G ED VR Zoom Lens, 50mm f/1.8G Standard Lens, 10-22mm f/3.5-4.5 USM'
                },
            description : {
                placeholder : 'Describe this particular lens, which camera models it best can be used with, and and important specifications'
                }
            },
        combo : {
            color : { label : 'Color' }
            },
        identifiers : {
            options : ['upc','sku'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        compatibility_ddm_: {
            label: 'Compatibility',
            help: 'The brands for which this lens is most compatible with',
            defaults: {
                "1":"Canon","2":"Contax","3":"Fuji","4":"Kodak","5":"Konica","6":"Leica","7":"Mamiya","8":"Minolta","9":"Nikon","10":"Olympus","11":"Panasonic","12":"Pentax","13":"Rollei","14":"Samsung","15":"Sigma","16":"Sony","17":"Yashica"
                }
            },
        minimum_focal_length_range_ddm_: {
            label: 'Minimum Focal Length Range (mm)',
            help: "Range for the minimum focal length",
            defaults: {
                "1":"10mm and under","2":"11mm-17mm","3":"18mm-25mm","4":"26mm-49mm","5":"50mm-69mm","6":"70mm-99mm","7":"100mm-169mm","8":"170mm-499mm","9":"500mm and above"
                }
            },
        maximum_focal_length_range_ddm_ : {
            label : 'Maximum Focal Length Range (mm)',
            placeholder : 'Range for the maximum focal length',
            defaults : {
                "1":"10mm and under","2":"11mm-17mm","3":"18mm-25mm","4":"26mm-40mm","5":"50mm-69mm","6":"70mm-99mm","7":"100mm-169mm","8":"170mm-499mm","9":"500mm-999mm","10":"1000mm and above"
                }
            }
        }
    }