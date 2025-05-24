import Image from '@tiptap/extension-image';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import ImageView from './ImageView.vue';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        size?: string;
        alignment?: string;
        caption?: string;
        link?: string;
      }) => ReturnType;
    };
  }
}

export default Image.extend({
  name: 'customImage',

  addAttributes(): Record<string, any> {
    return {
      src: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('src'),
        renderHTML: (attributes: any) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      alt: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('alt'),
        renderHTML: (attributes: any) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      title: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('title'),
        renderHTML: (attributes: any) => {
          if (!attributes.title) return {};
          return { title: attributes.title };
        },
      },
      size: {
        default: 'medium',
        parseHTML: (element: any) => {
          // Parse from data attribute first
          const dataSize = element.getAttribute('data-size');
          if (dataSize) return dataSize;
          
          // Parse from style width as fallback
          const style = element.getAttribute('style') || '';
          if (style.includes('width: 25%')) return 'small';
          if (style.includes('width: 50%')) return 'medium';
          if (style.includes('width: 75%')) return 'large';
          if (style.includes('width: 100%')) return 'full';
          return 'medium';
        },
        renderHTML: (attributes: any) => {
          if (!attributes.size) return {};
          return {
            'data-size': attributes.size,
          };
        },
      },
      alignment: {
        default: 'left', 
        parseHTML: (element: any) => {
          const dataAlignment = element.getAttribute('data-alignment');
          if (dataAlignment) return dataAlignment;
          
          // Parse from parent figure alignment
          const figure = element.closest('figure');
          if (figure) {
            const figureClass = figure.className;
            if (figureClass.includes('align-center')) return 'center';
            if (figureClass.includes('align-right')) return 'right';
          }
          return 'left';
        },
        renderHTML: (attributes: any) => {
          if (!attributes.alignment) return {};
          return {
            'data-alignment': attributes.alignment,
          };
        },
      },
      caption: {
        default: '',
        parseHTML: (element: any) => {
          // First check data attribute
          const dataCaption = element.getAttribute('data-caption');
          if (dataCaption) return dataCaption;
          
          // Look for figcaption in parent figure
          const figure = element.closest('figure');
          if (figure) {
            const figcaption = figure.querySelector('figcaption');
            return figcaption ? figcaption.textContent || '' : '';
          }
          return '';
        },
        renderHTML: (attributes: any) => {
          if (!attributes.caption) return {};
          return {
            'data-caption': attributes.caption,
          };
        },
      },
      link: {
        default: null,
        parseHTML: (element: any) => element.getAttribute('data-link'),
        renderHTML: (attributes: any) => {
          if (!attributes.link) return {};
          return {
            'data-link': attributes.link,
          };
        },
      },
    };
  },

  addNodeView() {
    return VueNodeViewRenderer(ImageView);
  },

  addCommands() {
    return {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        size?: string;
        alignment?: string;
        caption?: string;
        link?: string;
      }) => ({ commands }: { commands: any }) => {
        console.log('setImage called with options:', options);
        
        const attrs = {
          src: options.src,
          alt: options.alt || '',
          title: options.title || '',
          size: options.size || 'medium',
          alignment: options.alignment || 'left',
          caption: options.caption || '',
          link: options.link || null,
        };

        console.log('Inserting image with attributes:', attrs);

        return commands.insertContent({
          type: this.name,
          attrs,
        });
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (element: HTMLElement) => {
          const img = element as HTMLImageElement;
          const figure = img.closest('figure');
          
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            size: img.getAttribute('data-size') || 'medium',
            alignment: img.getAttribute('data-alignment') || 'left',
            caption: img.getAttribute('data-caption') || (figure?.querySelector('figcaption')?.textContent || ''),
            link: img.getAttribute('data-link'),
          };
        },
      },
      // Also handle figure > img structure
      {
        tag: 'figure img[src]',
        getAttrs: (element: HTMLElement) => {
          const img = element as HTMLImageElement;
          const figure = img.closest('figure');
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            title: img.getAttribute('title'),
            size: img.getAttribute('data-size') || 'medium',
            alignment: img.getAttribute('data-alignment') || 'left',
            caption: img.getAttribute('data-caption') || (figure?.querySelector('figcaption')?.textContent || ''),
            link: img.getAttribute('data-link'),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    console.log('renderHTML called with attributes:', HTMLAttributes);
    // Render as a simple img tag - the Vue component handles the figure structure
    return ['img', HTMLAttributes];
  },
}); 