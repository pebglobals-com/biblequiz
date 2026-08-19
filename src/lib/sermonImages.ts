const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const SERMON_IMAGES: Record<string, string> = {
  // Junior stories
  "hannahs-prayer-and-samuels-birth": U("photo-1511497584788-876760111969"),
  "water-turned-into-wine-at-cana": U("photo-1510812431401-41d2bd2722f3"),
  "jairus-daughter-and-the-woman-with-issue-of-blood": U("photo-1502082553048-f009c37129b9"),
  "healing-of-the-ten-lepers": U("photo-1548345680-f5475ea5df84"),
  "the-good-samaritan": U("photo-1500534314209-a25ddb2bd429"),
  "the-unforgiving-servant": U("photo-1472214103451-9374bd1c798e"),
  "the-story-of-gideon": U("photo-1519681393784-d120267933ba"),
  "the-story-of-samson": U("photo-1518709268805-4e9042af9f23"),
  "the-story-of-esther": U("photo-1529653762956-b0a27278529c"),
  "the-story-of-samuel-the-prophet": U("photo-1487958449943-2429e8be8625"),
  "the-story-of-king-saul": U("photo-1509644851169-2acc08aa25b5"),
  "the-story-of-david": U("photo-1501854140801-50d01698950b"),
  "the-wisdom-of-king-solomon": U("photo-1505873242700-f289a29e1e0f"),
  "the-feast-of-tabernacles": U("photo-1441974231531-c6227db76b6e"),

  // Senior sermons
  "who-is-god": U("photo-1470071459604-3b5ec3a7fe05"),
  "jesus-loves-me": U("photo-1501785888041-af3ef285b470"),
  "the-bible-gods-special-book": U("photo-1544787219-7f47ccb76574"),
  "is-there-anything-like-holy-ghost-fire-in-the-bible": U("photo-1513151233558-d860c5398176"),
  "the-evil-of-drunkenness": U("photo-1506377247377-2a5b3b417ebb"),
  "facts-about-covering-of-hair-in-worship": U("photo-1476703993599-0035a21b17a9"),
  "what-does-the-bible-say-about-dreams-and-visions": U("photo-1464822759023-fed622ff2c3b"),
  "is-it-only-in-cathedrals-god-can-be-worshipped": U("photo-1513635269975-59663e0ac1ad"),
  "labour-not-for-the-meat-that-perisheth": U("photo-1501594907352-04cda38ebc29"),
};

export function getSermonImage(slug: string): string {
  return SERMON_IMAGES[slug] || SERMON_IMAGES["who-is-god"];
}