import React from "react";
import { Helmet } from "react-helmet";

import { FRONTEND_URL } from "../../config";

export const BreadcrumbList = (crumbs) => {
  const schema = {
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [],
  };

  crumbs.forEach((item, index) => {
    schema.itemListElement.push({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "WebPage",
        "@id": item.url,
        url: item.url,
        name: item.text,
      },
    });
  });

  return schema;
};

export default function Seo({
  title,
  description,
  canonical,
  breadcrumbs = [],
  children,
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && (
        <link
          rel="canonical"
          href={`${FRONTEND_URL}${canonical.replace(/\/$/, "")}`}
        />
      )}

      {breadcrumbs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(BreadcrumbList(breadcrumbs))}
        </script>
      )}

      {children}
    </Helmet>
  );
}
