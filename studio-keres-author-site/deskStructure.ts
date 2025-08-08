import type {StructureBuilder} from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // --- Main Navigation ---
      S.listItem()
        .title('Main Navigation')
        .id('navigation')
        .child(S.document().schemaType('navigation').documentId('singleton-navigation')),

      // --- Author Page ---
      S.listItem()
        .title('Author Page')
        .id('author')
        .child(S.document().schemaType('author').documentId('singleton-author')),

      // --- Social Links ---

      S.listItem()
        .title('Social Links')
        .id('socialLinks')
        .child(S.document().schemaType('socialLinks').documentId('singleton-socialLinks')),

      // --- Site Settings ---
      S.listItem()
        .title('Site Settings')
        .id('settings')
        .child(S.document().schemaType('settings').documentId('singleton-settings')),

      S.divider(),

      // The rest of the documents
      ...S.documentTypeListItems().filter(
        (listItem) => !['navigation', 'author', 'settings', 'socialLinks'].includes(listItem.getId()!),
      ),
    ])
