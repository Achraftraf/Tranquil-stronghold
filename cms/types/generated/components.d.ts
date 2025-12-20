import type { Schema, Struct } from '@strapi/strapi';

export interface SharedTag extends Struct.ComponentSchema {
  collectionName: 'components_shared_tags';
  info: {
    displayName: 'tag';
    icon: 'priceTag';
  };
  attributes: {
    name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.tag': SharedTag;
    }
  }
}
