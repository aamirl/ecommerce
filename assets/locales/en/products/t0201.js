module.exports = {
    setup : {
        manufacturer : {
            label : 'Studio',
            verb : 'Produced'
            },
        line : {
            name : {
                label : 'Title',
                placeholder : 'The Hangover, Home Alone, Gone With The Wind, Star Wars'
                },
            description : {
                placeholder : 'If this movie is a part of a series/season, please describe the series overall. If it is the only part, please leave this blank.'
                }
            },
        variation : {
            name : {
                label : 'Part',
                placeholder : 'Part 2, Episode 6, Season 5, etc. If this is the first and only part, please leave this blank.',
                blank : true`
                },
            description : {
                placeholder : 'If this movie is a part of a series/season, please describe this particular series/season. If it is the only part, please describe the movie in it\'s entirety.'
                blank : true
                }
            },
        combo : {
            format: {
                label: "Format",
                help: "This is the format of the movie",
                defaults: {
                    1 : "DVD",
                    2 : "HD-DVD",
                    3 : "Blu-Ray 3D",
                    4 : "Blu-Ray",
                    5 : 'VHS',
                    6 : 'Universal Media Disc',
                    7 : 'Laser Disc'
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
        images : 'format',
        dimensions : true
        },
    properties : {
        directed : {
            label : 'Director',
            placeholder : 'Director of the movie'
            },
        runtime : {
            label : 'Runtime',
            placeholder : 'Movie runtime in minutes'
            },
        genre_ddm_: {
            label : "Genre",
            help : "Movie genre",
            default : {
                1: "Action",
                2 : "Adventure",
                3: "Anime",
                4: "Comedy",
                5: "Documentary",
                6: "Drama",
                7: "Exercise and Fitness",
                8: "Faith and Spirituality",
                9: "Fantasy",
                10: "Foreign",
                11: "Gay and Lesbian",
                12 : "Kids and Family",
                13 : "Military and War",
                14 : "Music Videos and Concerts",
                15 : "Mystery",
                16 : 'Performing Arts',
                17 : 'Reality TV',
                18 : 'Romance',
                19 : 'Science Fiction',
                20 : 'Special Interests',
                21 : 'Sports',
                22 : 'TV/Talk Shows',
                23 : 'Thrillers',
                24 : 'Westerns'
                25 : 'Other'
                }
            },
        mpaa_rating_dd_ : {
            label : 'MPAA Rating',
            placeholder : 'The rating for the movie in accordance with the Motion Picture Associate of America',
            defaults : {
                1 : 'Unrated',
                2 : "G",
                3 : 'PG',
                4 : 'PG-13',
                5 : 'R',
                6 : 'NC-17',
                7 : 'Not Applicable'
                }
            },
        imdb_link : {
            label : 'IMDB',
            placeholder : 'Enter the URL of the movie from IMDB (Internet Movie Database), www.imdb.com'
            }
        },
    booleans : [
        '_attr_subtitles'
        ]
    }