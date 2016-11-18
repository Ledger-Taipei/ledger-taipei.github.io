/**
 * SETUP
 **/
  var app = app || {};


/**
 * MODELS
 **/
  app.Contact = Backbone.Model.extend({
    url: '/contact',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      message: ''
    }
  });

/**
 * VIEWS
 **/
  app.TeamView = Backbone.View.extend({
    el: '#brn-team', 
    events: {
      'click .filter': 'mixItUp',
      'click #inline': 'deferredSync'
    },
    deferredSync: function(e) {
      var me = $(e.target);
      var userId = me.data('user-id');

      // Deferred loading images
      var imageEl = this.$el.find("[data-avatar='" + userId + "']");
      var src = imageEl.attr('src');

      if (src === '') {
        imageEl.attr('src', imageEl.data('image-src'));
      }
    },
    mixItUp: function(e) {
      var me = $(e.target);
      var filter = me.data('filter');

      // Highlight
      this.$el.find('.filter').removeClass('active');
      me.addClass('active');

      this.$el.find('ul li').each(function(el) {
        $(this).addClass('hide');
      });

      this.$el.find(filter).each(function(el) {
        $(this).fadeIn('slow');
        $(this).removeClass('hide');
      });

      this.syncUp();
    },
    initialize: function() {
      var self = this;

      this.$el.find('.3').each(function() {
        $(this).removeClass('hide');
      });

      this.syncUp();

      // Fancybox
      this.$el.find("a#inline").fancybox({
        'transitionIn'  : 'elastic',
        'transitionOut' : 'elastic',
        'speedIn'     : 2600, 
        'speedOut'    : 200, 
        'overlayShow' : false,
        'hideOnContentClick': true
      });

      //
      this.$el.find("[data-tag='user-id']").each(function() {
        var me = $(this);
        var userId = me.attr('id');
        var block = $('[data-profile="' + userId + '"]');
        var html = self.parse(block.html());

        block.html(html);
      });
    },
    parse: function(markdownBlock) {
        converter = new Showdown.converter({ extensions: ['github', 'table', 'prettify'] });

        return converter.makeHtml(markdownBlock); 
    },
    syncUp: function() {
        // Deferred loading images
        this.$el.find("ul li").each(function() {
          var me = $(this);
          var isHide = me.hasClass('hide');
          var imageBlock = me.contents().find('img');
          var src = imageBlock.attr('src');

          if (isHide === false && src === '') {
            imageBlock.attr('src', imageBlock.data('image-src'));
          }
        });
    },
    render: function() {
    }
  });

  app.StartupView = Backbone.View.extend({
    el: '#brn-startup', 
    events: {
      'click #inline': 'deferredSync'
    },
    deferredSync: function(e) {
      var me = $(e.target);
      var startupId = me.data('startup-id');

      // Deferred loading images
      var imageEl = this.$el.find("[data-logo='" + startupId + "']");
      var src = imageEl.attr('src');

      if (src === '') {
        imageEl.attr('src', imageEl.data('image-src'));
      }
    },
    parse: function(markdownBlock) {
        converter = new Showdown.converter({ extensions: ['github', 'table', 'prettify'] });

        return converter.makeHtml(markdownBlock); 
    },
    initialize: function() {
      var self = this;

      this.syncUp();

      // Fancybox
      this.$el.find("a#inline").fancybox({
        'transitionIn'  : 'elastic',
        'transitionOut' : 'elastic',
        'speedIn'     : 2600, 
        'speedOut'    : 200, 
        'overlayShow' : false,
        'hideOnContentClick': true
      });

      //
      this.$el.find("[data-tag='startup-id']").each(function() {
        var me = $(this);
        var startupId = me.attr('id');
        var block = $('[data-profile="' + startupId + '"]');
        var html = self.parse(block.html());

        block.html(html);
      });
    },
    syncUp: function() {
        // Deferred loading images
        this.$el.find("ul li").each(function() {
          var me = $(this);
          var isHide = me.hasClass('hide');
          var imageBlock = me.contents().find('img');
          var src = imageBlock.attr('src');

          if (isHide === false && src === '') {
            imageBlock.attr('src', imageBlock.data('image-src'));
          }
        });
    },
    render: function() {
    }
  });

  app.ContactView = Backbone.View.extend({
    el: '#brn-feedback',
    template: _.template( $('#tmpl-contact').html() ),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-contact': 'contact'
    },
    initialize: function() {
      this.model = new app.Contact();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));

      // decode contact email
      var me = $('.contact-email');

      me.html(
        me.html().replace(/1/g, 'c')
                 .replace(/2/g, 'o')
                 .replace(/3/g, 'n')
                 .replace(/4/g, 't')
                 .replace(/5/g, 'a')
                 .replace(/6/g, 'i')
      );
      //this.$el.find('[name="name"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    contact: function() {
      this.$el.find('.btn-contact').attr('disabled', true);
      this.$el.find('.btn-contact').html('Sending...');
      
      this.model.save({
        name: this.$el.find('[name="name"]').val(),
        email: this.$el.find('[name="email"]').val(),
        message: this.$el.find('[name="message"]').val()
      });
    }
  });

/**
 * BOOTUP
 **/
  $(document).ready(function() {
    app.teamView = new app.TeamView();
    app.startupView = new app.StartupView();
    app.contactView = new app.ContactView();
  });
