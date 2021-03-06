// Generated by CoffeeScript 1.7.1
(function() {
  define(function(require, exports, module) {
    var OutputSwitch, addKeyboardListener, makeToggleFocusable;
    require('vendor/link!css/outputswitch.css');
    addKeyboardListener = require('lib/keyboard').addKeyboardListener;
    makeToggleFocusable = require('lib/utils').makeToggleFocusable;
    OutputSwitch = Backbone.View.extend({
      template: require('lib/templates/output_switch'),
      className: 'client-switch',
      events: {
        'click .item': 'onItemSelect',
        'mouseover .item': 'onMouseOver'
      },
      initialize: function() {
        this.model.on('clients:add', this.render, this);
        this.model.on('clients:remove', this.render, this);
        this.selectedId = 0;
        this.highlightedId = 0;
        makeToggleFocusable(this.el);
        addKeyboardListener('clientswitch', this.el);
        this.el.listenKey('move-down', {
          mac: 'down',
          exec: (function(_this) {
            return function() {
              return _this.moveHighlight(1);
            };
          })(this)
        });
        this.el.listenKey('move-up', {
          mac: 'up',
          exec: (function(_this) {
            return function() {
              return _this.moveHighlight(-1);
            };
          })(this)
        });
        return this.el.listenKey('select-client', {
          mac: 'return',
          exec: (function(_this) {
            return function() {
              return _this.selectId(_this.highlightedId);
            };
          })(this)
        });
      },
      select: function(client) {
        var _ref;
        this.client = client;
        return this.selectId((_ref = this.client) != null ? _ref.id : void 0);
      },
      selectId: function(selectedId) {
        this.selectedId = selectedId;
        this.highlight(this.selectedId);
        if (this._notFirst) {
          this.trigger('change', app.Clients.get(this.selectedId));
        }
        this.render();
        this.el.blur();
        return this._notFirst = true;
      },
      onItemSelect: function(e) {
        var clientId;
        clientId = parseInt(e.currentTarget.getAttribute('data-client-id'), 10);
        if (clientId !== this.selectedId) {
          return this.selectId(clientId);
        }
      },
      moveHighlight: function(delta) {
        var clients, index;
        clients = this.model.getClients();
        index = clients.indexOf(_.find(clients, (function(_this) {
          return function(client) {
            return client.id === _this.highlightedId;
          };
        })(this)));
        if (index === -1) {
          return;
        }
        index += delta;
        if (index < 0) {
          index = clients.length - 1;
        }
        if (index >= clients.length) {
          index = 0;
        }
        return this.highlight(clients[index].id);
      },
      highlight: function(id) {
        var clients, index, items;
        clients = this.model.getClients();
        items = this.$('.item');
        items.removeClass('is-highlight');
        this.highlightedId = id;
        index = clients.indexOf(_.find(clients, function(client) {
          return client.id === id;
        }));
        if (items.length && index !== -1) {
          return $(items.get(index)).addClass('is-highlight');
        }
      },
      onMouseOver: function(e) {
        var clientId;
        clientId = parseInt(e.currentTarget.getAttribute('data-client-id'), 10);
        if (clientId !== this.highlightedId) {
          return this.highlight(clientId);
        }
      },
      render: function() {
        var selectedClient;
        selectedClient = app.Clients.get(this.selectedId);
        this.$el.html(this.template({
          clients: _.map(this.model.getClients(), function(client) {
            return client.toJSON();
          }),
          selectedClient: selectedClient ? selectedClient.toJSON() : {
            useragent: 'No clients connected'
          }
        }));
        if (selectedClient) {
          this.highlight(this.selectedId);
        }
        tm('outputrender');
        return this;
      }
    });
    return module.exports = OutputSwitch;
  });

}).call(this);
