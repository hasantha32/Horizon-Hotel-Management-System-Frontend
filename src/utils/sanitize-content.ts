import { useEffect, useState } from 'react';
import sanitizeHtml from 'sanitize-html';

export function useSanitizeContent({ description }: { description: string }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!description) {
    return;
  }
  const cleanDescription = sanitizeHtml(description, {
    allowedTags: sanitizeHtml?.defaults?.allowedTags?.concat(['img', 'iframe']),
    allowedAttributes: {
      p: ['style', 'class'],
      strong: ['style', 'class'],
      em: ['style', 'class'],
      u: ['style', 'class'],
      pre: ['style', 'class'],
      sub: ['style'],
      sup: ['style'],
      span: ['style', 'class'],
      a: ['style', 'href', 'data-*', 'name', 'target', 'class'],
      img: [
        'src',
        'srcset',
        'alt',
        'title',
        'width',
        'height',
        'loading',
        'class',
      ],
      li: ['style', 'class'],
      iframe: ['src', 'frameborder', 'allowfullscreen', 'class'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com'],
    allowedStyles: {
      '*': {
        // Match HEX and RGB
        color: [
          /^#(0x)?[0-9a-f]+$/i,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        ],
        'background-color': [
          /^#(0x)?[0-9a-f]+$/i,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        ],
        'text-align': [/^left$/, /^right$/, /^center$/],
        // Match any number with px, em, or %
        'font-size': [/^\d+(?:px|em|%)$/],
      },
    },
    allowedSchemesByTag: {
      img: ['data'],
    },
  });

  return isClient ? cleanDescription : '';
}
