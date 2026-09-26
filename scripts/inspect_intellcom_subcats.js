const fs = require('fs');
const html = fs.readFileSync('scripts/intellcom_test.html', 'utf8');

// Find all category links that belong to Category 50 or video surveillance
// Look for the category tree in the sidebar/filter
const filterForm = html.match(/<form[^>]+id=["']filter_form["'][\s\S]*?<\/form>/i);
if (filterForm) {
  console.log('Filter Form found! Length:', filterForm[0].length);
  fs.writeFileSync('scripts/intellcom_filter_form.html', filterForm[0]);
  
  const inputs = [...filterForm[0].matchAll(/<input[^>]+name=["']([^"']+)["'][^>]*value=["']([^"']*)["'][^>]*>/gi)];
  console.log('Inputs found in filter form:', inputs.length);
  inputs.slice(0, 30).forEach(i => console.log(i[1], '=', i[2]));
} else {
  console.log('Filter form not found in html');
}

// Find all category / subcategory links inside category 50 page
const allSubcats = [...html.matchAll(/<a[^>]+href=["'](\/ka\/catalog\/(\d+)\/([^"']+))["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
  url: m[1],
  id: m[2],
  slug: m[3],
  text: m[4].replace(/<[^>]+>/g, '').trim()
}));

console.log('\nAll unique subcategories found:', allSubcats.length);
fs.writeFileSync('scripts/intellcom_subcats.json', JSON.stringify(allSubcats, null, 2));
