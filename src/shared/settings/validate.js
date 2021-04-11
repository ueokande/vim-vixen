'use strict';
var equal = require('ajv/lib/compile/equal');
var validate = (function() {
  var pattern0 = new RegExp('.*');
  var refVal = [];
  return function validate(data, dataPath, parentData, parentDataProperty, rootData) {
    'use strict';
    var vErrors = null;
    var errors = 0;
    if ((data && typeof data === "object" && !Array.isArray(data))) {
      var errs__0 = errors;
      var valid1 = true;
      for (var key0 in data) {
        var isAdditional0 = !(false || key0 == 'keymaps' || key0 == 'search' || key0 == 'properties' || key0 == 'blacklist');
        if (isAdditional0) {
          valid1 = false;
          validate.errors = [{
            keyword: 'additionalProperties',
            dataPath: (dataPath || '') + "",
            schemaPath: '#/additionalProperties',
            params: {
              additionalProperty: '' + key0 + ''
            },
            message: 'should NOT have additional properties'
          }];
          return false;
          break;
        }
      }
      if (valid1) {
        var data1 = data.keymaps;
        if (data1 === undefined) {
          valid1 = true;
        } else {
          var errs_1 = errors;
          if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
            var errs__1 = errors;
            var valid2 = true;
            for (var key1 in data1) {
              if (pattern0.test(key1)) {
                var data2 = data1[key1];
                var errs_2 = errors;
                if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
                  if (true) {
                    var errs__2 = errors;
                    var valid3 = true;
                    if (data2.type === undefined) {
                      valid3 = false;
                      validate.errors = [{
                        keyword: 'required',
                        dataPath: (dataPath || '') + '.keymaps[\'' + key1 + '\']',
                        schemaPath: '#/properties/keymaps/patternProperties/.*/required',
                        params: {
                          missingProperty: 'type'
                        },
                        message: 'should have required property \'type\''
                      }];
                      return false;
                    } else {
                      var errs_3 = errors;
                      if (typeof data2.type !== "string") {
                        validate.errors = [{
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.keymaps[\'' + key1 + '\'].type',
                          schemaPath: '#/properties/keymaps/patternProperties/.*/properties/type/type',
                          params: {
                            type: 'string'
                          },
                          message: 'should be string'
                        }];
                        return false;
                      }
                      var valid3 = errors === errs_3;
                    }
                  }
                } else {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.keymaps[\'' + key1 + '\']',
                    schemaPath: '#/properties/keymaps/patternProperties/.*/type',
                    params: {
                      type: 'object'
                    },
                    message: 'should be object'
                  }];
                  return false;
                }
                var valid2 = errors === errs_2;
                if (!valid2) break;
              } else valid2 = true;
            }
          } else {
            validate.errors = [{
              keyword: 'type',
              dataPath: (dataPath || '') + '.keymaps',
              schemaPath: '#/properties/keymaps/type',
              params: {
                type: 'object'
              },
              message: 'should be object'
            }];
            return false;
          }
          var valid1 = errors === errs_1;
        }
        if (valid1) {
          var data1 = data.search;
          if (data1 === undefined) {
            valid1 = true;
          } else {
            var errs_1 = errors;
            if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
              if (true) {
                var errs__1 = errors;
                var valid2 = true;
                if (data1.default === undefined) {
                  valid2 = false;
                  validate.errors = [{
                    keyword: 'required',
                    dataPath: (dataPath || '') + '.search',
                    schemaPath: '#/properties/search/required',
                    params: {
                      missingProperty: 'default'
                    },
                    message: 'should have required property \'default\''
                  }];
                  return false;
                } else {
                  var errs_2 = errors;
                  if (typeof data1.default !== "string") {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.search.default',
                      schemaPath: '#/properties/search/properties/default/type',
                      params: {
                        type: 'string'
                      },
                      message: 'should be string'
                    }];
                    return false;
                  }
                  var valid2 = errors === errs_2;
                }
                if (valid2) {
                  var data2 = data1.engines;
                  if (data2 === undefined) {
                    valid2 = false;
                    validate.errors = [{
                      keyword: 'required',
                      dataPath: (dataPath || '') + '.search',
                      schemaPath: '#/properties/search/required',
                      params: {
                        missingProperty: 'engines'
                      },
                      message: 'should have required property \'engines\''
                    }];
                    return false;
                  } else {
                    var errs_2 = errors;
                    if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
                      var errs__2 = errors;
                      var valid3 = true;
                      for (var key2 in data2) {
                        if (pattern0.test(key2)) {
                          var errs_3 = errors;
                          if (typeof data2[key2] !== "string") {
                            validate.errors = [{
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.search.engines[\'' + key2 + '\']',
                              schemaPath: '#/properties/search/properties/engines/patternProperties/.*/type',
                              params: {
                                type: 'string'
                              },
                              message: 'should be string'
                            }];
                            return false;
                          }
                          var valid3 = errors === errs_3;
                          if (!valid3) break;
                        } else valid3 = true;
                      }
                    } else {
                      validate.errors = [{
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.search.engines',
                        schemaPath: '#/properties/search/properties/engines/type',
                        params: {
                          type: 'object'
                        },
                        message: 'should be object'
                      }];
                      return false;
                    }
                    var valid2 = errors === errs_2;
                  }
                }
              }
            } else {
              validate.errors = [{
                keyword: 'type',
                dataPath: (dataPath || '') + '.search',
                schemaPath: '#/properties/search/type',
                params: {
                  type: 'object'
                },
                message: 'should be object'
              }];
              return false;
            }
            var valid1 = errors === errs_1;
          }
          if (valid1) {
            var data1 = data.properties;
            if (data1 === undefined) {
              valid1 = true;
            } else {
              var errs_1 = errors;
              if ((data1 && typeof data1 === "object" && !Array.isArray(data1))) {
                var errs__1 = errors;
                var valid2 = true;
                if (data1.hintchars === undefined) {
                  valid2 = true;
                } else {
                  var errs_2 = errors;
                  if (typeof data1.hintchars !== "string") {
                    validate.errors = [{
                      keyword: 'type',
                      dataPath: (dataPath || '') + '.properties.hintchars',
                      schemaPath: '#/properties/properties/properties/hintchars/type',
                      params: {
                        type: 'string'
                      },
                      message: 'should be string'
                    }];
                    return false;
                  }
                  var valid2 = errors === errs_2;
                }
                if (valid2) {
                  if (data1.smoothscroll === undefined) {
                    valid2 = true;
                  } else {
                    var errs_2 = errors;
                    if (typeof data1.smoothscroll !== "boolean") {
                      validate.errors = [{
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.properties.smoothscroll',
                        schemaPath: '#/properties/properties/properties/smoothscroll/type',
                        params: {
                          type: 'boolean'
                        },
                        message: 'should be boolean'
                      }];
                      return false;
                    }
                    var valid2 = errors === errs_2;
                  }
                  if (valid2) {
                    if (data1.complete === undefined) {
                      valid2 = true;
                    } else {
                      var errs_2 = errors;
                      if (typeof data1.complete !== "string") {
                        validate.errors = [{
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.properties.complete',
                          schemaPath: '#/properties/properties/properties/complete/type',
                          params: {
                            type: 'string'
                          },
                          message: 'should be string'
                        }];
                        return false;
                      }
                      var valid2 = errors === errs_2;
                    }
                    if (valid2) {
                      var data2 = data1.colorscheme;
                      if (data2 === undefined) {
                        valid2 = true;
                      } else {
                        var errs_2 = errors;
                        if (typeof data2 !== "string") {
                          validate.errors = [{
                            keyword: 'type',
                            dataPath: (dataPath || '') + '.properties.colorscheme',
                            schemaPath: '#/properties/properties/properties/colorscheme/type',
                            params: {
                              type: 'string'
                            },
                            message: 'should be string'
                          }];
                          return false;
                        }
                        var schema2 = validate.schema.properties.properties.properties.colorscheme.enum;
                        var valid2;
                        valid2 = false;
                        for (var i2 = 0; i2 < schema2.length; i2++)
                          if (equal(data2, schema2[i2])) {
                            valid2 = true;
                            break;
                          } if (!valid2) {
                          validate.errors = [{
                            keyword: 'enum',
                            dataPath: (dataPath || '') + '.properties.colorscheme',
                            schemaPath: '#/properties/properties/properties/colorscheme/enum',
                            params: {
                              allowedValues: schema2
                            },
                            message: 'should be equal to one of the allowed values'
                          }];
                          return false;
                        }
                        var valid2 = errors === errs_2;
                      }
                      if (valid2) {
                        if (data1.searchOnlyCurrentWin === undefined) {
                          valid2 = true;
                        } else {
                          var errs_2 = errors;
                          if (typeof data1.searchOnlyCurrentWin !== "boolean") {
                            validate.errors = [{
                              keyword: 'type',
                              dataPath: (dataPath || '') + '.properties.searchOnlyCurrentWin',
                              schemaPath: '#/properties/properties/properties/searchOnlyCurrentWin/type',
                              params: {
                                type: 'boolean'
                              },
                              message: 'should be boolean'
                            }];
                            return false;
                          }
                          var valid2 = errors === errs_2;
                        }
                      }
                    }
                  }
                }
              } else {
                validate.errors = [{
                  keyword: 'type',
                  dataPath: (dataPath || '') + '.properties',
                  schemaPath: '#/properties/properties/type',
                  params: {
                    type: 'object'
                  },
                  message: 'should be object'
                }];
                return false;
              }
              var valid1 = errors === errs_1;
            }
            if (valid1) {
              var data1 = data.blacklist;
              if (data1 === undefined) {
                valid1 = true;
              } else {
                var errs_1 = errors;
                if (Array.isArray(data1)) {
                  var errs__1 = errors;
                  var valid1;
                  for (var i1 = 0; i1 < data1.length; i1++) {
                    var data2 = data1[i1];
                    var errs_2 = errors;
                    var errs__2 = errors;
                    var valid2 = false;
                    var errs_3 = errors;
                    if (typeof data2 !== "string") {
                      var err = {
                        keyword: 'type',
                        dataPath: (dataPath || '') + '.blacklist[' + i1 + ']',
                        schemaPath: '#/properties/blacklist/items/anyOf/0/type',
                        params: {
                          type: 'string'
                        },
                        message: 'should be string'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                    }
                    var valid3 = errors === errs_3;
                    valid2 = valid2 || valid3;
                    if (!valid2) {
                      var errs_3 = errors;
                      if ((data2 && typeof data2 === "object" && !Array.isArray(data2))) {
                        if (true) {
                          var errs__3 = errors;
                          var valid4 = true;
                          if (data2.url === undefined) {
                            valid4 = false;
                            var err = {
                              keyword: 'required',
                              dataPath: (dataPath || '') + '.blacklist[' + i1 + ']',
                              schemaPath: '#/properties/blacklist/items/anyOf/1/required',
                              params: {
                                missingProperty: 'url'
                              },
                              message: 'should have required property \'url\''
                            };
                            if (vErrors === null) vErrors = [err];
                            else vErrors.push(err);
                            errors++;
                          } else {
                            var errs_4 = errors;
                            if (typeof data2.url !== "string") {
                              var err = {
                                keyword: 'type',
                                dataPath: (dataPath || '') + '.blacklist[' + i1 + '].url',
                                schemaPath: '#/properties/blacklist/items/anyOf/1/properties/url/type',
                                params: {
                                  type: 'string'
                                },
                                message: 'should be string'
                              };
                              if (vErrors === null) vErrors = [err];
                              else vErrors.push(err);
                              errors++;
                            }
                            var valid4 = errors === errs_4;
                          }
                          if (valid4) {
                            var data3 = data2.keys;
                            if (data3 === undefined) {
                              valid4 = false;
                              var err = {
                                keyword: 'required',
                                dataPath: (dataPath || '') + '.blacklist[' + i1 + ']',
                                schemaPath: '#/properties/blacklist/items/anyOf/1/required',
                                params: {
                                  missingProperty: 'keys'
                                },
                                message: 'should have required property \'keys\''
                              };
                              if (vErrors === null) vErrors = [err];
                              else vErrors.push(err);
                              errors++;
                            } else {
                              var errs_4 = errors;
                              if (Array.isArray(data3)) {
                                var errs__4 = errors;
                                var valid4;
                                for (var i4 = 0; i4 < data3.length; i4++) {
                                  var errs_5 = errors;
                                  if (typeof data3[i4] !== "string") {
                                    var err = {
                                      keyword: 'type',
                                      dataPath: (dataPath || '') + '.blacklist[' + i1 + '].keys[' + i4 + ']',
                                      schemaPath: '#/properties/blacklist/items/anyOf/1/properties/keys/items/type',
                                      params: {
                                        type: 'string'
                                      },
                                      message: 'should be string'
                                    };
                                    if (vErrors === null) vErrors = [err];
                                    else vErrors.push(err);
                                    errors++;
                                  }
                                  var valid5 = errors === errs_5;
                                  if (!valid5) break;
                                }
                              } else {
                                var err = {
                                  keyword: 'type',
                                  dataPath: (dataPath || '') + '.blacklist[' + i1 + '].keys',
                                  schemaPath: '#/properties/blacklist/items/anyOf/1/properties/keys/type',
                                  params: {
                                    type: 'array'
                                  },
                                  message: 'should be array'
                                };
                                if (vErrors === null) vErrors = [err];
                                else vErrors.push(err);
                                errors++;
                              }
                              var valid4 = errors === errs_4;
                            }
                          }
                        }
                      } else {
                        var err = {
                          keyword: 'type',
                          dataPath: (dataPath || '') + '.blacklist[' + i1 + ']',
                          schemaPath: '#/properties/blacklist/items/anyOf/1/type',
                          params: {
                            type: 'object'
                          },
                          message: 'should be object'
                        };
                        if (vErrors === null) vErrors = [err];
                        else vErrors.push(err);
                        errors++;
                      }
                      var valid3 = errors === errs_3;
                      valid2 = valid2 || valid3;
                    }
                    if (!valid2) {
                      var err = {
                        keyword: 'anyOf',
                        dataPath: (dataPath || '') + '.blacklist[' + i1 + ']',
                        schemaPath: '#/properties/blacklist/items/anyOf',
                        params: {},
                        message: 'should match some schema in anyOf'
                      };
                      if (vErrors === null) vErrors = [err];
                      else vErrors.push(err);
                      errors++;
                      validate.errors = vErrors;
                      return false;
                    } else {
                      errors = errs__2;
                      if (vErrors !== null) {
                        if (errs__2) vErrors.length = errs__2;
                        else vErrors = null;
                      }
                    }
                    var valid2 = errors === errs_2;
                    if (!valid2) break;
                  }
                } else {
                  validate.errors = [{
                    keyword: 'type',
                    dataPath: (dataPath || '') + '.blacklist',
                    schemaPath: '#/properties/blacklist/type',
                    params: {
                      type: 'array'
                    },
                    message: 'should be array'
                  }];
                  return false;
                }
                var valid1 = errors === errs_1;
              }
            }
          }
        }
      }
    } else {
      validate.errors = [{
        keyword: 'type',
        dataPath: (dataPath || '') + "",
        schemaPath: '#/type',
        params: {
          type: 'object'
        },
        message: 'should be object'
      }];
      return false;
    }
    validate.errors = vErrors;
    return errors === 0;
  };
})();
validate.schema = {
  "type": "object",
  "properties": {
    "keymaps": {
      "type": "object",
      "patternProperties": {
        ".*": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          },
          "required": ["type"]
        }
      }
    },
    "search": {
      "type": "object",
      "properties": {
        "default": {
          "type": "string"
        },
        "engines": {
          "type": "object",
          "patternProperties": {
            ".*": {
              "type": "string"
            }
          }
        }
      },
      "required": ["default", "engines"]
    },
    "properties": {
      "type": "object",
      "properties": {
        "hintchars": {
          "type": "string"
        },
        "smoothscroll": {
          "type": "boolean"
        },
        "complete": {
          "type": "string"
        },
        "colorscheme": {
          "type": "string",
          "enum": ["system", "light", "dark"]
        },
        "searchOnlyCurrentWin": {
          "type": "boolean"
        }
      }
    },
    "blacklist": {
      "type": "array",
      "items": {
        "anyOf": [{
          "type": "string"
        }, {
          "type": "object",
          "properties": {
            "url": {
              "type": "string"
            },
            "keys": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": ["url", "keys"]
        }]
      }
    }
  },
  "additionalProperties": false
};
validate.errors = null;
module.exports = validate;