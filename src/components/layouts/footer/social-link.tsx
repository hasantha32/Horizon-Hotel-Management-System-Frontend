import * as socialIcons from '@/components/icons/social';
import { getIcon } from '@/utils/get-icon';
import React, { Fragment } from 'react';

export type SocialLinkProp = {
  key: any;
  social: {
    url: string;
    icon: string;
  };
};

const SocialLink: React.FC<SocialLinkProp> = ({ social }) => {
  const Icon = () => (
    <Fragment>
      {social.url && (
        <span className="flex h-4 w-4 items-center justify-center">
          {getIcon({
            iconList: socialIcons,
            iconName: social.icon,
            className: 'w-4 h-4',
          })}
        </span>
      )}
    </Fragment>
  );

  return (
    <a
      href={social.url}
      className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
    >
      <Icon />
      <span className="sr-only">Facebook page</span>
    </a>
  );
};

export default SocialLink;
