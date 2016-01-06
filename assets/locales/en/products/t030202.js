module.exports = {
    setup : {
        manufacturer : {
            label : 'Manufacturer',
            verb : 'Sold'
            },
        line : {
            name : {
                label : 'SIM Card Line',
                placeholder : 'Simple Mobile, GigSky, H20 Wireless;  In some cases with SIM cards, the card line will be similar to the manufacturer name. In that case, do not repeat the manufacturer\'s name here'
                },
            description : {
                placeholder : 'Give details on what this product line of SIM cards all has in common'
                }
            },
        variation : {
            name : {
                label : 'Card',
                placeholder : 'Dual SIM, SIM Card + $40 Prepaid, SIM Card + $80 Prepaid, BYOP Dual, SIM Activation Kit, Prepaid SIM Card '
                },
            description : {
                placeholder : 'Describe this particular card, how it differentiates from others, the amount of voice and data minutes included and any other important details like phone compatibility issues'
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
        activation_method_ddm_ : {
            label : 'Activation Method',
            help : 'Method of activation for the SIM card',
            defaults  : {
                1 : 'In Person',
                2 : 'Online',
                3 : 'Phone'
                }
            },
        phone_compatibility_ddm_ : {
            label : 'Phone Compatibility',
            help : 'This SIM card is compatible with which types of phones?',
            defaults : {
                1 : 'Unlocked GSM phones',
                2 : 'Unlocked CDMA phones',
                3 : 'Locked GSM phones',
                4 : 'Locked CDMA phones'
                }
            },
        card_format_dd_: {
            label: 'Card Format',
            help: 'How is this card sold?',
            defaults: {
                1 : 'Card Code',
                2 : 'Physical Card'
                }
            },
        contract_dd_ : {
            label : 'Contract/Prepaid',
            help : 'Is this card a part of a contract deal or a prepaid card?',
            defaults : {
                1 : 'Prepaid',
                2 : 'Contract'
                }
            },
        regular_micro_ddm : {
            label : 'Cards Included',
            help : 'Which cards are included with this SIM card?',
            defaults : {
                1 : 'Standard',
                2 : 'Micro',
                3 : 'Nano'
                }
            },
        domestic_ddm_ : {
            label : 'Domestic/International',
            help : 'Which countries can this SIM be used in? If domestic, please explain in the description which domestic country this card applies to.',
            defaults : {
                1 : 'International',
                2 : 'Domestic'
                }
            }
        }
    }