var request = require('superagent');
var _ = require('lodash');

module.exports = {
  template: '#repo_app_component',
  paramAttributes: ['owner', 'repo'],
  components: {
    variables: {
      template: '#codes_variables_component'
    },
    functions: {
      tempalte: '#codes_functions_component'
    },
    classes  : {
      template: '#codes_classes_component'
    },
    codeview : {
      template: '#codes_codeview_component'
    }
  },
  data: function() {
    return {
      app: {
        component: 'variables'
      },
      codes: null,
      collections: {
        variables: {},
        functions: {},
        classes  : {}
      },
      statistics: {
        variables: [],
        functions: [],
        classes  : []
      }
    };
  },
  filters: {
  },
  methods: {
    switchTab: function(target) {
      this.app.component = target;
    },
    getRepository: function() {
      var _this = this;
      request
      .get('/siteapi/repo')
      .query({ owner: this.owner, repo: this.repo })
      .accept('json')
      .end(function(err, res) {
        if (err)  { return console.log('user data get error: ', err); }

        _this.compile(res.body.db_repo);
        _this.$data.codes = res.body.auth ? res.body.db_repo : null;
      });
    },
    compile: function(codes) {

      console.log(codes.branches[0]);

      var _this = this;
      _.forEach(codes.branches[0].files, function(file) {
        _.forEach(file.result, function(result) {

          var data = {
            class_name: result.class_name,
            name: result.name,
            comment: result.comment,
            path: file.path,
            line: result.line
          };

          if (result.type === 'variable') {
            _this.$data.collections.variables[result.name] ||
              (_this.$data.collections.variables[result.name] = []);

            _this.$data.collections.variables[result.name].push(data);
            _this.$data.statistics.variables.push(data);
          } else if (result.type === 'function') {
            _this.$data.collections.functions[result.name] ||
              (_this.$data.collections.functions[result.name] = []);

            _this.$data.collections.functions[result.name].push(data);
            _this.$data.statistics.functions.push(data);
          } else if (result.type === 'class') {
            _this.$data.collections.classes[result.name] ||
              (_this.$data.collections.classes[result.name] = []);

            _this.$data.collections.classes[result.name].push(data);
            _this.$data.statistics.classes.push(data);
          }
        });
      });
    },
    sort: function(col_name) {

    }
  },
  ready: function() {

    var _this = this;

    this.getRepository();

    this.$el.classList.remove('hide');
  }
};
