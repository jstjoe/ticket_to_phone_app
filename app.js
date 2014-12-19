(function() {

  return {
    events: {
      'app.created':'onCreated',
      'ticket.save':'onSubmit'
    },
    requests: {
      updateUser: function(id, phone) {
        var user = {
          "user":{
            "phone":phone
          }
        };
        return {
          url: helpers.fmt('/api/v2/users/%@.json', id),
          type: 'PUT',
          dataType: 'JSON',
          contentType: 'application/JSON',
          proxy_v2: true,
          data: JSON.stringify(user)
        };
      }
    },
    onCreated: function() {
    },
    onSubmit: function() {
      var ticket = this.ticket(),
        requester = ticket.requester(),
        id = requester.id(),
        phone = ticket.customField('custom_field_' + this.setting("phoneNumberFieldID")); // capture phone number from field specified in settings
      if(!phone) {
        return;
      } else {
        return this.promise(function(done, fail) {
          this.ajax('updateUser', id, phone).then(
            function(response) {
              var newPhone = response.user.phone;
              services.notify(helpers.fmt("Requester's phone number updated to %@.", newPhone));
              done();
            },
            function() {
                services.notify("Updating requester's phone number failed but the ticket will update.", "error");
                done();
            }
          );
        });
      }
    }
  };

}());
