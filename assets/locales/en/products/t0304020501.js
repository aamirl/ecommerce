var g = require(_s_config.paths.locales + 'en/products/electronics.js');

module.exports = {
    setup : {
        manufacturer : {
            label : 'Brand/Manufacturer',
            placeholder : 'Dell, Asus, ViewSonic, BenQ',
            verb : 'Manufactured'
            },
        line : {
            name : {
                label : 'Series Letter',
                placeholder : 'E, G, R',
                help : 'Monitors are usually distinguished by a series letter, which is usually found at the beginning of the model numbers. For example, a monitor called the "Acer G235HL 7-Inch Widescreen" would be categorized under the "G-Series".'
                },
            description : {
                placeholder : 'Give details on what this product line of monitors have in common; describe the history, the popularity, basic features and any other pertinent information that applies to all monitors organized and marketed under this particular series'
                }
            },
        variation : {
            name : {
                label : 'Series Base',
                placeholder : '100, 200, 300, 400, 500',
                help : 'This reflects the base model of the monitor. For example, the series base for a monitor called the "Acer G235HL 7-Inch Widescreen" would be 200. Each different combination under the G200 series will retain this same series base, but can feature different resolutions, dimensions, etc.'
                },
            description : {
                placeholder : 'Describe any warranty terms, special features, inputs, outputs, included cables, built-in monitor camera(s) etc. that are important for the consumer to know about this particular monitor applicable to all the models under this particular grouping. Do not include information that may be different between models (such as display size) here.'
                }
            },
        combo : {
            color : { label : 'Color' },
            size : {
                label : 'Size (Diagonally)',
                help : 'Size of the display when measured diagonally (in your current chosen unit system)',
                validate : 'dimension',
                range : {
                    s: 8,
                    f: 60,
                    a : '',
                    i : 0.1,
                    }  
                }
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['model']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        year_dd_ : g.properties.year,
        display_type_dd_ : g.properties.display.types,
        display_technology_dd_ : {
            label : 'Display Technology',
            help : 'This is the display technology used for this particular computer display (LCD)',
            defaults : {
                1 : 'SVGA',
                2 : 'XGA',
                3 : 'WXGA',
                4 : 'WSXGA',
                5 : 'SXGA',
                6 : 'WXGA+',
                7 : 'SXGA+',
                8 : 'WSXGA+',
                9 : 'UXGA',
                10 : 'WUXGA',
                11 : 'QXGA'
                }
            },
        display_technology_dd_ : 
        resolution_dd_ : {
            label : 'Screen Resolution (Max)',
            help : 'The maximum screen display resolution for the laptop',
            defaults : {
                1 : '800x600',
                2 : '1024x768',
                3 : '1152x768',
                4 : '1280x768',
                5 : '1280x800',
                6 : '1280x854',
                7 : '1280x960',
                8 : '1280x1024',
                9 : '1366x768',
                10 : '1400x1050',
                11 : '1440x900',
                12 : '1680x1050',
                13 : '1600x1200',
                14 : '1920x1200',
                15 : '2048x1536',
                16 : '2560x1600'
                }
            },
        ppi_nr_ : {
            label : 'PPI (Pixels Per Inch)',
            placeholder : 'The amount of pixels per inch on the display; also called pixel density',
            validate : 'decimal'
            },
        aspect_ratio_dd_ : {
            label : 'Aspect Ratio',
            help : 'The screen ratio (w:h) of the display screen',
            defaults  : {
                1 : '5:4',
                2 : '4:3',
                3 : '16:10',
                4 : '16:9'
                }
            },
        refresh_rate_dd_ : {
            label : 'Refresh Rate',
            help : 'The refresh rate of the device',
            defaults : {
                1 : '60Hz',
                2 : '120Hz'
                3 : '240Hz',
                4 : '480Hz'
                }
            },
        contrast_ratio_ : {
            label : 'Contrast Ratio (:1)',
            placeholder : 'Contrast ratio is the difference between the darkest black and the whitest white that the monitor can reproduce. The higher the contrast ratio, the easier it is to see details'
            },
        response_time_ : {
            label : 'Response Time (ms)',
            placeholder : 'The speed at which the monitor\'s pixels can change colors is called response time. It is measured in milliseconds (ms).'
            },
        brightness : {
            label : 'Brightness (C/SqM)',
            placeholder : 'The brightness of the display as measured in candela per square meters.'
            },
        graphics_chip_dd_ : g.properties.graphics.cards.producers,
        hdmi_dd_ : g.properties.ports.hdmi,
        vga_dd_ : g.properties.ports.vga,
        usb2_dd_ : g.properties.ports.usb[2],
        usb3_dd_ : g.properties.ports.usb[3],
        wifi_dd_ : g.properties.wifi,
        ethernet_dd_ : g.properties.ports.ethernet,
        cameras_dd_ : g.properties.cameras.number,
        megapixels_dd_ : g.properties.cameras.megapixels,
        epeat_dd_ : g.properties.epeat,
        warranty_parts_dd_ : g.properties.warranty.labor,
        warranty_labor_dd_ : g.properties.warranty.parts
        },
    booleans : [
        'led_backlight_attr_',
        'hdmi_attr_',
        'energy_star_qualified_attr_',
        'webcam_attr_',
        'ultra_hd_4k_attr_',
        'touchscreen_attr_',
        'facial_recognition_technology_attr_',
        'antiglare_attr_',
        'tiltable_attr_',
        'tv_tuner_attr_',
        'ips_attr_',
        'stand_attr_',
        'built_in_speakers_attr_',
        '3d_ready_attr_',
        'high_definition_attr_',
        'vga_input_attr_',
        'thunderbolt_attr_',
        'split_screen_attr_',
        'dvi_input_attr_'
        ],
    reviews : g.reviews
    }