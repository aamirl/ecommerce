module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Camcorder Line',
                placeholder : 'Handycam, Hero, Action Cam'
                },
            description : {
                placeholder : 'Give a history/background of the camera line, and any features all the cameras in the line share'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'PVGS150, X100V'
                },
            description : {
                placeholder : 'Describe this model in this camcorder line, and all the features and specifications that make it unique'
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
        optical_zoom_dd_: {
            label: 'Optical Zoom',
            help: 'The magnification of the lens',
            defaults: {
                '1':'2.9x and under','2':'3-3.9x','3':'4-5.9x','4':'6-9.9x','5':'10-12.9x','6':'13x and up'
                }
            },
        display_size_ddm_: {
            label: 'Display Size',
            help: "Width of the display screen",
            defaults: {
                '1':'1.9in and under','2':'2-2.9in','3':'3-4.9in','4':'5-9.9in','5':'10-13in','6':'14-15in','7':'16-17in','8':'20-29in','9':'50in and up'
                }
            },
        framerate : {
            label : 'Frame Rate (FPS)',
            placeholder : 'Frame rate of the camcorder in frames per second',
            defaults : {
                1 : '1-10',
                2 : '10.1-20',
                3 : '20.1-30',
                4 : '30.1-40',
                5 : '40.1-50',
                6 : '50.1-60',
                7 : '60.1-70',
                8 : '70.1-80',
                }
            },
        media_type_dd_: {
            label: 'Media Type',
            help: 'The format of the storage memory for the camcorder',
            defaults: {
                '1':'MiniDV','2':'Flash Memory','3':'Hard Disk Drive','4':'Mini DVD','5':'Digital 8','6':'Analog 8mm and Hi8','7':'VHS-C'
                }
            },
        megapixels_dd_: {
            label: "Megapixels",
            help: "Camera resolution",
            defaults: {
                '1':'1.9 and Under','2':'2-2.9','3':'3-3.9','4':'4-4.9','5':'5-5.9','6':'6-6.9','7':'7+'
                }
            },
        sensor_technology_nr_dd_ : {
            label : 'Sensor Technology',
            help : 'Type of image sensor',
            defaults : {
                '1':'CMOS','2':'CCD','3':'3CCD','4':'MOS','5':'Advanced HAD CCD','6':'3MOS','7':'ClearVid CMOS','8':'HAD CCD','9':'Still Photo','10':'VGA CMOS'
                }
            }
        }
    }