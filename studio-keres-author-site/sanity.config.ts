import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'
import { deskStructure } from './deskStructure'

export default defineConfig({
  name: 'default',
  title: 'Keres Author Site',

  projectId: '092fr38x',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    visionTool(), 
    colorInput()
  ],

  schema: {
    types: schemaTypes,
  },
})