import { entries, map } from 'lodash';

const clearFields = async ({ plugin, target, hasContent }) => {
  if (!hasContent) return Promise.resolve();

  await Promise.all(
    map(entries(target.fields), async ([targetField]) => {
      const targetFieldData = target.fields[targetField];
      const targetFieldName = targetFieldData.apiKey;

      let value = null;

      if (targetFieldData.localized) {
        value = { [plugin.locale]: null };
      }

      await plugin.setFieldValue(targetFieldName, value);
    }),
  );

  return Promise.resolve();
};

export default clearFields;
