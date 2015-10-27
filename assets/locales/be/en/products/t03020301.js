module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Sold'
            },
        line : {
            name : {
                label : 'Device Line',
                placeholder : 'Marque, Marque 2, M90, Qy7'
                },
            description : {
                placeholder : 'Give details on what this product line of SIM cards all has in common'
                }
            },
        variation : {
            name : {
                label : 'Model',
                placeholder : 'M1100, M165, Tone Pro'
                },
            description : {
                placeholder : 'Describe this particular model, which phones it is capable of communicating with, and other important details that help consumers understand what they can use the device with and for'
                }
            },
        combo : {
            color : 'all'
            },
        identifiers : {
            options : ['upc','sku','model'],
            required : ['upc']
            },
        images : 'color',
        dimensions : true
        },
    properties : {
        microphone_dd_ : {
            label : 'Microphone(s)',
            help : 'The number of microphones attached to the bluetooth device',
            defaults  : {
                1 : 'Single',
                2 : 'Dual',
                3 : 'Triple',
                3 : 'Triple+',
                }
            },
        bluetooth_version_dd_ : {
            label : 'Specification',
            help : 'The version of the Bluetooth device/software',
            defaults : {
                1 : '1.0',
                2 : '1.1',
                3 : '1.2',
                4 : '2.0',
                5 : '2.1',
                6 : '3.0',
                7 : '4.0',
                8 : '4.1',
                9 : '4.2'
                }
            },
        bluetooth_profiles_ddm_ : {
            label : 'Profiles',
            help : 'The specification regarding an aspect of the Bluetooth-based wireless communication between devices (ontop of the core specifications)',
            defaults : {
                1 : 'A2DP',
                2 : 'ATT',
                3 : 'AVRCP',
                4 : 'BIP',
                5 : 'BPP',
                6 : 'CIP',
                7 : 'CTP',
                8 : 'DIP',
                9 : 'DUN',
                10 : 'ESDP',
                11 : 'FAX',
                12 : 'FTP',
                13 : 'GAVDP',
                14 : 'GAP',
                15 : 'GATT',
                16 : 'GOEP',
                17 : 'HCRP',
                18 : 'HDP',
                19 : 'HFP',
                20 : 'HID',
                21 : 'HSP',
                22 : 'ICP',
                23 : 'LAP',
                24 : 'MAP',
                25 : 'OBEX',
                26 : 'OPP',
                27 : 'PAN',
                28 : 'PBAP, PBA',
                29 : 'PXP',
                30 : 'SPP',
                31 : 'SDAP',
                32 : 'SAP, SIM, rSAP',
                33 : 'SYNCH',
                34 : 'SyncML',
                35 : 'VCP',
                36 : 'VDP',
                37 : 'UVI',
                38 : 'WAPB'
                }
            },
        standby_time: {
            label: 'Standby Time (hours)',
            help: 'How long can this device stay on standby?',
            validate : 'decimal'
            },
        charge_time: {
            label: 'Charge Time (hours)',
            help: 'How long does it take to charge this device completely from no charge?',
            validate : 'decimal'
            },
        rf_range: {
            label: 'Range (m)',
            help: 'What is the range of this device?',
            validate : 'decimal'
            }
        }
    }