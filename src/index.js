/** @jsx h */

import page from 'page';
import { define, props, withComponent } from 'skatejs';
import { h } from '@skatejs/val';

class Component extends withComponent() {
  rendererCallback(renderRoot, renderCallback) {
    const { firstChild } = renderRoot;
    const dom = renderCallback();
    if (firstChild) {
      renderRoot.replaceChild(dom, firstChild);
    } else {
      renderRoot.appendChild(dom);
    }
  }
}

export const Link = define(
  class Link extends Component {
    static props = {
      href: props.string
    };
    go = e => {
      e.preventDefault();
      page.show(this.href);
    };
    renderCallback({ href }) {
      return (
        <a href={href} events={{ click: this.go }}>
          <slot />
        </a>
      );
    }
  }
);

export const Route = define(
  class Route extends Component {
    static props = {
      page: null,
      PageToRender: null,
      path: props.string,
      propsToRender: props.object
    };
    propsUpdatedCallback(next, prev) {
      let { PageToRender } = next;
      if (PageToRender) {
        if (typeof PageToRender === 'function' && !PageToRender.prototype) {
          PageToRender = PageToRender();
        }
        if (PageToRender.then) {
          PageToRender.then(Page => (this.PageToRender = Page.default || Page));
        }
      }
      return super.propsUpdatedCallback(next, prev);
    }
    renderCallback({ PageToRender, propsToRender }) {
      if (
        PageToRender &&
        PageToRender.prototype &&
        PageToRender.prototype.renderCallback
      ) {
        return <PageToRender />;
      }
    }
  }
);

export const Router = define(
  class Router extends Component {
    static props = {
      options: props.object
    };
    childrenChangedCallback() {
      [...this.children].forEach(route => {
        page(route.path, (ctxt, next) => {
          route.propsToRender = ctxt;
          route.PageToRender = route.page;
        });
        page.exit(route.path, (ctxt, next) => {
          route.PageToRender = null;
          next();
        });
      });
      page.start();
    }
    propsUpdatedCallback(next, prev) {
      page(next.options);
      return super.propsUpdatedCallback(next, prev);
    }
    renderCallback() {
      return <slot />;
    }
  }
);
