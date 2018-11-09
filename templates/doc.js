module.exports = {
  page: function(name) {
      var _name = name[0].toUpperCase() + name.slice(1);

      return [
          '// edit pages/index.jsx , add the following code',
          'import ' + _name + ' from "react-proxy?name='+ name + '!./' + name + '";',
          '  ...',
          '<Router>',
          '   ...',
          '   <Route path="your_url_schema_here" component={' + _name + '}/>',
          '   ...',
          '</Router>',
          '...'
      ].join('\n\n');
  },
  component: function(name) {
      var _name = name[0].toUpperCase() + name.slice(1);

      return [
          '// edit commponents/index.jsx to export current component out.',
          'import ' + _name + ' from "./' + _name + '";',
          '...',
          'export default {',
          '    ...',
          '    '+ _name + ', ',
          '    ...',
          '};'
      ].join('\n\n');
  }
}
