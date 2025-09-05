export default function RemoveXMLfromXML(categoryName, targetXML) {
  const parser = new DOMParser();
  const targetDoc = parser.parseFromString(targetXML, 'text/xml');

  const toolbox = targetDoc.documentElement;
  const categories = toolbox.querySelectorAll('category');

  let removed = false;

  categories.forEach(category => {
	if (category.getAttribute('name') === categoryName) {
	  toolbox.removeChild(category);
	  removed = true;
	}
  });

  if (!removed) {
    console.warn(`Category "${categoryName}" not found.`);
  }

  return new XMLSerializer().serializeToString(targetDoc);
}
