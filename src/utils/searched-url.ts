import { isEmpty, uniqBy } from "lodash";

export interface ChildMenu {
    href: string;
    label: string;
    customLabel?: string;
    icon: string;
}
export interface Link {
    href: string;
    label: string;
    icon: string;
}
export interface SidebarLink {
    href: string;
    label: string;
    icon: string;
    permissions?: string[];
    childMenu?: ChildMenu[];
}

export interface OwnerLink {
    href: (shop: string) => string;
    label: string;
    icon: string;
    permissions?: string[];
}

export function getUrlLinks(links: SidebarLink[], searchText: string): ChildMenu[] {
    try {
        if (!searchText) return [];
        const searchTextLower = searchText.toLowerCase();
        const uniqueLinks = new Set<string>();
        const result: ChildMenu[] = [];


        const processLink = (link: SidebarLink): void => {
            const isMatch = (link.href && link.href.includes(searchTextLower)) || link.label.includes(searchTextLower);
            const isUnique = isMatch && !uniqueLinks.has(link.href);

            if (isUnique) {
                const formattedLink: ChildMenu = {
                    ...link,
                    customLabel: makeStringReadable(link.href),
                };

                result.push(formattedLink);
                uniqueLinks.add(link.href);
            }

            if (link.childMenu) {
                link.childMenu.forEach(processLink);
            }
        }

        links.forEach(processLink);

        return result;
    } catch (error) {
        return [];
    }
};



export function formatOwnerLinks(links: OwnerLink[], shop: string): SidebarLink[] {
    if (isEmpty(shop)) return [];

    const uniqueLinks: Map<string, SidebarLink> = new Map();

    for (const link of links) {
        const href = link.href(shop.toString());

        // Check if the href is already in the uniqueLinks map
        if (!uniqueLinks.has(href)) {
            uniqueLinks.set(href, {
                href,
                label: link.label,
                icon: link.icon,
                permissions: link.permissions,
            });
        }
    }

    return Array.from(uniqueLinks.values());
};


function makeStringReadable(inputString: string): string {
    const [, secondElement, ...rest] = [...inputString.split("/")];
    const firstWord: string = secondElement.replace(/\b\w/g, (match: string) => match.toUpperCase());
    const restFormattedString = [...rest].join(' - ');
    const regex = /\s*-\s*$/g;
    return `${firstWord} - ${restFormattedString}`.replace(regex, '');
}





export function extractHrefObjects(adminLinks: any) {
    const hrefLinks: any[] = [];

    function processMenu(menu: any[]) {
        for (const element of menu) {
            if (element.childMenu) {
                processMenu(element.childMenu);
            } else if (element.href) {
                hrefLinks.push(element);
            }
        }
    }

    processMenu(adminLinks);

    const result = Array.from(new Set(hrefLinks)); // Use Set to remove duplicates

    return result;
}

