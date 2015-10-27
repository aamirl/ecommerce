module.exports = {
    setup : {
        manufacturer : {
            label : 'Records Label/Studio',
            verb : ''
            },
        line : {
            name : {
                label : 'Artist',
                placeholder : 'Michael Jackson, The Beatles, Drake, Taylor Swift'
                },
            description : {
                placeholder : 'Give a history/background of the artist and describe their influences and sound.'
                }
            },
        variation : {
            name : {
                label : 'Album',
                placeholder : 'Thriller, Sgt. Pepper\'s Lonely Hearts Club, Take Care, 1989'
                },
            description : {
                placeholder : 'Describe this fit in contrast to other fits under this style/brand.'
                }
            },
        combo : {
            format: {
                label: "Format",
                help: "This is the format of the movie",
                defaults: {
                    1 : "CD",
                    2 : "MP3",
                    3 : 'Vinyl'
                    }
                },
            language : {
                label : 'Language',
                help : 'Language movie is in'
                }
            },
        identifiers : {
            options : ['upc','sku'],
            required : ['upc']
            },
        dimensions : true
        },
    properties : {
        genre_ddm_: {
            "label": "Genre(s)",
            "help": "Genres the album can be classified as",
            "defaults": {
                '1':'Alternative Country','2':'Alternative Rock','3':'Ambient','4':'Ancient Greek','5':'Andean','6':'Art Song','7':'Baroque','8':'Bhangra','9':'Bollywood','10':'Black Metal','11':'Blue Grass','12':'Blues','13':'Boogie Woogie','14':'Bossa Nova','15':'Break Beat','16':'Cajun','17':'Calypso','18':'Carribbean','19':'Celtic','20':'Candombe','21':'Children','22':'Christian','23':'Classical','24':'Classical Modern','25':'Classical Romantic','26':'Country','27':'Dancehall Reggae','28':'Death Metal','29':'Disco','30':'Electric','31':'Enka','32':'Eurodance','33':'Folk and Traditional','34':'Garage','35':'Gospel','36':'Gothic','37':'Gypsy','38':'House','39':'IDM','40':'Industrial','41':'Jazz','42':'Jewish','43':'Klezmer ','44':'Latin','45':'Latin Freestyle','46':'March','47':'Mariachi','48':'Metal','49':'Musicals','50':'New Age','51':'Pagan','52':'Opera','53':'Hip Hop','54':'Rock and Roll','55':'Salsa','56':'Reggae','57':'Spirituals','58':'Techno','59':'Trance','60':'Western','61':'World Fusion ','62':'Indie','63':'Soundtracks'
                }
            },
        decade_ddm_: {
            "label": "Decade",
            "help": "Decade album was released",
            "defaults": {
                '1':'Before 1900','2':'1910','3':'1920','4':'1930','5':'1940','6':'1950','7':'1960','8':'1970','9':'1980','10':'1990','11':'2000','12':'2010'
                }
            },
        occasions_nr_ddm_: {
            "label": 'Occasions',
            "help": "If this music specific to a certain occasion or special social gathering?",
            "defaults": {
                '1':'Dance Party','2':'Wedding','3':'Christmas','4':'Hanukkah','5':'Kwanza','6':'Eid','7':'Birthday','8':'Independence Day','9':'Funeral','10':'Corporate Event','11':'Bar and Bat Mitzvah','12':'Quinces','13':'Club Social','14':'Baby Shower','15':'Bridal Shower','16':'Banquet','17':'Holiday Party','18':'Anniversaries','19':'Dinner Party','20':'Cocktail Party'
                }
            }
        },
    booleans : [
        '_attr_anti_pilling',
        '_attr_anti_static',
        '_attr_anti_wrinkle',
        '_attr_breathable',
        '_attr_eco_friendly',
        '_attr_quick_dry',
        '_attr_waterproof',
        '_attr_windproof',
        '_attr_color_fadeproof',
        '_attr_machine_wash',
        'non_iron_attr_',
        'anti_shrink_attr_'
        ]
    }