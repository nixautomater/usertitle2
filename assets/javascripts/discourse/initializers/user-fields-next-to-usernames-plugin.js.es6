import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeWithApi(api) {
  api.includePostAttributes("display_user_fields");
  api.decorateWidget("poster-name:after", helper => {
    const userFields = helper.attrs.display_user_fields;
    const siteUserFields = Discourse.Site.currentProp("user_fields");

    if (userFields.length === 0 || siteUserFields.length === 0) return;

    const results = [];
    siteUserFields.forEach(field => {
      const match = userFields.find(_field => _field[field.id] !== undefined);
      if (match === undefined) return;
      results.push(I18n.t("user_fields_next_to_usernames.format", { field_name: field.name, field_value: match[field.id] }));
    })

    Ember.run.schedule('afterRender', () => {
      $('.names.trigger-user-card').each(function() {
        // an ugly hack to make it compatible  with another plugin
        // not sure if there is an event that we can listen to when
        // widget is inserted into the dom
        $(this).find('.display-user-fields').insertBefore($(this).find('div').first())
      })
    });

    return helper.h("span.display-user-fields", results.join(I18n.t("user_fields_next_to_usernames.join")));
  })
}

export default {
  name: 'user-fields-next-to-usernames-plugin',
  initialize() {
    withPluginApi('0.8.13', initializeWithApi);
  }
};
