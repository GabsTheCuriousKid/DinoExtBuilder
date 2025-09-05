export default function AddXMLtoXML(sourceXML, targetXML, insertBeforeCategory = null) {
  const parser = new DOMParser();
  const sourceDoc = parser.parseFromString(sourceXML, 'text/xml');
  const targetDoc = parser.parseFromString(targetXML, 'text/xml');

  const sourceCategory = sourceDoc.querySelector('category');
  if (!sourceCategory) {
    throw new Error("Source XML does not contain a <category> element.");
  }

  const importedCategory = targetDoc.importNode(sourceCategory, true);
  const toolbox = targetDoc.documentElement;

  if (insertBeforeCategory) {
    const beforeNode = [...toolbox.children].find(
      el => el.tagName === 'category' && el.getAttribute('name') === insertBeforeCategory
    );

    if (beforeNode) {
      toolbox.insertBefore(importedCategory, beforeNode);
    } else {
      console.warn(`Category "${insertBeforeCategory}" not found. Appending to end.`);
      toolbox.appendChild(importedCategory);
    }
  } else {
    toolbox.appendChild(importedCategory);
  }

  return new XMLSerializer().serializeToString(targetDoc);
}
