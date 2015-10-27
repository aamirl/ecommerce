module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Camera Line',
                placeholder : 'Cyber-Shot, OM-D, R Series, Alpha, PEN'
                },
            description : {
                placeholder : 'Give a history/background of the camera line, and any features all the cameras in the line share.'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'High Zoom Point and Shoot, E-M1, a7, E-P5'
                },
            description : {
                placeholder : 'Describe this model in this camera line, and all the features and specifications that make it unique'
                }
            },
        combo : {
            color : 'all'
            },
        identifiers : {
            options : ['upc','sku'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        megapixels_dd_: {
            "label": "Megapixels",
            "help": "Camera resolution",
            "defaults": {
                '1':'5.9 and Under','2':'6-7.9','3':'8-9.9','4':'10-11.9','5':'12-13.9','6':'14-15','7':'16-17','8':'18-20','9':'20+'
                }
            },
        optical_zoom_ddm_: {
            "label": 'Optical Zoom',
            "help": 'The physical extension of the lens which alters the ratios of the internal lenses and makes an object appear bigger',
            "defaults": {
                '1':'2.9x and under','2':'3-3.9x','3':'4-5.9x','4':'6-9.9x','5':'10-12.9x','6':'13x and up'
                }
            },
        display_size_dd_c : {
            label : 'Display Size',
            help : 'Width of the display screen',
            defaults : {
                '1':'1.9in and under','2':'2-2.9in','3':'3-4.9in','4':'5-9.9in','5':'10-13in','6':'14-15in','7':'16-17in','8':'17-19in','9':'20in and above'
                }
            },
        viewfinder_type_ddm_ : {
            label : 'Viewfinder Type',
            help : 'Type of the viewfinder',
            defaults : {
                1 : 'LCD',
                2 : 'Optical'
                }
            },
        viewfinder_composition_ddm_ : {
            label : 'Viewfinder Composition',
            help : 'Composition of the viewfinder',
            defaults : {
                1 : 'Pentaprism - SLR',
                2 : 'Penta-mirror'

                }
            },
        sensor_type_dd_ : {
            label : 'Sensor Type',
            help : 'Determines how to convert optical image into an electronic signal',
            defaults : {
                1 : 'CCD',
                2 : 'CMOS'
                }
            }
        }
    }