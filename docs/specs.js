specs = {
    "swagger": "2.0",
    "info": {
        "title": "Spinitron v2",
        "version": "1.0.0",
        "description": "Maximum limit is 200. Default limit is 20."
    },
    "host": "spinitron.com",
    "schemes": [
        "https",
        "http"
    ],
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    },
    "basePath": "/api",
    "produces": [
        "application/json",
        "application/xml"
    ],
    "tags": [
        {
            "name": "Persona"
        },
        {
            "name": "Show"
        },
        {
            "name": "Playlist"
        },
        {
            "name": "Spin"
        }
    ],
    "paths": {
        "/personas": {
            "get": {
                "summary": "Get Personas",
                "tags": [
                    "Persona"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "name",
                        "in": "query",
                        "type": "string",
                        "description": "Filter by Persona name"
                    },
                    {
                        "$ref": "#/parameters/limit"
                    },
                    {
                        "$ref": "#/parameters/page"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The personas",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/BaseIndexResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "items": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/Persona"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/personas/{id}": {
            "get": {
                "summary": "Get Persona by id",
                "tags": [
                    "Persona"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The Persona",
                        "schema": {
                            "$ref": "#/definitions/Persona"
                        }
                    },
                    "404": {
                        "description": "Persona not found",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        },
        "/shows": {
            "get": {
                "summary": "Returns scheduled shows optionally filtered by {start} and/or {end} datetimes",
                "description": "**Terminology**: Spinitron defines a *show* as a radio program. A show can have one or more *schedules*,\neach of which may specify either an *occurence* or a *repetition*, which represents a set of occurences.\nThus scheduled shows have occurences that, for example, may be displayed in a calendar.\n\nIn the response, `items` is an array of objects representing occurences of scheduled shows.\n\nYou may optionally filter `items` to a datetime *range* by including in the request {start} and/or {end}\nparameters, both of which must be no more than one hour in the past. An occurence starting at {end} is\nincluded in the reponse.\n\n`itmes` can include occurences that begin *or* end within the filter range. A show that goes on air before\n{start} appears in `items` if it ends *after* but not *at* {start}. An occurence starting at or before {end}\nis included.\n\nIf the request omits the {start} parameter, the server sets its value to the current time so that the filter\nrange's start is always defined. If the request specifies {end} then the requested range is *bounded*,\notherwise it is *unbounded*.\n\nFor a bounded request, `items` includes *every* occurence of all shows occuring in the range. The only\ndifference between objects in `items` representing a given show will be the `start` field value.\n\nFor an unbounded request, `items` includes *only one* occurence per show, specifically, the\nnext occurrence after {start} of all shows occuring after {start}.\n\nUse an unbounded request to get a straight list all shows. Use a bounded request to get a calendar/agenda\nof shows expanded into occurrences by thir shedules and repetitions.\n\nObjects in `items` are ordered first by `datetime` and then by `id`.\n",
                "tags": [
                    "Show"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "start",
                        "description": "The datetime starting from items must be returned. Maximum 1 hour in past.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "end",
                        "description": "The ending datetime. Maximum 1 hour in past.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "$ref": "#/parameters/limit"
                    },
                    {
                        "$ref": "#/parameters/page"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The shows",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/BaseIndexResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "items": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/Show"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "422": {
                        "description": "Invalid datetimes in filter: either too old or {end} is less than {start}.\n",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        },
        "/shows/{id}": {
            "get": {
                "summary": "Get a Show by id",
                "description": "The response object represents the next occurence of the show specified by {id}.\n\nStatus 404 is returned if a show with {id} does not exist or if it does but all its scheduled occurences elapsed in the past.\n",
                "tags": [
                    "Show"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The Show",
                        "schema": {
                            "$ref": "#/definitions/Show"
                        }
                    },
                    "404": {
                        "description": "Show not found or too old",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        },
        "/playlists": {
            "get": {
                "summary": "Returns playlists optionally filtered by {start} and/or {end} datetimes",
                "description": "Get Playlists optionally filtered by a datetime range. \nOnly past Playlists will be returned (with allowed tolerance equals 1 hour in future). \n\nOrdered chronologically from newest to oldest.\n",
                "tags": [
                    "Playlist"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "start",
                        "description": "The datetime starting from items must be returned. Maximum 1 hour in future.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "end",
                        "description": "The ending datetime. Maximum 1 hour in future.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "show_id",
                        "description": "Filter by show",
                        "in": "query",
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/limit"
                    },
                    {
                        "$ref": "#/parameters/page"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The playlists",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/BaseIndexResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "items": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/Playlist"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        "/playlists/{id}": {
            "get": {
                "summary": "Get a Playlist by id",
                "description": "The response object represents the playlist specified by {id}.\n\nStatus 404 is returned if a playlist with {id} does not exist or if it does but starts in the future (with allowed tolerance equals 1 hour in future).\n",
                "tags": [
                    "Playlist"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The playlist",
                        "schema": {
                            "$ref": "#/definitions/Playlist"
                        }
                    },
                    "404": {
                        "description": "Playlist not found or is in the future",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        },
        "/spins": {
            "get": {
                "summary": "Returns spins optionally filtered by {start} and/or {end} datetimes",
                "description": "Get Spins optionally filtered by a datetime range. Only past Spins will be returned.\n",
                "tags": [
                    "Spin"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "start",
                        "description": "The datetime starting from items must be returned.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "end",
                        "description": "The ending datetime.\n",
                        "in": "query",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "playlist_id",
                        "description": "Filter by playlist",
                        "in": "query",
                        "type": "integer"
                    },
                    {
                        "name": "show_id",
                        "description": "Filter by show",
                        "in": "query",
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/limit"
                    },
                    {
                        "$ref": "#/parameters/page"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The spins",
                        "schema": {
                            "allOf": [
                                {
                                    "$ref": "#/definitions/BaseIndexResponse"
                                },
                                {
                                    "type": "object",
                                    "properties": {
                                        "items": {
                                            "type": "array",
                                            "items": {
                                                "$ref": "#/definitions/Spin"
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            "post": {
                "summary": "Log a Spin",
                "tags": [
                    "Spin"
                ],
                "description": "An endpoint for automation systems to log spins into the spin table.",
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "live",
                        "in": "formData",
                        "type": "boolean",
                        "description": "Only when automation params are configured with the \"Pass through\" mode.\nEnables \"live assist\" mode. Default mode is \"full automation\".\n"
                    },
                    {
                        "name": "start",
                        "in": "formData",
                        "type": "string",
                        "format": "date-time"
                    },
                    {
                        "name": "duration",
                        "in": "formData",
                        "type": "integer"
                    },
                    {
                        "name": "artist",
                        "in": "formData",
                        "type": "string",
                        "required": true
                    },
                    {
                        "name": "release",
                        "in": "formData",
                        "type": "string"
                    },
                    {
                        "name": "label",
                        "in": "formData",
                        "type": "string"
                    },
                    {
                        "name": "song",
                        "in": "formData",
                        "type": "string",
                        "required": true
                    },
                    {
                        "name": "composer",
                        "in": "formData",
                        "type": "string"
                    },
                    {
                        "name": "isrc",
                        "in": "formData",
                        "type": "string"
                    }
                ],
                "responses": {
                    "201": {
                        "description": "The new created Spin.",
                        "schema": {
                            "$ref": "#/definitions/Spin"
                        }
                    },
                    "422": {
                        "description": "Validation failed.",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/ValidationError"
                            }
                        }
                    },
                    "default": {
                        "description": "Failed to create the object for unknown reason.",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        },
        "/spins/{id}": {
            "get": {
                "summary": "Get a Spin by id",
                "tags": [
                    "Spin"
                ],
                "security": [
                    {
                        "Bearer": []
                    }
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "type": "integer"
                    },
                    {
                        "$ref": "#/parameters/fields"
                    },
                    {
                        "$ref": "#/parameters/expand"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "The spin",
                        "schema": {
                            "$ref": "#/definitions/Spin"
                        }
                    },
                    "404": {
                        "description": "Spin not found",
                        "schema": {
                            "$ref": "#/definitions/Error"
                        }
                    }
                }
            }
        }
    },
    "parameters": {
        "limit": {
            "name": "count",
            "description": "Amount of items to return",
            "in": "query",
            "type": "integer",
            "default": 20,
            "minimum": 1
        },
        "page": {
            "name": "page",
            "description": "Offset, used together with count",
            "in": "query",
            "type": "integer",
            "minimum": 1
        },
        "fields": {
            "name": "fields",
            "description": "Allows to select only needed fields",
            "in": "query",
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "expand": {
            "name": "expand",
            "description": "Allows to select extra fields",
            "in": "query",
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "definitions": {
        "Persona": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "name": {
                    "type": "string"
                },
                "bio": {
                    "type": "string"
                },
                "since": {
                    "type": "string",
                    "format": "integer",
                    "description": "Year"
                },
                "email": {
                    "type": "string"
                },
                "website": {
                    "type": "string"
                },
                "image": {
                    "type": "string"
                },
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "$ref": "#/definitions/Link"
                        },
                        "shows": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Link"
                            }
                        }
                    }
                }
            }
        },
        "Show": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "start": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "end": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "duration": {
                    "type": "integer",
                    "description": "Duration in seconds"
                },
                "timezone": {
                    "type": "string",
                    "example": "America/Chicago"
                },
                "one_off": {
                    "type": "boolean"
                },
                "category": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "since": {
                    "type": "string",
                    "format": "integer",
                    "description": "Year"
                },
                "url": {
                    "type": "string"
                },
                "hide_dj": {
                    "type": "boolean"
                },
                "image": {
                    "type": "string"
                },
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "$ref": "#/definitions/Link"
                        },
                        "personas": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Link"
                            }
                        },
                        "playlists": {
                            "$ref": "#/definitions/Link"
                        }
                    }
                }
            }
        },
        "Playlist": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "persona_id": {
                    "type": "integer"
                },
                "show_id": {
                    "type": "integer"
                },
                "start": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "end": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "duration": {
                    "type": "integer",
                    "description": "Duration in seconds"
                },
                "timezone": {
                    "type": "string",
                    "example": "America/Chicago"
                },
                "category": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "since": {
                    "type": "string",
                    "format": "date"
                },
                "url": {
                    "type": "string"
                },
                "hide_dj": {
                    "type": "boolean"
                },
                "image": {
                    "type": "string"
                },
                "automation": {
                    "type": "boolean"
                },
                "episode_name": {
                    "type": "string"
                },
                "episode_description": {
                    "type": "string"
                },
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "$ref": "#/definitions/Link"
                        },
                        "persona": {
                            "$ref": "#/definitions/Link"
                        },
                        "show": {
                            "$ref": "#/definitions/Link"
                        },
                        "spins": {
                            "$ref": "#/definitions/Link"
                        }
                    }
                }
            }
        },
        "Spin": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "playlist_id": {
                    "type": "integer"
                },
                "start": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "end": {
                    "type": "string",
                    "format": "date-time",
                    "description": "UTC datetime, ISO-8601."
                },
                "duration": {
                    "type": "integer",
                    "description": "Duration in seconds"
                },
                "timezone": {
                    "type": "string",
                    "example": "America/Chicago"
                },
                "artist": {
                    "type": "string"
                },
                "release": {
                    "type": "string"
                },
                "label": {
                    "type": "string"
                },
                "song": {
                    "type": "string"
                },
                "composer": {
                    "type": "string"
                },
                "isrc": {
                    "type": "string"
                },
                "note": {
                    "type": "string"
                },
                "genre": {
                    "type": "string"
                },
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "$ref": "#/definitions/Link"
                        },
                        "playlist": {
                            "$ref": "#/definitions/Link"
                        }
                    }
                }
            }
        },
        "ValidationError": {
            "type": "object",
            "properties": {
                "field": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "Error": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "message": {
                    "type": "string"
                },
                "code": {
                    "type": "integer"
                },
                "status": {
                    "type": "integer"
                },
                "type": {
                    "type": "string"
                }
            }
        },
        "Pagination": {
            "type": "object",
            "properties": {
                "totalCount": {
                    "type": "integer"
                },
                "pageCount": {
                    "type": "integer"
                },
                "currentPage": {
                    "type": "integer"
                },
                "perPage": {
                    "type": "integer"
                }
            }
        },
        "Link": {
            "type": "object",
            "properties": {
                "href": {
                    "type": "string"
                }
            }
        },
        "BaseIndexResponse": {
            "type": "object",
            "properties": {
                "_links": {
                    "type": "object",
                    "properties": {
                        "self": {
                            "$ref": "#/definitions/Link"
                        }
                    }
                },
                "_meta": {
                    "$ref": "#/definitions/Pagination"
                }
            }
        }
    }
};
