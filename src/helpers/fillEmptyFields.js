import { entries, get, isEmpty, map } from 'lodash';
import toSnakeCase from '@root/helpers/toSnakeCase';

const getType = (fields) => {
  switch (fields.fieldType) {
    case 'text':
    case 'string':
      return fields.localized ? 'localizedString' : 'string';
    default:
      return fields.localized ? `localized${fields.fieldType}` : fields.fieldType;
  }
};

const fillEmptyFields = async ({ plugin, source, target }) => {
  await Promise.all(
    map(entries(target.fields), async ([targetField]) => {
      const targetFieldData = target.fields[targetField];
      const targetType = getType(targetFieldData);
      const sourceType = getType(source.fields[targetField]);

      const targetFieldName = targetFieldData.apiKey;
      const value = source.values[targetField];

      let fieldValue = await plugin.getFieldValue(targetFieldName);
      if (targetFieldData.localized) {
        fieldValue = fieldValue[plugin.locale];
      }

      if (!isEmpty(fieldValue)) return;

      if (sourceType === targetType) {
        await plugin.setFieldValue(targetFieldName, toSnakeCase(value));
      } else {
        const typeMapping = `${sourceType}::${targetType}`;
        switch (typeMapping) {
          case 'gallery::file':
            await plugin.setFieldValue(targetFieldName, toSnakeCase(value));
            break;
          case 'string::localizedString':
            await plugin.setFieldValue(targetFieldName, { en: value });
            break;
          case 'localizedString::string':
            await plugin.setFieldValue(targetFieldName, get(value, plugin.locale));
            break;
          default:
            console.error(`Could not set ${value} for ${typeMapping}`);
        }
      }
    }),
  );

  return Promise.resolve();
};

export default fillEmptyFields;
