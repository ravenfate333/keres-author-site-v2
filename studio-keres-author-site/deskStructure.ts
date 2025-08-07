import type { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton settings document
      S.listItem()
        .title('Site Settings')
        .id('settings') // Use the schema name from settings.ts
        .child(
          S.document()
            .schemaType('settings')
            .documentId('settings') // Use the schema name again
        ),
      
      // Add a visual divider
      S.divider(),

      // List out the rest of our document types, but filter out the settings type
      // to avoid it showing up twice.
      ...S.documentTypeListItems().filter(
        listItem => !['settings'].includes(listItem.getId()!)
      )
    ])