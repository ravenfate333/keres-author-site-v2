import { defineConfig, type NewDocumentOptionsResolver, type DocumentActionsResolver } from 'sanity';
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'
import {deskStructure} from './deskStructure'

const singletonTypes = new Set(['navigation', 'author', 'settings', 'socialLinks', 'accordionPage',]);
const singletonActions = new Set(['publish', 'discardChanges', 'restore']);

const newDocOptions: NewDocumentOptionsResolver = (prev, { creationContext }) => {
  if (creationContext.type === 'global') {
    return prev.filter((template) => !singletonTypes.has(template.templateId));
  }
  return prev;
};

const documentActions: DocumentActionsResolver = (prev, context) => {
  if (singletonTypes.has(context.schemaType)) {
    return prev.filter(({ action }) => action && singletonActions.has(action));
  }
  return prev;
};

export default defineConfig({
  name: 'default',
  title: 'Keres Author Site',
  projectId: '092fr38x',
  dataset: 'production',

  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
    colorInput(),
  ],

  newDocumentOptions: newDocOptions,
  document: { actions: documentActions },

  schema: { types: schemaTypes },
});

