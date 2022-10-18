import { map } from 'lodash';

const toggleFieldsVisibilty = async ({ client, config, plugin }, visible) => {
  const promises = map(config.fields, async (fieldName) => {
    const { localized } = await client.fields.find(`${plugin.itemType.attributes['api_key']}::${fieldName}`);
    const params = [fieldName, ...(localized ? [plugin.locale] : []), visible];
    return plugin.toggleField(...params);
  });
  await Promise.all(promises);
  return Promise.resolve();
};

export default toggleFieldsVisibilty;
