import type { Schema, Struct } from '@strapi/strapi';

export interface HomeCriterion extends Struct.ComponentSchema {
  collectionName: 'components_home_criterion';
  info: {
    displayName: 'Fit criterion';
    icon: 'check';
  };
  attributes: {
    detail: Schema.Attribute.String & Schema.Attribute.Required;
    key: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface HomeEra extends Struct.ComponentSchema {
  collectionName: 'components_home_era';
  info: {
    displayName: 'Era';
    icon: 'clock';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    when: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_cta';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedRegion extends Struct.ComponentSchema {
  collectionName: 'components_shared_region';
  info: {
    displayName: 'Region';
    icon: 'earth';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonicalOverride: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 170;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogImageAlt: Schema.Attribute.String;
  };
}

export interface SharedTextItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_text_item';
  info: {
    displayName: 'Text item';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedTitledText extends Struct.ComponentSchema {
  collectionName: 'components_shared_titled_text';
  info: {
    displayName: 'Titled text';
    icon: 'layer';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'home.criterion': HomeCriterion;
      'home.era': HomeEra;
      'shared.cta': SharedCta;
      'shared.region': SharedRegion;
      'shared.seo': SharedSeo;
      'shared.text-item': SharedTextItem;
      'shared.titled-text': SharedTitledText;
    }
  }
}
