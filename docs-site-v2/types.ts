
export interface NavItem {
  label: string;
  path: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Global type extensions
declare global {
  interface Window {
    __SSG_BUILD_ID__?: string;
    __FORCE_CLIENT_RENDER__?: boolean;
  }
}

// Global type extensions
declare global {
  interface Window {
    __SSG_BUILD_ID__?: string;
  }
}

export interface TocItem {
  id: string;
  label: string;
  level: number;
}
