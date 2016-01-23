var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Vizio, Sony, Samsung, TCL',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'TV Type',
                placeholder : '1080p Smart LED HDTV, 1080p 60Hz LED TV, 1080p 120Hz 3D Smart LED TV',
                help : 'Make sure that this infomration is listed to show the resolution, refresh rate and then the kind of television (LED/LCD)'
                },
            description : {
                placeholder : 'Give details on what all these particular sets of TV\'s have in common; describe the pixelation, the refresh rate, any special technologies included in this product line'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'E32-C1 50-Inch, 50LF6100 50-Inch, UN40H5003 40-Inch',
                help : 'Make sure that this information is listed as the model number, followed by the screen dimensions in inches; no other information should be included here'
                },
            description : {
                placeholder : 'Describe any warranty terms, special features, inputs, outputs, included cables, remotes, or anything else particularly important to this model that was not covered in the overall product line'
                }
            },
        combo : {
            color : { label : 'Color' }
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        size_dd_ : {
            label : 'Size (Diagonally)',
            help : 'This is the size of the display, when measured diagonally (in your current chosen unit system)',
            validate : 'dimension',
            primary : true,
            range : {
                s: 20,
                f: 40,
                a : '',
                i : 1
                }  
            },
        year_dd_ : g.properties.year,
        display_type_dd_ : g.properties.display.types,
        resolution_dd_ : {
            label : 'Resolution',
            help : 'The display resolution',
            defaults : {
                1 : '480i',
                2 : '576i',
                3 : '480p',
                4 : '576p',
                5 : '720p',
                6 : '1080i',
                7 : '1080p',
                8 : '2160p',
                9 : '4320p',
                10 : '8640p'
                }
            },
        refresh_rate_dd_ : {
            label : 'Refresh Rate',
            help : 'The refresh rate of the television',
            defaults : {
                1 : '60Hz',
                2 : '120Hz'
                3 : '240Hz',
                4 : '480Hz'
                }
            },
        hdmi_dd_ : g.properties.ports.hdmi,
        usb2_dd_ : g.properties.ports.usb[2],
        usb3_dd_ : g.properties.ports.usb[3],
        vga_dd_ : g.properties.ports.vga,
        wifi_dd_ : g.properties.wifi,
        ethernet_dd_ : g.properties.ports.ethernet,
        aspect_ratio_dd_ : {
            label : 'Aspect Ratio',
            help : 'The screen ratio (w:h) o the display screen',
            defaults  : {
                1 : '16:9',
                2 : '4:3',
                3 : '2.35:1',
                4 : '21:9'
                }
            },
        epeat_dd_ : g.properties.epeat,
        warranty_parts_dd_ : g.properties.warranty.labor,
        warranty_labor_dd_ : g.properties.warranty.parts
        },
    booleans : [
        'picture_in_picture_attr_',
        'bluray_player_attr_',
        'led_backlight_attr_',
        'wifi_connectivity_attr_',
        'smart_tv_interface_attr_',
        'fingerprint_reader_attr_',
        'remote_control_attr_'
        ],
    reviews : g.reviews
    }